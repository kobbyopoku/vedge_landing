import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { Button } from "../_components/Button";
import { StatBlock } from "../_components/StatBlock";
import { KenteDivider } from "../_components/KenteDivider";

export const metadata: Metadata = {
  title: "For laboratories",
  description: "Order to result with Levey-Jennings QC, reagent tracking, and instrument interfaces. The Vedge laboratory product.",
};

const layers = [
  {
    num: "I",
    title: "Order entry",
    body: "Orders arrive from hospital partners via HL7, from walk-ins at reception, or from the Vedge hospital product next door. Either way, one queue.",
  },
  {
    num: "II",
    title: "Sample tracking",
    body: "Barcode from collection to accessioning to instrument. Lost samples are caught before the patient calls.",
  },
  {
    num: "III",
    title: "Instrument interfaces",
    body: "Sysmex, Mindray, Abbott, Roche \u2014 the usual suspects bridge into Vedge. We write the interface if yours isn\u2019t already in.",
  },
  {
    num: "IV",
    title: "Quality control",
    body: "Levey-Jennings charts drawn in real time. Westgard rules fire the moment a run drifts. No one has to open Excel at 21:00.",
  },
  {
    num: "V",
    title: "Reagent inventory",
    body: "Lot-level tracking from the cold chain to the bench. Expiring reagents raise flags a week out, not the morning of.",
  },
  {
    num: "VI",
    title: "Release & report",
    body: "Validated results sign out to the ordering clinician. Patients get an SMS with a secure link to their report.",
  },
];

export default function LaboratoriesPage() {
  return (
    <>
      {/* ═══════════════ HERO — Split with sidebar of stats ═══════════════ */}
      <section className="border-b border-ink/15 bg-bone">
        <Container className="pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Vol. 03 · Labs</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                The bench, <span className="italic-display">the chart,</span> and <span className="italic-display">the Westgard rules</span> — all in one system.
              </h1>
              <p className="reveal reveal-delay-1 mt-10 max-w-2xl font-display text-lg leading-relaxed text-ink/80">
                Vedge Laboratory is a full LIS built around the reality of West African diagnostics: a dozen instruments from six vendors, reference ranges that need to update as populations do, and reagent lots that must be traceable when audit season arrives.
              </p>
              <div className="reveal reveal-delay-2 mt-10 flex flex-wrap gap-4">
                <Button href="/contact">Book a bench demo</Button>
                <Button href="/pricing#lab" variant="ghost">See lab pricing</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats rail */}
      <section className="border-b border-ink/15 bg-bone-deep">
        <Container className="py-16">
          <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
            <div className="reveal"><StatBlock value="6" label="Layers" note="From order entry to sign-out." /></div>
            <div className="reveal reveal-delay-1"><StatBlock value="3" label="Pricing tiers" note="Starter, Pro, Director." /></div>
            <div className="reveal reveal-delay-2"><StatBlock value="14d" label="Trial" note="Bring your own samples, we&rsquo;ll load them." /></div>
            <div className="reveal reveal-delay-3"><StatBlock value="QC" label="Levey-Jennings" note="Built in from day one, on every tier." /></div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ LAYERS ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>The six layers</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Order to result. <span className="italic-display">No gaps.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Traditional LIS products drop sample tracking on the floor and hand QC to a spreadsheet. Vedge holds the whole chain — so nothing goes missing, and nothing gets signed out that shouldn&rsquo;t.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ol>
                {layers.map((layer, i) => (
                  <li
                    key={layer.num}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-t border-ink/15 py-10 first:border-t-0 md:first:border-t"
                    style={{ transitionDelay: `${0.08 * i}s` }}
                  >
                    <div className="font-display text-4xl italic text-forest md:text-5xl">{layer.num}</div>
                    <div>
                      <h3 className="font-display text-2xl">{layer.title}</h3>
                      <p className="mt-3 max-w-xl text-ink/75">{layer.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ QC CALLOUT ═══════════════ */}
      <section className="bg-forest py-24 text-bone md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <Kicker className="!text-sun">On quality control</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                Westgard rules, <span className="italic-display !text-sun">drawn in real time.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-8 max-w-xl text-bone/80">
                Every instrument run charts against its own mean and SD. 1-2s, 1-3s, 2-2s, R-4s, 4-1s, 10x — the whole family of Westgard rules evaluate in real time. If a rule fires, the bench supervisor is paged before the next patient sample touches the instrument.
              </p>
            </div>
            <div className="col-span-12 md:col-span-5">
              {/* Editorial SVG Levey-Jennings illustration */}
              <div className="reveal reveal-delay-2">
                <svg viewBox="0 0 400 260" className="w-full" aria-hidden="true">
                  {/* background */}
                  <rect width="400" height="260" fill="#0E2319" />
                  {/* grid lines */}
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={30 + i * 33}
                      x2="400"
                      y2={30 + i * 33}
                      stroke="#F3ECDF"
                      strokeOpacity={i === 3 ? 0.35 : 0.1}
                      strokeDasharray={i === 3 ? "0" : "2 4"}
                    />
                  ))}
                  {/* labels */}
                  <text x="8" y="34" fill="#E8B04A" fontFamily="monospace" fontSize="9">+3SD</text>
                  <text x="8" y="67" fill="#F3ECDF" fontFamily="monospace" fontSize="9" opacity="0.45">+2SD</text>
                  <text x="8" y="129" fill="#F3ECDF" fontFamily="monospace" fontSize="10">MEAN</text>
                  <text x="8" y="160" fill="#F3ECDF" fontFamily="monospace" fontSize="9" opacity="0.45">-2SD</text>
                  <text x="8" y="225" fill="#C8553D" fontFamily="monospace" fontSize="9">-3SD</text>
                  {/* data polyline — intentionally editorial */}
                  <polyline
                    fill="none"
                    stroke="#E8B04A"
                    strokeWidth="1.5"
                    points="30,140 60,125 90,130 120,118 150,132 180,128 210,115 240,105 270,95 300,128 330,150 360,138"
                  />
                  {/* data points */}
                  {[
                    [30, 140], [60, 125], [90, 130], [120, 118], [150, 132],
                    [180, 128], [210, 115], [240, 105], [270, 95], [300, 128],
                    [330, 150], [360, 138],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#F3ECDF" />
                  ))}
                  {/* breach callout */}
                  <circle cx="270" cy="95" r="7" fill="none" stroke="#C8553D" strokeWidth="1.5" />
                  <text x="283" y="92" fill="#C8553D" fontFamily="monospace" fontSize="9">1-2s</text>
                </svg>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-kicker text-bone/50">
                  Levey-Jennings · run chart · today
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Kicker className="justify-center">Ready to talk</Kicker>
            <h2 className="reveal mt-8 font-display text-display">
              A lab director shouldn&rsquo;t have to babysit a spreadsheet. <span className="italic-display">Let&rsquo;s fix that.</span>
            </h2>
            <div className="reveal reveal-delay-1 mt-12 flex justify-center gap-4">
              <Button href="/contact">Book a bench demo</Button>
              <Button href="/pricing#lab" variant="ghost">Lab pricing</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
