"use client";

import { useState } from "react";
import { CalculatorState } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step1Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

export function Step1({ state, setState, onNext }: Step1Props) {
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    const volume = parseFloat(state.annualVolume.replace(/,/g, "")) || 0;
    const split = parseFloat(state.currentSplit) || 0;
    if (volume <= 0 || split <= 0 || split > 100) return;

    const totalCommission = volume * 0.03;
    const currentKeep = totalCommission * (split / 100);
    const potentialKeep = totalCommission * 0.9;
    const loss = Math.max(0, potentialKeep - currentKeep);

    setState((prev) => ({ ...prev, splitLoss: loss }));
    setShowResult(true);
  };

  // Format volume with commas as user types
  const formatVolume = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="animate-fade-in-up">
      {!showResult ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Let&apos;s see what your split is really costing you
          </h2>
          <p className="text-slate-400 mb-8">
            Enter your numbers below and watch the math unfold
          </p>

          <div className="space-y-6">
            {/* Annual Volume Input */}
            <div>
              <label
                htmlFor="annualVolume"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                What&apos;s your annual sales volume?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  $
                </span>
                <input
                  id="annualVolume"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 5,000,000"
                  value={state.annualVolume}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      annualVolume: formatVolume(e.target.value),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-lg placeholder:text-slate-500 glow-focus"
                />
              </div>
            </div>

            {/* Current Split Input */}
            <div>
              <label
                htmlFor="currentSplit"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                What&apos;s your current commission split?
              </label>
              <div className="relative">
                <input
                  id="currentSplit"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 70"
                  value={state.currentSplit}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      currentSplit: e.target.value,
                    }))
                  }
                  className="w-full pr-12 pl-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-lg placeholder:text-slate-500 glow-focus"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  %
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                This is the percentage you keep (e.g., 70 for a 70/30 split)
              </p>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={!state.annualVolume || !state.currentSplit}
            className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed animate-button-pulse"
          >
            See What You&apos;re Losing
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your split is costing you...
          </h2>
          <p className="text-slate-400 mb-8">
            Every year, you&apos;re leaving money on the table
          </p>

          {/* Animated Loss Display */}
          <div className="glass rounded-2xl p-8 text-center mb-8">
            <AnimatedNumber
              value={state.splitLoss}
              className="text-5xl md:text-6xl font-bold text-red-500 animate-red-glow"
            />
            <p className="text-slate-400 mt-4 text-lg">
              lost annually due to your split
            </p>
          </div>

          {/* Comparison breakdown */}
          <div className="glass rounded-xl p-4 mb-8 text-sm">
            <div className="flex justify-between text-slate-400 mb-2">
              <span>Your current split ({state.currentSplit}%)</span>
              <span className="text-red-400">
                ${((parseFloat(state.annualVolume.replace(/,/g, "")) || 0) * 0.03 * (parseFloat(state.currentSplit) / 100)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>With a 90/10 split</span>
              <span className="text-green-400">
                ${((parseFloat(state.annualVolume.replace(/,/g, "")) || 0) * 0.03 * 0.9).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onNext}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/30 tilt-hover"
          >
            But that&apos;s not all...
          </button>
        </>
      )}
    </div>
  );
}
