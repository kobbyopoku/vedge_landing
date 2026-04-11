import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { Button } from "../_components/Button";
import { KenteDivider } from "../_components/KenteDivider";

export const metadata: Metadata = {
  title: "About",
  description: "Why Vedge exists, who builds it, and what we believe about healthcare software in West Africa.",
};

const principles = [
  {
    num: "i.",
    title: "Software that respects the ward.",
    body: "A nurse on a night shift is the most important user in the building. Every screen we ship is tested against the reality of a 02:00 round, not a product demo at noon.",
  },
  {
    num: "ii.",
    title: "Local by default, never by afterthought.",
    body: "We are built in Accra, priced in cedis, designed for NHIS. International hospitals can use Vedge, but they are the guest \u2014 not the customer we optimise for.",
  },
  {
    num: "iii.",
    title: "Privacy is a prerequisite, not a premium.",
    body: "Every organisation gets tenant isolation, encrypted at rest, audited by default. We don\u2019t have a \u201csecurity plan\u201d \u2014 we have one security posture and it applies to everyone.",
  },
  {
    num: "iv.",
    title: "Honest with the P&L.",
    body: "If a hospital is on the wrong tier, we\u2019ll tell them. If we\u2019re not the right fit, we\u2019ll say so. Trust is a longer game than the quarter.",
  },
];

const team = [
  { name: "The clinical council", role: "Doctors, nurses, pharmacists, and lab directors who advise on every release.", loc: "Accra · Kumasi · Lagos" },
  { name: "The engineering bench", role: "A small team of senior engineers writing Spring Boot, React, and PostgreSQL.", loc: "Accra · Cape Coast · Remote" },
  { name: "The design desk", role: "One design lead and two product designers obsessed with density and legibility.", loc: "Accra" },
  { name: "The implementation crew", role: "Field deployment specialists who travel with a laptop and a network cable.", loc: "Across Ghana" },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="border-b border-ink/15">
        <Container className="pt-20 pb-24 md:pt-28 md:pb-36">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Colophon</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero max-w-5xl">
                We started Vedge because <span className="italic-display">no one else was going to.</span>
              </h1>
              <p className="reveal reveal-delay-1 mt-10 max-w-2xl font-display text-xl text-ink/80 leading-snug">
                West African healthcare runs on paper folders, Excel workbooks, and good faith. The tools we inherited from Western vendors were not built for our wards, our rhythms, or our P&amp;L. So we built one that is.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ MANIFESTO / PRINCIPLES ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <Kicker>Four principles</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                What we believe, <br /><span className="italic-display">in four lines.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                This is the short version of our manifesto. It fits on one page on purpose. A longer document is available to partners on request.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <dl className="border-t border-ink/20">
                {principles.map((p, i) => (
                  <div
                    key={p.num}
                    className="reveal grid grid-cols-[auto_1fr] gap-8 border-b border-ink/15 py-10"
                    style={{ transitionDelay: `${0.08 * i}s` }}
                  >
                    <dt className="font-display text-3xl italic text-forest">{p.num}</dt>
                    <div>
                      <div className="font-display text-2xl leading-snug">{p.title}</div>
                      <dd className="mt-3 max-w-xl text-ink/75">{p.body}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <KenteDivider className="bg-bone-deep py-4" />

      {/* ═══════════════ TEAM ═══════════════ */}
      <section id="careers" className="bg-bone-deep py-24 md:py-32">
        <Container>
          <Kicker>Who builds Vedge</Kicker>
          <h2 className="reveal mt-6 font-display text-display max-w-3xl">
            A small team, on purpose. <span className="italic-display">A long bench.</span>
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
            {team.map((t, i) => (
              <div
                key={t.name}
                className="reveal border-t border-ink/20 pt-8"
                style={{ transitionDelay: `${0.1 * i}s` }}
              >
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-3 text-ink/75">{t.role}</p>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-kicker text-ink/55">{t.loc}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ SECURITY BLOCK ═══════════════ */}
      <section id="security" className="border-t border-ink/15 py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <Kicker>Security &amp; compliance</Kicker>
              <h2 className="reveal mt-6 font-display text-display">
                Patient privacy <span className="italic-display">is a floor,</span> not a ceiling.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <ul className="space-y-8 border-t border-ink/20 pt-8">
                <li className="reveal">
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">Data residency</div>
                  <h3 className="mt-2 font-display text-xl">Hosted in-country.</h3>
                  <p className="mt-2 text-ink/70 max-w-xl">Patient records stay in Ghana. We run primary infrastructure on local cloud regions with same-country backups.</p>
                </li>
                <li className="reveal reveal-delay-1">
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">Encryption</div>
                  <h3 className="mt-2 font-display text-xl">AES-256 at rest. TLS 1.3 in transit.</h3>
                  <p className="mt-2 text-ink/70 max-w-xl">Every organisation has its own encryption context. Master keys rotate on a fixed schedule.</p>
                </li>
                <li className="reveal reveal-delay-2">
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">Audit</div>
                  <h3 className="mt-2 font-display text-xl">Every action logged. Every login traced.</h3>
                  <p className="mt-2 text-ink/70 max-w-xl">When a regulator or an auditor asks who touched a record, we can show them the answer in seconds.</p>
                </li>
                <li className="reveal reveal-delay-3">
                  <div className="font-mono text-[10px] uppercase tracking-kicker text-clay">Standards</div>
                  <h3 className="mt-2 font-display text-xl">HL7, FHIR, ICD-10, LOINC.</h3>
                  <p className="mt-2 text-ink/70 max-w-xl">We speak the standards so you can exchange data with any partner, regulator, or referral network.</p>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="bg-forest-deep text-bone">
        <Container className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Kicker className="justify-center !text-sun">Join the work</Kicker>
            <h2 className="reveal mt-8 font-display text-hero text-bone">
              Build healthcare software that <span className="italic-display !text-sun">actually gets used.</span>
            </h2>
            <p className="reveal reveal-delay-1 mx-auto mt-6 max-w-xl text-bone/75">
              We hire clinicians, engineers, designers, and field specialists. If you want to spend your career building something that matters within an hour of where you grew up, write to us.
            </p>
            <div className="reveal reveal-delay-2 mt-12 flex justify-center gap-4">
              <Button href="/contact" variant="ghost" className="!border-bone/40 !text-bone hover:!bg-bone hover:!text-forest-deep">
                careers@vedge.health
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
