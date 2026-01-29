"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WISH_LIST_OPTIONS, WISH_LIST_CATEGORIES } from "@/lib/constants";

export default function AgentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    yearsExperience: "",
    salesVolume: "",
    currentBroker: "",
    wishList: [] as string[],
  });

  const toggleWishListItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      wishList: prev.wishList.includes(id)
        ? prev.wishList.filter((item) => item !== id)
        : [...prev.wishList, id],
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create profile");
      }

      router.push("/dashboard/agent");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const groupedOptions = WISH_LIST_OPTIONS.reduce(
    (acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = [];
      }
      acc[option.category].push(option);
      return acc;
    },
    {} as Record<string, typeof WISH_LIST_OPTIONS[number][]>
  );

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
            <div
              className={`w-20 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Let&apos;s start with the basics
              </h2>
              <p className="text-gray-600 mb-6">
                This information helps brokerages understand your experience
                level.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name (Optional - remains hidden until you reveal)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Real Estate License Number *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseNumber: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 01234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) =>
                      setFormData({ ...formData, yearsExperience: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!formData.licenseNumber || !formData.yearsExperience) {
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

          {/* Step 2: Production */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your production
              </h2>
              <p className="text-gray-600 mb-6">
                Share your sales volume - this is what brokerages care about
                most.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Volume (Last 12 Months) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.salesVolume}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({ ...formData, salesVolume: value });
                      }}
                      required
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5000000"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your total transaction volume in dollars
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Brokerage (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.currentBroker}
                    onChange={(e) =>
                      setFormData({ ...formData, currentBroker: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Keller Williams"
                  />
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
                    if (!formData.salesVolume) {
                      setError("Please enter your sales volume");
                      return;
                    }
                    setError("");
                    setStep(3);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Wish List */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wish list
              </h2>
              <p className="text-gray-600 mb-6">
                Select what matters most to you. Brokerages will only see you if
                they match your criteria.
              </p>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {Object.entries(groupedOptions).map(([category, options]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                      {WISH_LIST_CATEGORIES[category as keyof typeof WISH_LIST_CATEGORIES]}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {options.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                            formData.wishList.includes(option.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.wishList.includes(option.id)}
                            onChange={() => toggleWishListItem(option.id)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                              formData.wishList.includes(option.id)
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.wishList.includes(option.id) && (
                              <svg
                                className="w-3 h-3 text-white"
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
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Selected: {formData.wishList.length} requirements
              </p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
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
