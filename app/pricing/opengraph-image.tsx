import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../_lib/og";

export const alt = "Vedge pricing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Pricing",
    // "GHS", not "₵": the cedi sign is outside the Latin font subset and
    // satori would fetch a fallback glyph from Google Fonts at render time.
    headline: "Labs and pharmacies start free. Hospitals from *GHS 1,200 a month.*",
    footer: "30-day hospital trials. No credit card. Save 20% on a year; founding customers save 40%.",
  });
}
