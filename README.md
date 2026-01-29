# The Agent Agent - Reverse Real Estate Recruitment Platform

A platform that flips the script on real estate recruitment. Agents create anonymous profiles, set their requirements, and brokerages compete for their talent with personalized offers.

## 🚀 Features

### For Agents (B2C)
- **Brokerage Fee Calculator** - See how much you're leaving on the table with your current split
- **Anonymous Profiles** - Share your production without revealing your identity
- **Wish List** - Define your must-haves (splits, benefits, tech stack, etc.)
- **Pitch Inbox** - Receive and review personalized offers from brokerages
- **Reveal Control** - You decide when to share your contact information

### For Brokerages (B2B)
- **Agent Discovery Feed** - Browse qualified, production-verified agents
- **Match Scoring** - See which agents match your offerings
- **Pitch System** - Send personalized messages with your standard offer
- **Pay-per-Connect** - Only pay $500 when an agent accepts your pitch

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Payments**: Stripe Checkout

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted via Supabase/Neon)
- Stripe account (for payment processing)

## 🏁 Getting Started

### 1. Clone and Install

```bash
cd agent-agent
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agent_agent"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Stripe Webhook (Local Development)

For local webhook testing, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── agent/          # Agent profile API
│   │   ├── brokerage/      # Brokerage profile API
│   │   ├── pitches/        # Pitch system API
│   │   └── stripe/         # Payment endpoints
│   ├── auth/               # Auth pages (signin, register)
│   ├── dashboard/
│   │   ├── agent/          # Agent dashboard
│   │   └── brokerage/      # Brokerage dashboard
│   ├── onboarding/
│   │   ├── agent/          # Agent profile creation
│   │   └── brokerage/      # Brokerage profile creation
│   └── page.tsx            # Landing page
├── components/
│   ├── calculator.tsx      # Brokerage fee calculator
│   ├── pitch-inbox.tsx     # Agent pitch inbox
│   ├── agent-discovery-feed.tsx
│   └── ...
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── stripe.ts           # Stripe configuration
│   └── constants.ts        # Wish list options
└── types/
    └── next-auth.d.ts      # Type extensions
```

## 🔐 User Flows

### Agent Flow
1. Land on homepage → Use calculator
2. Register as Agent
3. Complete profile (license, volume, wish list)
4. View dashboard with pitch inbox
5. Review pitches → Accept/Decline
6. On accept → Brokerage pays → Identity revealed

### Brokerage Flow
1. Register as Brokerage
2. Complete profile (company info, standard offer)
3. View dashboard with agent discovery feed
4. Send pitches to matching agents
5. Wait for acceptance → Pay $500 → Get contact info

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Database

Use a managed PostgreSQL service:
- [Supabase](https://supabase.com) (free tier available)
- [Neon](https://neon.tech) (serverless PostgreSQL)
- [Railway](https://railway.app)

## 📝 License

MIT
