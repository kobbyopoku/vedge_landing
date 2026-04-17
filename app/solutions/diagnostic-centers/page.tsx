import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../../_components/Container";
import { Kicker } from "../../_components/Kicker";
import { Button } from "../../_components/Button";
import { StatBlock } from "../../_components/StatBlock";
import { KenteDivider } from "../../_components/KenteDivider";
import { formatPrice, annualPrice } from "../../_data/plans";
import { getPlans } from "../../_lib/api";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5177";

export const metadata: Metadata = {
  title: "For radiology & diagnostic centres",
  description:
    "Walk-ins, multi-modality workflows, WhatsApp-deliverable reports, and payment that happens at your counter — not upfront. Vedge for standalone diagnostic and imaging centres.",
};

const modalities = [
  { code: "CT", name: "CT" },
  { code: "MRI", name: "MRI" },
  { code: "XR", name: "X-ray" },
  { code: "US", name: "Ultrasound" },
  { code: "MG", name: "Mammography" },
  { code: "ECG", name: "ECG" },
];

const workflowSteps = [
  {
    step: "01",
    title: "Patient arrives with referral",
    body: "Receptionist logs the patient — name, age, modality, clinical indication, insurer — in a single form. The study lands on the correct modality worklist before the patient finishes at the counter.",
  },
  {
    step: "02",
    title: "Patient goes straight to the scanner",
    body: "No clipboard loops. No waiting for the radiographer to find a paper request card. The worklist is already sorted by modality and urgency.",
  },
  {
    step: "03",
    title: "Study acquired, invoice waits in billing",
    body: "The draft invoice is created the moment intake is logged. Your billing clerk adjusts line items — CT with contrast, additional views, ECG add-on — before charging. Nothing bills prematurely.",
  },
  {
    step: "04",
    title: "Radiologist signs the report",
    body: "Template pre-fills 90% of a normal study. The radiologist edits the clinical finding, flags critical results in one click, and signs. The referrer is notified within seconds of a critical flag.",
  },
  {
    step: "05",
    title: "Report delivered the way the patient wants it",
    body: "Branded PDF at the counter, copy-paste link to WhatsApp, or emailed token link with configurable expiry and view cap. The referrer gets a copy automatically.",
  },
];

const reportFeatures = [
  {
    code: "TPL",
    name: "15 canonical normal-study macros",
    body: "CT chest-abdomen-pelvis, US abdomen, CXR, knee MRI, mammography screen — the most common normals ship pre-built. Edit the last 10%, not the first 90%.",
  },
  {
    code: "SGN",
    name: "Sign & flag critical in one click",
    body: "A single action signs the report and pages the referrer with the critical finding. Time-stamped and logged for medico-legal audit.",
  },
  {
    code: "PDF",
    name: "Branded PDF on demand",
    body: "Letterhead, study metadata, signing radiologist, date, and a QR code that links to the patient's share page. Print it at the counter or email it — one button either way.",
  },
  {
    code: "MAC",
    name: "Build your own macros",
    body: "Add site-specific templates — your institution's own referral population, your consultant's preferred phrasing. Macros are version-controlled so previous wording is never lost.",
  },
];

const shareFeatures = [
  {
    title: "Public token link",
    body: "Every report gets a time-boxed share link — set the expiry (7, 14, 30 days) and a view cap. Patients share it with their doctor without creating an account.",
  },
  {
    title: "Copy-paste to WhatsApp",
    body: "One button copies the share URL. The patient pastes it into WhatsApp. Works on any Android or iPhone — no app download required.",
  },
  {
    title: "Printed PDF at the counter",
    body: "If the patient prefers paper, print the branded letterhead PDF straight from the receipt printer. The QR on the printed page still links back to the digital version.",
  },
];

const billingFeatures = [
  {
    title: "DRAFT invoices first",
    body: "Every study creates a DRAFT invoice. Your billing clerk reviews before charging — add contrast, remove a duplicate view, apply NHIS tariff codes. Nothing goes to the patient until billing approves.",
  },
  {
    title: "Payment rails built in",
    body: "Paystack, Flutterwave, MTN MoMo, Vodafone Cash, NHIS, and private insurance — all on the same checkout. No third-party billing module to licence.",
  },
  {
    title: "À la carte and package pricing",
    body: "Set individual modality prices or bundle CT + ECG into a cardiac screening package. Discounts apply automatically when a package is selected at intake.",
  },
];

