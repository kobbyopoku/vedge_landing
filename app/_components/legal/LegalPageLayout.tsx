import Link from "next/link";
import React from "react";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

/**
 * Shared chrome for every page under {@code /legal/*}. Renders inside
 * the site&rsquo;s global {@code <Header />} and {@code <Footer />}
 * from the root layout — so we don&rsquo;t duplicate the brand wordmark
 * here; we just give the legal pages a consistent editorial body:
 * big Fraunces title, "last updated / version" strip, sticky TOC
 * sidebar, and a cross-link footer.
 *
 * <p>Uses inline styles for the Vedge palette where Tailwind tokens
 * don&rsquo;t carry the brand hexes — same approach as the
 * transactional-email templates so one visual language carries
 * through every patient / tenant touch point.</p>
 */
export function LegalPageLayout({
  kicker,
  title,
  intro,
  toc,
  children,
}: {
  /** Small-caps label above the title (e.g. "Privacy"). */
  kicker: string;
  /** Page H1 — Fraunces display type. */
  title: string;
  /** Optional lede shown under the title + metadata strip. */
  intro?: React.ReactNode;
  /** Section IDs + labels for the sticky sidebar table of contents. */
  toc?: readonly { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[60vh]"
      style={{
        backgroundColor: "#F3ECDF",
        color: "#0B0B09",
        fontFamily:
          "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <article className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
          <div className="min-w-0">
            {/* ── Title block ───────────────────────────────────── */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span
                  aria-hidden="true"
                  className="block"
                  style={{
                    width: 24,
                    height: 1,
                    backgroundColor: "#C8553D",
                  }}
                />
                <span
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{
                    fontFamily:
                      "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
                    fontWeight: 500,
                    color: "#1B3B2F",
                  }}
                >
                  {kicker}
                </span>
              </div>
              <h1
                className="text-[40px] md:text-[52px] leading-[1.05] tracking-[-0.025em] mb-6"
                style={{
                  fontFamily:
                    "var(--font-display), Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
                  color: "#0E2319",
                }}
              >
                {title}
              </h1>

              <div
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.18em]"
                style={{
                  fontFamily:
                    "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
                  color: "#847567",
                }}
              >
                <span>Last updated · {LEGAL_CONFIG.lastUpdated}</span>
                <span>Version · {LEGAL_CONFIG.policyVersion}</span>
                <span>Governing law · {LEGAL_CONFIG.governingLaw}</span>
              </div>

              {intro && (
                <div
                  className="mt-8 text-[17px] leading-[1.7]"
                  style={{ color: "#3A3A35" }}
                >
                  {intro}
                </div>
              )}
            </div>

            {/* ── Body ─────────────────────────────────────────── */}
            <div
              className="legal-body space-y-10 text-[15px] leading-[1.75]"
              style={{ color: "#3A3A35" }}
            >
              {children}
            </div>

            {/* ── Cross-link footer ────────────────────────────── */}
            <LegalFooterNav />
          </div>

          {/* ── Sticky TOC (desktop only) ─────────────────────── */}
          {toc && toc.length > 0 && (
            <aside className="hidden lg:block">
              <nav
                className="sticky top-10 text-sm"
                aria-label="On this page"
              >
                <p
                  className="text-[10px] uppercase tracking-[0.22em] mb-3"
                  style={{
                    fontFamily:
                      "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
                    color: "#847567",
                  }}
                >
                  On this page
                </p>
                <ul className="space-y-1.5">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block py-0.5 hover:underline"
                        style={{ color: "#3A3A35" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}

export const LEGAL_PAGES: readonly { href: string; label: string }[] = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/dpa", label: "Data Processing Agreement" },
  { href: "/legal/patient-privacy", label: "Patient Privacy Notice" },
  { href: "/legal/acceptable-use", label: "Acceptable Use" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/security", label: "Security" },
  { href: "/legal/compliance", label: "Compliance" },
  { href: "/legal/ai", label: "Responsible AI" },
  { href: "/legal/sub-processors", label: "Sub-processors" },
  { href: "/legal/sla", label: "Service Level" },
  { href: "/legal/refund", label: "Billing & Refunds" },
  { href: "/legal/regional-annexes", label: "Regional Annexes" },
] as const;

function LegalFooterNav() {
  return (
    <footer
      className="mt-16 pt-8"
      style={{ borderTop: "1px solid rgba(11, 11, 9, 0.12)" }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.22em] mb-4"
        style={{
          fontFamily:
            "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
          color: "#847567",
        }}
      >
        More legal pages
      </p>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
        {LEGAL_PAGES.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="hover:underline"
              style={{ color: "#1B3B2F" }}
            >
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
      <p
        className="mt-8 text-[12px] italic"
        style={{
          fontFamily:
            "var(--font-display), Georgia, 'Times New Roman', serif",
          color: "#847567",
        }}
      >
        Questions? Write to {LEGAL_CONFIG.legalEmail} or the DPO at{" "}
        {LEGAL_CONFIG.dpoEmail}.
      </p>
    </footer>
  );
}

/** H2 section header matched to the page's editorial style. */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-10">
      <h2
        className="text-[26px] leading-[1.2] tracking-[-0.015em] mb-4"
        style={{
          fontFamily: "var(--font-display), Georgia, 'Times New Roman', serif",
          fontWeight: 400,
          color: "#0E2319",
        }}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** Highlighted callout for regulator citations / review placeholders. */
export function LegalCallout({
  variant = "info",
  children,
}: {
  variant?: "info" | "warning" | "review";
  children: React.ReactNode;
}) {
  const palette = {
    info: { bg: "#FBF7EE", border: "rgba(11, 11, 9, 0.12)", accent: "#1B3B2F" },
    warning: { bg: "#FEF9E7", border: "#F0C977", accent: "#8A6A1A" },
    review: { bg: "#FCE7E3", border: "#C8553D", accent: "#8A2D1E" },
  }[variant];

  return (
    <div
      className="px-5 py-4 text-[14px] leading-[1.65]"
      style={{
        backgroundColor: palette.bg,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${palette.accent}`,
      }}
      role={variant === "review" ? "alert" : undefined}
    >
      {children}
    </div>
  );
}
