import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LEGAL_PAGES,
} from "@/app/_components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Legal · Vedge",
  description:
    "Every Vedge legal policy and notice — privacy, terms, data protection, security, and the rest.",
};

/**
 * Hub page that lists every legal surface on the site with a short
 * one-liner each. Anyone landing on {@code /legal} directly — from a
 * sitemap, a press query, or a procurement crawl — gets the full
 * catalogue in one place.
 */
const SUMMARIES: Record<string, string> = {
  "/legal/privacy":
    "How we collect, process, and protect personal data across tenants and patients.",
  "/legal/terms":
    "Binding agreement between Vedge and subscribing healthcare organisations.",
  "/legal/dpa":
    "Data Processing Agreement annexed to every tenant subscription.",
  "/legal/patient-privacy":
    "Plain-language notice for patients whose data passes through Vedge.",
  "/legal/acceptable-use":
    "What tenants and users may and may not do on the platform.",
  "/legal/cookies": "Cookies and similar tech used on Vedge sites.",
  "/legal/security":
    "The technical and organisational measures we apply to protect data.",
  "/legal/compliance":
    "Our posture towards HEFRA, NHIA, MoH, the councils, and CSA.",
  "/legal/ai":
    "How Vedge uses AI — scope, guard-rails, and clinical responsibility.",
  "/legal/sub-processors":
    "The authoritative list of third parties Vedge engages.",
  "/legal/sla": "Uptime commitment and service credits.",
  "/legal/refund":
    "Billing cycle, failed-payment grace, refund rules, and chargebacks.",
  "/legal/regional-annexes":
    "Country-specific overrides for Nigeria, Kenya, and South Africa.",
};

export default function LegalHubPage() {
  return (
    <LegalPageLayout
      kicker="Catalogue"
      title="Legal + compliance"
      intro={<>
        Every Vedge legal policy in one place. Each page has a stable,
        canonical URL under {`/legal/…`} — safe to link to from
        contracts, procurement documents, or press kits.
      </>}
    >
      <ul className="space-y-5">
        {LEGAL_PAGES.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="block group"
              style={{
                padding: "16px 20px",
                backgroundColor: "#FBF7EE",
                border: "1px solid rgba(11, 11, 9, 0.12)",
                transition: "border-color 150ms",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="text-[18px] leading-[1.3] mb-1"
                    style={{
                      fontFamily:
                        "var(--font-display), Georgia, 'Times New Roman', serif",
                      color: "#0E2319",
                    }}
                  >
                    {p.label}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.55]"
                    style={{ color: "#3A3A35" }}
                  >
                    {SUMMARIES[p.href] ?? ""}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="shrink-0 pt-1 opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#C8553D" }}
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </LegalPageLayout>
  );
}
