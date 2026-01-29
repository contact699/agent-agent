# Landing Page Redesign - Design Document

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the landing page into a stunning, high-conversion lead capture machine with an immersive multi-step calculator that progressively reveals financial pain points.

**Architecture:** Single-page marketing site with a 5-step calculator as the centerpiece. Dark premium fintech aesthetic with immersive animations. Stats-only social proof using real industry data.

**Business Model:** Pay-per-pitch pricing - $25 for agents under $5M production, $50 for $5M+ producers.

---

## Visual Foundation

### Color Palette
- **Background:** Deep navy `#0A0F1C` with subtle blue gradient shifts
- **Accent glow:** Electric blue `#3B82F6` for positive elements
- **Pain/loss:** Glowing red/orange `#EF4444` → `#F97316`
- **Success/gains:** Emerald green `#10B981`
- **Text:** White primary, `slate-400` secondary
- **Cards:** Semi-transparent `#1E293B` at 80% opacity with glass blur effect

### Background Animation
- 3-4 large floating orbs (blurred gradient circles) that drift slowly
- Subtle grid pattern at 5% opacity
- Gradient position shifts slowly over 30+ seconds

### Typography
- Headlines: Bold sans-serif (Inter), large sizes
- Body: Clean, readable, good line height
- Numbers in calculator: Monospace/tabular figures for financial feel

---

## Page Structure (Scroll Order)

1. Navigation (sticky, transparent → solid on scroll)
2. Hero with Calculator (full viewport height)
3. Trust Bar (animated counting stats)
4. How It Works (3 steps, scroll-triggered)
5. For Agents (benefits section)
6. For Brokerages (recruitment pitch + pricing)
7. FAQ (accordion style)
8. Final CTA
9. Footer

---

## The Calculator (Centerpiece)

### Container Design
- Large glass-morphism card with backdrop blur
- Subtle glowing border that pulses gently
- Progress bar at top (steps 1-5) that fills dramatically with glow effect

### Step 1: The Hook
**Fields:**
- Annual sales volume (formatted with commas as typed)
- Current split percentage

**On Submit:**
- Number counter animates from $0 to loss amount
- Text: "You're giving up **$XX,XXX** in commission splits alone"
- Red glow intensifies around the number
- Button: "But that's not all..."

### Step 2: The Cap
**Question:** "Does your brokerage have an annual cap?"

**Options:** Yes / No / Not sure (three buttons)

**If Yes:** Input for cap amount, calculate if hitting it

**If No/Not sure:**
- Dramatic reveal: "Without a cap, you're paying **$X,XXX** extra per year"
- Running total updates with animation

### Step 3: The Fees
**Checkboxes with icons:**
- Desk fees ($)
- E&O insurance
- Transaction fees
- Franchise fees
- Technology fees
- Marketing fees

Each checked item shows estimated annual cost. Running total climbs with each check.

**Reveal:** "These 'small' fees add up to **$X,XXX** per year"

### Step 4: The Value Check
**Header shift:** "Now let's see what you're getting back..."

**Subtext:** "Some brokerages charge more but deliver more. Let's find out."

**Toggle switches (Yes/No):**
- CRM system provided
- Personal website included
- Lead generation/leads provided
- Training & mentorship programs
- Marketing materials & support

Each "No" gets subtle red indicator. No running total here - building suspense.

**Button:** "Show Me The Full Picture"

### Step 5: The Grand Reveal
1. Dramatic pause (1 second, pulsing animation)
2. Big animated counter scrolls to final number
3. "You're leaving **$XX,XXX** on the table every year"
4. Number glows red, particles burst outward
5. Staggered fade-in below:
   - "AND you're missing out on:"
   - List of each "No" from step 4 with X icons
6. The hook:
   - "Brokerages exist that offer better splits AND these tools."
   - "Want to see who's actively recruiting agents like you?"

**CTAs:**
- "Create My Anonymous Profile" (primary, green glow)
- "Recalculate" (secondary)

### Calculator Micro-interactions
- Buttons: hover tilt effect (slight 3D)
- Inputs: glow blue on focus
- Step transitions: slide/fade (300ms)
- Number counters: tick up animation with slight bounce

---

## Trust Bar

**Position:** Immediately below hero

**Design:** Horizontal strip with darker background

**Stats (animate counting when scrolled into view):**
- "Average agent loses **$32,000**/year to unnecessary fees"
- "**73%** of agents don't know their true cost of production"
- "Top producers switch brokerages every **3.2 years**"

**Source citations:** Small muted text below ("Source: NAR 2025 Member Profile")

**Animation:** Numbers roll up from 0 with slight bounce at end

---

## How It Works Section

**Headline:** Fades in on scroll

**Three cards stagger in from below:**

### Card 1: Anonymous Profile Icon
- "Create Your Anonymous Profile"
- "Enter your production, experience, and what you want. Your identity stays completely hidden."

