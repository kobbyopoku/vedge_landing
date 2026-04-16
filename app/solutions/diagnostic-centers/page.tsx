import type { Metadata } from "next";
import { Container } from "../../_components/Container";
import { Kicker } from "../../_components/Kicker";
import { Button } from "../../_components/Button";
import { StatBlock } from "../../_components/StatBlock";
import { KenteDivider } from "../../_components/KenteDivider";
import { ProductShot } from "../../_components/ProductShot";

export const metadata: Metadata = {
  title: "For diagnostic centres",
  description: "Imaging orders, modality worklist, structured reporting, PACS integration, and patient portal — purpose-built for standalone diagnostic centres and imaging groups.",
};

const capabilities = [
  { code: "ORD", name: "Imaging orders", body: "Referrers order from any Vedge-connected clinic — or walk-ins scan in at reception. The study lands on the modality the same minute." },
  { code: "WRK", name: "Modality worklist", body: "Radiographers see their next study sorted by urgency and modality. Paper worklists retire." },
  { code: "RPT", name: "Structured reports", body: "Template library for X-ray, US, CT, MRI, and mammography. Radiologists edit the last 10% — not rewrite the first 90%." },
  { code: "CRI", name: "Critical findings", body: "Stroke on CT, pneumothorax on CXR, ectopic on US — flagged, time-stamped, and pushed to the referrer within minutes." },
  { code: "PAC", name: "PACS integration", body: "DICOM storage and web viewer built-in. Connect your existing PACS via the HL7 outbound feed — no rip-and-replace." },
  { code: "PDF", name: "Branded PDF reports", body: "Every report exports as a letterhead PDF with study metadata, signing radiologist, and a QR link to the patient portal." },
  { code: "POR", name: "Patient share links", body: "Send a time-boxed link by SMS or email. The patient views their report — and downloads the images if you let them — without creating an account." },
  { code: "TEL", name: "Teleradiology", body: "Overnight coverage by rotating readers. Studies route by modality, subspecialty, or urgency — without a third-party middleman." },
  { code: "NHI", name: "NHIS & private billing", body: "Tariff codes for every modality, pre-authorisation workflow, claim submission the same day the patient leaves." },
];

const workflow = [
  { step: "01", title: "Order arrives", body: "Referring clinic orders a CT abdomen. Appears on your incoming worklist with the clinical indication attached." },
  { step: "02", title: "Reception & prep", body: "Patient arrives. Reception verifies insurance and prints the study armband. Prep instructions print for the radiographer." },
  { step: "03", title: "Study acquired", body: "Modality pushes images into PACS. Study state flips from SCHEDULED to ACQUIRED on the radiologist\u2019s worklist." },
  { step: "04", title: "Report signed", body: "Radiologist opens a template, edits for the specific study, signs. Critical findings page the referrer within seconds." },
  { step: "05", title: "Report delivered", body: "Branded PDF emailed to referrer. Time-boxed share link sent to patient. Claim lodged with their insurer. Done." },
];

export default function DiagnosticCentersPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-ink/15">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Vol. 04 · Diagnostic centres</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                From <span className="italic-display">order</span> to signed <span className="italic-display">report</span>, without paper in between.
              </h1>
              <div className="mt-12 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <p className="reveal reveal-delay-1 max-w-xl font-display text-lg leading-relaxed text-ink/80">
                    Vedge runs the full imaging workflow — orders, modality worklist, DICOM study, structured report, critical-finding page, patient share link, insurer claim — on one backbone. Standalone diagnostic centres, imaging groups, and hospital radiology departments all fit.
                  </p>
                  <div className="reveal reveal-delay-2 mt-10 flex flex-wrap gap-4">
                    <Button href="/contact">Book an imaging demo</Button>
                    <Button href="/pricing#diagnostic" variant="ghost">See imaging pricing</Button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
                  <div className="reveal reveal-delay-2 grid grid-cols-2 gap-y-8">
                    <StatBlock value="9" label="Capabilities" />
                    <StatBlock value="14d" label="Free trial" />
                    <StatBlock value="3" label="Pricing tiers" />
                    <StatBlock value="₵1,200" label="Starts at" />
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
                Nine surfaces. <br /><span className="italic-display">One workflow.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Every imaging surface a standalone centre needs is included from tier one. PACS, HL7, DICOM viewer, and teleradiology unlock as you grow.
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

      {/* ═══════════════ PRODUCT SHOT ═══════════════ */}
      <ProductShot
        kicker="On the worklist"
        title={
          <>
            Orders in, reports out,<br />
            <span className="italic-display">nothing in between.</span>
          </>
        }
        body="Studies land on the modality worklist the moment a referrer orders. Radiographer acquires, PACS syncs, radiologist opens a template, signs — referrer sees the report on their phone before the patient gets home."
        src="/screenshots/web-imaging.png"
        alt="Imaging worklist dashboard showing the Orders and Reports tab structure for inbound studies."
      />

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ WORKFLOW ═══════════════ */}
      <section className="bg-bone-deep py-24 md:py-32">
        <Container>
          <Kicker>A study, end-to-end</Kicker>
          <h2 className="reveal mt-8 font-display text-display max-w-3xl">
            Five steps. <span className="italic-display">No phone tag.</span>
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
              Same day reports, every study. <span className="italic-display">Our referrers started calling us first.</span>
            </p>
            <p className="reveal reveal-delay-2 mt-10 font-mono text-[11px] uppercase tracking-kicker text-ink/60">
              — Consultant radiologist · Kumasi
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
                Fourteen days. <span className="italic-display !text-sun">Every modality.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Start a diagnostic trial and we&rsquo;ll wire your first modality to Vedge within the week. PACS migration and reading-room setup included in the trial — no charge until you&rsquo;re running signed reports.
              </p>
            </div>
            <div className="col-span-12 mt-8 md:col-span-4 md:mt-0 md:flex md:items-end md:justify-end">
              <Button href="/contact" variant="ghost" className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest-deep">
                Start imaging trial
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
