import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { Button } from "../_components/Button";
import { StatBlock } from "../_components/StatBlock";
import { KenteDivider } from "../_components/KenteDivider";

export const metadata: Metadata = {
  title: "For pharmacies",
  description: "POS, inventory, insurance reimbursement — NHIS and private plans — and visibility when doctors prescribe. The Vedge pharmacy product.",
};

// Core capabilities of the pharmacy product — grouped by surface.
const surfaces = [
  {
    code: "POS",
    name: "Point of sale",
    body: "Barcode scan, cedi-native receipts, split payments, and offline fallback if the Ridge Road power goes out mid-sale.",
  },
  {
    code: "INV",
    name: "Inventory depth",
    body: "Live stock levels per SKU, per branch, per lot. Low-stock alerts fire before you run out, not the day a patient walks in.",
  },
  {
    code: "EXP",
    name: "Expiry tracking",
    body: "Every pack is tagged with its expiry date at intake. Vedge surfaces anything within 60 days of expiring — so you return or clear it before it\u2019s worthless.",
  },
  {
    code: "RX",
    name: "Prescription fill",
    body: "When a Vedge hospital prescribes, the prescription lands in your queue before the patient reaches the door. Scan, dispense, counsel, close.",
  },
  {
    code: "INS",
    name: "Insurance reimbursement",
    body: "NHIS, private insurers, corporate plans, and community schemes. Claim capture the moment you dispense, not at the end of the month. Submissions and reconciliation are part of the workflow, not a chore.",
  },
  {
    code: "CTR",
    name: "Controlled-drug ledger",
    body: "Schedule II and III medications are tracked with a full audit trail. When the PSG inspector arrives, you have the ledger open in seconds.",
  },
  {
    code: "SUP",
    name: "Supplier orders",
    body: "Generate purchase orders from reorder points. Send to suppliers in one tap. Track receipt against the PO.",
  },
  {
    code: "VIS",
    name: "Visibility to doctors",
    body: "Paid tiers put your pharmacy in the prescribing doctor\u2019s route when a patient is searching. Opt out any time.",
  },
];

// The "visibility flywheel" — why being on Vedge matters for discovery.
const flywheel = [
  { num: "01", title: "A patient is prescribed a medication", body: "Inside a Vedge hospital or clinic, during a visit. The prescription is digital from the moment it\u2019s written." },
  { num: "02", title: "Vedge finds nearby pharmacies", body: "The patient app locates every pharmacy within a radius that carries the prescribed drug right now, ranked by distance, price, and stock." },
  { num: "03", title: "Your pharmacy gets the ping", body: "If you\u2019re on a paid tier and you have the stock, you appear. The patient taps, the order lands in your queue, they walk over." },
  { num: "04", title: "They pick up, you dispense", body: "Scan, counsel, close. If the patient is insured — NHIS or otherwise — the claim files itself in the right format for the right provider. Revenue and reimbursement logged in one motion." },
];

// Four-tier comparison — mirrors the backend V27 pharmacy catalog exactly:
// PHARMACY_BASIC (free) → PHARMACY_STARTER (Recommended) → PHARMACY_PLUS → PHARMACY_CHAIN.
// The GTM plays out on the tier badges: Basic is free to seed network density,
// Recommended is the first paid tier that unlocks visibility in the prescribing
// doctor's patient-app queue, and Plus adds inventory analytics + insurance.
const tierHighlights = [
  {
    tier: "Basic",
    price: "Free",
    trial: "No trial needed",
    color: "forest",
    badge: "Free",
    items: [
      "1 counter",
      "POS & basic inventory",
      "Prescription fill",
      "Listed in the patient app",
      "Community support",
    ],
  },
  {
    tier: "Recommended Starter",
    price: "₵149/mo",
    trial: "14-day trial",
    color: "clay",
    badge: "Most common",
    items: [
      "Up to 2 counters",
      "Everything in Basic",
      "Appears when Vedge doctors prescribe nearby",
      "Demand forecasting",
      "Supplier orders",
    ],
  },
  {
    tier: "Recommended Plus",
    price: "₵349/mo",
    trial: "14-day trial",
    color: "ink",
    items: [
      "Up to 5 counters",
      "Everything in Starter",
      "Expiry tracking",
      "Controlled-drug ledger",
      "Insurance reimbursement (NHIS + private)",
      "Multi-supplier reconciliation",
    ],
  },
  {
    tier: "Chain",
    price: "₵699/mo",
    trial: "14-day trial",
    color: "ink",
    items: [
      "Unlimited counters",
      "Everything in Plus",
      "Central warehouse",
      "Inter-branch transfers",
      "Multi-site reporting",
      "Priority support",
    ],
  },
];

