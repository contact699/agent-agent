# Landing Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the landing page into a stunning, high-conversion lead capture machine with an immersive 5-step calculator, dark fintech aesthetic, and full marketing page sections.

**Architecture:** Replace existing `page.tsx` and `calculator.tsx` with new components featuring CSS animations, glass-morphism effects, and scroll-triggered interactions. Use Tailwind CSS with custom keyframe animations (no additional dependencies).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, CSS animations (no Framer Motion - keep it lightweight)

---

## Phase 1: Foundation & Animation Utilities

### Task 1: Update Global CSS with Animation Keyframes and Variables

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Replace globals.css with new theme variables and animations**

```css
@import "tailwindcss";

:root {
  /* Landing page dark theme */
  --landing-bg: #0A0F1C;
  --landing-bg-lighter: #111827;
  --card-bg: rgba(30, 41, 59, 0.8);
  --accent-blue: #3B82F6;
  --accent-blue-glow: rgba(59, 130, 246, 0.5);
  --pain-red: #EF4444;
  --pain-orange: #F97316;
  --success-green: #10B981;
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;

  /* App theme (existing pages) */
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

/* ===== LANDING PAGE ANIMATIONS ===== */

/* Floating orbs background animation */
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(10px, -20px) scale(1.05); }
  50% { transform: translate(-5px, 10px) scale(0.95); }
  75% { transform: translate(-15px, -10px) scale(1.02); }
}

/* Gradient shift for background */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Pulse glow effect */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px var(--accent-blue-glow); }
  50% { box-shadow: 0 0 40px var(--accent-blue-glow), 0 0 60px var(--accent-blue-glow); }
}

/* Number counter tick effect */
@keyframes count-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade in from below */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered fade in */
@keyframes stagger-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide in from right */
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide in from left */
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Button pulse */
@keyframes button-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Progress bar fill */
@keyframes progress-fill {
  from { width: 0%; }
}

/* Red glow pulse for pain numbers */
@keyframes red-glow-pulse {
  0%, 100% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
  50% { text-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.4); }
}

/* Particle burst */
@keyframes particle-burst {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

/* Accordion expand */
@keyframes accordion-expand {
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
}

/* ===== UTILITY CLASSES ===== */

.animate-float {
  animation: float 30s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 35s ease-in-out infinite;
  animation-delay: -10s;
}

.animate-float-slow {
  animation: float 40s ease-in-out infinite;
  animation-delay: -20s;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 30s ease infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-stagger-in {
  animation: stagger-in 0.5s ease-out forwards;
}

.animate-button-pulse {
  animation: button-pulse 2s ease-in-out infinite;
}

.animate-red-glow {
  animation: red-glow-pulse 2s ease-in-out infinite;
}

/* Glass morphism effect */
.glass {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-hover:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 3D tilt effect on hover */
.tilt-hover {
  transition: transform 0.2s ease;
}

.tilt-hover:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02);
}

/* Glow input focus */
.glow-focus:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-blue-glow);
  border-color: var(--accent-blue);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-delayed,
  .animate-float-slow,
  .animate-gradient,
  .animate-pulse-glow,
  .animate-fade-in-up,
  .animate-stagger-in,
  .animate-button-pulse,
  .animate-red-glow {
    animation: none;
  }

  .tilt-hover:hover {
    transform: none;
  }
}
```

**Step 2: Verify the CSS compiles**

Run: `npm run build`
Expected: Build succeeds with no CSS errors

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add landing page animation keyframes and utility classes"
```

---

### Task 2: Create Animated Background Component

**Files:**
- Create: `src/components/landing/animated-background.tsx`

**Step 1: Create the animated background with floating orbs**

```tsx
"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: "linear-gradient(135deg, #0A0F1C 0%, #1E3A5F 50%, #0A0F1C 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute w-96 h-96 rounded-full animate-float opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          top: "10%",
          left: "10%",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full animate-float-delayed opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          top: "60%",
          right: "10%",
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full animate-float-slow opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
          bottom: "20%",
          left: "30%",
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full animate-float opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
          top: "30%",
          right: "30%",
          animationDelay: "-15s",
        }}
      />
    </div>
  );
}
```

**Step 2: Verify component renders**

Run: `npm run dev` and temporarily import into page.tsx to check
Expected: Background shows with animated floating orbs

**Step 3: Commit**

```bash
git add src/components/landing/animated-background.tsx
git commit -m "feat: add animated background component with floating orbs"
```

---

### Task 3: Create Sticky Navigation Component

**Files:**
- Create: `src/components/landing/navigation.tsx`

**Step 1: Create the navigation with scroll-based transparency**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#for-agents", label: "For Agents" },
    { href: "#for-brokerages", label: "For Brokerages" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0F1C]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            The Agent<span className="text-blue-400">Agent</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register?role=agent"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 tilt-hover"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth/signin"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register?role=agent"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/navigation.tsx
git commit -m "feat: add sticky navigation with scroll-based transparency"
```

