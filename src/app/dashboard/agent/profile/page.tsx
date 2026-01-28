import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AgentProfileForm from "@/components/agent-profile-form";

export default async function AgentProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "AGENT") {
    redirect("/auth/signin");
  }

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
  });

  if (!agent) {
    redirect("/onboarding/agent");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        <AgentProfileForm agent={agent} />
      </div>
    </div>
  );
}
