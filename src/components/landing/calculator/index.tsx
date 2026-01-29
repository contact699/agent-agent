"use client";

import { useState } from "react";
import { CalculatorState, INITIAL_STATE } from "./types";
import { ProgressBar } from "./progress-bar";
import { Step1 } from "./steps/step-1";
import { Step2 } from "./steps/step-2";
import { Step3 } from "./steps/step-3";
import { Step4 } from "./steps/step-4";
import { Step5 } from "./steps/step-5";

export function Calculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const nextStep = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const reset = () => {
    setState(INITIAL_STATE);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="glass rounded-2xl p-8 animate-pulse-glow">
        {state.step < 5 && (
          <ProgressBar currentStep={state.step} totalSteps={5} />
        )}

        {state.step === 1 && (
          <Step1 state={state} setState={setState} onNext={nextStep} />
        )}
        {state.step === 2 && (
          <Step2 state={state} setState={setState} onNext={nextStep} />
        )}
        {state.step === 3 && (
          <Step3 state={state} setState={setState} onNext={nextStep} />
        )}
        {state.step === 4 && (
          <Step4 state={state} setState={setState} onNext={nextStep} />
        )}
        {state.step === 5 && <Step5 state={state} onReset={reset} />}
      </div>
    </div>
  );
}

// Re-export types for convenience
export { type CalculatorState } from "./types";
