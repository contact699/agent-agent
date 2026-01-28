import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { AgentDiscoveryFeed } from "@/components/agent-discovery-feed";

// Helper to safely get wishList as string array
function getWishList(wishList: unknown): string[] {
  if (Array.isArray(wishList)) {
    return wishList.filter((item): item is string => typeof item === "string");
  }
  return [];
}

// Serialize agents to match component expected types
function serializeAgents(agents: Array<{
  id: string;
  anonymousId: string;
  yearsExperience: number;
  salesVolume: number;
  wishList: unknown;
  name?: string | null;
  licenseNumber?: string;
}>) {
  return agents.map((agent) => ({
    id: agent.id,
    anonymousId: agent.anonymousId,
    yearsExperience: agent.yearsExperience,
    salesVolume: agent.salesVolume,
    wishList: getWishList(agent.wishList),
    name: agent.name,
    licenseNumber: agent.licenseNumber,
  }));
}

// Serialize pitched agents with pitch info for payment flow
type PitchStatus = "PENDING" | "ACCEPTED" | "DECLINED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED";

function serializePitchedAgents(pitches: Array<{
  id: string;
  agentId: string;
  status: PitchStatus;
  paymentStatus: PaymentStatus;
  agent: {
    id: string;
    anonymousId: string;
    yearsExperience: number;
    salesVolume: number;
    wishList: unknown;
    name?: string | null;
    licenseNumber?: string;
  };
}>) {
  return pitches.map((pitch) => ({
    pitchId: pitch.id,
    agentId: pitch.agentId,
    status: pitch.status,
    paymentStatus: pitch.paymentStatus,
    agent: {
      id: pitch.agent.id,
      anonymousId: pitch.agent.anonymousId,
      yearsExperience: pitch.agent.yearsExperience,
      salesVolume: pitch.agent.salesVolume,
      wishList: getWishList(pitch.agent.wishList),
      name: pitch.agent.name,
      licenseNumber: pitch.agent.licenseNumber,
    },
  }));
}

export default async function BrokerageDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "BROKERAGE") {
    redirect("/dashboard");
  }

  const brokerage = await prisma.brokerage.findUnique({
    where: { userId: session.user.id },
    include: {
      pitchesSent: {
        include: {
          agent: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!brokerage) {
    redirect("/onboarding/brokerage");
  }

  // Get all agents that haven't been pitched by this brokerage
  const pitchedAgentIds = brokerage.pitchesSent.map((p) => p.agentId);
  
  const availableAgents = await prisma.agent.findMany({
    where: {
      id: { notIn: pitchedAgentIds },
      isAnonymous: true,
    },
    orderBy: { salesVolume: "desc" },
  });

  const pendingPitches = brokerage.pitchesSent.filter(
    (p) => p.status === "PENDING"
  );
  const acceptedPitches = brokerage.pitchesSent.filter(
    (p) => p.status === "ACCEPTED"
  );
  const paidPitches = brokerage.pitchesSent.filter(
    (p) => p.paymentStatus === "PAID"
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const standardOffer = brokerage.standardOffer as {
    splitPercent: number;
    capAmount: number | null;
    monthlyFee: number;
    additionalBenefits: string[];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                The Agent<span className="text-blue-600">Agent</span>
              </Link>
              <span className="text-sm text-gray-500">Brokerage Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{brokerage.companyName}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Brokerage
              </h2>

              <div className="text-center py-4">
                {brokerage.logoUrl ? (
                  <img
                    src={brokerage.logoUrl}
                    alt={brokerage.companyName}
                    className="w-20 h-20 rounded-lg object-cover mx-auto mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {brokerage.companyName.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">
                  {brokerage.companyName}
                </h3>
                <p className="text-sm text-gray-600">{brokerage.location}</p>
              </div>

              <Link
                href="/dashboard/brokerage/profile"
                className="block w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile →
              </Link>
            </div>

            {/* Standard Offer Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Standard Offer
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Split</span>
                  <span className="font-semibold text-green-600">
                    {standardOffer.splitPercent}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cap</span>
                  <span className="font-medium">
                    {standardOffer.capAmount
                      ? formatCurrency(standardOffer.capAmount)
                      : "No cap"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly Fee</span>
                  <span className="font-medium">
                    {formatCurrency(standardOffer.monthlyFee)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recruiting Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {pendingPitches.length}
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {acceptedPitches.length}
                  </div>
                  <div className="text-xs text-gray-600">Accepted</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg col-span-2">
                  <div className="text-2xl font-bold text-green-600">
                    {paidPitches.length}
                  </div>
                  <div className="text-xs text-gray-600">Connected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Discovery Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Discover Agents
                </h2>
                <span className="text-sm text-gray-500">
                  {availableAgents.length} agents available
                </span>
              </div>
              <AgentDiscoveryFeed
                agents={serializeAgents(availableAgents)}
                brokerageId={brokerage.id}
                standardOffer={standardOffer}
                pitchedAgents={serializePitchedAgents(brokerage.pitchesSent)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