export default function PharmaciesPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-ink/15">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Vol. 04 · Pharmacies</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                The counter that knows what the <span className="italic-display">doctor just prescribed</span> — before the patient <span className="italic-display">walks in.</span>
              </h1>
              <div className="mt-12 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <p className="reveal reveal-delay-1 max-w-xl font-display text-lg leading-relaxed text-ink/80">
                    Vedge Pharmacy is a point-of-sale, an inventory system, an insurance claims desk (NHIS, private, corporate — every provider), and a discovery surface. On one screen, in one workflow, for every pharmacy that fills a prescription.
                  </p>
                  <div className="reveal reveal-delay-2 mt-10 flex flex-wrap gap-4">
                    <Button href="/contact">Book a counter demo</Button>
                    <Button href="/pricing#pharmacy" variant="ghost">See pharmacy pricing</Button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
                  <div className="reveal reveal-delay-2 grid grid-cols-2 gap-y-8">
                    <StatBlock value="8" label="Core surfaces" />
                    <StatBlock value="14d" label="Free trial" />
                    <StatBlock value="4" label="Pricing tiers" />
                    <StatBlock value="Free" label="Starts at" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ SURFACES ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>Eight surfaces</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                What lives on <br /><span className="italic-display">the counter.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                A pharmacy in any African city runs nine things at once. We put them on one screen so you can actually see all of them.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ul className="grid grid-cols-1 border-t border-ink/20 sm:grid-cols-2">
                {surfaces.map((s, i) => (
                  <li
                    key={s.code}
                    className={`reveal border-b border-ink/15 p-7 ${i % 2 === 0 ? "sm:border-r sm:border-ink/15" : ""}`}
                    style={{ transitionDelay: `${0.06 * i}s` }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">{s.code}</div>
                    <h3 className="mt-3 font-display text-2xl">{s.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ VISIBILITY FLYWHEEL ═══════════════ */}
      <section className="bg-bone-deep py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>The flywheel</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Pharmacies get discovered. <br /><span className="italic-display">Not listed.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Every paid Vedge pharmacy is plugged into a live loop: a doctor writes a prescription, a patient searches for it, you appear, they come. No flyers, no SEO, no ads.
              </p>
            </div>

            <div className="col-span-12 md:col-span-8">
              <ol className="border-t border-ink/25">
                {flywheel.map((step, i) => (
                  <li
                    key={step.num}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-b border-ink/15 py-10"
                    style={{ transitionDelay: `${0.1 * i}s` }}
                  >
                    <div className="font-mono text-sm text-clay">{step.num}</div>
                    <div>
                      <h3 className="font-display text-2xl">{step.title}</h3>
                      <p className="mt-3 max-w-xl text-ink/75">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ TIER COMPARISON ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <Kicker>Four tiers</Kicker>
          <h2 className="reveal mt-6 font-display text-display max-w-3xl">
            Start free. <span className="italic-display">Scale by counter.</span>
          </h2>
          <p className="reveal reveal-delay-1 mt-6 max-w-xl text-ink/70">
            Every tier includes the core POS and inventory. Upgrades unlock discovery, controlled-drug tracking, and multi-branch reporting — in that order.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tierHighlights.map((t, i) => {
              const borderColor =
                t.color === "clay"
                  ? "border-clay"
                  : t.color === "forest"
                    ? "border-forest"
                    : "border-ink";
              const titleColor =
                t.color === "clay"
                  ? "text-clay"
                  : t.color === "forest"
                    ? "text-forest"
                    : "text-ink";
              return (
                <div
                  key={t.tier}
                  className={`reveal border-t-4 ${borderColor} bg-bone p-8`}
                  style={{ transitionDelay: `${0.1 * i}s` }}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className={`font-display text-3xl ${titleColor}`}>{t.tier}</h3>
                    {t.badge && (
                      <span className="rounded-full border border-clay bg-clay/10 px-3 py-[3px] font-mono text-[9px] uppercase tracking-kicker text-clay">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 font-display text-4xl">{t.price}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-kicker text-ink/55">
                    {t.trial}
                  </div>
                  <ul className="mt-8 space-y-3">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
                        <span aria-hidden="true" className="mt-[9px] inline-block h-[5px] w-[5px] rotate-45 bg-forest" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PULL QUOTE ═══════════════ */}
      <section className="border-t border-ink/15 py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Kicker>A pharmacist writes</Kicker>
            <blockquote className="reveal mt-10">
              <p className="font-display text-display leading-[1.05]">
                &ldquo;The first week I was on Growth, three patients I&rsquo;d never seen walked in holding my counter&rsquo;s name on their phone. <span className="italic-display">I hadn&rsquo;t spent a pesewa on advertising.</span>&rdquo;
              </p>
              <footer className="reveal reveal-delay-1 mt-10 font-mono text-[11px] uppercase tracking-kicker text-ink/60">
                — Pharmacist · Madina
              </footer>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="bg-forest text-bone">
        <Container className="py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <Kicker className="!text-sun">Start here</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                Fourteen days. <span className="italic-display !text-sun">No card. No commitment.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Start a pharmacy trial today. We&rsquo;ll ship you a barcode scanner cradle (if you don&rsquo;t have one) and a member of the implementation team will walk you through your first day of sales, live.
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-4 md:mt-0 md:flex md:items-end md:justify-end">
              <Button href="/contact" variant="ghost" className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest">
                Start pharmacy trial
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
