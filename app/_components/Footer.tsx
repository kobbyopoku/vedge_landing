import Link from "next/link";
import { Container } from "./Container";
import { KenteDivider } from "./KenteDivider";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Hospitals", href: "/hospitals" },
      { label: "Laboratories", href: "/laboratories" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security & compliance", href: "/about#security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about#careers" },
      { label: "Press", href: "/contact" },
    ],
  },
  {
    title: "Offices",
    links: [
      { label: "Accra, Ghana", href: "/contact" },
      { label: "Takoradi, Ghana", href: "/contact" },
      { label: "Lagos, Nigeria", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 bg-forest-deep text-bone">
      <KenteDivider className="border-y border-bone/10 bg-forest-deep" />
      <Container as="div" className="py-20">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-baseline gap-2" aria-label="Vedge home">
              <span className="font-display text-4xl text-bone">vedge</span>
              <span className="h-2 w-2 translate-y-[-6px] bg-clay" />
            </Link>
            <p className="mt-6 max-w-sm font-display text-[1.35rem] leading-snug text-bone/80">
              A hospital operating system <span className="italic-display !text-sun">built for West Africa</span> — from the wards of Ridge to the bush clinics of the North.
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-kicker text-bone/50">
              © {new Date().getFullYear()} Vedge Health Systems Ltd.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] uppercase tracking-kicker text-sun">
                {col.title}
              </p>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-grow font-display text-lg text-bone/90 hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-bone/15 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-kicker text-bone/55">
            Ring road east · Accra · Ghana
          </p>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-kicker text-bone/55">
            <Link href="/contact" className="link-grow hover:text-bone">hello@vedge.health</Link>
            <span>·</span>
            <Link href="/contact" className="link-grow hover:text-bone">+233 30 000 0000</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
