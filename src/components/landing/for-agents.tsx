"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const benefits = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Stay Anonymous",
    description:
      "Your current brokerage will never know you're exploring options. Browse and receive offers without risking your position.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Compare Real Offers",
    description:
      "See actual commission splits, fees, and benefits side-by-side. No more guessing or awkward negotiations.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4l16 16"
        />
      </svg>
    ),
    title: "Zero Cost To You",
    description:
      "Brokerages pay to access talent. You pay nothing — ever. Our incentives are aligned with yours.",
  },
];

export function ForAgents() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          headerObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const benefitsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBenefitsVisible(true);
          benefitsObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaVisible(true);
          ctaObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    if (benefitsRef.current) {
      benefitsObserver.observe(benefitsRef.current);
    }
    if (ctaRef.current) {
      ctaObserver.observe(ctaRef.current);
    }

    return () => {
      headerObserver.disconnect();
      benefitsObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  return (
    <section id="for-agents" className="py-20 md:py-28 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built For Agents Who Know Their Worth
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Stop negotiating blind. Get the data and leverage you need to secure
            the deal you deserve.
          </p>
        </div>

        {/* Benefits */}
        <div
          ref={benefitsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                benefitsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: benefitsVisible ? `${index * 150}ms` : "0ms",
              }}
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 text-blue-400">
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center transition-all duration-700 ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/auth/register?role=agent"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
