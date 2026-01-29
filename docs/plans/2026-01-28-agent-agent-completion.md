# Agent Agent - Complete Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the Agent Agent reverse real estate recruitment platform MVP with payment processing, profile editing, email notifications, and comprehensive testing.

**Architecture:** Next.js 16 App Router with server/client component separation, Prisma ORM for PostgreSQL, NextAuth for authentication, and Stripe for payments. The app uses role-based access (AGENT/BROKERAGE) with anonymous agent profiles revealed only after payment.

**Tech Stack:** Next.js 16.1.3, React 19, Tailwind CSS 4, Prisma 7.2, NextAuth 4.24, Stripe 20.2, PostgreSQL

---

## Phase 1: Payment Flow Completion

### Task 1: Stripe Webhook Handler

**Files:**
- Modify: `src/app/api/stripe/webhook/route.ts`
- Modify: `src/lib/stripe.ts`

**Step 1: Read existing webhook route**

Run: `cat src/app/api/stripe/webhook/route.ts`
Understand the current implementation.

**Step 2: Write the webhook handler implementation**

```typescript
// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const pitchId = session.metadata?.pitchId;

      if (!pitchId) {
        console.error("No pitchId in session metadata");
        break;
      }

      await prisma.pitch.update({
        where: { id: pitchId },
        data: {
          paymentStatus: "PAID",
          stripePaymentId: session.id,
          paidAt: new Date(),
        },
      });

      console.log(`Payment completed for pitch ${pitchId}`);
      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const pitchId = session.metadata?.pitchId;

      if (pitchId) {
        await prisma.pitch.update({
          where: { id: pitchId },
          data: {
            paymentStatus: "FAILED",
          },
        });
        console.log(`Payment failed for pitch ${pitchId}`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

**Step 3: Run the development server and test**

Run: `npm run dev`
Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Step 4: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts
git commit -m "feat: complete Stripe webhook handler for payment processing"
```

---

### Task 2: Stripe Checkout Session Creation

**Files:**
- Create: `src/app/api/stripe/checkout/route.ts`

**Step 1: Write the checkout endpoint**

```typescript
// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, CONTACT_FEE_CENTS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "BROKERAGE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pitchId } = await req.json();

  if (!pitchId) {
    return NextResponse.json(
      { error: "pitchId is required" },
      { status: 400 }
    );
  }

  const pitch = await prisma.pitch.findUnique({
    where: { id: pitchId },
    include: {
      brokerage: true,
      agent: true,
    },
  });

  if (!pitch) {
    return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
  }

  if (pitch.brokerage.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (pitch.status !== "ACCEPTED") {
    return NextResponse.json(
      { error: "Pitch must be accepted before payment" },
      { status: 400 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Contact Fee - ${pitch.agent.anonymousId}`,
            description: "One-time fee to reveal agent contact information",
          },
          unit_amount: CONTACT_FEE_CENTS,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/brokerage?payment=success&pitchId=${pitchId}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/brokerage?payment=cancelled&pitchId=${pitchId}`,
    metadata: {
      pitchId,
      brokerageId: pitch.brokerageId,
      agentId: pitch.agentId,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

**Step 2: Verify the endpoint works**

Run: `npm run dev`
Test by making a POST request with valid session.

**Step 3: Commit**

```bash
git add src/app/api/stripe/checkout/route.ts
git commit -m "feat: add Stripe checkout session creation endpoint"
```

---

### Task 3: Update Pitch Accept to Trigger Checkout

**Files:**
- Modify: `src/app/api/pitches/[id]/accept/route.ts`

**Step 1: Read the current accept route**

Run: `cat src/app/api/pitches/[id]/accept/route.ts`

**Step 2: Update to return checkout URL for brokerage**

The accept endpoint should:
1. Update pitch status to ACCEPTED
2. Return the pitch data (brokerage dashboard will redirect to payment)

**Step 3: Commit**

```bash
git add src/app/api/pitches/[id]/accept/route.ts
git commit -m "feat: update pitch accept flow for payment integration"
```

---

## Phase 2: Profile Edit Pages

### Task 4: Agent Profile Edit Page

**Files:**
- Create: `src/app/dashboard/agent/profile/page.tsx`

**Step 1: Create the agent profile edit page**

```tsx
// src/app/dashboard/agent/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AgentProfileForm from "@/components/agent-profile-form";