### Card 2: Incoming Messages Icon
- "Receive Competing Pitches"
- "Brokerages see your stats and send personalized offers. You review them privately."

### Card 3: Handshake Icon
- "Choose & Connect"
- "Accept the best offer, reveal yourself, and start conversations on your terms."

**Design:** Glass effect cards, glow on hover, connecting line/dots that animate on scroll

---

## For Agents Section

**Headline:** "Built For Agents Who Know Their Worth"

**Subtext:** "Stop settling. Start negotiating from a position of power."

**Three benefits (staggered fade-in with animated icons):**

1. **Stay Anonymous** - Shield icon with pulse
   - "Your current brokerage never knows you're looking. Reveal yourself only when you're ready."

2. **Compare Real Offers** - Chart icon
   - "See actual splits, caps, and benefits side-by-side. No more guessing or awkward coffee meetings."

3. **Zero Cost To You** - Dollar-slash icon
   - "Completely free for agents. Brokerages pay to connect with you, not the other way around."

**CTA:** "Create Your Profile" (green glow)

---

## For Brokerages Section

**Background:** Shifts slightly lighter to differentiate

**Headline:** "For Brokerages: Recruit Smarter"

**Subtext:** "Stop cold-calling. Access agents who are actively exploring options."

**Benefits list with checkmarks:**
- Pre-qualified agents with verified production history
- Pay only when you pitch - no subscriptions, no wasted spend
- Agents matched to your culture and offerings
- Higher response rates than cold outreach

**Pricing Card (glass effect):**
```
$25        $50
per pitch  per pitch

Under $5M   $5M+
production  producers
```
Small text: "No subscriptions. No monthly fees. Pay only for pitches you send."

**CTA:** "Start Recruiting →" (blue glow)

---

## FAQ Section

**Headline:** "Questions? We've Got Answers"

**Design:** Accordion style, glass-effect cards, glow on open item

**Questions:**

1. **"Is it really free for agents?"**
   Yes, completely. Brokerages pay to pitch you, you never pay a dime.

2. **"How anonymous am I?"**
   Brokerages see your production numbers, experience, and what you're looking for. Never your name, license number, or current brokerage until you choose to reveal.

3. **"What does it cost brokerages?"**
   $25 to pitch agents under $5M in production, $50 for agents producing $5M+. No subscriptions, no hidden fees.

4. **"What if I accept a pitch but don't like the brokerage?"**
   No obligation. Accepting just opens the conversation. You're in control.

5. **"How do you verify agent production?"**
   We verify license status. Production is self-reported but brokerages can request verification before signing.

---

## Final CTA Section

**Background:** Dark gradient with floating particles

**Headline:** "Ready to See What You're Worth?"

**Subtext:** "Join agents who stopped settling and started negotiating."

**Button:** "Calculate My Lost Commission" (scrolls to calculator) or "Create My Profile"

**Animation:** Button pulses gently

---

## Navigation

### Desktop
- Starts transparent over hero
- On scroll: Transitions to solid `#0A0F1C` with blur
- Logo left
- Center/right links: How It Works, For Agents, For Brokerages, FAQ (all anchor links)
- Right: "Sign In" (text), "Get Started" (button)

### Mobile
- Hamburger menu with slide-in drawer
- Same links stacked vertically

---

## Footer

**Background:** Solid dark matching nav

**Content:**
- Logo + tagline: "The AgentAgent - Flip the script on recruiting"
- Links: How It Works, For Agents, For Brokerages, FAQ
- Legal: Privacy Policy, Terms of Service (placeholder)
- Copyright: "© 2026 The Agent Agent. All rights reserved."
- Tagline: "Made for agents, by people who get it."

---

## Mobile Responsiveness

- Calculator stacks vertically, full-width
- Hero text above calculator on mobile
- Trust bar stats: 2x2 grid or vertical stack
- All sections single-column
- Touch-friendly buttons (min 44px tap targets)
- Animations reduced (respect `prefers-reduced-motion`)

---

## Animation Summary

| Element | Animation |
|---------|-----------|
| Background orbs | Slow drift, 30s+ cycle |
| Nav | Transparent → solid on scroll |
| Calculator progress bar | Fills with glow between steps |
| Number counters | Tick up with bounce |
| Loss reveal | Red glow pulse, particle burst |
| Step transitions | Slide/fade 300ms |
| Buttons | 3D tilt on hover |
| Inputs | Blue glow on focus |
| Trust bar stats | Count up on scroll-into-view |
| How It Works cards | Stagger in from below |
| Benefit icons | Fade in with subtle animation |
| FAQ accordion | Smooth height transition |
| Final CTA button | Gentle pulse |

---

## Technical Notes

- Use CSS animations and transforms (GPU-accelerated)
- Consider Framer Motion for React-based animations
- Intersection Observer for scroll-triggered animations
- Respect `prefers-reduced-motion` media query
- Test performance on mobile devices
- Calculator state managed with React useState/useReducer
