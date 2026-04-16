import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { Button } from "../_components/Button";
import { KenteDivider } from "../_components/KenteDivider";
import { formatPrice, annualPrice, type Vertical } from "../_data/plans";
import { getPlans } from "../_lib/api";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5177";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for hospitals, laboratories, pharmacies, diagnostic centres, and patients across Africa. Free base tiers for labs and pharmacies. Hospitals and imaging centres from ₵1,200/month.",
};

// Groups and display labels for pricing segments.
const segments: { key: Vertical; title: string; kicker: string; note: string; anchor: string }[] = [
  {
    key: "hospital",
    title: "Hospitals & clinics",
    kicker: "For the wards",
    note: "Plans are priced per organisation, not per bed. Scale staff and departments without getting punished for growth.",
    anchor: "hospital",
  },
  {
    key: "laboratory",
    title: "Laboratories",
    kicker: "For the bench",
    note: "Essentials is free forever. Levey-Jennings QC, reagent tracking, and instrument interfaces unlock at Pro. Accredited tier adds the full ISO 15189 toolkit.",
    anchor: "lab",
  },
  {
    key: "pharmacy",
    title: "Pharmacies",
    kicker: "For the counter",
    note: "A free base tier for every community pharmacy in Africa, plus paid Recommended tiers that plug you into the prescribing doctor's app. Bring your own barcode scanner.",
    anchor: "pharmacy",
  },
  {
    key: "patient",
    title: "Patients",
    kicker: "For the people",
    note: "The Vedge patient app is free. Teleconsultation and lab result delivery are priced per use, never per month.",
    anchor: "patient",
  },
  {
    key: "diagnostic_center",
    title: "Radiology / Diagnostic Centres",
    kicker: "For the scanner",
    note: "Three tiers for imaging centres of every size. Starter covers CT, X-ray, and ultrasound. Pro adds MRI, mammography, ECG, and PACS. Enterprise extends to multi-site teleradiology networks.",
    anchor: "diagnostic",
  },
];

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="border-b border-ink/15">
        <Container className="pt-20 pb-24 md:pt-28 md:pb-32">
          <Kicker>Pricing · 2026 edition</Kicker>
          <h1 className="reveal mt-8 font-display text-hero max-w-5xl">
            Fourteen plans. <span className="italic-display">Five verticals.</span> Priced in cedis, <span className="italic-display">not dollars.</span>
          </h1>
          <div className="mt-14 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <p className="reveal reveal-delay-1 max-w-xl font-display text-xl text-ink/80 leading-snug">
                We didn&rsquo;t take a US EHR and put a price tag on it in GHS. We started with an African health system&rsquo;s P&amp;L and worked backwards. Everything here reflects that.
              </p>
            </div>
            <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
              <dl className="reveal reveal-delay-2 grid grid-cols-2 gap-y-6">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Annual saving</dt>
                  <dd className="mt-1 font-display text-3xl">20%</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Founding customer</dt>
                  <dd className="mt-1 font-display text-3xl">−40%</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Hospital trial</dt>
                  <dd className="mt-1 font-display text-3xl">30d</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Lab trial</dt>
                  <dd className="mt-1 font-display text-3xl">14d</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Jump nav */}
          <div className="reveal reveal-delay-3 mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/15 pt-8">
            <span className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">Jump to</span>
            {segments.map((s) => (
              <Link key={s.anchor} href={`#${s.anchor}`} className="link-grow font-mono text-[11px] uppercase tracking-kicker text-ink">
                {s.title}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ SEGMENTS ═══════════════ */}
      {segments.map((segment, segIdx) => {
        const segmentPlans = plans.filter((p) => p.vertical === segment.key);
        return (
          <section
            key={segment.key}
            id={segment.anchor}
            className={`py-24 md:py-32 ${segIdx % 2 === 1 ? "bg-bone-deep" : "bg-bone"}`}
          >
            <Container>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4">
                  <Kicker>{segment.kicker}</Kicker>
                  <h2 className="reveal mt-6 font-display text-display">
                    {segment.title}
                  </h2>
                  <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                    {segment.note}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-8">
                  <ul className="border-t border-ink/20">
                    {segmentPlans.map((plan, i) => {
                      const annual = annualPrice(plan.monthly);
                      return (
                        <li
                          key={plan.code}
                          className="reveal border-b border-ink/15 py-10"
                          style={{ transitionDelay: `${0.08 * i}s` }}
                        >
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 md:col-span-5">
                              <div className="flex items-baseline gap-3">
                                <h3 className="font-display text-3xl md:text-4xl">
                                  {plan.name}
                                </h3>
                                {plan.badge && (
                                  <span className="rounded-full border border-clay bg-clay/10 px-3 py-[3px] font-mono text-[9px] uppercase tracking-kicker text-clay">
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <p className="mt-3 max-w-xs text-ink/70">{plan.tagline}</p>
                              <div className="mt-4 font-mono text-[10px] uppercase tracking-kicker text-ink/55">
                                {plan.trialDays}-day trial · No card required
                              </div>
                            </div>

                            <div className="col-span-12 md:col-span-3 md:text-right">
                              <div className="font-display text-4xl md:text-5xl">
                                {formatPrice(plan.monthly)}
                                {typeof plan.monthly === "number" && plan.monthly > 0 && (
                                  <span className="ml-1 font-sans text-sm text-ink/55">/mo</span>
                                )}
                              </div>
                              {typeof annual === "number" && annual > 0 && (
                                <div className="mt-2 font-mono text-[10px] uppercase tracking-kicker text-ink/55">
                                  or {formatPrice(annual)}/yr
                                </div>
                              )}
                            </div>

                            <div className="col-span-12 md:col-span-4">
                              <ul className="space-y-2">
                                {plan.includes.slice(0, 6).map((item) => (
                                  <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
                                    <span aria-hidden="true" className="mt-[9px] inline-block h-[5px] w-[5px] rotate-45 bg-forest" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-6">
                                {plan.monthly === "custom" ? (
                                  <Link
                                    href="/contact"
                                    className="link-grow font-mono text-[11px] uppercase tracking-kicker text-clay"
                                  >
                                    Request a quote
                                  </Link>
                                ) : (
                                  <a
                                    href={`${appUrl}/register`}
                                    className="link-grow font-mono text-[11px] uppercase tracking-kicker text-clay"
                                  >
                                    Start free trial →
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Container>
          </section>
        );
      })}

      <KenteDivider className="bg-bone py-4" />

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="bg-forest text-bone">
        <Container className="py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <Kicker className="!text-sun">Still choosing</Kicker>
              <h2 className="reveal mt-8 font-display text-display text-bone">
                Not sure which plan fits? <span className="italic-display !text-sun">We&rsquo;ll tell you.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                A twenty-minute call. Bring the numbers that matter: beds, departments, monthly patients, insurance mix. We&rsquo;ll recommend the right tier — and tell you if you&rsquo;re on the wrong one a year from now.
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-4 md:mt-0 md:flex md:items-end md:justify-end">
              <div className="reveal reveal-delay-2">
                <Button href="/contact" variant="ghost" className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest">
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
