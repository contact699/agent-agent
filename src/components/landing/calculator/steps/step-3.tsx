"use client";

import { useEffect, useState } from "react";
import { CalculatorState, FEE_ESTIMATES } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step3Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

const FEE_LABELS: Record<keyof typeof FEE_ESTIMATES, { name: string; description: string }> = {
  desk: { name: "Desk Fee", description: "$500/month" },
  eo: { name: "E&O Insurance", description: "Annual premium" },
  transaction: { name: "Transaction Fees", description: "~$150 per deal" },
  franchise: { name: "Franchise Fee", description: "Annual fee" },
  technology: { name: "Technology Fee", description: "$200/month" },
  marketing: { name: "Marketing Fee", description: "$300/month" },
};

export function Step3({ state, setState, onNext }: Step3Props) {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Calculate fees loss whenever fees change
  useEffect(() => {
    const feesLoss = Object.entries(state.fees).reduce((total, [key, checked]) => {
      if (checked) {
        return total + FEE_ESTIMATES[key as keyof typeof FEE_ESTIMATES];
      }
      return total;
    }, 0);

    setState((prev) => ({ ...prev, feesLoss }));
  }, [state.fees, setState]);

  const handleFeeToggle = (feeKey: keyof typeof FEE_ESTIMATES) => {
    setHasInteracted(true);
    setState((prev) => ({
      ...prev,
      fees: {
        ...prev.fees,
        [feeKey]: !prev.fees[feeKey],
      },
    }));
  };

  const runningTotal = state.splitLoss + state.capLoss + state.feesLoss;
  const checkedCount = Object.values(state.fees).filter(Boolean).length;

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Now let&apos;s talk about fees...
      </h2>
      <p className="text-slate-400 mb-6">
        Check all the fees you currently pay to your brokerage
      </p>

      {/* Previous losses reminder */}
      <div className="glass rounded-xl p-4 mb-6 flex justify-between items-center">
        <span className="text-slate-400">Previous losses:</span>
        <span className="text-red-500 font-bold text-xl">
          ${(state.splitLoss + state.capLoss).toLocaleString("en-US")}
        </span>
      </div>

      {/* Fee checkboxes */}
      <div className="space-y-3 mb-8">
        {(Object.keys(FEE_ESTIMATES) as Array<keyof typeof FEE_ESTIMATES>).map((feeKey, index) => {
          const fee = FEE_LABELS[feeKey];
          const isChecked = state.fees[feeKey];
          const estimate = FEE_ESTIMATES[feeKey];

          return (
            <button
              key={feeKey}
              onClick={() => handleFeeToggle(feeKey)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 animate-stagger-in ${
                isChecked
                  ? "glass border-red-500/50 shadow-lg shadow-red-500/10"
                  : "glass glass-hover"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Custom checkbox */}
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    isChecked
                      ? "bg-red-500 border-red-500"
                      : "border-slate-500 bg-transparent"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-white font-medium">{fee.name}</p>
                  <p className="text-slate-500 text-sm">{fee.description}</p>
                </div>
              </div>

              {/* Estimated cost */}
              <div
                className={`text-right transition-all duration-300 ${
                  isChecked ? "opacity-100" : "opacity-50"
                }`}
              >
                <p
                  className={`font-bold ${
                    isChecked ? "text-red-500" : "text-slate-400"
                  }`}
                >
                  ${estimate.toLocaleString("en-US")}
                </p>
                <p className="text-slate-500 text-xs">/year</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Running total display - shows after any checkbox interaction */}
      {hasInteracted && (
        <div className="glass rounded-2xl p-6 mb-6 border border-red-500/30 animate-fade-in-up">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">
              Total annual losses
            </p>
            <AnimatedNumber
              value={runningTotal}
              className="text-4xl md:text-5xl font-bold text-red-500 animate-red-glow"
            />
          </div>

          {/* Breakdown */}
          <div className="mt-6 pt-4 border-t border-slate-600 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Split loss</span>
              <span className="text-red-400">
                ${state.splitLoss.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cap loss</span>
              <span className="text-orange-400">
                ${state.capLoss.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>
                Fees ({checkedCount} selected)
              </span>
              <span className="text-yellow-400">
                ${state.feesLoss.toLocaleString("en-US")}
              </span>
            </div>
            <div className="border-t border-slate-600 pt-2 flex justify-between font-bold">
              <span className="text-white">Grand total</span>
              <span className="text-red-500">
                ${runningTotal.toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 tilt-hover"
      >
        {checkedCount > 0 ? "Continue to the Solution" : "Skip Fees & Continue"}
      </button>

      {!hasInteracted && (
        <p className="text-center text-slate-500 text-sm mt-4">
          Not sure which fees you pay? No worries, just continue
        </p>
      )}
    </div>
  );
}
