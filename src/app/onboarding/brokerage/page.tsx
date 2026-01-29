"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BrokerageOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    location: "",
    description: "",
    logoUrl: "",
    standardOffer: {
      splitPercent: "",
      capAmount: "",
      monthlyFee: "",
      additionalBenefits: [] as string[],
    },
  });

  const benefitOptions = [
    { id: "health_insurance", label: "Health Insurance" },
    { id: "retirement_401k", label: "401(k) / Retirement" },
    { id: "training", label: "Training & Mentorship" },
    { id: "leads", label: "Leads Provided" },
    { id: "transaction_coordinator", label: "Transaction Coordinator" },
    { id: "marketing", label: "Marketing Support" },
    { id: "tech_stack", label: "Tech Stack Included" },
    { id: "office_space", label: "Office Space" },
  ];

  const toggleBenefit = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      standardOffer: {
        ...prev.standardOffer,
        additionalBenefits: prev.standardOffer.additionalBenefits.includes(id)
          ? prev.standardOffer.additionalBenefits.filter((b) => b !== id)
          : [...prev.standardOffer.additionalBenefits, id],
      },
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/brokerage/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          location: formData.location,
          description: formData.description,
          logoUrl: formData.logoUrl || null,
          standardOffer: {
            splitPercent: parseFloat(formData.standardOffer.splitPercent),
            capAmount: parseFloat(formData.standardOffer.capAmount) || null,
            monthlyFee: parseFloat(formData.standardOffer.monthlyFee) || 0,
            additionalBenefits: formData.standardOffer.additionalBenefits,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create profile");
      }

      router.push("/dashboard/brokerage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`w-20 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Company Info */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your brokerage
              </h2>
              <p className="text-gray-600 mb-6">
                This information will be shown to agents when you send them a
                pitch.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Premier Realty Group"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Los Angeles, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell agents what makes your brokerage special..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, logoUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!formData.companyName || !formData.location) {
                    setError("Please fill in all required fields");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Continue
              </button>
            </>
          )}

          {/* Step 2: Standard Offer */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Define your standard offer
              </h2>
              <p className="text-gray-600 mb-6">
                This will be your default offer when reaching out to agents. You
                can customize it for individual pitches later.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Split (Agent&apos;s %) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.standardOffer.splitPercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          standardOffer: {
                            ...formData.standardOffer,
                            splitPercent: e.target.value,
                          },
                        })
                      }
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 80"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Agent keeps this percentage, brokerage keeps the rest
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Cap Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.standardOffer.capAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({
                          ...formData,
                          standardOffer: {
                            ...formData.standardOffer,
                            capAmount: value,
                          },
                        });
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 25000"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Leave blank if no cap
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Fee ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.standardOffer.monthlyFee}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({
                          ...formData,
                          standardOffer: {
                            ...formData.standardOffer,
                            monthlyFee: value,
                          },
                        });
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Benefits Included
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {benefitOptions.map((benefit) => (
                      <label
                        key={benefit.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                          formData.standardOffer.additionalBenefits.includes(
                            benefit.id
                          )
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.standardOffer.additionalBenefits.includes(
                            benefit.id
                          )}
                          onChange={() => toggleBenefit(benefit.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                            formData.standardOffer.additionalBenefits.includes(
                              benefit.id
                            )
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.standardOffer.additionalBenefits.includes(
                            benefit.id
                          ) && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {benefit.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!formData.standardOffer.splitPercent) {
                      setError("Please enter your commission split");
                      return;
                    }
                    handleSubmit();
                  }}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {loading ? "Creating Profile..." : "Complete Profile"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
