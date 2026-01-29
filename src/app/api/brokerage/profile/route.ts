import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get current user's brokerage profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "BROKERAGE") {
      return NextResponse.json(
        { error: "Only brokerages can access this endpoint" },
        { status: 403 }
      );
    }

    const brokerage = await prisma.brokerage.findUnique({
      where: { userId: session.user.id },
    });

    if (!brokerage) {
      return NextResponse.json({ error: "Brokerage profile not found" }, { status: 404 });
    }

    return NextResponse.json({ brokerage });
  } catch (error) {
    console.error("Error fetching brokerage profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create brokerage profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "BROKERAGE") {
      return NextResponse.json(
        { error: "Only brokerages can create brokerage profiles" },
        { status: 403 }
      );
    }

    // Check if profile already exists
    const existingBrokerage = await prisma.brokerage.findUnique({
      where: { userId: session.user.id },
    });

    if (existingBrokerage) {
      return NextResponse.json(
        { error: "Brokerage profile already exists" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      logoUrl,
      location,
      description,
      standardOffer,
    } = body;

    // Validation
    if (!companyName || !location || !standardOffer) {
      return NextResponse.json(
        { error: "Company name, location, and standard offer are required" },
        { status: 400 }
      );
    }

    const brokerage = await prisma.brokerage.create({
      data: {
        userId: session.user.id,
        companyName,
        logoUrl: logoUrl || null,
        location,
        description: description || null,
        standardOffer,
      },
    });

    return NextResponse.json(
      { message: "Brokerage profile created", brokerage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brokerage profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update brokerage profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "BROKERAGE") {
      return NextResponse.json(
        { error: "Only brokerages can update brokerage profiles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      logoUrl,
      location,
      description,
      standardOffer,
    } = body;

    const brokerage = await prisma.brokerage.update({
      where: { userId: session.user.id },
      data: {
        ...(companyName && { companyName }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(location && { location }),
        ...(description !== undefined && { description }),
        ...(standardOffer && { standardOffer }),
      },
    });

    return NextResponse.json({ message: "Brokerage profile updated", brokerage });
  } catch (error) {
    console.error("Error updating brokerage profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