---

## Phase 2: Multi-Step Calculator

### Task 4: Create Calculator Types and Constants

**Files:**
- Create: `src/components/landing/calculator/types.ts`

**Step 1: Define types for calculator state**

```typescript
export interface CalculatorState {
  step: number;
  // Step 1
  annualVolume: string;
  currentSplit: string;
  splitLoss: number;
  // Step 2
  hasCap: "yes" | "no" | "not-sure" | null;
  capAmount: string;
  capLoss: number;
  // Step 3
  fees: {
    desk: boolean;
    eo: boolean;
    transaction: boolean;
    franchise: boolean;
    technology: boolean;
    marketing: boolean;
  };
  feesLoss: number;
  // Step 4
  benefits: {
    crm: boolean;
    website: boolean;
    leads: boolean;
    training: boolean;
    marketing: boolean;
  };
  // Step 5 (calculated)
  totalLoss: number;
  missingBenefits: string[];
}

export const FEE_ESTIMATES = {
  desk: 6000,      // $500/month
  eo: 1200,        // E&O insurance
  transaction: 3000, // ~$150 per transaction, ~20 transactions
  franchise: 5000,   // Franchise fee
  technology: 2400,  // $200/month
  marketing: 3600,   // $300/month
};

export const BENEFIT_LABELS: Record<keyof CalculatorState["benefits"], string> = {
  crm: "CRM System",
  website: "Personal Website",
  leads: "Lead Generation",
  training: "Training & Mentorship",
  marketing: "Marketing Materials",
};

export const INITIAL_STATE: CalculatorState = {
  step: 1,
  annualVolume: "",
  currentSplit: "",
  splitLoss: 0,
  hasCap: null,
  capAmount: "",
  capLoss: 0,
  fees: {
    desk: false,
    eo: false,
    transaction: false,
    franchise: false,
    technology: false,
    marketing: false,
  },
  feesLoss: 0,
  benefits: {
    crm: false,
    website: false,
    leads: false,
    training: false,
    marketing: false,
  },
  totalLoss: 0,
  missingBenefits: [],
};
```

**Step 2: Commit**

```bash
git add src/components/landing/calculator/types.ts
git commit -m "feat: add calculator types and constants"
```

---

### Task 5: Create Animated Number Counter Component

**Files:**
- Create: `src/components/landing/calculator/animated-number.tsx`

**Step 1: Create component that animates number counting up**

```tsx
"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({
  value,
  duration = 1500,
  className = "",
  prefix = "$",
  suffix = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(startValue + diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayValue);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/calculator/animated-number.tsx
git commit -m "feat: add animated number counter component"
```

---

### Task 6: Create Progress Bar Component

**Files:**
- Create: `src/components/landing/calculator/progress-bar.tsx`

**Step 1: Create animated progress bar with glow**

```tsx
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
        {/* Animated fill */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full blur-md" />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/calculator/progress-bar.tsx
git commit -m "feat: add animated progress bar component"
```

---

### Task 7: Create Calculator Step Components (Steps 1-3)

**Files:**
- Create: `src/components/landing/calculator/steps/step-1.tsx`
- Create: `src/components/landing/calculator/steps/step-2.tsx`
- Create: `src/components/landing/calculator/steps/step-3.tsx`

**Step 1: Create Step 1 - The Hook (split calculation)**

