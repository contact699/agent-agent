"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalculatorState } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step5Props {
  state: CalculatorState;
  onReset: () => void;
}

export function Step5({ state, onReset }: Step5Props) {
  const [showNumber, setShowNumber] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Initial reveal of the number
    const timerNumber = setTimeout(() => {
      setShowNumber(true);
      setShowParticles(true);
    }, 300);

    // Show details after number animation
    const timer1 = setTimeout(() => setShowDetails(true), 1500);

    // Show CTA last
    const timer2 = setTimeout(() => setShowCTA(true), 2500);

    // Hide particles after burst
    const timerParticles = setTimeout(() => setShowParticles(false), 1500);

    return () => {
      clearTimeout(timerNumber);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timerParticles);
    };
  }, []);

  return (
    <div className="text-center">
      {/* Dramatic Header */}
      <div className="mb-8 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Here&apos;s What Your Current Brokerage Is Really Costing You
        </h2>
      </div>

      {/* Big Number Reveal */}
      <div className="relative mb-10">
        {/* Particle Burst Effect */}
        {showParticles && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-red-500"
                style={{
                  animation: "particle-burst 1s ease-out forwards",
                  transform: `rotate(${i * 30}deg) translateY(-20px)`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        )}

        {/* The Big Number */}
        <div
          className={`transition-all duration-700 ${
            showNumber ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <div className="text-6xl md:text-8xl font-black text-red-500 animate-red-glow">
            <AnimatedNumber
              value={state.totalLoss}
              duration={2000}
              className="text-red-500"
              prefix="-$"
            />
          </div>
          <p className="text-slate-400 mt-3 text-lg">per year in lost earnings</p>
        </div>
      </div>

      {/* Missing Benefits List */}
      <div
        className={`transition-all duration-500 mb-10 ${
          showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {state.missingBenefits.length > 0 && (
          <div className="glass rounded-xl p-6 text-left">
            <h3 className="text-white font-semibold mb-4 text-center">
              And you&apos;re paying for these costs yourself:
            </h3>
            <div className="space-y-3">
              {state.missingBenefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 animate-slide-in-left"
                  style={{ animationDelay: `${index * 100 + 1500}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.missingBenefits.length === 0 && (
          <div className="glass rounded-xl p-6">
            <p className="text-emerald-400">
              Great news! Your brokerage provides all the key benefits.
              But you&apos;re still losing{" "}
              <span className="font-bold text-red-400">
                ${state.totalLoss.toLocaleString()}
              </span>{" "}
              per year on splits, caps, and fees.
            </p>
          </div>
        )}
      </div>

      {/* Hook Text */}
      <div
        className={`transition-all duration-500 mb-8 ${
          showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="glass rounded-xl p-6 border border-blue-500/30">
          <p className="text-lg text-white">
            <span className="text-blue-400 font-semibold">Did you know?</span>{" "}
            Brokerages exist that offer better splits{" "}
            <span className="text-emerald-400 font-semibold">AND</span> include
            these tools at no extra cost.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div
        className={`transition-all duration-500 space-y-4 ${
          showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Link
          href="/auth/register?role=agent"
          className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-600/30 animate-button-pulse text-center"
        >
          Create My Anonymous Profile
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 px-6 bg-transparent border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 font-medium rounded-xl transition-all duration-300"
        >
          Recalculate
        </button>

        <p className="text-slate-500 text-sm mt-4">
          100% anonymous. No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
