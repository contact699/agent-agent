"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WISH_LIST_OPTIONS, WISH_LIST_CATEGORIES } from "@/lib/constants";

interface Agent {
  id: string;
  anonymousId: string;
  yearsExperience: number;
  salesVolume: number;
  wishList: string[];
  // Contact info revealed after payment
  name?: string | null;
  licenseNumber?: string;
}

interface StandardOffer {
  splitPercent: number;
  capAmount: number | null;
  monthlyFee: number;
  additionalBenefits: string[];
}

type PitchStatus = "PENDING" | "ACCEPTED" | "DECLINED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED";

interface PitchedAgent {
  pitchId: string;
  agentId: string;
  status: PitchStatus;
  paymentStatus: PaymentStatus;
  agent: Agent;
}

interface AgentDiscoveryFeedProps {
  agents: Agent[];
  brokerageId: string;
  standardOffer: StandardOffer;
  pitchedAgents?: PitchedAgent[];
}

// Experience filter options
const EXPERIENCE_OPTIONS = [
  { value: 0, label: "Any experience" },
  { value: 2, label: "2+ years" },
  { value: 5, label: "5+ years" },
  { value: 10, label: "10+ years" },
];

// Volume filter options
const VOLUME_OPTIONS = [
  { value: 0, label: "Any volume" },
  { value: 500000, label: "$500K+" },
  { value: 1000000, label: "$1M+" },
  { value: 5000000, label: "$5M+" },
];