```tsx
"use client";

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

    // 3% commission rate assumption
    const totalCommission = volume * 0.03;
    const currentKeep = totalCommission * (split / 100);
    const potentialKeep = totalCommission * 0.9; // 90/10 split
    const loss = Math.max(0, potentialKeep - currentKeep);

    setState((prev) => ({ ...prev, splitLoss: loss }));
    setShowResult(true);
  };

  const formatVolume = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-2">
        Let&apos;s see what you&apos;re really paying
      </h3>
      <p className="text-slate-400 mb-6">
        Enter your production numbers to uncover your true cost.
      </p>

      {!showResult ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Annual Sales Volume ($)
            </label>
            <input
              type="text"
              value={state.annualVolume}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  annualVolume: formatVolume(e.target.value),
                }))
              }
              placeholder="e.g., 5,000,000"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 glow-focus transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Current Split (%)
            </label>
            <input
              type="number"
              value={state.currentSplit}
              onChange={(e) =>
                setState((prev) => ({ ...prev, currentSplit: e.target.value }))
              }
              placeholder="e.g., 70"
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 glow-focus transition-all duration-200"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover mt-4"
          >
            See What You&apos;re Losing
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-slate-400 mb-2">
            You&apos;re giving up in commission splits alone:
          </p>
          <div className="text-5xl font-bold text-red-500 animate-red-glow mb-4">
            <AnimatedNumber value={state.splitLoss} duration={1500} />
          </div>
          <p className="text-slate-400 mb-6">per year</p>

          <button
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover animate-button-pulse"
          >
            But that&apos;s not all...
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
```

**Step 2: Create Step 2 - The Cap**

```tsx
"use client";

import { useState } from "react";
import { CalculatorState } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step2Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

export function Step2({ state, setState, onNext }: Step2Props) {
  const [showCapInput, setShowCapInput] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCapChoice = (choice: "yes" | "no" | "not-sure") => {
    setState((prev) => ({ ...prev, hasCap: choice }));

    if (choice === "yes") {
      setShowCapInput(true);
    } else {
      // Calculate loss without cap
      // Assume typical cap is $20,000 and they would save anything above
      const volume = parseFloat(state.annualVolume.replace(/,/g, "")) || 0;
      const split = parseFloat(state.currentSplit) || 0;
      const totalCommission = volume * 0.03;
      const brokerageShare = totalCommission * ((100 - split) / 100);
      const typicalCap = 20000;
      const capLoss = Math.max(0, brokerageShare - typicalCap);

      setState((prev) => ({ ...prev, capLoss }));
      setShowResult(true);
    }
  };

  const handleCapSubmit = () => {
    const capAmount = parseFloat(state.capAmount.replace(/,/g, "")) || 0;
    const volume = parseFloat(state.annualVolume.replace(/,/g, "")) || 0;
    const split = parseFloat(state.currentSplit) || 0;
    const totalCommission = volume * 0.03;
    const brokerageShare = totalCommission * ((100 - split) / 100);

    // If they have a cap, calculate what they save vs no cap
    // If their cap is high, they might still be losing
    const typicalCap = 16000; // Industry competitive cap
    const capLoss = Math.max(0, capAmount - typicalCap);

    setState((prev) => ({ ...prev, capLoss }));
    setShowResult(true);
  };

  const formatAmount = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const runningTotal = state.splitLoss + state.capLoss;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-2">
        Does your brokerage have an annual cap?
      </h3>
      <p className="text-slate-400 mb-6">
        A cap limits how much you pay to your brokerage each year.
      </p>

      {!state.hasCap && !showResult && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleCapChoice("yes")}
            className="py-4 px-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-blue-500 text-white font-medium rounded-lg transition-all duration-200"
          >
            Yes
          </button>
          <button
            onClick={() => handleCapChoice("no")}
            className="py-4 px-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-blue-500 text-white font-medium rounded-lg transition-all duration-200"
          >
            No
          </button>
          <button
            onClick={() => handleCapChoice("not-sure")}
            className="py-4 px-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-blue-500 text-white font-medium rounded-lg transition-all duration-200"
          >
            Not Sure
          </button>
        </div>
      )}

      {showCapInput && !showResult && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What&apos;s your annual cap amount?
            </label>
            <input
              type="text"
              value={state.capAmount}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  capAmount: formatAmount(e.target.value),
                }))
              }
              placeholder="e.g., 20,000"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 glow-focus transition-all duration-200"
            />
          </div>
          <button
            onClick={handleCapSubmit}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
          >
            Calculate
          </button>
        </div>
      )}

      {showResult && (
        <div className="text-center">
          {state.hasCap === "no" || state.hasCap === "not-sure" ? (
            <p className="text-slate-400 mb-2">
              Without a cap, you&apos;re paying extra:
            </p>
          ) : (
            <p className="text-slate-400 mb-2">
              Your cap is higher than competitive options:
            </p>
          )}

          <div className="text-4xl font-bold text-orange-500 mb-4">
            +<AnimatedNumber value={state.capLoss} duration={1200} />
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg mb-6">
            <p className="text-sm text-slate-400">Running total:</p>
            <div className="text-3xl font-bold text-red-500 animate-red-glow">
              <AnimatedNumber value={runningTotal} duration={1000} />
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
          >
            What else are you paying?
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Create Step 3 - The Fees**

```tsx
"use client";

