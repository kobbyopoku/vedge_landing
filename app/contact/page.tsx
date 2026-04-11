import type { Metadata } from "next";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & demo",
  description: "Book a live walk-through with the Vedge team, or tell us what you need.",
};

const offices = [
  {
    city: "Accra",
    address: "14 Ring Road East, Accra, Ghana",
    phone: "+233 30 000 0000",
    hours: "Mon — Sat · 08:00 — 19:00 GMT",
  },
  {
    city: "Takoradi",
    address: "Beach Road · Takoradi · Western Region",
    phone: "+233 31 000 0000",
    hours: "Mon — Fri · 09:00 — 18:00 GMT",
  },
  {
    city: "Lagos",
    address: "Lekki Phase I · Lagos State · Nigeria",
    phone: "+234 1 000 0000",
    hours: "Mon — Fri · 09:00 — 18:00 WAT",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="border-b border-ink/15">
        <Container className="pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2">
              <Kicker>Correspondence</Kicker>
            </div>
            <div className="col-span-12 md:col-span-10">
              <h1 className="reveal font-display text-hero max-w-5xl">
                Tell us about your <span className="italic-display">ward, bench,</span> or <span className="italic-display">counter.</span>
              </h1>
              <p className="reveal reveal-delay-1 mt-10 max-w-xl font-display text-xl text-ink/80 leading-snug">
                We read every message within one working day. Include the facility name, the size of your team, and what you run today. The more you tell us, the faster we can respond with something useful.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ FORM + OFFICES ═══════════════ */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 md:col-span-7">
              <ContactForm />
            </div>

            <aside className="col-span-12 md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
              <Kicker>Or find us</Kicker>
              <ul className="mt-10 space-y-12">
                {offices.map((o, i) => (
                  <li key={o.city} className="reveal border-t border-ink/15 pt-8" style={{ transitionDelay: `${0.08 * i}s` }}>
                    <h2 className="font-display text-3xl">{o.city}</h2>
                    <div className="mt-4 space-y-2 text-ink/75">
                      <div>{o.address}</div>
                      <div>{o.phone}</div>
                      <div className="font-mono text-[10px] uppercase tracking-kicker text-ink/55">{o.hours}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
