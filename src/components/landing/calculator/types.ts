export interface CalculatorState {
  step: number;
  // Step 1
  annualVolume: string;
  currentSplit: string;
  splitLoss: number;
  // Step 2
  hasCap: "yes" | "no" | "not-sure" | null;
  capAmount: string;
  capLoss: number;
  // Step 3
  fees: {
    desk: boolean;
    eo: boolean;
    transaction: boolean;
    franchise: boolean;
    technology: boolean;
    marketing: boolean;
  };
  feesLoss: number;
  // Step 4
  benefits: {
    crm: boolean;
    website: boolean;
    leads: boolean;
    training: boolean;
    marketing: boolean;
  };
  // Step 5 (calculated)
  totalLoss: number;
  missingBenefits: string[];
}

export const FEE_ESTIMATES = {
  desk: 6000, // $500/month
  eo: 1200, // E&O insurance
  transaction: 3000, // ~$150 per transaction, ~20 transactions
  franchise: 5000, // Franchise fee
  technology: 2400, // $200/month
  marketing: 3600, // $300/month
};

export const BENEFIT_LABELS: Record<keyof CalculatorState["benefits"], string> = {
  crm: "CRM System",
  website: "Personal Website",
  leads: "Lead Generation",
  training: "Training & Mentorship",
  marketing: "Marketing Materials",
};

export const INITIAL_STATE: CalculatorState = {
  step: 1,
  annualVolume: "",
  currentSplit: "",
  splitLoss: 0,
  hasCap: null,
  capAmount: "",
  capLoss: 0,
  fees: {
    desk: false,
    eo: false,
    transaction: false,
    franchise: false,
    technology: false,
    marketing: false,
  },
  feesLoss: 0,
  benefits: {
    crm: false,
    website: false,
    leads: false,
    training: false,
    marketing: false,
  },
  totalLoss: 0,
  missingBenefits: [],
};
