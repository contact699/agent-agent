"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "./calculator/animated-number";

const stats = [
  {
    value: 32000,
    prefix: "$",
    suffix: "/year",
    label: "Average agent loss",
  },
  {
    value: 73,
    prefix: "",
    suffix: "%",
    label: "of agents don't know their cost",
  },
  {
    value: 3.2,
    prefix: "",
    suffix: " years",
    label: "Top producers switch frequency",
  },
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
    <div
      ref={ref}
      className="bg-[#0A0F1C]/80 border-y border-gray-700/50 py-8 md:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {isVisible ? (
                  stat.value === 3.2 ? (
                    <span>
                      {stat.prefix}3.2{stat.suffix}
                    </span>
                  ) : (
                    <AnimatedNumber
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1500}
                    />
                  )
                ) : (
                  <span>
                    {stat.prefix}0{stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-xs mt-6">
          Source: National Association of Realtors Annual Report, 2024
        </p>
      </div>
    </div>
  );
}
