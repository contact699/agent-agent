import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { PitchInbox } from "@/components/pitch-inbox";

// Helper to serialize Prisma data for client components
function serializePitches(pitches: Awaited<ReturnType<typeof getPitches>>) {
  return pitches.map((pitch) => {
    // Only include contact email if payment is completed
    const contactEmail = pitch.paymentStatus === "PAID" ? pitch.brokerage.user.email : null;

    return {
      ...pitch,
      createdAt: pitch.createdAt.toISOString(),
      updatedAt: pitch.updatedAt.toISOString(),
      respondedAt: pitch.respondedAt?.toISOString() || null,
      paidAt: pitch.paidAt?.toISOString() || null,
      offerDetails: pitch.offerDetails as Record<string, unknown>,
      brokerage: {
        id: pitch.brokerage.id,
        companyName: pitch.brokerage.companyName,
        location: pitch.brokerage.location,
        logoUrl: pitch.brokerage.logoUrl,
        description: pitch.brokerage.description,
        contactEmail,
        createdAt: pitch.brokerage.createdAt.toISOString(),
        updatedAt: pitch.brokerage.updatedAt.toISOString(),
      },
    };
  });
}

async function getPitches(agentId: string) {
  return prisma.pitch.findMany({
    where: { agentId },
    include: {
      brokerage: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AgentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "AGENT") {
    redirect("/dashboard");
  }

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
  });

  if (!agent) {
    redirect("/onboarding/agent");
  }

  const pitchesRaw = await getPitches(agent.id);
  const pitches = serializePitches(pitchesRaw);

  const pendingPitches = pitches.filter(
    (p) => p.status === "PENDING"
  );
  const acceptedPitches = pitches.filter(
    (p) => p.status === "ACCEPTED"
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              <span className="text-sm text-gray-500">Agent Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Profile
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    agent.isAnonymous
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {agent.isAnonymous ? "Anonymous" : "Visible"}
                </span>
              </div>

              <div className="text-center py-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {agent.anonymousId.slice(-3).toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Anonymous Agent #{agent.anonymousId.slice(-6).toUpperCase()}
                </p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium">
                    {agent.yearsExperience} years
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sales Volume</span>
                  <span className="font-medium">
                    {formatCurrency(agent.salesVolume)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">License #</span>
                  <span className="font-medium">{agent.licenseNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Requirements</span>
                  <span className="font-medium">
                    {(agent.wishList as string[]).length} items
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard/agent/profile"
                className="block w-full mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile →
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {pendingPitches.length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {acceptedPitches.length}
                  </div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pitch Inbox */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pitch Inbox
              </h2>
              <PitchInbox pitches={pitches} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
