import {
  AnimatedBackground,
  Navigation,
  Calculator,
  TrustBar,
  HowItWorks,
  ForAgents,
  ForBrokerages,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navigation />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="animate-fade-in-up">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Stop Chasing Brokerages.
                <span className="text-blue-400"> Let Them Chase You.</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                The Agent Agent flips the script on real estate recruitment. Create
                an anonymous profile, set your requirements, and let brokerages
                compete for your talent with personalized offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register?role=agent"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 tilt-hover text-center shadow-lg shadow-green-600/25"
                >
                  Create Your Profile
                </Link>
                <a
                  href="#how-it-works"
                  className="border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 text-center"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Right: Calculator */}
            <div className="flex justify-center lg:justify-end">
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
      <HowItWorks />
      <ForAgents />
      <ForBrokerages />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
