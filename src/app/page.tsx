import Link from "next/link";
import { BrokerageFeeCalculator } from "@/components/calculator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            The Agent<span className="text-blue-400">Agent</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/auth/signin"
              className="text-gray-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register?role=brokerage"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              For Brokerages
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Stop Chasing Brokerages.
              <span className="text-blue-400"> Let Them Chase You.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              The Agent Agent flips the script on real estate recruitment. Create
              an anonymous profile, set your requirements, and let brokerages
              compete for your talent with personalized offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register?role=agent"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition duration-200 text-center"
              >
                Create Your Profile
              </Link>
              <Link
                href="#how-it-works"
                className="border border-gray-500 hover:border-gray-400 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition duration-200 text-center"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <BrokerageFeeCalculator />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Three simple steps to getting better offers from brokerages that
            actually want you.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Anonymous Profile
              </h3>
              <p className="text-gray-600">
                Enter your production numbers, license info, and what you&apos;re
                looking for in a brokerage. Your identity stays hidden.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Receive Personalized Pitches
              </h3>
              <p className="text-gray-600">
                Brokerages that match your criteria send you their best offers.
                Review them in your private inbox.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Choose & Connect
              </h3>
              <p className="text-gray-600">
                Accept the offer you like best, reveal your identity, and start
                the conversation on your terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Brokerages Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                For Brokerages
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Stop wasting time on cold calls. Access a pool of verified,
                production-qualified agents who are actively looking for new
                opportunities.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Pre-qualified agents with verified production history
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Only pay when agents accept your pitch
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Match with agents who fit your culture and offerings
                  </span>
                </li>
              </ul>
              <Link
                href="/auth/register?role=brokerage"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition duration-200"
              >
                Start Recruiting →
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">$500</div>
                <p className="text-gray-600 mb-6">One-time contact fee</p>
                <p className="text-sm text-gray-500">
                  Only pay when an agent accepts your pitch and reveals their
                  identity. No subscription. No monthly fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold text-white mb-4 md:mb-0">
              The Agent<span className="text-blue-400">Agent</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 The Agent Agent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