export default async function AgentProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "AGENT") {
    redirect("/auth/signin");
  }

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
  });

  if (!agent) {
    redirect("/onboarding/agent");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        <AgentProfileForm agent={agent} />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/dashboard/agent/profile/page.tsx
git commit -m "feat: add agent profile edit page"
```

---

### Task 5: Agent Profile Form Component

**Files:**
- Create: `src/components/agent-profile-form.tsx`

**Step 1: Create the form component**

```tsx
// src/components/agent-profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WISH_LIST_OPTIONS } from "@/lib/constants";

interface Agent {
  id: string;
  name: string | null;
  licenseNumber: string;
  yearsExperience: number;
  salesVolume: number;
  currentBroker: string | null;
  wishList: string[];
  isAnonymous: boolean;
}

export default function AgentProfileForm({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: agent.name || "",
    licenseNumber: agent.licenseNumber,
    yearsExperience: agent.yearsExperience,
    salesVolume: agent.salesVolume,
    currentBroker: agent.currentBroker || "",
    wishList: agent.wishList,
    isAnonymous: agent.isAnonymous,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agent/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      router.push("/dashboard/agent");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleWishListItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      wishList: prev.wishList.includes(itemId)
        ? prev.wishList.filter((id) => id !== itemId)
        : [...prev.wishList, itemId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          License Number
        </label>
        <input
          type="text"
          value={formData.licenseNumber}
          onChange={(e) =>
            setFormData({ ...formData, licenseNumber: e.target.value })
          }
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.yearsExperience}
            onChange={(e) =>
              setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })
            }
            min="0"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sales Volume ($)
          </label>
          <input
            type="number"
            value={formData.salesVolume}
            onChange={(e) =>
              setFormData({ ...formData, salesVolume: parseInt(e.target.value) || 0 })
            }
            min="0"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Broker (Optional)
        </label>
        <input
          type="text"
          value={formData.currentBroker}
          onChange={(e) =>
            setFormData({ ...formData, currentBroker: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Wish List
        </label>
        <div className="space-y-4">
          {Object.entries(WISH_LIST_OPTIONS).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-600 mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleWishListItem(item.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.wishList.includes(item.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAnonymous"
          checked={formData.isAnonymous}
          onChange={(e) =>
            setFormData({ ...formData, isAnonymous: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
          Keep my profile anonymous to brokerages
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/agent")}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/agent-profile-form.tsx
git commit -m "feat: add agent profile form component"
```

---

### Task 6: Brokerage Profile Edit Page

**Files:**
- Create: `src/app/dashboard/brokerage/profile/page.tsx`

**Step 1: Create the brokerage profile edit page**

```tsx
// src/app/dashboard/brokerage/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BrokerageProfileForm from "@/components/brokerage-profile-form";

export default async function BrokerageProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "BROKERAGE") {
    redirect("/auth/signin");
  }

  const brokerage = await prisma.brokerage.findUnique({
    where: { userId: session.user.id },
  });

  if (!brokerage) {
    redirect("/onboarding/brokerage");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Brokerage Profile</h1>
        <BrokerageProfileForm brokerage={brokerage} />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/dashboard/brokerage/profile/page.tsx
git commit -m "feat: add brokerage profile edit page"
```

---

### Task 7: Brokerage Profile Form Component

**Files:**
- Create: `src/components/brokerage-profile-form.tsx`

**Step 1: Create the form component**

```tsx
// src/components/brokerage-profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StandardOffer {
  splitPercent: number;
  capAmount: number;
  monthlyFee: number;
  additionalBenefits: string[];
}

interface Brokerage {
  id: string;
  companyName: string;
  location: string;
  logoUrl: string | null;
  description: string | null;
  standardOffer: StandardOffer;
}

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

export default function BrokerageProfileForm({
  brokerage,
}: {
  brokerage: Brokerage;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: brokerage.companyName,
    location: brokerage.location,
    logoUrl: brokerage.logoUrl || "",
    description: brokerage.description || "",
    standardOffer: brokerage.standardOffer,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/brokerage/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      router.push("/dashboard/brokerage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleBenefit = (benefitId: string) => {
    setFormData((prev) => ({
      ...prev,
      standardOffer: {
        ...prev.standardOffer,
        additionalBenefits: prev.standardOffer.additionalBenefits.includes(benefitId)
          ? prev.standardOffer.additionalBenefits.filter((id) => id !== benefitId)
          : [...prev.standardOffer.additionalBenefits, benefitId],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
          placeholder="e.g., Los Angeles, CA"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Logo URL (Optional)
        </label>
        <input
          type="url"
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          placeholder="Tell agents about your brokerage..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold">Standard Offer</h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Commission Split (%)
          </label>
          <input
            type="number"
            value={formData.standardOffer.splitPercent}
            onChange={(e) =>
              setFormData({
                ...formData,
                standardOffer: {
                  ...formData.standardOffer,
                  splitPercent: parseInt(e.target.value) || 0,
                },
              })
            }
            min="0"
            max="100"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cap Amount ($)
          </label>
          <input
            type="number"
            value={formData.standardOffer.capAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                standardOffer: {
                  ...formData.standardOffer,
                  capAmount: parseInt(e.target.value) || 0,
                },
              })
            }
            min="0"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly Fee ($)
          </label>
          <input
            type="number"
            value={formData.standardOffer.monthlyFee}
            onChange={(e) =>
              setFormData({
                ...formData,
                standardOffer: {
                  ...formData.standardOffer,
                  monthlyFee: parseInt(e.target.value) || 0,
                },
              })
            }
            min="0"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Benefits
        </label>
        <div className="flex flex-wrap gap-2">
          {BENEFIT_OPTIONS.map((benefit) => (
            <button
              key={benefit.id}
              type="button"
              onClick={() => toggleBenefit(benefit.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.standardOffer.additionalBenefits.includes(benefit.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {benefit.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/brokerage")}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/brokerage-profile-form.tsx
git commit -m "feat: add brokerage profile form component"
```

---

## Phase 3: Agent Reveal Flow

### Task 8: Update Pitch Inbox to Show Contact Info After Payment

**Files:**
- Modify: `src/components/pitch-inbox.tsx`

**Step 1: Read the current pitch inbox component**

Run: `cat src/components/pitch-inbox.tsx`

**Step 2: Update to show agent contact info when paymentStatus is PAID**

The component should:
1. Show "Payment Required" badge for ACCEPTED pitches with PENDING payment
2. Show agent name, license, and contact info for PAID pitches
3. Keep anonymous display for PENDING/DECLINED pitches

**Step 3: Commit**

```bash
git add src/components/pitch-inbox.tsx
git commit -m "feat: update pitch inbox to reveal agent info after payment"
```

---

### Task 9: Update Agent Discovery Feed for Payment Flow

**Files:**
- Modify: `src/components/agent-discovery-feed.tsx`

**Step 1: Read the current agent discovery feed**

Run: `cat src/components/agent-discovery-feed.tsx`

**Step 2: Update to handle payment flow**

Add:
1. "Pay Now" button for accepted pitches with pending payment
2. Contact info display for paid connections
3. Payment status indicators

**Step 3: Commit**

```bash
git add src/components/agent-discovery-feed.tsx
git commit -m "feat: add payment flow to agent discovery feed"
```

---

### Task 10: Add Connected Agents Section to Brokerage Dashboard

**Files:**
- Modify: `src/app/dashboard/brokerage/page.tsx`
- Create: `src/components/connected-agents.tsx`

**Step 1: Create connected agents component**

```tsx
// src/components/connected-agents.tsx
"use client";

interface ConnectedAgent {
  id: string;
  name: string;
  licenseNumber: string;
  yearsExperience: number;
  salesVolume: number;
  connectedAt: string;
}

interface Props {
  agents: ConnectedAgent[];
}

export default function ConnectedAgents({ agents }: Props) {
  if (agents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Connected Agents</h2>
        <p className="text-gray-500 text-center py-8">
          No connected agents yet. When an agent accepts your pitch and you complete payment, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Connected Agents ({agents.length})
      </h2>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="border rounded-lg p-4 hover:border-blue-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{agent.name}</h3>
                <p className="text-sm text-gray-600">
                  License: {agent.licenseNumber}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Connected
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Experience:</span>{" "}
                <span className="font-medium">{agent.yearsExperience} years</span>
              </div>
              <div>
                <span className="text-gray-500">Sales Volume:</span>{" "}
                <span className="font-medium">
                  ${agent.salesVolume.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Connected on {new Date(agent.connectedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Update brokerage dashboard to include connected agents**

**Step 3: Commit**

```bash
git add src/components/connected-agents.tsx src/app/dashboard/brokerage/page.tsx
git commit -m "feat: add connected agents section to brokerage dashboard"
```

---

## Phase 4: Email Notifications

### Task 11: Set Up Email Utility

**Files:**
- Create: `src/lib/email.ts`

**Step 1: Create email utility with Resend**

```typescript
// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@theagentagent.com";

export async function sendPitchReceivedEmail(
  agentEmail: string,
  brokerageName: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Skipping email - RESEND_API_KEY not configured");
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: agentEmail,
    subject: `New pitch from ${brokerageName}`,
    html: `
      <h1>You've received a new pitch!</h1>
      <p>${brokerageName} is interested in recruiting you.</p>
      <p>Log in to your dashboard to view the offer details and respond.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/agent">View Pitch</a>
    `,
  });
}

export async function sendPitchAcceptedEmail(
  brokerageEmail: string,
  agentAnonymousId: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Skipping email - RESEND_API_KEY not configured");
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: brokerageEmail,
    subject: `${agentAnonymousId} accepted your pitch!`,
    html: `
      <h1>Great news!</h1>
      <p>${agentAnonymousId} has accepted your pitch.</p>
      <p>Complete the $500 contact fee to reveal their information and connect.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/brokerage">Complete Payment</a>
    `,
  });
}

export async function sendPaymentCompleteEmail(
  agentEmail: string,
  brokerageName: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Skipping email - RESEND_API_KEY not configured");
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: agentEmail,
    subject: `${brokerageName} has connected with you`,
    html: `
      <h1>You're connected!</h1>
      <p>${brokerageName} has completed payment and can now view your contact information.</p>
      <p>They may reach out to you directly to discuss the opportunity.</p>
    `,
  });
}

export async function sendPitchDeclinedEmail(
  brokerageEmail: string,
  agentAnonymousId: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Skipping email - RESEND_API_KEY not configured");
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: brokerageEmail,
    subject: `${agentAnonymousId} declined your pitch`,
    html: `
      <h1>Pitch Update</h1>
      <p>${agentAnonymousId} has declined your pitch.</p>
      <p>Continue browsing other agents who may be a better fit for your brokerage.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/brokerage">Browse Agents</a>
    `,
  });
}
```

**Step 2: Add Resend to package.json**

Run: `npm install resend`

**Step 3: Commit**

```bash
git add src/lib/email.ts package.json package-lock.json
git commit -m "feat: add email notification utility with Resend"
```

---

### Task 12: Integrate Email Notifications into API Routes

**Files:**
- Modify: `src/app/api/pitches/route.ts`
- Modify: `src/app/api/pitches/[id]/accept/route.ts`
- Modify: `src/app/api/pitches/[id]/decline/route.ts`
- Modify: `src/app/api/stripe/webhook/route.ts`

**Step 1: Add email to pitch creation**

Import and call `sendPitchReceivedEmail` when a new pitch is created.

**Step 2: Add email to pitch acceptance**

Import and call `sendPitchAcceptedEmail` when a pitch is accepted.

**Step 3: Add email to pitch decline**

Import and call `sendPitchDeclinedEmail` when a pitch is declined.

**Step 4: Add email to payment completion**

Import and call `sendPaymentCompleteEmail` in the webhook handler when payment succeeds.

**Step 5: Commit**

```bash
git add src/app/api/pitches/route.ts src/app/api/pitches/[id]/accept/route.ts src/app/api/pitches/[id]/decline/route.ts src/app/api/stripe/webhook/route.ts
git commit -m "feat: integrate email notifications into API routes"
```

---

## Phase 5: Testing

### Task 13: Set Up Testing Infrastructure

**Files:**
- Create: `jest.config.js`
- Create: `jest.setup.ts`
- Modify: `package.json`

**Step 1: Install testing dependencies**

Run: `npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`

**Step 2: Create Jest configuration**

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = createJestConfig(customJestConfig);
```

**Step 3: Create Jest setup file**

```typescript
// jest.setup.ts
import "@testing-library/jest-dom";
```

**Step 4: Add test scripts to package.json**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Step 5: Commit**

```bash
git add jest.config.js jest.setup.ts package.json package-lock.json
git commit -m "chore: set up Jest testing infrastructure"
```

---

### Task 14: Write Auth API Tests

**Files:**
- Create: `src/__tests__/api/auth/register.test.ts`

**Step 1: Create register endpoint test**

```typescript
// src/__tests__/api/auth/register.test.ts
import { POST } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email is missing", async () => {
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ password: "password123", role: "AGENT" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("should return 400 if password is too short", async () => {
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "short",
        role: "AGENT",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("password");
  });

  it("should return 400 if user already exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "existing-user",
      email: "test@example.com",
    });

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        role: "AGENT",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("exists");
  });

  it("should create user successfully with valid data", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "new-user-id",
      email: "test@example.com",
      role: "AGENT",
    });

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        role: "AGENT",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe("test@example.com");
  });
});
```

**Step 2: Run the test**

Run: `npm test src/__tests__/api/auth/register.test.ts`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/__tests__/api/auth/register.test.ts
git commit -m "test: add registration API endpoint tests"
```

---

### Task 15: Write Pitch API Tests

**Files:**
- Create: `src/__tests__/api/pitches/pitches.test.ts`

**Step 1: Create pitch endpoint tests**

```typescript
// src/__tests__/api/pitches/pitches.test.ts
import { GET, POST } from "@/app/api/pitches/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    pitch: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    brokerage: {
      findUnique: jest.fn(),
    },
    agent: {
      findUnique: jest.fn(),
    },
  },
}));

describe("GET /api/pitches", () => {
  it("should return 401 if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/pitches");
    const response = await GET(req);

    expect(response.status).toBe(401);
  });

  it("should return pitches for authenticated agent", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "AGENT" },
    });

    (prisma.agent.findUnique as jest.Mock).mockResolvedValue({
      id: "agent-1",
      userId: "user-1",
    });

    (prisma.pitch.findMany as jest.Mock).mockResolvedValue([
      {
        id: "pitch-1",
        agentId: "agent-1",
        status: "PENDING",
        brokerage: { companyName: "Test Brokerage" },
      },
    ]);

    const req = new NextRequest("http://localhost/api/pitches");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pitches).toHaveLength(1);
  });
});

describe("POST /api/pitches", () => {
  it("should return 401 if not a brokerage", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "AGENT" },
    });

    const req = new NextRequest("http://localhost/api/pitches", {
      method: "POST",
      body: JSON.stringify({ agentId: "agent-1", message: "Join us!" }),
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("should create pitch successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    (prisma.brokerage.findUnique as jest.Mock).mockResolvedValue({
      id: "brokerage-1",
      userId: "user-1",
      standardOffer: { splitPercent: 90, capAmount: 25000, monthlyFee: 0 },
    });

    (prisma.pitch.findFirst as jest.Mock).mockResolvedValue(null);

    (prisma.pitch.create as jest.Mock).mockResolvedValue({
      id: "new-pitch",
      agentId: "agent-1",
      brokerageId: "brokerage-1",
      status: "PENDING",
    });

    const req = new NextRequest("http://localhost/api/pitches", {
      method: "POST",
      body: JSON.stringify({ agentId: "agent-1", message: "Join us!" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.pitch).toBeDefined();
  });
});
```

**Step 2: Run the tests**

Run: `npm test src/__tests__/api/pitches/pitches.test.ts`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/__tests__/api/pitches/pitches.test.ts
git commit -m "test: add pitch API endpoint tests"
```

---

### Task 16: Write Component Tests

**Files:**
- Create: `src/__tests__/components/calculator.test.tsx`

**Step 1: Create calculator component test**

```tsx
// src/__tests__/components/calculator.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import BrokerageFeeCalculator from "@/components/calculator";

describe("BrokerageFeeCalculator", () => {
  it("renders the calculator", () => {
    render(<BrokerageFeeCalculator />);

    expect(screen.getByText(/calculator/i)).toBeInTheDocument();
  });

  it("calculates fees correctly", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText(/volume/i);
    fireEvent.change(volumeInput, { target: { value: "1000000" } });

    // Check that calculation result is displayed
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });
});
```

**Step 2: Run the test**

Run: `npm test src/__tests__/components/calculator.test.tsx`
Expected: Tests pass

**Step 3: Commit**

```bash
git add src/__tests__/components/calculator.test.tsx
git commit -m "test: add calculator component tests"
```

---

## Phase 6: Search and Filtering

### Task 17: Add Agent Search/Filter to Discovery Feed

**Files:**
- Modify: `src/components/agent-discovery-feed.tsx`
- Modify: `src/app/api/agents/route.ts` (create if not exists)

**Step 1: Create agents browse API endpoint**

```typescript
// src/app/api/agents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "BROKERAGE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const minExperience = parseInt(searchParams.get("minExperience") || "0");
  const minVolume = parseInt(searchParams.get("minVolume") || "0");
  const wishListFilter = searchParams.get("wishList")?.split(",") || [];

  const agents = await prisma.agent.findMany({
    where: {
      yearsExperience: { gte: minExperience },
      salesVolume: { gte: minVolume },
      ...(wishListFilter.length > 0 && {
        wishList: { hasSome: wishListFilter },
      }),
    },
    select: {
      id: true,
      anonymousId: true,
      yearsExperience: true,
      salesVolume: true,
      wishList: true,
      isAnonymous: true,
    },
    orderBy: { salesVolume: "desc" },
  });

  return NextResponse.json({ agents });
}
```

**Step 2: Add filter UI to agent discovery feed**

Add dropdowns/inputs for:
- Minimum experience
- Minimum sales volume
- Wish list item filters

**Step 3: Commit**

```bash
git add src/app/api/agents/route.ts src/components/agent-discovery-feed.tsx
git commit -m "feat: add agent search and filtering functionality"
```

---

## Phase 7: Polish and Deployment

### Task 18: Add Loading States and Error Handling

**Files:**
- Modify: `src/components/agent-discovery-feed.tsx`
- Modify: `src/components/pitch-inbox.tsx`
- Create: `src/components/loading-spinner.tsx`

**Step 1: Create loading spinner component**

```tsx
// src/components/loading-spinner.tsx
export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}
```

**Step 2: Add loading states to components**

**Step 3: Commit**

```bash
git add src/components/loading-spinner.tsx src/components/agent-discovery-feed.tsx src/components/pitch-inbox.tsx
git commit -m "feat: add loading states and error handling to components"
```

---

### Task 19: Add Environment Variable Validation

**Files:**
- Create: `src/lib/env.ts`
- Modify: `src/app/layout.tsx`

**Step 1: Create environment validation**

```typescript
// src/lib/env.ts
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

const optionalEnvVars = [
  "RESEND_API_KEY",
  "FROM_EMAIL",
  "STRIPE_CONTACT_FEE_CENTS",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export function getEnv<T extends string>(key: T): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
```

**Step 2: Commit**

```bash
git add src/lib/env.ts
git commit -m "feat: add environment variable validation"
```

---

### Task 20: Create Environment Example File

**Files:**
- Create: `.env.example`

**Step 1: Create example env file**

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agent_agent"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CONTACT_FEE_CENTS="50000"

# Email (Optional - Resend)
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@theagentagent.com"
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add environment variable example file"
```

---

### Task 21: Final Build Verification

**Files:**
- None (verification only)

**Step 1: Run linting**

Run: `npm run lint`
Expected: No errors

**Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 4: Run build**

Run: `npm run build`
Expected: Build completes successfully

**Step 5: Commit any fixes**

```bash
git add .
git commit -m "fix: address build and lint issues"
```

---

## Summary

This plan covers:

1. **Payment Flow (Tasks 1-3)**: Complete Stripe webhook handling and checkout session creation
2. **Profile Editing (Tasks 4-7)**: Agent and brokerage profile edit pages with forms
3. **Agent Reveal (Tasks 8-10)**: Show agent info after payment, connected agents section
4. **Email Notifications (Tasks 11-12)**: Resend integration for pitch lifecycle emails
5. **Testing (Tasks 13-16)**: Jest setup and API/component tests
6. **Search/Filtering (Task 17)**: Agent discovery with filters
7. **Polish (Tasks 18-21)**: Loading states, env validation, build verification

Each task follows TDD principles with:
- Small, focused changes
- Frequent commits
- Clear file paths
- Exact code examples
