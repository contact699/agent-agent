"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WISH_LIST_OPTIONS, WISH_LIST_CATEGORIES } from "@/lib/constants";

interface Agent {
  id: string;
  userId: string;
  name: string | null;
  licenseNumber: string;
  yearsExperience: number;
  salesVolume: number;
  currentBroker: string | null;
  wishList: unknown; // Prisma Json type - will be parsed as string[]
  isAnonymous: boolean;
}

interface AgentProfileFormProps {
  agent: Agent;
}

export default function AgentProfileForm({ agent }: AgentProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: agent.name || "",
    licenseNumber: agent.licenseNumber,
    yearsExperience: agent.yearsExperience,
    salesVolume: agent.salesVolume,
    currentBroker: agent.currentBroker || "",
    wishList: Array.isArray(agent.wishList) ? (agent.wishList as string[]) : [],
    isAnonymous: agent.isAnonymous,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleWishListItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      wishList: prev.wishList.includes(itemId)
        ? prev.wishList.filter((id) => id !== itemId)
        : [...prev.wishList, itemId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/agent/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || null,
          licenseNumber: formData.licenseNumber,
          yearsExperience: formData.yearsExperience,
          salesVolume: formData.salesVolume,
          currentBroker: formData.currentBroker || null,
          wishList: formData.wishList,
          isAnonymous: formData.isAnonymous,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      router.push("/dashboard/agent");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/agent");
  };

  // Group wish list options by category
  const optionsByCategory = WISH_LIST_OPTIONS.reduce(
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your name (optional)"
        />
      </div>

      {/* License Number */}
      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
          License Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="licenseNumber"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g., DRE12345678"
        />
      </div>

      {/* Years of Experience */}
      <div>
        <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
          Years of Experience
        </label>
        <input
          type="number"
          id="yearsExperience"
          name="yearsExperience"
          value={formData.yearsExperience}
          onChange={handleInputChange}
          min="0"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Sales Volume */}
      <div>
        <label htmlFor="salesVolume" className="block text-sm font-medium text-gray-700">
          Sales Volume (Last 12 Months)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="salesVolume"
            name="salesVolume"
            value={formData.salesVolume}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Current Broker */}
      <div>
        <label htmlFor="currentBroker" className="block text-sm font-medium text-gray-700">
          Current Broker (Optional)
        </label>
        <input
          type="text"
          id="currentBroker"
          name="currentBroker"
          value={formData.currentBroker}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your current brokerage"
        />
      </div>

      {/* Wish List */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What are you looking for in a brokerage?
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Select all that apply. This helps brokerages understand your preferences.
        </p>

        <div className="space-y-6">
          {Object.entries(WISH_LIST_CATEGORIES).map(([categoryKey, categoryLabel]) => {
            const categoryOptions = optionsByCategory[categoryKey];
            if (!categoryOptions || categoryOptions.length === 0) return null;

            return (
              <div key={categoryKey}>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{categoryLabel}</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => {
                    const isSelected = formData.wishList.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleWishListItem(option.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anonymous Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAnonymous"
          name="isAnonymous"
          checked={formData.isAnonymous}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
          Keep my profile anonymous (recommended)
        </label>
      </div>
      <p className="text-xs text-gray-500 -mt-4 ml-6">
        When anonymous, brokerages will see you as &quot;Anonymous Agent&quot; until you accept their pitch.
      </p>

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
