import type { Metadata } from "next";
import { Container } from "../../_components/Container";
import { Kicker } from "../../_components/Kicker";
import { Button } from "../../_components/Button";
import { StatBlock } from "../../_components/StatBlock";
import { KenteDivider } from "../../_components/KenteDivider";

export const metadata: Metadata = {
  title: "Vedge Patient — your health, in your pocket",
  description: "The consumer companion to Vedge. Appointments, lab results with trend charts, prescriptions, imaging reports, and a time-boxed share link you can send to any doctor. Free forever.",
};

const capabilities = [
  { code: "APT", name: "Appointments", body: "Book, reschedule, and cancel. Get reminders the day before, the hour before, and when it\u2019s your turn in the queue." },
  { code: "LAB", name: "Lab results with trends", body: "Every result you\u2019ve had with Vedge-connected facilities, visualised over time. See your HbA1c trend across three years at a glance." },
  { code: "IMG", name: "Imaging reports", body: "View radiologist reports and the DICOM images, if your facility allows it. A branded PDF to save, email, or show another doctor." },
  { code: "RX", name: "Prescriptions", body: "Active, refillable, and historical. Pharmacies connected to Vedge can dispense from the e-script — no paper slip, no queue." },
  { code: "SHR", name: "Second-opinion share", body: "Generate a time-boxed link you can send to any doctor — even one who doesn\u2019t use Vedge. They see your record, you stay in control." },
  { code: "TEL", name: "Tele-consult booking", body: "Book a video consult with any doctor on the platform. Pay per call, no subscription. Your record is already there when the call starts." },
  { code: "EDU", name: "Condition library", body: "Plain-language explainers for the conditions in your record, vetted by local specialists. No web-MD rabbit holes." },
  { code: "FAM", name: "Family accounts", body: "Manage a child\u2019s or parent\u2019s record with their permission. One login, verified family links." },
];

const principles = [
  {
    code: "FRE",
    name: "Free forever",
    body: "The patient app doesn\u2019t charge you. Hospitals and labs pay for the backbone; you get the record of your own health at no cost.",
  },
  {
    code: "OWN",
    name: "You own your record",
    body: "Export everything as a standard FHIR bundle, any time. Leave a facility, keep your history. Close your Vedge account, take it with you.",
  },
  {
    code: "PRV",
    name: "Nobody sells your data",
    body: "No ads. No research licensing. No pharmaceutical partnerships. The people who pay us are the facilities you visit, not anyone buying your information.",
  },
  {
    code: "SEC",
    name: "End-to-end audit",
    body: "Every time a clinician opens your record, it\u2019s logged. You can see who looked, when, and from which facility — the same audit your hospital sees internally.",
  },
];

export default function VedgePatientPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-ink/15">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Companion · Vedge Patient</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                Your health records, <span className="italic-display">in your pocket.</span>
              </h1>
              <div className="mt-12 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <p className="reveal reveal-delay-1 max-w-xl font-display text-lg leading-relaxed text-ink/80">
                    Every lab result, every prescription, every imaging report from every Vedge-connected facility — held by you, not trapped in a folder you can&rsquo;t find. Free, forever, for every patient in Africa.
                  </p>
                  <div className="reveal reveal-delay-2 mt-10 flex flex-wrap gap-4">
                    <Button href="/contact">Join the waitlist</Button>
                    <Button href="#privacy" variant="ghost">How we handle your data</Button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
                  <div className="reveal reveal-delay-2 grid grid-cols-2 gap-y-8">
                    <StatBlock value="₵0" label="Always" />
                    <StatBlock value="iOS + Android" label="Platforms" />
                    <StatBlock value="FHIR" label="Export format" />
                    <StatBlock value="You" label="Data owner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CAPABILITY GRID ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>Capabilities</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Eight things. <br /><span className="italic-display">One record.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Vedge Patient stitches your visits, labs, prescriptions, and imaging into one timeline. Any Vedge-connected facility shows up automatically. Older paper records can be uploaded and tagged.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ul className="grid grid-cols-1 border-t border-ink/20 sm:grid-cols-2">
                {capabilities.map((cap, i) => (
                  <li
                    key={cap.code}
                    className={`reveal border-b border-ink/15 p-7 ${i % 2 === 0 ? "sm:border-r sm:border-ink/15" : ""}`}
                    style={{ transitionDelay: `${0.06 * i}s` }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">{cap.code}</div>
                    <h3 className="mt-3 font-display text-2xl">{cap.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{cap.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ PRIVACY / PRINCIPLES ═══════════════ */}
      <section id="privacy" className="bg-bone-deep py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>What we promise</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Your data <br /><span className="italic-display">is yours.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Four rules we won&rsquo;t break. Written down so you can hold us to them.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <ul className="grid grid-cols-1 border-t border-ink/20 sm:grid-cols-2">
                {principles.map((p, i) => (
                  <li
                    key={p.code}
                    className={`reveal border-b border-ink/15 p-7 ${i % 2 === 0 ? "sm:border-r sm:border-ink/15" : ""}`}
                    style={{ transitionDelay: `${0.06 * i}s` }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">{p.code}</div>
                    <h3 className="mt-3 font-display text-2xl">{p.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ PULL QUOTE ═══════════════ */}
      <section className="py-28 md:py-36">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="reveal font-display text-mega leading-none text-ink/15">&ldquo;</p>
            <p className="reveal reveal-delay-1 -mt-16 font-display text-display leading-[1.05]">
              I&rsquo;d moved cities. My new GP asked for my history. <span className="italic-display">I sent her a link on WhatsApp.</span>
            </p>
            <p className="reveal reveal-delay-2 mt-10 font-mono text-[11px] uppercase tracking-kicker text-ink/60">
              — Vedge Patient · Early access user
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="border-t border-ink/15 bg-forest-deep text-bone">
        <Container className="py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <Kicker className="!text-sun">Coming soon</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                Join the <span className="italic-display !text-sun">waitlist.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Public launch follows our first 15 hospital customers. If you&rsquo;re a patient at a Vedge facility already, you&rsquo;ll get early access automatically.
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-4 md:mt-0 md:flex md:items-end md:justify-end">
              <Button href="/contact" variant="ghost" className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest-deep">
                Get notified
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
