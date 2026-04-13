import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { RevealMount } from "./_components/RevealMount";

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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <RevealMount />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
