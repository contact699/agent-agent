import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendPitchDeclinedEmail } from "@/lib/email";

// POST - Decline a pitch (agent only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: pitchId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "AGENT") {
      return NextResponse.json(
        { error: "Only agents can decline pitches" },
        { status: 403 }
      );
    }

    const agent = await prisma.agent.findUnique({
      where: { userId: session.user.id },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent profile not found" },
        { status: 404 }
      );
    }

    const pitch = await prisma.pitch.findUnique({
      where: { id: pitchId },
      include: { brokerage: true },
    });

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
    }

    if (pitch.agentId !== agent.id) {
      return NextResponse.json(
        { error: "This pitch is not for you" },
        { status: 403 }
      );
    }

    if (pitch.status !== "PENDING") {
      return NextResponse.json(
        { error: "This pitch has already been responded to" },
        { status: 400 }
      );
    }

    await prisma.pitch.update({
      where: { id: pitchId },
      data: {
        status: "DECLINED",
        respondedAt: new Date(),
      },
    });

    // Send email notification to brokerage (fire-and-forget, don't block response)
    const brokerageUser = await prisma.user.findUnique({
      where: { id: pitch.brokerage.userId },
      select: { email: true },
    });

    if (brokerageUser?.email) {
      sendPitchDeclinedEmail({
        brokerageEmail: brokerageUser.email,
        agentAnonymousId: agent.anonymousId,
        pitchId: pitchId,
      }).catch((err) => console.error("Email send failed:", err));
    }

    return NextResponse.json({ message: "Pitch declined" });
  } catch (error) {
    console.error("Error declining pitch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
