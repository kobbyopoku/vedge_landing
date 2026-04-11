import Link from "next/link";
import { Container } from "./_components/Container";
import { Kicker } from "./_components/Kicker";
import { Button } from "./_components/Button";
import { StatBlock } from "./_components/StatBlock";
import { KenteDivider } from "./_components/KenteDivider";
import { verticals } from "./_data/plans";

// Feature chips used in the marquee — the real product surfaces we shipped.
const marqueeChips = [
  "Inpatient Wards",
  "MAR · Medication Administration",
  "Levey-Jennings QC",
  "Insurance Claims",
  "Critical Lab Alerts",
  "Pharmacy POS",
  "Reagent Lot Tracking",
  "AI Diagnostic Assist",
  "Patient Mobile App",
  "Custom Roles",
  "HL7 Lab Interfaces",
  "Multi-Tenant Orgs",
];

const features = [
  {
    num: "01",
    title: "Built for every insurer your patients carry.",
    body: "NHIS, private insurers, corporate health plans, community schemes — Vedge captures claims during the visit and submits them in the format each provider expects. No three-week reconciliation month-end headache.",
  },
  {
    num: "02",
    title: "Designed for the wards you actually work in.",
    body: "Load-shedding aware. Sync-to-cloud when power returns. Offline charting on the wards. Printable fall-back for every chart if the generator dies.",
  },
  {
    num: "03",
    title: "One platform. Four verticals.",
    body: "Hospitals, labs, and pharmacies on the same backbone — so a doctor orders a test, the lab runs it, the pharmacy dispenses the meds, and the ledger closes itself.",
  },
  {
    num: "04",
    title: "Pricing that respects an African P&L.",
    body: "Plans start at ₵149 a month. 30-day trials. No forced annual contracts. Founding customer programme for the first 15 paying facilities — 40% off the first year.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-16 pb-28 md:pt-24 md:pb-40">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2 md:pt-3">
              <Kicker>Ed. 01 · Accra</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero text-ink">
                A health operating system<br />
                <span className="italic-display">built for the way</span><br />
                Africa <span className="italic-display">actually works.</span>
              </h1>

              <div className="mt-10 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <p className="reveal reveal-delay-1 max-w-xl font-display text-lg leading-relaxed text-ink/80">
                    Vedge is the records platform hospitals, clinics, laboratories, and pharmacies across Africa use to run wards, file insurance claims with every provider their patients carry, dispense medication, and stay in sync — whether the lights are on or off.
                  </p>
                  <div className="reveal reveal-delay-2 mt-10 flex flex-wrap items-center gap-4">
                    <Button href="/contact">Book a demo</Button>
                    <Button href="/pricing" variant="ghost">See pricing</Button>
                  </div>
                </div>
                <div className="col-span-12 mt-10 md:col-span-5 md:mt-0 md:border-l md:border-ink/15 md:pl-8">
                  <div className="reveal reveal-delay-2 grid grid-cols-2 gap-y-6">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Serving</div>
                      <div className="mt-1 font-display text-2xl">Africa · Pan-continental</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Verticals</div>
                      <div className="mt-1 font-display text-2xl">4</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Starts at</div>
                      <div className="mt-1 font-display text-2xl">₵149<span className="text-sm text-ink/60">/mo</span></div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Trial</div>
                      <div className="mt-1 font-display text-2xl">30 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* A huge quoted phrase that acts as design-led credibility */}
          <div className="reveal reveal-delay-3 mt-28 border-t border-ink/20 pt-10 md:pt-14">
            <p className="font-display text-mega leading-none">
              <span className="text-ink">fifty</span>{" "}
              <span className="italic-display">thousand</span>{" "}
              <span className="text-ink">patients.</span>
            </p>
            <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <p className="max-w-md font-display text-xl text-ink/75">
                Projected lives touched by Vedge across pilot partners in the next twelve months — without a single patient losing a paper chart on the way.
              </p>
              <div className="font-mono text-[11px] uppercase tracking-kicker text-ink/60">
                Target · 2026 — 2027
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ FEATURE MARQUEE ═══════════════════════ */}
      <section aria-label="Product surfaces" className="border-y border-ink/15 bg-forest text-bone">
        <div className="overflow-hidden py-6">
          <div className="marquee gap-12 whitespace-nowrap font-display text-3xl">
            {[...marqueeChips, ...marqueeChips].map((chip, i) => (
              <span key={i} className="flex items-center gap-12">
                <span className="text-bone">{chip}</span>
                <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-clay" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FACILITY TYPES ═══════════════════════ */}
      <section className="py-24 md:py-36">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>What we cover</Kicker>
              <h2 className="reveal mt-6 font-display text-display text-ink">
                Four verticals.<br /><span className="italic-display">One chart.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-8 max-w-sm text-ink/70">
                Most software vendors sell you a hospital system, a lab system, and a pharmacy system as three separate products. Vedge was built to be one.
              </p>
            </div>

            <div className="col-span-12 md:col-span-8 md:pl-12">
              <ul>
                {verticals.map((v, i) => (
                  <li key={v.key} className="reveal group border-t border-ink/15 py-10 last:border-b" style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>
                    <Link href={v.href} className="grid grid-cols-12 items-baseline gap-4">
                      <span className="col-span-2 font-mono text-[11px] uppercase tracking-kicker text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="col-span-8">
                        <div className="font-display text-3xl transition-colors group-hover:text-forest md:text-4xl">
                          {v.label}
                        </div>
                        <p className="mt-2 max-w-md text-ink/70">{v.blurb}</p>
                      </div>
                      <span className="col-span-2 justify-self-end font-display text-2xl transition-transform duration-500 group-hover:translate-x-2">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ KENTE DIVIDER ═══════════════════════ */}
      <div className="relative bg-bone-deep py-8">
        <KenteDivider />
      </div>

      {/* ═══════════════════════ FEATURES / NUMBERED LIST ═══════════════════════ */}
      <section className="bg-bone py-24 md:py-36">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <Kicker>The four commitments</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                We don&rsquo;t ship a <span className="italic-display">generic EHR.</span> We ship a system that fits the floor you actually stand on.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <dl className="space-y-10">
                {features.map((f) => (
                  <div key={f.num} className="reveal grid grid-cols-[auto_1fr] gap-6 border-t border-ink/15 pt-8">
                    <dt className="font-mono text-sm text-clay">{f.num}</dt>
                    <div>
                      <div className="font-display text-2xl leading-tight">{f.title}</div>
                      <dd className="mt-3 max-w-xl text-ink/75">{f.body}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ STATS STRIP ═══════════════════════ */}
      <section className="border-y border-ink/15 bg-bone-deep py-20">
        <Container>
          <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
            <div className="reveal"><StatBlock value="11" label="Pricing tiers" note="Across four verticals, meeting you where you are." /></div>
            <div className="reveal reveal-delay-1"><StatBlock value="30d" label="Hospital trial" note="Zero credit card. Zero auto-charge. Cancel any time." /></div>
            <div className="reveal reveal-delay-2"><StatBlock value="17%" label="Annual saving" note="Save when you commit to a year. Founding customers save 40%." /></div>
            <div className="reveal reveal-delay-3"><StatBlock value="₵149" label="Starting price" note="Per month, for a single-counter pharmacy. Scaling from there." /></div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ DESIGN PARTNER CALLOUT ═══════════════════════ */}
      <section aria-labelledby="partners-heading" className="relative overflow-hidden bg-clay text-bone">
        <div className="grain absolute inset-0 !opacity-20" />
        <Container className="relative z-10 py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <Kicker className="!text-bone">Design partner programme · 2026</Kicker>
              <h2 id="partners-heading" className="reveal mt-8 font-display text-hero text-bone">
                Forty facilities. <span className="italic-display !text-sun">Ten of each. One year. No invoice.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-8 max-w-xl font-display text-xl text-bone/90 leading-snug">
                We are taking forty African facilities — ten hospitals, ten clinics, ten laboratories, ten pharmacies — into a twelve-month design partnership. Full access to every module of Vedge, zero cost, in exchange for thirty minutes a week and one case study at month twelve.
              </p>
              <ul className="reveal reveal-delay-2 mt-10 space-y-3">
                {[
                  "12 months of Vedge, every module, every seat, every branch",
                  "A direct line to the engineers writing the code",
                  "Roadmap influence — your requests go to the top of the queue",
                  "Early access to new modules before everyone else",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-bone/90">
                    <span aria-hidden="true" className="mt-[9px] inline-block h-[5px] w-[5px] rotate-45 bg-sun" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="reveal reveal-delay-3 mt-12">
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-4 border-b border-bone pb-2 font-display text-3xl text-bone hover:text-sun md:text-4xl"
                >
                  Read the full programme <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* The three big numbers as a standalone rail */}
            <div className="col-span-12 mt-12 md:col-span-5 md:mt-0 md:border-l md:border-bone/30 md:pl-10">
              <div className="reveal reveal-delay-2 flex flex-col gap-12">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-sun">Partners</div>
                  <div className="mt-2 font-display text-[5.5rem] leading-none text-bone">40</div>
                  <div className="mt-2 max-w-[14rem] text-xs text-bone/75">Ten each across hospitals, clinics, labs, and pharmacies.</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-sun">Duration</div>
                  <div className="mt-2 font-display text-[5.5rem] leading-none text-bone">12 mo</div>
                  <div className="mt-2 max-w-[14rem] text-xs text-bone/75">Starts the day your data is migrated.</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-sun">Cost</div>
                  <div className="mt-2 font-display text-[5.5rem] leading-none text-bone">₵0</div>
                  <div className="mt-2 max-w-[14rem] text-xs text-bone/75">All modules, all users, migration included.</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ TESTIMONIAL ═══════════════════════ */}
      <section className="py-28 md:py-40">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Kicker>A partner writes</Kicker>
            <blockquote className="reveal mt-8">
              <p className="font-display text-display leading-[1.02] text-ink">
                &ldquo;We went from stacks of green folders to <span className="italic-display">every ward running on Vedge in six weeks</span>. The training wasn&rsquo;t the hard part. Convincing the matron we could retire paper forever was.&rdquo;
              </p>
              <footer className="reveal reveal-delay-1 mt-12 flex items-center gap-6">
                <div className="h-14 w-14 rounded-full bg-forest ring-4 ring-sun/30" aria-hidden="true" />
                <div>
                  <div className="font-display text-xl">Dr. Ama Owusu</div>
                  <div className="font-mono text-[11px] uppercase tracking-kicker text-ink/60">
                    Medical director · Ridge Hospital pilot
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════ CTA BLOCK ═══════════════════════ */}
      <section className="bg-forest-deep text-bone">
        <Container className="py-28 md:py-40">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <Kicker className="!text-sun">The next step</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                See Vedge on your floor. <span className="italic-display !text-sun">Bring the matron.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-8 max-w-xl text-bone/75">
                We come to you. A ninety-minute walk-through in your wards, your lab, or your pharmacy counter — with the people who&rsquo;ll actually use Vedge in the room. No slides unless you ask.
              </p>
              <div className="reveal reveal-delay-2 mt-12">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-4 border-b border-bone pb-2 font-display text-3xl text-bone hover:text-sun md:text-4xl"
                >
                  Book a demo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="col-span-12 mt-10 md:col-span-5 md:mt-0 md:border-l md:border-bone/20 md:pl-10">
              <div className="font-mono text-[10px] uppercase tracking-kicker text-sun/80">Or reach us at</div>
              <ul className="mt-6 space-y-5">
                <li>
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-bone/50">Email</div>
                  <div className="font-display text-2xl text-bone">hello@vedge.health</div>
                </li>
                <li>
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-bone/50">Accra</div>
                  <div className="font-display text-2xl text-bone">+233 30 000 0000</div>
                </li>
                <li>
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-bone/50">Hours</div>
                  <div className="font-display text-2xl text-bone">Mon — Sat · 08:00 — 19:00 GMT</div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
