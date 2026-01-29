// Wish list options for agents
export const WISH_LIST_OPTIONS = [
  {
    id: "90_10_SPLIT",
    label: "90/10 Split or Better",
    category: "compensation",
  },
  {
    id: "80_20_SPLIT",
    label: "80/20 Split or Better",
    category: "compensation",
  },
  {
    id: "100_SPLIT",
    label: "100% Commission (Flat Fee)",
    category: "compensation",
  },
  {
    id: "CAP_UNDER_25K",
    label: "Cap Under $25,000",
    category: "compensation",
  },
  {
    id: "CAP_UNDER_15K",
    label: "Cap Under $15,000",
    category: "compensation",
  },
  {
    id: "NO_MONTHLY_FEES",
    label: "No Monthly Fees",
    category: "fees",
  },
  {
    id: "LOW_MONTHLY_FEES",
    label: "Monthly Fees Under $500",
    category: "fees",
  },
  {
    id: "HEALTH_INSURANCE",
    label: "Health Insurance Available",
    category: "benefits",
  },
  {
    id: "RETIREMENT_401K",
    label: "401(k) or Retirement Plan",
    category: "benefits",
  },
  {
    id: "TRAINING_MENTORSHIP",
    label: "Training & Mentorship Program",
    category: "support",
  },
  {
    id: "LEADS_PROVIDED",
    label: "Leads Provided",
    category: "support",
  },
  {
    id: "TRANSACTION_COORDINATOR",
    label: "Transaction Coordinator Support",
    category: "support",
  },
  {
    id: "MARKETING_SUPPORT",
    label: "Marketing Support & Materials",
    category: "support",
  },
  {
    id: "FOLLOW_UP_BOSS_CRM",
    label: "Follow Up Boss CRM",
    category: "tech",
  },
  {
    id: "KVCORE_CRM",
    label: "kvCORE CRM",
    category: "tech",
  },
  {
    id: "TECH_STACK_INCLUDED",
    label: "Tech Stack Included",
    category: "tech",
  },
  {
    id: "OFFICE_SPACE",
    label: "Office Space Provided",
    category: "workspace",
  },
  {
    id: "REMOTE_FRIENDLY",
    label: "Remote-Friendly",
    category: "workspace",
  },
  {
    id: "TEAM_ENVIRONMENT",
    label: "Team Environment",
    category: "culture",
  },
  {
    id: "INDEPENDENT_WORK",
    label: "Independent Work Style",
    category: "culture",
  },
] as const;

export type WishListId = (typeof WISH_LIST_OPTIONS)[number]["id"];

export const WISH_LIST_CATEGORIES = {
  compensation: "Compensation",
  fees: "Fees",
  benefits: "Benefits",
  support: "Support & Resources",
  tech: "Technology",
  workspace: "Workspace",
  culture: "Culture",
} as const;
