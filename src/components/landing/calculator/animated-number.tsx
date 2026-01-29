"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // default 1500ms
  className?: string;
  prefix?: string; // default "$"
  suffix?: string; // default ""
}

export function AnimatedNumber({ value, duration = 1500, className = "", prefix = "$", suffix = "" }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);

  useEffect(() => {
    // Store the starting value from ref to avoid dependency issues
    const startValue = previousValueRef.current;

    if (value === 0 && startValue === 0) {
      return;
    }

    const startTime = Date.now();
    const diff = value - startValue;
    let animationFrameId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Update ref when animation completes
        previousValueRef.current = value;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  const formatted = new Intl.NumberFormat("en-US").format(displayValue);

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
