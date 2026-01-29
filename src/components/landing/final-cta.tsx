"use client";

import Link from "next/link";

export function FinalCTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0A0F1C 0%, #1E3A5F 50%, #0A0F1C 100%)",
        }}
      />

      {/* Floating Orbs - smaller and fewer than animated-background */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl animate-float opacity-20"
        style={{
          backgroundColor: "#3B82F6",
          top: "10%",
          left: "5%",
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full blur-3xl animate-float-delayed opacity-15"
        style={{
          backgroundColor: "#8B5CF6",
          bottom: "10%",
          right: "10%",
        }}
      />
      <div
        className="absolute w-56 h-56 rounded-full blur-3xl animate-float-slow opacity-10"
        style={{
          backgroundColor: "#10B981",
          top: "50%",
          right: "25%",
          transform: "translateY(-50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
          Ready to See What You&apos;re Worth?
        </h2>
        <p className="text-xl lg:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of agents who&apos;ve discovered what brokerages are
          really willing to offer. It&apos;s free, anonymous, and takes less
          than 5 minutes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToTop}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 animate-button-pulse hover:shadow-lg hover:shadow-green-500/25"
          >
            Calculate My Lost Commission
          </button>
          <Link
            href="/auth/register?role=agent"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Create My Profile
          </Link>
        </div>

        {/* Trust indicator */}
        <p className="mt-8 text-gray-500 text-sm">
          No credit card required. Your identity stays private until you choose
          to reveal it.
        </p>
      </div>
    </section>
  );
}
