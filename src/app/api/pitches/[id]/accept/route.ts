import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Accept a pitch (agent only)
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
        { error: "Only agents can accept pitches" },
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

    // Update pitch status to accepted and return updated pitch data
    // The brokerage will then see this in their dashboard and can pay via the checkout endpoint
    const updatedPitch = await prisma.pitch.update({
      where: { id: pitchId },
      data: {
        status: "ACCEPTED",
        respondedAt: new Date(),
      },
      include: {
        brokerage: {
          select: {
            id: true,
            companyName: true,
          },
        },
        agent: {
          select: {
            id: true,
            anonymousId: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Pitch accepted",
      pitch: updatedPitch,
    });
  } catch (error) {
    console.error("Error accepting pitch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
