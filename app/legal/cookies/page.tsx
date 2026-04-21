import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
} from "@/app/_components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy · Vedge",
  description: "What cookies and similar technologies Vedge uses.",
};

const TOC = [
  { id: "what", label: "1. What cookies are" },
  { id: "categories", label: "2. Categories we use" },
  { id: "table", label: "3. Cookie table" },
  { id: "consent", label: "4. Consent + withdrawal" },
  { id: "third-party", label: "5. Third-party cookies" },
];

type Cookie = {
  name: string;
  purpose: string;
  duration: string;
  category: "strictly-necessary" | "analytics" | "preference";
  firstOrThird: "first" | "third";
};

const COOKIES: readonly Cookie[] = [
  {
    name: "vedge_session",
    purpose: "Keeps you logged in across pages",
    duration: "Session",
    category: "strictly-necessary",
    firstOrThird: "first",
  },
  {
    name: "vedge_refresh_token",
    purpose: "Renews your session without forcing re-login",
    duration: "7 days",
    category: "strictly-necessary",
    firstOrThird: "first",
  },
  {
    name: "vedge_csrf",
    purpose: "Prevents cross-site request forgery on forms",
    duration: "Session",
    category: "strictly-necessary",
    firstOrThird: "first",
  },
  {
    name: "vedge_theme",
    purpose: "Remembers your light / dark theme preference",
    duration: "1 year",
    category: "preference",
    firstOrThird: "first",
  },
  {
    name: "vedge_consent",
    purpose: "Records your cookie-consent choices",
    duration: "1 year",
    category: "strictly-necessary",
    firstOrThird: "first",
  },
  {
    name: "_ph_*",
    purpose: "PostHog product analytics (only when consented)",
    duration: "1 year",
    category: "analytics",
    firstOrThird: "third",
  },
];

const CATEGORY_LABEL: Record<Cookie["category"], string> = {
  "strictly-necessary": "Strictly necessary",
  analytics: "Analytics",
  preference: "Preference",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      kicker="Cookies"
      title="Cookie Policy"
      toc={TOC}
      intro={
        <>
          This page explains the cookies and similar technologies Vedge
          uses on {`https://tryvedge.com`} and{" "}
          {`https://app.tryvedge.com`}. Our general data practices are
          in the <Link href="/legal/privacy">Privacy Policy</Link>.
        </>
      }
    >
      <LegalSection id="what" title="1. What cookies are">
        <p>
          A cookie is a small text file that a website places on your
          device to remember information between visits. Similar
          technologies include local storage, session storage, and
          pixel trackers — we refer to all of them as &ldquo;cookies&rdquo;
          in this policy for brevity.
        </p>
      </LegalSection>

      <LegalSection id="categories" title="2. Categories we use">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Strictly necessary</strong> — required for the
            Service to function. Cannot be disabled without breaking
            login or security.
          </li>
          <li>
            <strong>Preference</strong> — remember small UI choices
            like theme. Easy to live without, convenient to have.
          </li>
          <li>
            <strong>Analytics</strong> — anonymous usage telemetry
            that helps us improve the product. Only set after you
            consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="table" title="3. Cookie table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-[11px] uppercase tracking-[0.18em]"
                style={{
                  fontFamily:
                    "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
                  color: "#847567",
                  borderBottom: "1px solid rgba(11, 11, 9, 0.12)",
                }}
              >
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Purpose</th>
                <th className="py-3 pr-4 font-medium">Duration</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">First/Third</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr
                  key={c.name}
                  style={{ borderBottom: "1px solid rgba(11, 11, 9, 0.06)" }}
                >
                  <td
                    className="py-3 pr-4 font-mono text-xs"
                    style={{ color: "#0B0B09" }}
                  >
                    {c.name}
                  </td>
                  <td className="py-3 pr-4">{c.purpose}</td>
                  <td className="py-3 pr-4 tabular-nums">{c.duration}</td>
                  <td className="py-3 pr-4">{CATEGORY_LABEL[c.category]}</td>
                  <td className="py-3 pr-4 capitalize">{c.firstOrThird}-party</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="consent" title="4. Consent + withdrawal">
        <p>
          The first time you visit a Vedge site we show a consent
          banner. Strictly-necessary cookies are always on
          (you can&rsquo;t use the Service without them); analytics and
          preference cookies are off by default and set only if you
          consent.
        </p>
        <p>
          You can change your choices at any time via the{" "}
          &ldquo;Cookie settings&rdquo; link in the site footer or by
          clearing the <code>vedge_consent</code> cookie in your
          browser, which re-shows the banner on next visit.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="5. Third-party cookies">
        <p>
          When consented, PostHog serves analytics cookies under its own
          privacy terms. Payment processors (Paystack / Flutterwave /
          Stripe) set cookies on their hosted checkout pages as required
          for fraud prevention; those cookies are subject to their own
          privacy notices and are outside Vedge&rsquo;s control.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
