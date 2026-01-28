import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BrokerageProfileForm from "@/components/brokerage-profile-form";

export default async function BrokerageProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "BROKERAGE") {
    redirect("/auth/signin");
  }

  const brokerage = await prisma.brokerage.findUnique({
    where: { userId: session.user.id },
  });

  if (!brokerage) {
    redirect("/onboarding/brokerage");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Brokerage Profile</h1>
        <BrokerageProfileForm brokerage={brokerage} />
      </div>
    </div>
  );
}
