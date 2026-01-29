"use client";

import { CalculatorState, BENEFIT_LABELS } from "../types";

interface Step4Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

export function Step4({ state, setState, onNext }: Step4Props) {
  const benefitKeys = Object.keys(BENEFIT_LABELS) as Array<keyof typeof BENEFIT_LABELS>;

  const toggleBenefit = (key: keyof CalculatorState["benefits"]) => {
    setState((prev) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [key]: !prev.benefits[key],
      },
    }));
  };

  const handleContinue = () => {
    // Calculate missing benefits (those where answer is "No" / false)
    const missingBenefits = benefitKeys
      .filter((key) => !state.benefits[key])
      .map((key) => BENEFIT_LABELS[key]);

    // Calculate total loss from all previous steps
    const totalLoss = state.splitLoss + state.capLoss + state.feesLoss;

    setState((prev) => ({
      ...prev,
      missingBenefits,
      totalLoss,
    }));

    onNext();
  };

  const noCount = benefitKeys.filter((key) => !state.benefits[key]).length;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Now let&apos;s see what you&apos;re getting back...
        </h2>
        <p className="text-slate-400 text-lg">
          Some brokerages charge more, but deliver more. Does yours provide these tools?
        </p>
      </div>

      {/* Benefits Toggles */}
      <div className="space-y-4 mb-8">
        {benefitKeys.map((key, index) => (
          <div
            key={key}
            className="glass rounded-xl p-4 flex items-center justify-between animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  state.benefits[key]
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                    : "bg-red-500 shadow-lg shadow-red-500/50"
                }`}
              />
              <span className="text-white font-medium">{BENEFIT_LABELS[key]}</span>
            </div>

            {/* Yes/No Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!state.benefits[key]) toggleBenefit(key);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  state.benefits[key]
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  if (state.benefits[key]) toggleBenefit(key);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  !state.benefits[key]
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {noCount > 0 && (
        <div className="glass rounded-xl p-4 mb-6 border border-red-500/30 animate-fade-in-up">
          <div className="flex items-center gap-2 text-red-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium">
              You&apos;re missing {noCount} benefit{noCount !== 1 ? "s" : ""} that could be included
            </span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-600/30 animate-button-pulse"
      >
        Show Me The Full Picture
      </button>
    </div>
  );
}