import { useState } from "react";
import { CalculatorState, FEE_ESTIMATES } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step3Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

const FEE_LABELS = {
  desk: { label: "Desk Fees", estimate: "$500/month" },
  eo: { label: "E&O Insurance", estimate: "$100/month" },
  transaction: { label: "Transaction Fees", estimate: "$150/transaction" },
  franchise: { label: "Franchise Fees", estimate: "$400/month" },
  technology: { label: "Technology Fees", estimate: "$200/month" },
  marketing: { label: "Marketing Fees", estimate: "$300/month" },
};

export function Step3({ state, setState, onNext }: Step3Props) {
  const [showResult, setShowResult] = useState(false);

  const toggleFee = (fee: keyof typeof state.fees) => {
    setState((prev) => ({
      ...prev,
      fees: { ...prev.fees, [fee]: !prev.fees[fee] },
    }));
  };

  const calculateFees = () => {
    let total = 0;
    Object.entries(state.fees).forEach(([key, checked]) => {
      if (checked) {
        total += FEE_ESTIMATES[key as keyof typeof FEE_ESTIMATES];
      }
    });
    setState((prev) => ({ ...prev, feesLoss: total }));
    setShowResult(true);
  };

  const currentFeesTotal = Object.entries(state.fees).reduce(
    (sum, [key, checked]) =>
      checked ? sum + FEE_ESTIMATES[key as keyof typeof FEE_ESTIMATES] : sum,
    0
  );

  const runningTotal = state.splitLoss + state.capLoss + state.feesLoss;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-2">
        What other fees do you pay?
      </h3>
      <p className="text-slate-400 mb-6">
        Select all the fees your brokerage charges you.
      </p>

      {!showResult ? (
        <>
          <div className="space-y-3 mb-6">
            {Object.entries(FEE_LABELS).map(([key, { label, estimate }]) => (
              <button
                key={key}
                onClick={() => toggleFee(key as keyof typeof state.fees)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  state.fees[key as keyof typeof state.fees]
                    ? "bg-red-900/30 border-red-500 text-white"
                    : "bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
              >
                <span className="flex items-center">
                  <span
                    className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                      state.fees[key as keyof typeof state.fees]
                        ? "bg-red-500 border-red-500"
                        : "border-slate-500"
                    }`}
                  >
                    {state.fees[key as keyof typeof state.fees] && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {label}
                </span>
                <span className="text-sm text-slate-500">{estimate}</span>
              </button>
            ))}
          </div>

          {currentFeesTotal > 0 && (
            <div className="p-4 bg-slate-800/30 rounded-lg mb-4 text-center">
              <p className="text-sm text-slate-400">Selected fees total:</p>
              <p className="text-2xl font-bold text-orange-400">
                ${currentFeesTotal.toLocaleString()}/year
              </p>
            </div>
          )}

          <button
            onClick={calculateFees}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
          >
            Continue
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-slate-400 mb-2">
            These &quot;small&quot; fees add up to:
          </p>
          <div className="text-4xl font-bold text-orange-500 mb-4">
            +<AnimatedNumber value={state.feesLoss} duration={1200} />
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg mb-6">
            <p className="text-sm text-slate-400">Running total:</p>
            <div className="text-3xl font-bold text-red-500 animate-red-glow">
              <AnimatedNumber value={runningTotal} duration={1000} />
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
          >
            Now let&apos;s see what you&apos;re getting back...
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/landing/calculator/steps/
git commit -m "feat: add calculator steps 1-3 (hook, cap, fees)"
```

---

### Task 8: Create Calculator Step Components (Steps 4-5)

**Files:**
- Create: `src/components/landing/calculator/steps/step-4.tsx`
- Create: `src/components/landing/calculator/steps/step-5.tsx`

**Step 1: Create Step 4 - The Value Check**

```tsx
"use client";

import { CalculatorState, BENEFIT_LABELS } from "../types";

interface Step4Props {
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
  onNext: () => void;
}

export function Step4({ state, setState, onNext }: Step4Props) {
  const toggleBenefit = (benefit: keyof typeof state.benefits) => {
    setState((prev) => ({
      ...prev,
      benefits: { ...prev.benefits, [benefit]: !prev.benefits[benefit] },
    }));
  };

  const handleContinue = () => {
    // Calculate missing benefits
    const missing = Object.entries(state.benefits)
      .filter(([_, has]) => !has)
      .map(([key]) => BENEFIT_LABELS[key as keyof typeof BENEFIT_LABELS]);

    // Calculate total loss
    const totalLoss = state.splitLoss + state.capLoss + state.feesLoss;

    setState((prev) => ({
      ...prev,
      missingBenefits: missing,
      totalLoss,
    }));

    onNext();
  };

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-2xl font-bold text-white mb-2">
        Now let&apos;s see what you&apos;re getting back...
      </h3>
      <p className="text-slate-400 mb-6">
        Some brokerages charge more but deliver more. Does yours provide:
      </p>

      <div className="space-y-3 mb-6">
        {Object.entries(BENEFIT_LABELS).map(([key, label]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600"
          >
            <span className="text-white">{label}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!state.benefits[key as keyof typeof state.benefits]) {
                    toggleBenefit(key as keyof typeof state.benefits);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  state.benefits[key as keyof typeof state.benefits]
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  if (state.benefits[key as keyof typeof state.benefits]) {
                    toggleBenefit(key as keyof typeof state.benefits);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !state.benefits[key as keyof typeof state.benefits]
                    ? "bg-red-600 text-white"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
      >
        Show Me The Full Picture
      </button>
    </div>
  );
}
```

**Step 2: Create Step 5 - The Grand Reveal**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalculatorState } from "../types";
import { AnimatedNumber } from "../animated-number";

interface Step5Props {
  state: CalculatorState;
  onReset: () => void;
}

export function Step5({ state, onReset }: Step5Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    // Staggered reveal
    const timer1 = setTimeout(() => setShowDetails(true), 1500);
    const timer2 = setTimeout(() => setShowCTA(true), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="text-center">
      {/* Dramatic number reveal */}
      <div className="mb-8">
        <p className="text-slate-400 mb-4 text-lg">
          You&apos;re leaving on the table every year:
        </p>
        <div className="relative inline-block">
          <div className="text-6xl md:text-7xl font-bold text-red-500 animate-red-glow">
            <AnimatedNumber value={state.totalLoss} duration={2000} />
          </div>
          {/* Particle burst effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full opacity-0 animate-[particle-burst_1s_ease-out_1.5s_forwards]" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full opacity-0 animate-[particle-burst_1s_ease-out_1.6s_forwards]" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-500 rounded-full opacity-0 animate-[particle-burst_1s_ease-out_1.7s_forwards]" />
          </div>
        </div>
      </div>

      {/* Missing benefits */}
      {showDetails && state.missingBenefits.length > 0 && (
        <div className="animate-fade-in-up mb-8">
          <p className="text-slate-400 mb-4">AND you&apos;re missing out on:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {state.missingBenefits.map((benefit, i) => (
              <span
                key={benefit}
                className="px-4 py-2 bg-red-900/30 border border-red-500/50 rounded-full text-red-400 text-sm animate-stagger-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                ✗ {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA section */}
      {showCTA && (
        <div className="animate-fade-in-up">
          <div className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl mb-6">
            <p className="text-lg text-white mb-2">
              Brokerages exist that offer better splits AND these tools.
            </p>
            <p className="text-slate-400">
              Want to see who&apos;s actively recruiting agents like you?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/register?role=agent"
              className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover animate-button-pulse text-center"
            >
              Create My Anonymous Profile
            </Link>
            <button
              onClick={onReset}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-all duration-200 border border-slate-600"
            >
              Recalculate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/landing/calculator/steps/
git commit -m "feat: add calculator steps 4-5 (value check, grand reveal)"
```

---

### Task 9: Create Main Calculator Container

**Files:**
- Create: `src/components/landing/calculator/index.tsx`

**Step 1: Create the main calculator component that orchestrates all steps**

```tsx
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

export { type CalculatorState } from "./types";
```

**Step 2: Commit**

```bash
git add src/components/landing/calculator/index.tsx
git commit -m "feat: add main calculator container component"
```

---

## Phase 3: Page Sections

### Task 10: Create Trust Bar Component

**Files:**
- Create: `src/components/landing/trust-bar.tsx`

**Step 1: Create animated stats trust bar**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "./calculator/animated-number";

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 32000, prefix: "$", suffix: "/year", label: "Average agent loss to unnecessary fees" },
  { value: 73, prefix: "", suffix: "%", label: "of agents don't know their true cost" },
  { value: 3.2, prefix: "", suffix: " years", label: "Average time top producers switch" },
];

export function TrustBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#0A0F1C]/80 border-y border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s ease-out ${index * 0.2}s`,
              }}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {isVisible ? (
                  <>
                    {stat.prefix}
                    <AnimatedNumber
                      value={stat.value}
                      duration={2000}
                      prefix=""
                    />
                    {stat.suffix}
                  </>
                ) : (
                  `${stat.prefix}0${stat.suffix}`
                )}
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Source: NAR 2025 Member Profile, Industry Research
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/trust-bar.tsx
git commit -m "feat: add animated trust bar with stats"
```

---

### Task 11: Create How It Works Section

**Files:**
- Create: `src/components/landing/how-it-works.tsx`

**Step 1: Create animated how it works section**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v-2m0 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
    title: "Create Your Anonymous Profile",
    description: "Enter your production, experience, and what you want. Your identity stays completely hidden.",
    color: "blue",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Receive Competing Pitches",
    description: "Brokerages see your stats and send personalized offers. You review them privately.",
    color: "green",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Choose & Connect",
    description: "Accept the best offer, reveal yourself, and start conversations on your terms.",
    color: "purple",
  },
];

const colorClasses = {
  blue: "from-blue-600 to-blue-400 shadow-blue-500/30",
  green: "from-green-600 to-green-400 shadow-green-500/30",
  purple: "from-purple-600 to-purple-400 shadow-purple-500/30",
};

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="py-20 bg-[#0A0F1C]">
      <div className="container mx-auto px-6">
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Three simple steps to getting better offers from brokerages that actually want you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 opacity-30" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.6s ease-out ${index * 0.2 + 0.3}s`,
              }}
            >
              <div className="glass rounded-2xl p-8 h-full glass-hover transition-all duration-300">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} shadow-lg flex items-center justify-center text-white mb-6`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: add animated how it works section"
```

---

### Task 12: Create For Agents Section

**Files:**
- Create: `src/components/landing/for-agents.tsx`

**Step 1: Create the for agents benefits section**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const benefits = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Stay Anonymous",
    description: "Your current brokerage never knows you're looking. Reveal yourself only when you're ready.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Compare Real Offers",
    description: "See actual splits, caps, and benefits side-by-side. No more guessing or awkward coffee meetings.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 6L6 18" />
      </svg>
    ),
    title: "Zero Cost To You",
    description: "Completely free for agents. Brokerages pay to connect with you, not the other way around.",
  },
];

export function ForAgents() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="for-agents" ref={ref} className="py-20 bg-[#111827]">
      <div className="container mx-auto px-6">
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Built For Agents Who Know Their Worth
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Stop settling. Start negotiating from a position of power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s ease-out ${index * 0.15 + 0.2}s`,
              }}
            >
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div
          className="text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out 0.6s",
          }}
        >
          <Link
            href="/auth/register?role=agent"
            className="inline-block py-4 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover shadow-lg shadow-green-600/25"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/for-agents.tsx
git commit -m "feat: add for agents benefits section"
```

---

### Task 13: Create For Brokerages Section

**Files:**
- Create: `src/components/landing/for-brokerages.tsx`

**Step 1: Create the for brokerages section with pricing**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const benefits = [
  "Pre-qualified agents with verified production history",
  "Pay only when you pitch - no subscriptions, no wasted spend",
  "Agents matched to your culture and offerings",
  "Higher response rates than cold outreach",
];

export function ForBrokerages() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="for-brokerages" ref={ref} className="py-20 bg-[#0A0F1C]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-30px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              For Brokerages: Recruit Smarter
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Stop cold-calling. Access agents who are actively exploring options.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                    transition: `all 0.5s ease-out ${index * 0.1 + 0.3}s`,
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
                  <span className="text-slate-300">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register?role=brokerage"
              className="inline-block py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
            >
              Start Recruiting →
            </Link>
          </div>

          {/* Right: Pricing Card */}
          <div
            className="flex justify-center lg:justify-end"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.6s ease-out 0.2s",
            }}
          >
            <div className="glass rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                Simple, Transparent Pricing
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-bold text-blue-400 mb-2">$25</div>
                  <div className="text-sm text-slate-400 mb-2">per pitch</div>
                  <div className="text-xs text-slate-500 px-2 py-1 bg-slate-700/50 rounded-full">
                    Under $5M production
                  </div>
                </div>

                <div className="text-center p-6 bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-bold text-blue-400 mb-2">$50</div>
                  <div className="text-sm text-slate-400 mb-2">per pitch</div>
                  <div className="text-xs text-slate-500 px-2 py-1 bg-slate-700/50 rounded-full">
                    $5M+ producers
                  </div>
                </div>
              </div>

              <p className="text-center text-slate-500 text-sm">
                No subscriptions. No monthly fees.
                <br />
                Pay only for pitches you send.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/for-brokerages.tsx
git commit -m "feat: add for brokerages section with pricing"
```

---

### Task 14: Create FAQ Section

**Files:**
- Create: `src/components/landing/faq.tsx`

**Step 1: Create accordion FAQ section**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "Is it really free for agents?",
    answer: "Yes, completely. Brokerages pay to pitch you, you never pay a dime.",
  },
  {
    question: "How anonymous am I?",
    answer: "Brokerages see your production numbers, experience, and what you're looking for. Never your name, license number, or current brokerage until you choose to reveal.",
  },
  {
    question: "What does it cost brokerages?",
    answer: "$25 to pitch agents under $5M in production, $50 for agents producing $5M+. No subscriptions, no hidden fees.",
  },
  {
    question: "What if I accept a pitch but don't like the brokerage?",
    answer: "No obligation. Accepting just opens the conversation. You're in control.",
  },
  {
    question: "How do you verify agent production?",
    answer: "We verify license status. Production is self-reported but brokerages can request verification before signing.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
      >
        <span className="font-medium text-white">{question}</span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 text-slate-400">{answer}</div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={ref} className="py-20 bg-[#111827]">
      <div className="container mx-auto px-6 max-w-3xl">
        <div
          className="text-center mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Questions? We&apos;ve Got Answers
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease-out ${index * 0.1 + 0.2}s`,
              }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/faq.tsx
git commit -m "feat: add accordion FAQ section"
```

---

### Task 15: Create Final CTA Section

**Files:**
- Create: `src/components/landing/final-cta.tsx`

**Step 1: Create the final call-to-action section**

```tsx
"use client";

import Link from "next/link";

export function FinalCTA() {
  const scrollToCalculator = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0F1C] to-[#111827] relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-64 h-64 rounded-full animate-float opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            top: "20%",
            left: "10%",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full animate-float-delayed opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
            bottom: "20%",
            right: "15%",
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to See What You&apos;re Worth?
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Join agents who stopped settling and started negotiating.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToCalculator}
            className="py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover animate-button-pulse"
          >
            Calculate My Lost Commission
          </button>
          <Link
            href="/auth/register?role=agent"
            className="py-4 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 tilt-hover"
          >
            Create My Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/final-cta.tsx
git commit -m "feat: add final CTA section"
```

---

### Task 16: Create Footer Component

**Files:**
- Create: `src/components/landing/footer.tsx`

**Step 1: Create the footer**

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0A0F1C] border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
              The Agent<span className="text-blue-400">Agent</span>
            </Link>
            <p className="text-slate-400 max-w-md">
              Flip the script on recruiting. Let brokerages compete for your talent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#for-agents" className="text-slate-400 hover:text-white transition-colors">
                  For Agents
                </a>
              </li>
              <li>
                <a href="#for-brokerages" className="text-slate-400 hover:text-white transition-colors">
                  For Brokerages
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2026 The Agent Agent. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm mt-4 md:mt-0">
            Made for agents, by people who get it.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/footer.tsx
git commit -m "feat: add footer component"
```

---

## Phase 4: Assemble the Landing Page

### Task 17: Create Landing Page Index Export

**Files:**
- Create: `src/components/landing/index.ts`

**Step 1: Create barrel export for all landing components**

```typescript
export { AnimatedBackground } from "./animated-background";
export { Navigation } from "./navigation";
export { Calculator } from "./calculator";
export { TrustBar } from "./trust-bar";
export { HowItWorks } from "./how-it-works";
export { ForAgents } from "./for-agents";
export { ForBrokerages } from "./for-brokerages";
export { FAQ } from "./faq";
export { FinalCTA } from "./final-cta";
export { Footer } from "./footer";
```

**Step 2: Commit**

```bash
git add src/components/landing/index.ts
git commit -m "feat: add landing components barrel export"
```

---

### Task 18: Update Main Landing Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Replace the entire page with new landing page**

```tsx
import {
  AnimatedBackground,
  Navigation,
  Calculator,
  TrustBar,
  HowItWorks,
  ForAgents,
  ForBrokerages,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="animate-fade-in-up">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Stop Chasing Brokerages.
                <span className="text-blue-400"> Let Them Chase You.</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                The Agent Agent flips the script on real estate recruitment. Create
                an anonymous profile, set your requirements, and let brokerages
                compete for your talent with personalized offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register?role=agent"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 tilt-hover text-center shadow-lg shadow-green-600/25"
                >
                  Create Your Profile
                </Link>
                <a
                  href="#how-it-works"
                  className="border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 text-center"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Right: Calculator */}
            <div className="flex justify-center lg:justify-end">
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* How It Works */}
      <HowItWorks />

      {/* For Agents */}
      <ForAgents />

      {/* For Brokerages */}
      <ForBrokerages />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
```

**Step 2: Verify the page renders**

Run: `npm run dev`
Expected: Page loads with all sections, animations work

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble new landing page with all sections"
```

---

### Task 19: Delete Old Calculator Component

**Files:**
- Delete: `src/components/calculator.tsx`

**Step 1: Remove the old calculator**

```bash
rm src/components/calculator.tsx
```

**Step 2: Update any imports that might reference old calculator**

Check for any other files importing from `@/components/calculator` and update them.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old calculator component"
```

---

## Phase 5: Testing & Polish

### Task 20: Run Build and Fix Any TypeScript Errors

**Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: If there are errors, fix them one by one**

Common issues to watch for:
- Missing imports
- Type mismatches
- Unused variables

**Step 3: Run lint**

Run: `npm run lint`
Expected: No lint errors (or only warnings)

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build and lint errors"
```

---

### Task 21: Test Responsive Design

**Step 1: Test on mobile viewport**

Run: `npm run dev`
Open browser dev tools, test at 375px width

Check:
- Calculator stacks vertically
- Navigation hamburger works
- All text is readable
- Buttons are tappable (44px+ targets)

**Step 2: Test on tablet viewport**

Check at 768px width

**Step 3: Test reduced motion**

In browser dev tools, enable "prefers-reduced-motion" media feature
Verify: Animations are disabled

---

### Task 22: Push and Deploy

**Step 1: Push to GitHub**

```bash
git push origin master
```

**Step 2: Deploy to Vercel**

```bash
npx vercel --prod
```

Expected: Deployment succeeds

**Step 3: Verify live site**

Visit the Vercel URL and test all functionality.

---

## Summary

**Total Tasks:** 22
**Estimated Complexity:** High
**Key Components Created:**
- Animated background with floating orbs
- Sticky navigation with scroll effects
- 5-step progressive calculator
- Trust bar with animated stats
- How It Works section with scroll animations
- For Agents benefits section
- For Brokerages section with pricing
- FAQ accordion
- Final CTA
- Footer

**New Pricing Model:** $25/pitch for <$5M, $50/pitch for $5M+ producers
