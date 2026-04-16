import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { KenteDivider } from "../_components/KenteDivider";
import { DesignPartnerForm } from "./DesignPartnerForm";

export const metadata: Metadata = {
  title: "Design partners",
  description: "A twelve-month free programme for forty African facilities — ten hospitals, ten clinics, ten laboratories, and ten pharmacies — willing to shape Vedge from the inside.",
};

const benefits = [
  {
    num: "01",
    title: "Twelve months on us.",
    body: "Your facility runs on Vedge for a full year at zero cost. Every module, every seat, every branch. When the year ends you choose whether to continue — no auto-renewals, no surprises.",
  },
  {
    num: "02",
    title: "A direct line to the team.",
    body: "A dedicated Slack channel, a shared document library, and weekly thirty-minute calls with the engineers who actually write the code. You ask; we build; you test.",
  },
  {
    num: "03",
    title: "Influence the roadmap.",
    body: "Design partner requests go to the top of the queue. If you need something that isn\u2019t in the product yet, we either build it or tell you why we won\u2019t — before the quarter ends.",
  },
  {
    num: "04",
    title: "Early access to everything.",
    body: "New modules land in your facility first. You break them, we fix them, everyone else gets the stable version six weeks later.",
  },
  {
    num: "05",
    title: "Co-authored case study.",
    body: "At month twelve we publish a joint case study — the problems you started with, the numbers you moved, the lessons we both learned. Your choice whether to use your real name.",
  },
];

const expectations = [
  {
    num: "i.",
    title: "Thirty minutes a week.",
    body: "One thirty-minute session on a day that suits you. Cancel freely when the wards are under pressure; we\u2019ll reschedule without drama.",
  },
  {
    num: "ii.",
    title: "Honest feedback.",
    body: "If Vedge is slow, broken, ugly, or wrong for your workflow — we need to know first, not last. We\u2019re here to fix it, not to defend it.",
  },
  {
    num: "iii.",
    title: "One case study at month twelve.",
    body: "A 60-minute interview, a few screenshots, and your permission to publish the result. That\u2019s the entire marketing ask.",
  },
  {
    num: "iv.",
    title: "Logo usage.",
    body: "Permission to list your facility as a design partner on this website. Anonymised if you prefer — we won\u2019t push back.",
  },
];

const whoWeNeed = [
  { label: "Hospitals", target: "10", detail: "A deliberate mix: district hospitals, private groups, mission-run, teaching, and speciality centres (women\u2019s, paediatric, oncology). Ideally at least one of each archetype." },
  { label: "Clinics", target: "10", detail: "Out-patient clinics with at least two clinicians \u2014 one of whom is willing to run the digital chart themselves. Urban and rural, public and private." },
  { label: "Laboratories", target: "10", detail: "A blend of standalone diagnostic labs and hospital-attached reference labs. At least half should be running automated analysers, and QC workflows must be real, not theoretical." },
  { label: "Pharmacies", target: "10", detail: "Single-counter community pharmacies, growing 2-3 counter operators, and at least two chains of five or more branches. Mix of urban, peri-urban, and rural." },
];

