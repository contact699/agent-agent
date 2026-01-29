import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { sendPaymentCompleteEmail } from "@/lib/email";

// Disable body parsing - Stripe requires raw body for webhook verification
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const pitchId = session.metadata?.pitchId;
        
        if (!pitchId) {
          console.error("No pitchId in session metadata");
          break;
        }

        // Update pitch payment status
        await prisma.pitch.update({
          where: { id: pitchId },
          data: {
            paymentStatus: "PAID",
            stripePaymentId: session.id,
            paidAt: new Date(),
          },
        });

        // Reveal agent identity by setting isAnonymous to false
        const pitch = await prisma.pitch.findUnique({
          where: { id: pitchId },
          include: {
            agent: {
              include: {
                user: { select: { email: true } },
              },
            },
            brokerage: true,
          },
        });

        if (pitch) {
          await prisma.agent.update({
            where: { id: pitch.agentId },
            data: {
              isAnonymous: false,
            },
          });

          // Send email notification to agent (fire-and-forget, don't block response)
          if (pitch.agent.user.email) {
            sendPaymentCompleteEmail({
              agentEmail: pitch.agent.user.email,
              agentName: pitch.agent.name,
              brokerageCompanyName: pitch.brokerage.companyName,
              pitchId: pitchId,
            }).catch((err) => console.error("Email send failed:", err));
          }
        }

        console.log(`Payment completed for pitch ${pitchId}`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const pitchId = session.metadata?.pitchId;

        if (pitchId) {
          await prisma.pitch.update({
            where: { id: pitchId },
            data: {
              paymentStatus: "FAILED",
            },
          });
          console.log(`Payment failed for pitch ${pitchId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
