"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const benefits = [
  "Access verified production data before you pitch",
  "Only pay when agents accept your offer",
  "No cold calling or guesswork",
  "Filter by production level, location, and preferences",
  "Direct connection once accepted",
];

export function ForBrokerages() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="for-brokerages"
      className="relative py-20 lg:py-32 bg-[#0A0F1C] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div
            className={`${
              isVisible ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              For Brokerages:{" "}
              <span className="text-blue-400">Recruit Smarter</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Stop wasting time on cold calls and unqualified leads. Access a
              pool of verified agents who are actively exploring new
              opportunities.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className={`flex items-start ${
                    isVisible ? "animate-stagger-in" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0"
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
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register?role=brokerage"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Recruiting
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Pricing Card Column */}
          <div
            className={`${
              isVisible ? "animate-slide-in-right" : "opacity-0"
            }`}
          >
            <div className="glass rounded-2xl p-8 lg:p-10 glass-hover">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Simple, Transparent Pricing
              </h3>

              {/* Pricing Tiers */}
              <div className="space-y-6 mb-8">
                {/* Tier 1 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">
                      Under $5M production
                    </span>
                    <span className="text-3xl font-bold text-white">$25</span>
                  </div>
                  <p className="text-gray-500 text-sm">per pitch</p>
                </div>

                {/* Tier 2 */}
                <div className="bg-white/5 rounded-xl p-6 border border-blue-500/30 relative">
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Top Producers
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">
                      $5M+ producers
                    </span>
                    <span className="text-3xl font-bold text-white">$50</span>
                  </div>
                  <p className="text-gray-500 text-sm">per pitch</p>
                </div>
              </div>

              {/* No Subscription Notice */}
              <div className="text-center border-t border-white/10 pt-6">
                <p className="text-lg font-medium text-green-400 mb-2">
                  No subscriptions. No monthly fees.
                </p>
                <p className="text-gray-400 text-sm">
                  Only pay when you send a pitch to an agent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
