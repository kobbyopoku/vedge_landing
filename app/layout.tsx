import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { LEGAL_CONFIG } from "./_lib/legal/config";
import "./globals.css";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { RevealMount } from "./_components/RevealMount";
import { BROWSER_SUPPORT_SCRIPT } from "./_components/browserSupport";
import { CookieBanner } from "./_components/legal/CookieBanner";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base for og:image and twitter:image URLs. Without it, crawlers
  // on a preview deploy get the preview host, and locally they get nothing.
  metadataBase: new URL(LEGAL_CONFIG.urls.marketing),
  title: {
    default: "Vedge — A health operating system built for Africa",
    template: "%s · Vedge",
  },
  description:
    "Vedge is an end-to-end health operating system for hospitals, clinics, laboratories, pharmacies, and patients across Africa. Built for every insurer your patients carry — NHIS, private, and corporate plans — and the way care actually runs on the floor.",
  keywords: [
    "healthcare software Africa",
    "hospital management system",
    "EHR Africa",
    "insurance claims",
    "NHIS",
    "private health insurance",
    "laboratory information system",
    "pharmacy management",
    "Vedge",
  ],
  authors: [{ name: "Vedge" }],
  openGraph: {
    title: "Vedge — A health operating system built for Africa",
    description:
      "End-to-end health software for hospitals, clinics, labs, pharmacies, and patients across Africa.",
    type: "website",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedge",
    description: "A health operating system built for Africa.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the support script below adds a class to
    // <html> before React hydrates.
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <div
          id="legacy-browser-notice"
          className="legacy-browser-notice"
          role="alert"
          hidden
          suppressHydrationWarning
        >
          <strong>Your browser is out of date.</strong> You can read this page,
          but the forms and menus will not work. On Windows 7, install Chrome 109
          or Firefox ESR 115, the last versions made for it. On Windows 10 or 11,
          install or update Chrome. Then reload this page.
        </div>
        {/* After the notice: it un-hides it. See browserSupport.ts. */}
        <script dangerouslySetInnerHTML={{ __html: BROWSER_SUPPORT_SCRIPT }} />
        <RevealMount />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