export default async function DiagnosticCentersPage() {
  const allPlans = await getPlans();
  const diagnosticPlans = allPlans.filter((p) => p.vertical === "diagnostic_center");

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-ink/15">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Vol. 05 · Diagnostic centres</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                Built for how your{" "}
                <span className="italic-display">imaging centre</span>{" "}
                actually runs.
              </h1>
              <div className="mt-12 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <p className="reveal reveal-delay-1 max-w-xl font-display text-lg leading-relaxed text-ink/80">
                    Walk-ins, multi-modality workflows, WhatsApp-deliverable reports, and payment that happens at your counter — not upfront. Vedge handles the full imaging cycle so your radiographers and radiologists can stay focused on the patient.
                  </p>
                  <div className="reveal reveal-delay-2 mt-10 flex flex-wrap gap-4">
                    <Button href={`${appUrl}/register`}>Start 14-day free trial</Button>
                    <Button href="/pricing#diagnostic" variant="ghost">See imaging pricing</Button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
                  <div className="reveal reveal-delay-2 grid grid-cols-2 gap-y-8">
                    <StatBlock value="6" label="Modalities" note="CT, MRI, X-ray, Ultrasound, Mammography, ECG." />
                    <StatBlock value="14d" label="Free trial" note="Every modality. No card required." />
                    <StatBlock value="3" label="Pricing tiers" note="From ₵1,200/month." />
                    <StatBlock value="₵0" label="Setup fee" note="PACS wiring included in trial." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ WALK-IN INTAKE ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>Walk-in intake</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                One form. <span className="italic-display">Patient goes straight to the scanner.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Most of your patients arrive with a paper referral. Vedge turns that slip into a structured order — patient demographics, modality, clinical indication, insurer, payment method — in one screen. By the time the patient sits down, the worklist already knows what comes next.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ol>
                {workflowSteps.map((step, i) => (
                  <li
                    key={step.step}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-t border-ink/15 py-10 first:border-t-0 md:first:border-t"
                    style={{ transitionDelay: `${0.08 * i}s` }}
                  >
                    <div className="font-mono text-sm text-clay">{step.step}</div>
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

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ RADIOLOGIST PRODUCTIVITY ═══════════════ */}
      <section className="bg-bone-deep py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>Radiologist productivity</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Templates, sign-off, <span className="italic-display">branded PDF.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Fifteen canonical normal-study macros ship by default — so a routine CXR or abdominal ultrasound takes seconds, not minutes. Critical findings reach the referrer before the patient leaves your building.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ul className="grid grid-cols-1 border-t border-ink/20 sm:grid-cols-2">
                {reportFeatures.map((feat, i) => (
                  <li
                    key={feat.code}
                    className={`reveal border-b border-ink/15 p-7 ${i % 2 === 0 ? "sm:border-r sm:border-ink/15" : ""}`}
                    style={{ transitionDelay: `${0.06 * i}s` }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">{feat.code}</div>
                    <h3 className="mt-3 font-display text-2xl">{feat.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{feat.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ SHARE RESULTS ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <Kicker>Result delivery</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Share results the way your patients{" "}
                <span className="italic-display">actually want them.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                A token link expires on your schedule and caps how many times it can be viewed. Your patient pastes it into WhatsApp. Or they take a printed PDF at the counter. One report, three delivery modes, zero extra work.
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:pl-12">
              <ul>
                {shareFeatures.map((feat, i) => (
                  <li
                    key={feat.title}
                    className="reveal border-t border-ink/15 py-10 last:border-b"
                    style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
                  >
                    <div className="grid grid-cols-12 items-baseline gap-4">
                      <span className="col-span-2 font-mono text-[11px] uppercase tracking-kicker text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="col-span-10">
                        <div className="font-display text-2xl md:text-3xl">{feat.title}</div>
                        <p className="mt-2 max-w-md text-ink/70">{feat.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ BILLING ═══════════════ */}
      <section className="bg-bone-deep py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>Billing on your terms</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Draft first. <span className="italic-display">Charge when ready.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Billing at an imaging centre is rarely simple — contrast add-ons, insurance pre-authorisation, NHIS tariff codes, package discounts. Vedge keeps everything in DRAFT until your billing clerk signs off.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 md:pl-12">
              <ul>
                {billingFeatures.map((feat, i) => (
                  <li
                    key={feat.title}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-t border-ink/15 py-10"
                    style={{ transitionDelay: `${0.08 * i}s` }}
                  >
                    <div className="font-display text-4xl italic text-forest md:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl">{feat.title}</h3>
                      <p className="mt-3 max-w-xl text-ink/75">{feat.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ MODALITIES ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <Kicker>Modalities</Kicker>
          <h2 className="reveal mt-6 font-display text-display max-w-2xl">
            Every modality you run, <span className="italic-display">one worklist.</span>
          </h2>
          <div className="reveal reveal-delay-1 mt-14 grid grid-cols-3 gap-6 border-t border-ink/20 pt-10 md:grid-cols-6">
            {modalities.map((mod, i) => (
              <div
                key={mod.code}
                className="reveal flex flex-col items-center gap-3 border border-ink/15 p-6"
                style={{ transitionDelay: `${0.06 * i}s` }}
              >
                <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">{mod.code}</div>
                <div className="font-display text-xl">{mod.name}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PLANS ═══════════════ */}
      {diagnosticPlans.length > 0 && (
        <section id="diagnostic" className="border-t border-ink/15 bg-bone-deep py-24 md:py-32">
          <Container>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4">
                <Kicker>For the scanner</Kicker>
                <h2 className="reveal mt-6 font-display text-display">
                  Three tiers. <span className="italic-display">Start in 14 days.</span>
                </h2>
                <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                  Starter covers the essentials. Pro adds PACS, MRI, mammography, and insurance pre-authorisation. Enterprise extends to multi-site and teleradiology networks.
                </p>
              </div>
              <div className="col-span-12 md:col-span-8">
                <ul className="border-t border-ink/20">
                  {diagnosticPlans.map((plan, i) => {
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
                              <h3 className="font-display text-3xl md:text-4xl">{plan.name}</h3>
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
                              <a
                                href={`${appUrl}/register`}
                                className="link-grow font-mono text-[11px] uppercase tracking-kicker text-clay"
                              >
                                Start free trial →
                              </a>
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
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="border-t border-ink/15 bg-forest-deep text-bone">
        <Container className="py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <Kicker className="!text-sun">Start here</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                Fourteen days. <span className="italic-display !text-sun">Every modality.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Start a diagnostic trial and we&rsquo;ll wire your first modality to Vedge within the week. PACS migration and reading-room setup included in the trial — no charge until you&rsquo;re running signed reports.
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-4 md:mt-0 md:flex md:items-end md:justify-end">
              <Button
                href={`${appUrl}/register`}
                variant="ghost"
                className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest-deep"
              >
                Start free 14-day trial
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