export function AgentDiscoveryFeed({
  agents,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  brokerageId,
  standardOffer,
  pitchedAgents = [],
}: AgentDiscoveryFeedProps) {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [pitchMessage, setPitchMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Filter state
  const [minExperience, setMinExperience] = useState(0);
  const [minVolume, setMinVolume] = useState(0);
  const [selectedWishListFilters, setSelectedWishListFilters] = useState<string[]>([]);
  const [showWishListDropdown, setShowWishListDropdown] = useState(false);

  // Create a map of agentId -> pitch info for quick lookup
  const pitchMap = new Map<string, PitchedAgent>();
  pitchedAgents.forEach((p) => pitchMap.set(p.agentId, p));

  // Get pitch info for an agent
  const getPitchInfo = (agentId: string) => pitchMap.get(agentId);

  // Handle payment checkout
  const handlePayNow = async (pitchId: string) => {
    setPaymentLoading(pitchId);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaymentLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWishListLabel = (id: string) => {
    const option = WISH_LIST_OPTIONS.find((o) => o.id === id);
    return option?.label || id;
  };

  const calculateMatchScore = (agent: Agent) => {
    const wishList = agent.wishList as string[];
    if (!wishList || wishList.length === 0) return 100;

    let matched = 0;
    
    wishList.forEach((wish) => {
      // Check split requirements
      if (wish === "90_10_SPLIT" && standardOffer.splitPercent >= 90) matched++;
      if (wish === "80_20_SPLIT" && standardOffer.splitPercent >= 80) matched++;
      if (wish === "100_SPLIT" && standardOffer.splitPercent === 100) matched++;
      
      // Check cap requirements
      if (wish === "CAP_UNDER_25K" && standardOffer.capAmount && standardOffer.capAmount <= 25000) matched++;
      if (wish === "CAP_UNDER_15K" && standardOffer.capAmount && standardOffer.capAmount <= 15000) matched++;
      
      // Check fee requirements
      if (wish === "NO_MONTHLY_FEES" && standardOffer.monthlyFee === 0) matched++;
      if (wish === "LOW_MONTHLY_FEES" && standardOffer.monthlyFee < 500) matched++;
      
      // Check benefits
      const benefitMap: Record<string, string> = {
        HEALTH_INSURANCE: "health_insurance",
        RETIREMENT_401K: "retirement_401k",
        TRAINING_MENTORSHIP: "training",
        LEADS_PROVIDED: "leads",
        TRANSACTION_COORDINATOR: "transaction_coordinator",
        MARKETING_SUPPORT: "marketing",
        TECH_STACK_INCLUDED: "tech_stack",
        OFFICE_SPACE: "office_space",
      };

      if (benefitMap[wish] && standardOffer.additionalBenefits?.includes(benefitMap[wish])) {
        matched++;
      }
    });

    return Math.round((matched / wishList.length) * 100);
  };

  const sendPitch = async () => {
    if (!selectedAgent || !pitchMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/pitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          message: pitchMessage,
          offerDetails: standardOffer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send pitch");
      }

      setSelectedAgent(null);
      setPitchMessage("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send pitch");
    } finally {
      setLoading(false);
    }
  };

  // Toggle wish list filter
  const toggleWishListFilter = (id: string) => {
    setSelectedWishListFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setMinExperience(0);
    setMinVolume(0);
    setSelectedWishListFilters([]);
  };

  // Combine available agents and pitched agents for display
  // Available agents = not pitched yet
  // Pitched agents = agents with existing pitches
  const allAgentsToDisplay: Agent[] = [
    ...agents,
    ...pitchedAgents.map((p) => p.agent),
  ];

  // Apply client-side filters
  const filteredAgents = useMemo(() => {
    return allAgentsToDisplay.filter((agent) => {
      // Filter by minimum experience
      if (agent.yearsExperience < minExperience) {
        return false;
      }

      // Filter by minimum sales volume
      if (agent.salesVolume < minVolume) {
        return false;
      }

      // Filter by wish list items (agent must have at least one of the selected items)
      if (selectedWishListFilters.length > 0) {
        const agentWishList = agent.wishList as string[];
        const hasMatchingWishList = selectedWishListFilters.some((filter) =>
          agentWishList.includes(filter)
        );
        if (!hasMatchingWishList) {
          return false;
        }
      }

      return true;
    });
  }, [allAgentsToDisplay, minExperience, minVolume, selectedWishListFilters]);

  const hasActiveFilters = minExperience > 0 || minVolume > 0 || selectedWishListFilters.length > 0;

  // Sort agents by match score
  const sortedAgents = [...filteredAgents].sort(
    (a, b) => calculateMatchScore(b) - calculateMatchScore(a)
  );

  // Render status badge for an agent
  const renderStatusBadge = (agent: Agent) => {
    const pitchInfo = getPitchInfo(agent.id);

    if (!pitchInfo) {
      return null; // No pitch yet - will show "Send Pitch" on card click
    }

    if (pitchInfo.paymentStatus === "PAID") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Connected
        </span>
      );
    }

    if (pitchInfo.status === "ACCEPTED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
          Accepted - Pay to Connect
        </span>
      );
    }

    if (pitchInfo.status === "DECLINED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Declined
        </span>
      );
    }

    // PENDING status
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Pitch Sent
      </span>
    );
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Experience Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience
            </label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sales Volume
            </label>
            <select
              value={minVolume}
              onChange={(e) => setMinVolume(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {VOLUME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Wish List Filter */}
          <div className="flex-1 min-w-[200px] relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Looking For
            </label>
            <button
              type="button"
              onClick={() => setShowWishListDropdown(!showWishListDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
            >
              <span className="truncate">
                {selectedWishListFilters.length === 0
                  ? "Any requirements"
                  : `${selectedWishListFilters.length} selected`}
              </span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  showWishListDropdown ? "rotate-180" : ""
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

            {/* Wish List Dropdown */}
            {showWishListDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {Object.entries(WISH_LIST_CATEGORIES).map(([categoryKey, categoryLabel]) => {
                  const categoryOptions = WISH_LIST_OPTIONS.filter(
                    (opt) => opt.category === categoryKey
                  );
                  if (categoryOptions.length === 0) return null;

                  return (
                    <div key={categoryKey}>
                      <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {categoryLabel}
                      </div>
                      {categoryOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedWishListFilters.includes(option.id)}
                            onChange={() => toggleWishListFilter(option.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {selectedWishListFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedWishListFilters.map((filterId) => {
              const option = WISH_LIST_OPTIONS.find((o) => o.id === filterId);
              return (
                <span
                  key={filterId}
                  className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {option?.label || filterId}
                  <button
                    type="button"
                    onClick={() => toggleWishListFilter(filterId)}
                    className="ml-1.5 hover:text-blue-900"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredAgents.length} of {allAgentsToDisplay.length} agents
        </div>
      </div>

      {/* Global error display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* No Results After Filtering */}
      {filteredAgents.length === 0 && allAgentsToDisplay.length > 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No agents match your filters
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* No Agents Available at All */}
      {allAgentsToDisplay.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No agents available
          </h3>
          <p className="text-gray-600">
            Check back later for new talent!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {sortedAgents.map((agent) => {
          const matchScore = calculateMatchScore(agent);
          const wishList = agent.wishList as string[];
          const pitchInfo = getPitchInfo(agent.id);
          const isPaid = pitchInfo?.paymentStatus === "PAID";
          const isAcceptedPendingPayment = pitchInfo?.status === "ACCEPTED" && pitchInfo?.paymentStatus !== "PAID";
          const isDeclined = pitchInfo?.status === "DECLINED";
          const canSendPitch = !pitchInfo;

          return (
            <div
              key={agent.id}
              className={`border rounded-lg p-4 transition ${
                isPaid
                  ? "border-green-300 bg-green-50"
                  : isAcceptedPendingPayment
                  ? "border-yellow-300 bg-yellow-50"
                  : isDeclined
                  ? "border-red-200 bg-red-50 opacity-75"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer"
              }`}
              onClick={() => {
                if (canSendPitch) {
                  setSelectedAgent(agent);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isPaid
                      ? "bg-gradient-to-br from-green-400 to-green-600"
                      : "bg-gradient-to-br from-blue-400 to-blue-600"
                  }`}>
                    <span className="text-white font-bold">
                      {isPaid && agent.name
                        ? agent.name.charAt(0).toUpperCase()
                        : agent.anonymousId.slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    {isPaid && agent.name ? (
                      <>
                        <h4 className="font-semibold text-gray-900">
                          {agent.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          License: {agent.licenseNumber}
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">
                          Anonymous Agent #{agent.anonymousId.slice(-6).toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {agent.yearsExperience} years experience
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {renderStatusBadge(agent)}
                  <div
                    className={`text-sm font-semibold mt-1 ${
                      matchScore >= 70
                        ? "text-green-600"
                        : matchScore >= 40
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {matchScore}% match
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(agent.salesVolume)} volume
                  </div>
                </div>
              </div>

              {/* Contact Info for Paid Connections */}
              {isPaid && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <h5 className="text-sm font-semibold text-green-800 mb-2">Contact Information</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900">{agent.name || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">License:</span>
                      <p className="font-medium text-gray-900">{agent.licenseNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Now Button for Accepted Pitches */}
              {isAcceptedPendingPayment && pitchInfo && (
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayNow(pitchInfo.pitchId);
                    }}
                    disabled={paymentLoading === pitchInfo.pitchId}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center"
                  >
                    {paymentLoading === pitchInfo.pitchId ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Pay Now to Reveal Contact Info
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    This agent accepted your pitch! Pay to view their contact details.
                  </p>
                </div>
              )}

              {/* Wish List Tags */}
              {wishList && wishList.length > 0 && !isPaid && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {wishList.slice(0, 4).map((wish) => (
                    <span
                      key={wish}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {getWishListLabel(wish)}
                    </span>
                  ))}
                  {wishList.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{wishList.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Send Pitch hint for unpitched agents */}
              {canSendPitch && (
                <div className="mt-3 text-sm text-blue-600 font-medium">
                  Click to send pitch →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pitch Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Send Pitch
                </h3>
                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    setPitchMessage("");
                    setError("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Agent Info */}
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {selectedAgent.anonymousId.slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Anonymous Agent #
                      {selectedAgent.anonymousId.slice(-6).toUpperCase()}
                    </h4>
                    <p className="text-gray-600">
                      {selectedAgent.yearsExperience} years •{" "}
                      {formatCurrency(selectedAgent.salesVolume)} volume
                    </p>
                  </div>
                </div>

                {/* Agent's Requirements */}
                {(selectedAgent.wishList as string[]).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      What They&apos;re Looking For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedAgent.wishList as string[]).map((wish) => (
                        <span
                          key={wish}
                          className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-full"
                        >
                          {getWishListLabel(wish)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Your Offer Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Your Offer (Auto-attached)
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Split</span>
                      <p className="font-semibold text-green-600">
                        {standardOffer.splitPercent}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Cap</span>
                      <p className="font-medium">
                        {standardOffer.capAmount
                          ? formatCurrency(standardOffer.capAmount)
                          : "No cap"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly</span>
                      <p className="font-medium">
                        {formatCurrency(standardOffer.monthlyFee)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pitch Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell this agent why they should join your brokerage..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      setSelectedAgent(null);
                      setPitchMessage("");
                      setError("");
                    }}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendPitch}
                    disabled={loading || !pitchMessage.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    {loading ? "Sending..." : "Send Pitch"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
