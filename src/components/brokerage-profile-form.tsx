"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BENEFIT_OPTIONS = [
  { id: "health_insurance", label: "Health Insurance" },
  { id: "401k", label: "401(k)" },
  { id: "training", label: "Training Program" },
  { id: "leads", label: "Lead Generation" },
  { id: "transaction_coordinator", label: "Transaction Coordinator" },
  { id: "marketing", label: "Marketing Support" },
  { id: "tech_stack", label: "Tech Stack Included" },
  { id: "office_space", label: "Office Space" },
];

interface StandardOffer {
  splitPercent: number;
  capAmount: number;
  monthlyFee: number;
  additionalBenefits: string[];
}

interface Brokerage {
  id: string;
  userId: string;
  companyName: string;
  location: string;
  logoUrl: string | null;
  description: string | null;
  standardOffer: unknown; // Prisma Json type
}

interface BrokerageProfileFormProps {
  brokerage: Brokerage;
}

function parseStandardOffer(offer: unknown): StandardOffer {
  const defaultOffer: StandardOffer = {
    splitPercent: 80,
    capAmount: 0,
    monthlyFee: 0,
    additionalBenefits: [],
  };

  if (!offer || typeof offer !== "object") {
    return defaultOffer;
  }

  const obj = offer as Record<string, unknown>;

  return {
    splitPercent: typeof obj.splitPercent === "number" ? obj.splitPercent : defaultOffer.splitPercent,
    capAmount: typeof obj.capAmount === "number" ? obj.capAmount : defaultOffer.capAmount,
    monthlyFee: typeof obj.monthlyFee === "number" ? obj.monthlyFee : defaultOffer.monthlyFee,
    additionalBenefits: Array.isArray(obj.additionalBenefits) ? obj.additionalBenefits : defaultOffer.additionalBenefits,
  };
}

export default function BrokerageProfileForm({ brokerage }: BrokerageProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedOffer = parseStandardOffer(brokerage.standardOffer);

  const [formData, setFormData] = useState({
    companyName: brokerage.companyName,
    location: brokerage.location,
    logoUrl: brokerage.logoUrl || "",
    description: brokerage.description || "",
    splitPercent: parsedOffer.splitPercent,
    capAmount: parsedOffer.capAmount,
    monthlyFee: parsedOffer.monthlyFee,
    additionalBenefits: parsedOffer.additionalBenefits,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleBenefit = (benefitId: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalBenefits: prev.additionalBenefits.includes(benefitId)
        ? prev.additionalBenefits.filter((id) => id !== benefitId)
        : [...prev.additionalBenefits, benefitId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/brokerage/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          location: formData.location,
          logoUrl: formData.logoUrl || null,
          description: formData.description || null,
          standardOffer: {
            splitPercent: Number(formData.splitPercent),
            capAmount: Number(formData.capAmount),
            monthlyFee: Number(formData.monthlyFee),
            additionalBenefits: formData.additionalBenefits,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      router.push("/dashboard/brokerage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/brokerage");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your brokerage name"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g., Los Angeles, CA"
        />
      </div>

      {/* Logo URL */}
      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
          Logo URL (Optional)
        </label>
        <input
          type="url"
          id="logoUrl"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Tell agents about your brokerage..."
        />
      </div>

      {/* Standard Offer Section */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Standard Offer</h2>
        <p className="text-sm text-gray-500 mb-4">
          This is the default offer attached to your pitches. You can customize individual pitches later.
        </p>

        {/* Split Percent */}
        <div className="mb-4">
          <label htmlFor="splitPercent" className="block text-sm font-medium text-gray-700">
            Commission Split (%) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="splitPercent"
              name="splitPercent"
              value={formData.splitPercent}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="80"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Agent&apos;s portion of the commission (e.g., 80 for an 80/20 split)
          </p>
        </div>

        {/* Cap Amount */}
        <div className="mb-4">
          <label htmlFor="capAmount" className="block text-sm font-medium text-gray-700">
            Cap Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="capAmount"
              name="capAmount"
              value={formData.capAmount}
              onChange={handleInputChange}
              min="0"
              step="1000"
              className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Maximum annual commission paid to brokerage (0 for no cap)
          </p>
        </div>

        {/* Monthly Fee */}
        <div className="mb-4">
          <label htmlFor="monthlyFee" className="block text-sm font-medium text-gray-700">
            Monthly Fee
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="monthlyFee"
              name="monthlyFee"
              value={formData.monthlyFee}
              onChange={handleInputChange}
              min="0"
              step="50"
              className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Monthly desk fee or E&O fee (0 for none)
          </p>
        </div>

        {/* Additional Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Benefits
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Select all benefits included in your standard offer.
          </p>
          <div className="flex flex-wrap gap-2">
            {BENEFIT_OPTIONS.map((benefit) => {
              const isSelected = formData.additionalBenefits.includes(benefit.id);
              return (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => toggleBenefit(benefit.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {benefit.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
