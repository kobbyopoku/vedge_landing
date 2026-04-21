"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * First-visit cookie consent banner. Writes to {@code vedge_consent}
 * cookie and {@code localStorage} — either is enough to suppress the
 * banner on subsequent visits.
 *
 * <p>Strictly-necessary cookies are always on (the Service doesn&rsquo;t
 * work without them); analytics and preference cookies are opt-in.
 * Clearing {@code vedge_consent} re-shows the banner on next visit —
 * that&rsquo;s the documented opt-out path in the Cookie Policy.</p>
 */
const CONSENT_COOKIE = "vedge_consent";
const CONSENT_LOCAL_KEY = "vedge_consent_v1";

type ConsentChoice = {
  analytics: boolean;
  preferences: boolean;
  acceptedAt: string;
};

function persistConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_LOCAL_KEY, JSON.stringify(choice));
  } catch {
    // localStorage can throw in private-browsing mode — the cookie is
    // the backup.
  }
  const encoded = encodeURIComponent(JSON.stringify(choice));
  // 365-day cookie, SameSite=Lax so it survives top-level nav.
  document.cookie = `${CONSENT_COOKIE}=${encoded}; path=/; max-age=31536000; SameSite=Lax`;
}

function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_LOCAL_KEY);
    if (raw) return JSON.parse(raw) as ConsentChoice;
  } catch {
    // fall through to cookie
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`),
  );
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1])) as ConsentChoice;
    } catch {
      return null;
    }
  }
  return null;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only render once mounted on the client — SSR doesn't know the
    // user's prior consent state and would always render the banner.
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  const choose = (analytics: boolean) => {
    persistConsent({
      analytics,
      preferences: true,
      acceptedAt: new Date().toISOString(),
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
      style={{
        backgroundColor: "#FBF7EE",
        border: "1px solid rgba(11, 11, 9, 0.16)",
        boxShadow: "0 8px 24px rgba(11, 11, 9, 0.10)",
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            aria-hidden="true"
            className="block"
            style={{
              width: 20,
              height: 1,
              backgroundColor: "#C8553D",
            }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{
              fontFamily:
                "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
              fontWeight: 500,
              color: "#1B3B2F",
            }}
          >
            Cookie choice
          </span>
        </div>
        <p
          className="text-[14px] leading-[1.6] mb-4"
          style={{ color: "#3A3A35" }}
        >
          We use strictly-necessary cookies to keep you logged in and
          secure. With your consent we also use analytics cookies to
          improve the product. Read the details on our{" "}
          <Link
            href="/legal/cookies"
            className="underline"
            style={{ color: "#0E2319" }}
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => choose(true)}
            className="px-4 py-2 text-[13px] font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#C8553D",
              color: "#F3ECDF",
              border: "1px solid #C8553D",
              letterSpacing: "0.02em",
            }}
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="px-4 py-2 text-[13px] transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "transparent",
              color: "#0E2319",
              border: "1px solid rgba(11, 11, 9, 0.24)",
            }}
          >
            Necessary only
          </button>
        </div>
      </div>
    </div>
  );
}
