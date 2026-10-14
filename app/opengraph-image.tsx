import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "./_lib/og";

// Default card for every route without its own opengraph-image.tsx:
// home, contact, companions, legal.
export const alt = "Vedge — A health operating system built for the way Africa actually works.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Health operating system · Accra",
    headline: "A health operating system *built for the way* Africa *actually works.*",
    footer: "Hospitals, clinics, laboratories, pharmacies, and diagnostic centres on one chart.",
  });
}
