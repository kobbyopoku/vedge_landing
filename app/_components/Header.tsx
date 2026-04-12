import Link from "next/link";
import { Container } from "./Container";

const nav = [
  { label: "Hospitals", href: "/hospitals" },
  { label: "Labs", href: "/laboratories" },
  { label: "Pharmacies", href: "/pharmacies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Partners", href: "/partners" },
];

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5177";

/**
 * Editorial header — thin top rule, three-column lockup (logo / nav / CTA).
 * On mobile the nav collapses to a CSS-only details/summary disclosure so we
 * keep the whole layout as a Server Component (no client JS).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-bone/85 backdrop-blur supports-[backdrop-filter]:bg-bone/70">
      <Container as="div" className="flex items-center justify-between py-5">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Vedge home">
          <span className="font-display text-2xl tracking-tight">vedge</span>
          <span className="h-2 w-2 translate-y-[-4px] bg-clay transition-transform duration-500 group-hover:rotate-45" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex lg:gap-9">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-grow font-mono text-[11px] uppercase tracking-kicker text-ink/80 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href={`${appUrl}/login`}
            className="font-mono text-[11px] uppercase tracking-kicker text-ink/70 hover:text-ink transition-colors"
          >
            Sign in
          </a>
          <a
            href={`${appUrl}/register`}
            className="group inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 font-mono text-[11px] uppercase tracking-kicker text-bone transition-colors hover:bg-forest/90"
          >
            Start free
            <span className="inline-block h-px w-6 bg-bone/60 transition-all duration-500 group-hover:w-10" />
          </a>
        </div>

        {/* Mobile disclosure — CSS-only via <details> */}
        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-kicker text-ink">
            Menu
          </summary>
          <div className="absolute right-0 top-10 flex w-56 flex-col gap-4 border border-ink/15 bg-bone p-5 shadow-[8px_8px_0_0_rgba(11,11,9,0.9)]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] uppercase tracking-kicker text-ink"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`${appUrl}/login`}
              className="mt-2 border-t border-ink/15 pt-3 font-mono text-[11px] uppercase tracking-kicker text-ink/70"
            >
              Sign in
            </a>
            <a
              href={`${appUrl}/register`}
              className="font-mono text-[11px] uppercase tracking-kicker text-clay"
            >
              Start free →
            </a>
          </div>
        </details>
      </Container>
    </header>
  );
}
