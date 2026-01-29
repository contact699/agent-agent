import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user has a profile
  if (session.user.role === "AGENT") {
    const agent = await prisma.agent.findUnique({
      where: { userId: session.user.id },
    });

    if (!agent) {
      redirect("/onboarding/agent");
    }

    redirect("/dashboard/agent");
  } else if (session.user.role === "BROKERAGE") {
    const brokerage = await prisma.brokerage.findUnique({
      where: { userId: session.user.id },
    });

    if (!brokerage) {
      redirect("/onboarding/brokerage");
    }

    redirect("/dashboard/brokerage");
  }

  // Fallback
  redirect("/");
}
