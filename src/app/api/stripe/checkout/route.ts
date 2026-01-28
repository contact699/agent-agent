import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, CONTACT_FEE_CENTS } from "@/lib/stripe";
import prisma from "@/lib/prisma";

// POST - Create Stripe checkout session for pitch payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "BROKERAGE") {
      return NextResponse.json(
        { error: "Only brokerages can pay for pitches" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { pitchId } = body;

    if (!pitchId) {
      return NextResponse.json(
        { error: "Pitch ID is required" },
        { status: 400 }
      );
    }

    const brokerage = await prisma.brokerage.findUnique({
      where: { userId: session.user.id },
    });

    if (!brokerage) {
      return NextResponse.json(
        { error: "Brokerage profile not found" },
        { status: 404 }
      );
    }

    const pitch = await prisma.pitch.findUnique({
      where: { id: pitchId },
      include: {
        agent: true,
      },
    });

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
    }

    if (pitch.brokerageId !== brokerage.id) {
      return NextResponse.json(
        { error: "This pitch does not belong to your brokerage" },
        { status: 403 }
      );
    }

    if (pitch.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Agent has not accepted this pitch yet" },
        { status: 400 }
      );
    }

    if (pitch.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "This pitch has already been paid for" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Agent Contact Fee",
              description: `Contact information for Anonymous Agent #${pitch.agent.anonymousId.slice(-6).toUpperCase()}`,
            },
            unit_amount: CONTACT_FEE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/brokerage?payment=success&pitch=${pitchId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/brokerage?payment=cancelled`,
      metadata: {
        pitchId,
        brokerageId: brokerage.id,
        agentId: pitch.agentId,
      },
    });

    // Store the session ID for webhook verification
    await prisma.pitch.update({
      where: { id: pitchId },
      data: {
        stripePaymentId: checkoutSession.id,
      },
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
