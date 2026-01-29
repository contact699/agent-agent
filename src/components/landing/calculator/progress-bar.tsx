"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
              i + 1 <= currentStep
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Progress bar track */}
      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect at the end */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full blur-md" />
        </div>
      </div>
    </div>
  );
}
