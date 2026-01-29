"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is it really free for agents?",
    answer:
      "Yes, completely free. Agents never pay a dime. We make money when brokerages pay to send you pitches. Your profile, inbox, and all features are 100% free forever.",
  },
  {
    question: "How anonymous am I?",
    answer:
      "Brokerages see your production numbers, license state, and preferences - but never your name, contact info, or current brokerage. Your identity is only revealed when YOU choose to accept a pitch and connect.",
  },
  {
    question: "What does it cost brokerages?",
    answer:
      "$25 per pitch for agents under $5M in production, or $50 per pitch for $5M+ producers. No subscriptions, no monthly fees, no hidden costs. Brokerages only pay when they want to reach out to you.",
  },
  {
    question: "What if I accept but don't like the brokerage?",
    answer:
      "No obligation whatsoever. Accepting a pitch just opens the conversation - you're not committed to anything. If the brokerage isn't a fit after talking, simply move on. There's no pressure and no penalty.",
  },
  {
    question: "How do you verify agent production?",
    answer:
      "Your real estate license is verified through state records. Production numbers are self-reported on your profile. Brokerages understand this and will verify production during their standard recruitment process.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 lg:py-32 bg-[#111827]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about The Agent Agent
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl overflow-hidden glass-hover"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-medium text-white pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
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
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
