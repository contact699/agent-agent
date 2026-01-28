"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OfferDetails {
  splitPercent?: number;
  capAmount?: number | null;
  monthlyFee?: number;
  additionalBenefits?: string[];
}

interface Pitch {
  id: string;
  message: string;
  offerDetails: OfferDetails | Record<string, unknown>;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string | Date;
  brokerage: {
    id: string;
    companyName: string;
    location: string;
    logoUrl: string | null;
    description?: string | null;
    // Contact info revealed after payment
    contactEmail?: string | null;
  };
}

interface PitchInboxProps {
  pitches: Pitch[];
}

export function PitchInbox({ pitches }: PitchInboxProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);

  // Helper to safely access offer details
  const getOfferDetails = (offer: OfferDetails | Record<string, unknown>): OfferDetails => {
    return offer as OfferDetails;
  };

  const handleAction = async (pitchId: string, action: "accept" | "decline") => {
    setLoading(pitchId);

    try {
      const response = await fetch(`/api/pitches/${pitchId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to process action");
      }

      // Refresh the page to show updated pitch status
      // Note: For accepted pitches, the brokerage will need to complete payment
      // before contact information is shared
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
      setSelectedPitch(null);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "No cap";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingPitches = pitches.filter((p) => p.status === "PENDING");
  const respondedPitches = pitches.filter((p) => p.status !== "PENDING");

  if (pitches.length === 0) {
    return (
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No pitches yet
        </h3>
        <p className="text-gray-600">
          Brokerages that match your requirements will send you offers here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Pending Pitches */}
      {pendingPitches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            New Pitches ({pendingPitches.length})
          </h3>
          <div className="space-y-4">
            {pendingPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="border border-blue-200 bg-blue-50/50 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer"
                onClick={() => setSelectedPitch(pitch)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {pitch.brokerage.logoUrl ? (
                      <img
                        src={pitch.brokerage.logoUrl}
                        alt={pitch.brokerage.companyName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {pitch.brokerage.companyName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">
                        {pitch.brokerage.companyName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {pitch.brokerage.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(pitch.createdAt)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Split</span>
                    <p className="font-semibold text-green-600">
                      {getOfferDetails(pitch.offerDetails).splitPercent}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Cap</span>
                    <p className="font-medium">
                      {formatCurrency(getOfferDetails(pitch.offerDetails).capAmount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Monthly Fee</span>
                    <p className="font-medium">
                      {formatCurrency(getOfferDetails(pitch.offerDetails).monthlyFee)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 line-clamp-2">{pitch.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responded Pitches */}
      {respondedPitches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Previous Pitches ({respondedPitches.length})
          </h3>
          <div className="space-y-3">
            {respondedPitches.map((pitch) => {
              const isPaid = pitch.status === "ACCEPTED" && pitch.paymentStatus === "PAID";
              const isAwaitingPayment = pitch.status === "ACCEPTED" && pitch.paymentStatus === "PENDING";
              const isDeclined = pitch.status === "DECLINED";

              return (
                <div
                  key={pitch.id}
                  className={`border rounded-lg p-4 ${
                    isPaid
                      ? "border-green-200 bg-green-50/50 opacity-100"
                      : isAwaitingPayment
                      ? "border-yellow-200 bg-yellow-50/50 opacity-100"
                      : "border-gray-200 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isPaid && pitch.brokerage.logoUrl ? (
                        <img
                          src={pitch.brokerage.logoUrl}
                          alt={pitch.brokerage.companyName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isPaid ? "bg-green-100" : isAwaitingPayment ? "bg-yellow-100" : "bg-gray-100"
                        }`}>
                          <span className={`text-sm font-bold ${
                            isPaid ? "text-green-600" : isAwaitingPayment ? "text-yellow-600" : "text-gray-400"
                          }`}>
                            {pitch.brokerage.companyName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="ml-3">
                        <h4 className={`font-medium ${isPaid ? "text-gray-900" : "text-gray-700"}`}>
                          {pitch.brokerage.companyName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {pitch.brokerage.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : isAwaitingPayment
                          ? "bg-yellow-100 text-yellow-700"
                          : isDeclined
                          ? "bg-gray-100 text-gray-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isPaid
                        ? "Connected"
                        : isAwaitingPayment
                        ? "Awaiting Payment"
                        : pitch.status}
                    </span>
                  </div>

                  {/* Show brokerage contact info after payment */}
                  {isPaid && pitch.brokerage.contactEmail && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-1">
                            Contact Information
                          </h5>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 mr-2 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <a
                              href={`mailto:${pitch.brokerage.contactEmail}`}
                              className="text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              {pitch.brokerage.contactEmail}
                            </a>
                          </div>
                        </div>
                        <a
                          href={`mailto:${pitch.brokerage.contactEmail}?subject=Re: Your pitch on AgentAgent`}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                          Contact Now
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Show awaiting payment message */}
                  {isAwaitingPayment && (
                    <div className="mt-3 flex items-center text-sm text-yellow-700">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Waiting for brokerage to complete payment. Contact info will be shared once payment is confirmed.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pitch Detail Modal */}
      {selectedPitch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Pitch from {selectedPitch.brokerage.companyName}
                </h3>
                <button
                  onClick={() => setSelectedPitch(null)}
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
                {/* Brokerage Info */}
                <div className="flex items-center">
                  {selectedPitch.brokerage.logoUrl ? (
                    <img
                      src={selectedPitch.brokerage.logoUrl}
                      alt={selectedPitch.brokerage.companyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedPitch.brokerage.companyName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedPitch.brokerage.companyName}
                    </h4>
                    <p className="text-gray-600">
                      {selectedPitch.brokerage.location}
                    </p>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Their Offer
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Split</span>
                      <p className="text-xl font-bold text-green-600">
                        {getOfferDetails(selectedPitch.offerDetails).splitPercent}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Cap</span>
                      <p className="text-lg font-semibold">
                        {formatCurrency(getOfferDetails(selectedPitch.offerDetails).capAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Monthly</span>
                      <p className="text-lg font-semibold">
                        {formatCurrency(getOfferDetails(selectedPitch.offerDetails).monthlyFee)}
                      </p>
                    </div>
                  </div>

                  {getOfferDetails(selectedPitch.offerDetails).additionalBenefits &&
                    getOfferDetails(selectedPitch.offerDetails).additionalBenefits!.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-500">
                          Also includes:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getOfferDetails(selectedPitch.offerDetails).additionalBenefits!.map(
                            (benefit) => (
                              <span
                                key={benefit}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                              >
                                {benefit.replace(/_/g, " ")}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Message */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Their Message
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedPitch.message}
                  </p>
                </div>

                {/* Actions for PENDING pitches */}
                {selectedPitch.status === "PENDING" && (
                  <div className="flex gap-4 pt-4 border-t">
                    <button
                      onClick={() => handleAction(selectedPitch.id, "decline")}
                      disabled={loading === selectedPitch.id}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(selectedPitch.id, "accept")}
                      disabled={loading === selectedPitch.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                      {loading === selectedPitch.id
                        ? "Processing..."
                        : "Accept & Reveal Identity"}
                    </button>
                  </div>
                )}

                {/* Status for ACCEPTED pitches awaiting payment */}
                {selectedPitch.status === "ACCEPTED" && selectedPitch.paymentStatus === "PENDING" && (
                  <div className="pt-4 border-t">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <h5 className="font-semibold text-yellow-800">Awaiting Payment</h5>
                          <p className="text-sm text-yellow-700">
                            You've accepted this pitch. Waiting for {selectedPitch.brokerage.companyName} to complete payment before contact details are shared.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact info for PAID pitches */}
                {selectedPitch.status === "ACCEPTED" && selectedPitch.paymentStatus === "PAID" && (
                  <div className="pt-4 border-t">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h5 className="font-semibold text-green-800">Connected!</h5>
                      </div>
                      {selectedPitch.brokerage.contactEmail ? (
                        <div className="space-y-3">
                          <p className="text-sm text-green-700">
                            Payment has been completed. You can now contact {selectedPitch.brokerage.companyName} directly.
                          </p>
                          <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center text-gray-700">
                              <svg
                                className="w-4 h-4 mr-2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm">{selectedPitch.brokerage.contactEmail}</span>
                            </div>
                            <a
                              href={`mailto:${selectedPitch.brokerage.contactEmail}?subject=Re: Your pitch on AgentAgent`}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                            >
                              Send Email
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-green-700">
                          Payment has been completed. The brokerage will reach out to you shortly.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Status for DECLINED pitches */}
                {selectedPitch.status === "DECLINED" && (
                  <div className="pt-4 border-t">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2"
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
                        <div>
                          <h5 className="font-semibold text-gray-700">Declined</h5>
                          <p className="text-sm text-gray-600">
                            You declined this pitch from {selectedPitch.brokerage.companyName}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
