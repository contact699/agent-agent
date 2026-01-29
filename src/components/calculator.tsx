"use client";

import { useState } from "react";

export function BrokerageFeeCalculator() {
  const [annualVolume, setAnnualVolume] = useState<string>("");
  const [currentSplit, setCurrentSplit] = useState<string>("");
  const [result, setResult] = useState<{
    lostCommission: number;
    potentialEarnings: number;
  } | null>(null);

  const calculateLostCommission = () => {
    const volume = parseFloat(annualVolume.replace(/,/g, ""));
    const split = parseFloat(currentSplit);

    if (isNaN(volume) || isNaN(split) || split < 0 || split > 100) {
      return;
    }

    // Standard commission rate assumption: 3% of transaction volume
    const totalCommission = volume * 0.03;
    
    // What agent currently keeps
    const currentAgentShare = totalCommission * (split / 100);
    
    // What agent could keep at 90/10 split
    const potentialAgentShare = totalCommission * 0.9;
    
    // Lost commission = difference
    const lostCommission = potentialAgentShare - currentAgentShare;

    setResult({
      lostCommission: Math.max(0, lostCommission),
      potentialEarnings: potentialAgentShare,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Brokerage Fee Calculator
      </h3>
      <p className="text-gray-600 mb-6">
        See how much you could be leaving on the table with your current split.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="volume"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Annual Sales Volume ($)
          </label>
          <input
            type="text"
            id="volume"
            value={annualVolume}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9,]/g, "");
              setAnnualVolume(value);
            }}
            placeholder="e.g., 5,000,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label
            htmlFor="split"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Current Split (Your %)
          </label>
          <input
            type="number"
            id="split"
            value={currentSplit}
            onChange={(e) => setCurrentSplit(e.target.value)}
            placeholder="e.g., 70"
            min="0"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <button
          onClick={calculateLostCommission}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02]"
        >
          Calculate My Lost Commission
        </button>
      </div>

      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              You&apos;re potentially leaving behind
            </p>
            <p className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(result.lostCommission)}
            </p>
            <p className="text-sm text-gray-500">per year</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-red-100">
            <p className="text-sm text-gray-600 text-center">
              With a 90/10 split, you could earn{" "}
              <span className="font-semibold text-green-600">
                {formatCurrency(result.potentialEarnings)}
              </span>{" "}
              annually.
            </p>
          </div>

          <a
            href="/auth/register?role=agent"
            className="mt-4 block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
          >
            Find Better Offers →
          </a>
        </div>
      )}
    </div>
  );
}