export default function PartnersPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-ink/15 bg-bone">
        <div className="grain absolute inset-0" />
        <Container className="relative z-10 pt-20 pb-24 md:pt-28 md:pb-36">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Programme · 2026</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero">
                Forty facilities. <span className="italic-display">Ten of each.</span> <br />
                Twelve months. <span className="italic-display">Zero invoice.</span>
              </h1>
              <p className="reveal reveal-delay-1 mt-10 max-w-2xl font-display text-xl text-ink/80 leading-snug">
                The Vedge Design Partner programme. A twelve-month free deployment for fifty African healthcare facilities — across hospitals, clinics, laboratories, pharmacies, and diagnostic centres — willing to build the product with us, on camera, on the ward, on the record.
              </p>

              {/* The shape of the deal, in four numbers */}
              <dl className="reveal reveal-delay-2 mt-14 grid grid-cols-2 gap-y-10 border-t border-ink/20 pt-10 md:grid-cols-4">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Partners</dt>
                  <dd className="mt-2 font-display text-4xl">50</dd>
                  <p className="mt-2 max-w-[12rem] text-xs text-ink/65">Across hospitals, clinics, labs, pharmacies, and diagnostic centres.</p>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Duration</dt>
                  <dd className="mt-2 font-display text-4xl">12 mo</dd>
                  <p className="mt-2 max-w-[12rem] text-xs text-ink/65">Full access starting the day your data is migrated.</p>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Cost</dt>
                  <dd className="mt-2 font-display text-4xl">₵0</dd>
                  <p className="mt-2 max-w-[12rem] text-xs text-ink/65">All modules, all users, all branches, migration included.</p>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">Ask</dt>
                  <dd className="mt-2 font-display text-4xl">30 min/wk</dd>
                  <p className="mt-2 max-w-[12rem] text-xs text-ink/65">A weekly feedback session plus one case study at month twelve.</p>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ WHAT YOU GET ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>What you get</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Five benefits. <br /><span className="italic-display">All in writing.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                Everything here is written into your design partner agreement before you sign. Nothing is implied and nothing is conditional.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <dl className="border-t border-ink/20">
                {benefits.map((b, i) => (
                  <div
                    key={b.num}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-b border-ink/15 py-10"
                    style={{ transitionDelay: `${0.08 * i}s` }}
                  >
                    <dt className="font-mono text-sm text-clay">{b.num}</dt>
                    <div>
                      <div className="font-display text-2xl leading-snug">{b.title}</div>
                      <dd className="mt-3 max-w-xl text-ink/75">{b.body}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ WHAT WE ASK ═══════════════ */}
      <section className="bg-bone-deep py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>What we ask</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Four things. <br /><span className="italic-display">No fine print.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                A design partnership is a two-way contract. Here is the full list of what we need from you, in exchange for everything on the previous page.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <dl className="border-t border-ink/20">
                {expectations.map((e, i) => (
                  <div
                    key={e.num}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-b border-ink/15 py-10"
                    style={{ transitionDelay: `${0.08 * i}s` }}
                  >
                    <dt className="font-display text-2xl italic text-forest">{e.num}</dt>
                    <div>
                      <div className="font-display text-2xl leading-snug">{e.title}</div>
                      <dd className="mt-3 max-w-xl text-ink/75">{e.body}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ WHO WE NEED ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <Kicker>Who we need</Kicker>
          <h2 className="reveal mt-6 font-display text-display max-w-3xl">
            The shape of the <span className="italic-display">ideal forty.</span>
          </h2>
          <p className="reveal reveal-delay-1 mt-6 max-w-xl text-ink/70">
            Design partners aren&rsquo;t first-come, first-served. We want a deliberate mix that gives us signal across verticals, facility sizes, and ownership models.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whoWeNeed.map((w, i) => (
              <div
                key={w.label}
                className="reveal border-t border-ink/20 pt-6"
                style={{ transitionDelay: `${0.1 * i}s` }}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{w.label}</h3>
                  <span className="font-display text-3xl text-clay">{w.target}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{w.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ APPLICATION FORM ═══════════════ */}
      <section id="apply" className="border-t border-ink/15 bg-forest-deep py-24 text-bone md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker className="!text-sun">Apply</Kicker>
              <h2 className="reveal mt-8 font-display text-hero text-bone">
                Tell us about your <span className="italic-display !text-sun">facility.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-bone/75">
                Forty slots — ten per vertical. Rolling basis. We read every application within two working days and reply to every applicant — yes or no — before the end of the same week.
              </p>

              <div className="mt-14 border-t border-bone/15 pt-6">
                <div className="font-mono text-[10px] uppercase tracking-kicker text-sun">Already talking to us?</div>
                <p className="mt-3 text-sm text-bone/75">
                  If you&rsquo;ve been in touch with the Vedge team, mention the name of who you spoke to in the &ldquo;what you want to solve&rdquo; field so we can stitch your application into the conversation.
                </p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-8 md:border-l md:border-bone/15 md:pl-10">
              <DesignPartnerForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
