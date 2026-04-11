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
    default: "Vedge — A hospital operating system built for West Africa",
    template: "%s · Vedge",
  },
  description:
    "Vedge is an end-to-end healthcare platform for hospitals, clinics, laboratories, and pharmacies across Ghana and West Africa. Built for NHIS, designed for reality.",
  keywords: [
    "healthcare software Ghana",
    "hospital management system",
    "EHR West Africa",
    "NHIS claims",
    "laboratory information system",
    "pharmacy management",
    "Vedge",
  ],
  authors: [{ name: "Vedge" }],
  openGraph: {
    title: "Vedge — A hospital operating system built for West Africa",
    description:
      "End-to-end healthcare software for hospitals, clinics, labs, and pharmacies across Ghana.",
    type: "website",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedge",
    description: "A hospital operating system built for West Africa.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <RevealMount />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
