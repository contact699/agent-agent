import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendPitchReceivedEmail } from "@/lib/email";

// Type for pitch with included agent from Prisma query
interface PitchWithAgent {
  paymentStatus: string;
  agent: {
    name: string | null;
    licenseNumber: string;
  };
  [key: string]: unknown;
}

// GET - Get pitches (for brokerage: sent pitches, for agent: received pitches)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "BROKERAGE") {
      const brokerage = await prisma.brokerage.findUnique({
        where: { userId: session.user.id },
      });

      if (!brokerage) {
        return NextResponse.json(
          { error: "Brokerage profile not found" },
          { status: 404 }
        );
      }

      const pitches = await prisma.pitch.findMany({
        where: { brokerageId: brokerage.id },
        include: {
          agent: {
            select: {
              id: true,
              anonymousId: true,
              yearsExperience: true,
              salesVolume: true,
              wishList: true,
              // Only include name/contact if payment is complete
              name: true,
              licenseNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Filter out personal info for unpaid pitches
      const sanitizedPitches = (pitches as PitchWithAgent[]).map((pitch) => ({
        ...pitch,
        agent: {
          ...pitch.agent,
          name: pitch.paymentStatus === "PAID" ? pitch.agent.name : null,
          licenseNumber:
            pitch.paymentStatus === "PAID" ? pitch.agent.licenseNumber : null,
        },
      }));

      return NextResponse.json({ pitches: sanitizedPitches });
    } else if (session.user.role === "AGENT") {
      const agent = await prisma.agent.findUnique({
        where: { userId: session.user.id },
      });

      if (!agent) {
        return NextResponse.json(
          { error: "Agent profile not found" },
          { status: 404 }
        );
      }

      const pitches = await prisma.pitch.findMany({
        where: { agentId: agent.id },
        include: {
          brokerage: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ pitches });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new pitch (brokerage only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "BROKERAGE") {
      return NextResponse.json(
        { error: "Only brokerages can send pitches" },
        { status: 403 }
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

    const body = await request.json();
    const { agentId, message, offerDetails } = body;

    if (!agentId || !message || !offerDetails) {
      return NextResponse.json(
        { error: "Agent ID, message, and offer details are required" },
        { status: 400 }
      );
    }

    // Check if agent exists
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check if pitch already exists
    const existingPitch = await prisma.pitch.findUnique({
      where: {
        agentId_brokerageId: {
          agentId,
          brokerageId: brokerage.id,
        },
      },
    });

    if (existingPitch) {
      return NextResponse.json(
        { error: "You have already pitched this agent" },
        { status: 409 }
      );
    }

    const pitch = await prisma.pitch.create({
      data: {
        agentId,
        brokerageId: brokerage.id,
        message,
        offerDetails,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });

    // Send email notification to agent (fire-and-forget, don't block response)
    const agentUser = await prisma.user.findUnique({
      where: { id: agent.userId },
      select: { email: true },
    });

    if (agentUser?.email) {
      sendPitchReceivedEmail({
        agentEmail: agentUser.email,
        brokerageCompanyName: brokerage.companyName,
        pitchId: pitch.id,
      }).catch((err) => console.error("Email send failed:", err));
    }

    return NextResponse.json(
      { message: "Pitch sent successfully", pitch },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pitch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
