"use client";

import { useState } from "react";
import { CalculatorState } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step2Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

const TYPICAL_CAP = 20000;

export function Step2({ state, setState, onNext }: Step2Props) {
  const [showResult, setShowResult] = useState(false);

  const handleCapChoice = (choice: "yes" | "no" | "not-sure") => {
    setState((prev) => ({ ...prev, hasCap: choice }));

    if (choice === "no" || choice === "not-sure") {
      // Calculate loss assuming typical cap
      const loss = TYPICAL_CAP;
      setState((prev) => ({ ...prev, capLoss: loss, capAmount: "" }));
      setShowResult(true);
    }
  };

  const handleCapSubmit = () => {
    const capAmount = parseFloat(state.capAmount.replace(/,/g, "")) || 0;
    if (capAmount <= 0) return;

    setState((prev) => ({ ...prev, capLoss: capAmount }));
    setShowResult(true);
  };

  // Format cap amount with commas
  const formatCap = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const runningTotal = state.splitLoss + state.capLoss;

  return (
    <div className="animate-fade-in-up">
      {!showResult ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            What about your cap?
          </h2>
          <p className="text-slate-400 mb-8">
            Many brokerages have annual caps that eat into your earnings
          </p>

          {/* Current running total reminder */}
          <div className="glass rounded-xl p-4 mb-8 flex justify-between items-center">
            <span className="text-slate-400">So far you&apos;re losing:</span>
            <span className="text-red-500 font-bold text-xl">
              ${state.splitLoss.toLocaleString("en-US")}
            </span>
          </div>

          {state.hasCap !== "yes" ? (
            <>
              <p className="text-white text-lg mb-6 text-center">
                Does your brokerage have an annual cap?
              </p>

              {/* Choice buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleCapChoice("yes")}
                  className="py-4 px-6 glass glass-hover rounded-xl text-white font-medium transition-all duration-300 hover:border-blue-500/50"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleCapChoice("no")}
                  className="py-4 px-6 glass glass-hover rounded-xl text-white font-medium transition-all duration-300 hover:border-blue-500/50"
                >
                  No
                </button>
                <button
                  onClick={() => handleCapChoice("not-sure")}
                  className="py-4 px-6 glass glass-hover rounded-xl text-white font-medium transition-all duration-300 hover:border-blue-500/50"
                >
                  Not sure
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-lg mb-6">
                What&apos;s your annual cap amount?
              </p>

              {/* Cap amount input */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 20,000"
                  value={state.capAmount}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      capAmount: formatCap(e.target.value),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-lg placeholder:text-slate-500 glow-focus"
                />
              </div>

              <button
                onClick={handleCapSubmit}
                disabled={!state.capAmount}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calculate Cap Loss
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your cap adds to the damage...
          </h2>
          <p className="text-slate-400 mb-8">
            {state.hasCap === "not-sure"
              ? "Based on typical brokerage caps"
              : state.hasCap === "no"
              ? "Even without a cap, most brokerages have hidden costs equivalent to one"
              : "That cap is money straight out of your pocket"}
          </p>

          {/* Cap Loss Display */}
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-slate-400 text-sm mb-1">Cap loss</p>
              <AnimatedNumber
                value={state.capLoss}
                className="text-3xl md:text-4xl font-bold text-orange-500"
              />
            </div>
          </div>

          {/* Running Total Display */}
          <div className="glass rounded-2xl p-8 text-center mb-8 border border-red-500/30">
            <p className="text-slate-400 text-sm mb-2">Running total</p>
            <AnimatedNumber
              value={runningTotal}
              className="text-5xl md:text-6xl font-bold text-red-500 animate-red-glow"
            />
            <p className="text-slate-400 mt-4">
              and we&apos;re not done yet...
            </p>
          </div>

          {/* Breakdown */}
          <div className="glass rounded-xl p-4 mb-8 text-sm space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Split loss</span>
              <span className="text-red-400">
                ${state.splitLoss.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cap loss</span>
              <span className="text-orange-400">
                +${state.capLoss.toLocaleString("en-US")}
              </span>
            </div>
            <div className="border-t border-slate-600 pt-2 flex justify-between font-medium">
              <span className="text-white">Total so far</span>
              <span className="text-red-500">
                ${runningTotal.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onNext}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/30 tilt-hover"
          >
            Wait, there&apos;s more...
          </button>
        </>
      )}
    </div>
  );
}
