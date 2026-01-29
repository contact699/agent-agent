"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14c-2.5 0-4.5-1.5-5.5-3.5M12 14c2.5 0 4.5-1.5 5.5-3.5"
        />
      </svg>
    ),
    title: "Create Anonymous Profile",
    description:
      "Build your professional profile with your production numbers, experience, and preferences — all without revealing your identity.",
    color: "blue",
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
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 11l4 4 4-4"
        />
      </svg>
    ),
    title: "Receive Offers",
    description:
      "Brokerages compete for your talent by sending you real offers. You see the numbers before they see your name.",
    color: "green",
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Connect on Your Terms",
    description:
      "When you find the right offer, reveal your identity and start the conversation — with leverage on your side.",
    color: "purple",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: "text-green-400",
    glow: "shadow-green-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
};

export function HowItWorks() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    const cardsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          cardsObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    if (cardsRef.current) {
      cardsObserver.observe(cardsRef.current);
    }

    return () => {
      headerObserver.disconnect();
      cardsObserver.disconnect();
    };
  }, []);

  return (
    <section id="how-it-works" className="py-20 md:py-28">
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
            How It Works
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Three simple steps to take control of your career and negotiate from
            a position of power.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {steps.map((step, index) => {
            const colors = colorClasses[step.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className={`relative p-6 md:p-8 rounded-2xl backdrop-blur-md bg-white/5 border ${colors.border} ${colors.glow} shadow-lg transition-all duration-700 ${
                  cardsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: cardsVisible ? `${index * 150}ms` : "0ms",
                }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0A0F1C] border border-gray-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl ${colors.bg} flex items-center justify-center mb-6 ${colors.icon}`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
