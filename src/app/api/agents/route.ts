import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

interface AgentResult {
  id: string;
  anonymousId: string;
  yearsExperience: number;
  salesVolume: number;
  wishList: JsonValue;
  isAnonymous: boolean;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "BROKERAGE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const minExperience = parseInt(searchParams.get("minExperience") || "0");
  const minVolume = parseInt(searchParams.get("minVolume") || "0");
  const wishListFilter = searchParams.get("wishList")?.split(",").filter(Boolean) || [];

  // First, fetch agents with basic filters (experience and volume)
  let agents: AgentResult[] = await prisma.agent.findMany({
    where: {
      yearsExperience: { gte: minExperience },
      salesVolume: { gte: minVolume },
    },
    select: {
      id: true,
      anonymousId: true,
      yearsExperience: true,
      salesVolume: true,
      wishList: true,
      isAnonymous: true,
    },
    orderBy: { salesVolume: "desc" },
  });

  // Filter by wish list items in application code (since wishList is a Json field)
  if (wishListFilter.length > 0) {
    agents = agents.filter((agent) => {
      const agentWishList = agent.wishList as string[];
      return wishListFilter.some((filter) => agentWishList.includes(filter));
    });
  }

  return NextResponse.json({ agents });
}
