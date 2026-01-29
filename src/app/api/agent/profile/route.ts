import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get current user's agent profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "AGENT") {
      return NextResponse.json(
        { error: "Only agents can access this endpoint" },
        { status: 403 }
      );
    }

    const agent = await prisma.agent.findUnique({
      where: { userId: session.user.id },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent profile not found" }, { status: 404 });
    }

    return NextResponse.json({ agent });
  } catch (error) {
    console.error("Error fetching agent profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create agent profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "AGENT") {
      return NextResponse.json(
        { error: "Only agents can create agent profiles" },
        { status: 403 }
      );
    }

    // Check if profile already exists
    const existingAgent = await prisma.agent.findUnique({
      where: { userId: session.user.id },
    });

    if (existingAgent) {
      return NextResponse.json(
        { error: "Agent profile already exists" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const {
      name,
      licenseNumber,
      yearsExperience,
      salesVolume,
      currentBroker,
      wishList,
    } = body;

    // Validation
    if (!licenseNumber || yearsExperience === undefined || salesVolume === undefined) {
      return NextResponse.json(
        { error: "License number, years experience, and sales volume are required" },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.create({
      data: {
        userId: session.user.id,
        name: name || null,
        licenseNumber,
        yearsExperience: parseInt(yearsExperience),
        salesVolume: parseFloat(salesVolume),
        currentBroker: currentBroker || null,
        wishList: wishList || [],
        isAnonymous: true,
      },
    });

    return NextResponse.json(
      { message: "Agent profile created", agent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating agent profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update agent profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "AGENT") {
      return NextResponse.json(
        { error: "Only agents can update agent profiles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      licenseNumber,
      yearsExperience,
      salesVolume,
      currentBroker,
      wishList,
      isAnonymous,
    } = body;

    const agent = await prisma.agent.update({
      where: { userId: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(licenseNumber && { licenseNumber }),
        ...(yearsExperience !== undefined && { yearsExperience: parseInt(yearsExperience) }),
        ...(salesVolume !== undefined && { salesVolume: parseFloat(salesVolume) }),
        ...(currentBroker !== undefined && { currentBroker }),
        ...(wishList && { wishList }),
        ...(isAnonymous !== undefined && { isAnonymous }),
      },
    });

    return NextResponse.json({ message: "Agent profile updated", agent });
  } catch (error) {
    console.error("Error updating agent profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
