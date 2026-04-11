import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { Button } from "../_components/Button";
import { StatBlock } from "../_components/StatBlock";
import { KenteDivider } from "../_components/KenteDivider";

export const metadata: Metadata = {
  title: "For hospitals and clinics",
  description: "Inpatient, outpatient, pharmacy, labs, and insurance claims — NHIS, private, and corporate plans — on one chart. The Vedge hospital product.",
};

const capabilities = [
  { code: "ADM", name: "Admissions", body: "Patient intake, triage, bed board. Ward transfers in a single drag." },
  { code: "MAR", name: "Medication Administration Record", body: "Nurse-friendly scheduling with barcode scan, missed dose alerts, and nightly audit trail." },
  { code: "WRD", name: "Wards & beds", body: "Live bed occupancy, housekeeping status, and isolation flags." },
  { code: "LAB", name: "Integrated lab orders", body: "Orders flow to the in-house lab or an external reference lab via HL7." },
  { code: "PHM", name: "Pharmacy dispensing", body: "Prescriptions flow from chart to pharmacy queue to counter to patient." },
  { code: "INS", name: "Insurance claims", body: "NHIS, private insurers, corporate health plans, and community schemes. Claims captured during the visit, submitted in each provider\u2019s format, reconciled automatically." },
  { code: "ALT", name: "Critical lab alerts", body: "Results outside of reference range page the responsible clinician within seconds." },
  { code: "AID", name: "AI diagnostic assist", body: "Symptom-to-differential suggestions that respect a clinician\u2019s judgement, not replace it." },
  { code: "ROL", name: "Custom roles & audit", body: "Every action is logged. Build roles that match your org chart, not ours." },
];

const workflow = [
  { step: "01", title: "Patient arrives", body: "Reception captures their insurance — NHIS, private, corporate, whatever they carry. Triage auto-suggests priority." },
  { step: "02", title: "Clinician sees them", body: "Full chart in under a second. Vital signs stream from the monitor if you have one." },
  { step: "03", title: "Orders go out", body: "Labs, imaging, and meds leave the encounter automatically \u2014 no paper forms." },
  { step: "04", title: "Results come back", body: "Abnormal results page the clinician. Normal results live in the chart, searchable forever." },
  { step: "05", title: "Claim files itself", body: "Reimbursement request leaves the building \u2014 in the right format for the right insurer \u2014 the same day the patient does." },
];

export default function HospitalsPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-ink/15">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Vol. 02 · Hospitals</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                One chart from triage to <span className="italic-display">TTO</span>. One claim from admission to <span className="italic-display">reimbursement.</span>
              </h1>
              <div className="mt-12 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <p className="reveal reveal-delay-1 max-w-xl font-display text-lg leading-relaxed text-ink/80">
                    Vedge replaces the folder trolley, the Excel workbook, the paper drug chart, and the third-party claims desk. Every insurance plan your patients carry, every ward your matron runs, every drug your pharmacist dispenses — held in one record.
                  </p>
                  <div className="reveal reveal-delay-2 mt-10 flex flex-wrap gap-4">
                    <Button href="/contact">Book a ward demo</Button>
                    <Button href="/pricing#hospital" variant="ghost">See hospital pricing</Button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
                  <div className="reveal reveal-delay-2 grid grid-cols-2 gap-y-8">
                    <StatBlock value="9" label="Core modules" />
                    <StatBlock value="30d" label="Free trial" />
                    <StatBlock value="4" label="Pricing tiers" />
                    <StatBlock value="₵349" label="Starts at" />
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
                Nine modules. <br /><span className="italic-display">All included.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                We don&rsquo;t up-sell you a pharmacy module a year in. Everything a mid-size hospital needs is in the base tier and lights up on day one.
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

      {/* ═══════════════ WORKFLOW ═══════════════ */}
      <section className="bg-bone-deep py-24 md:py-32">
        <Container>
          <Kicker>A day in the ward</Kicker>
          <h2 className="reveal mt-8 font-display text-display max-w-3xl">
            Five steps. <span className="italic-display">No paper.</span>
          </h2>
          <ol className="mt-16 grid gap-10 md:grid-cols-5">
            {workflow.map((w, i) => (
              <li key={w.step} className="reveal" style={{ transitionDelay: `${0.1 * i}s` }}>
                <div className="font-mono text-sm text-clay">{w.step}</div>
                <div className="mt-4 h-px w-full bg-ink/25" />
                <h3 className="mt-5 font-display text-xl leading-tight">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{w.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ═══════════════ PULL QUOTE ═══════════════ */}
      <section className="py-28 md:py-36">
        <Container>
          <div className="mx-auto max-w-4xl">
            <p className="reveal font-display text-mega leading-none text-ink/15">&ldquo;</p>
            <p className="reveal reveal-delay-1 -mt-16 font-display text-display leading-[1.05]">
              The matron told us she&rsquo;d believe it when the drug chart disappeared. <span className="italic-display">By week three it had.</span>
            </p>
            <p className="reveal reveal-delay-2 mt-10 font-mono text-[11px] uppercase tracking-kicker text-ink/60">
              — Pharmacist · Accra Regional
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="border-t border-ink/15 bg-forest-deep text-bone">
        <Container className="py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <Kicker className="!text-sun">Start here</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                Thirty days. <span className="italic-display !text-sun">No card.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Start a hospital trial today and we&rsquo;ll have a record keeper on a plane to Accra (or a Zoom, your pick) within a week. Every trial includes a ward walk-through and your first month of data migration, free.
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-4 md:mt-0 md:flex md:items-end md:justify-end">
              <Button href="/contact" variant="ghost" className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest-deep">
                Start hospital trial
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
