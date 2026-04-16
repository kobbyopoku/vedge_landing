import Link from "next/link";
import { Container } from "./Container";
import { nav, isGroup, type NavItem, type NavGroup, type NavLeaf } from "../_data/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5177";

/**
 * Editorial header — thin top rule, three-column lockup (logo / nav / CTA).
 *
 * Desktop: dropdowns open on hover/focus via CSS group-hover. Mobile: a
 * single <details> disclosure that reveals the whole nav tree. Server
 * Component throughout — no client JS needed for the menu.
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
            <NavItemView key={item.label} item={item} />
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
          <div className="absolute right-0 top-10 flex w-72 flex-col gap-4 border border-ink/15 bg-bone p-5 shadow-[8px_8px_0_0_rgba(11,11,9,0.9)]">
            {nav.map((item) => (
              <MobileNavItem key={item.label} item={item} />
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

// ── Desktop nav item ────────────────────────────────────────────────────

function NavItemView({ item }: { item: NavItem }) {
  if (!isGroup(item)) {
    return (
      <Link
        href={item.href}
        className="link-grow font-mono text-[11px] uppercase tracking-kicker text-ink/80 hover:text-ink"
      >
        {item.label}
      </Link>
    );
  }
  return <DropdownView group={item} />;
}

function DropdownView({ group }: { group: NavGroup }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="link-grow flex items-center gap-1 font-mono text-[11px] uppercase tracking-kicker text-ink/80 hover:text-ink focus:text-ink focus:outline-none"
        aria-haspopup="true"
      >
        {group.label}
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/*
        Invisible bridge (pt-5) so hover doesn't drop when the cursor travels
        from the trigger to the panel. Panel is opacity-0 + pointer-events-
        none when closed so it doesn't steal clicks or focus.
      */}
      <div className="pointer-events-none absolute left-1/2 top-full z-40 -translate-x-1/2 translate-y-1 pt-5 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="w-[360px] border border-ink/15 bg-bone p-6 shadow-[8px_8px_0_0_rgba(11,11,9,0.9)]">
          <ul className="flex flex-col gap-4">
            {group.children.map((child) => (
              <li key={child.href}>
                <DropdownLeaf leaf={child} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DropdownLeaf({ leaf }: { leaf: NavLeaf }) {
  return (
    <Link
      href={leaf.href}
      className="group/leaf block border-b border-transparent pb-3 transition-colors hover:border-ink/15 focus:outline-none focus:border-ink/40"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-base text-ink">{leaf.label}</span>
        <span className="inline-block h-px w-4 bg-ink/40 transition-all duration-300 group-hover/leaf:w-8" />
      </div>
      {leaf.description ? (
        <p className="mt-1 font-mono text-[11px] leading-snug tracking-wide text-ink/60">
          {leaf.description}
        </p>
      ) : null}
    </Link>
  );
}

// ── Mobile nav item ─────────────────────────────────────────────────────

function MobileNavItem({ item }: { item: NavItem }) {
  if (!isGroup(item)) {
    return (
      <Link
        href={item.href}
        className="font-mono text-[11px] uppercase tracking-kicker text-ink"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <details className="group/sub">
      <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] uppercase tracking-kicker text-ink">
        {item.label}
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 transition-transform duration-300 group-open/sub:rotate-180"
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <ul className="mt-3 ml-3 flex flex-col gap-3 border-l border-ink/10 pl-3">
        {item.children.map((child) => (
          <li key={child.href}>
            <Link href={child.href} className="block font-display text-[15px] text-ink">
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
