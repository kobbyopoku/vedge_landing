import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../_lib/og";

export const alt = "Vedge design partner programme";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Design partner programme · 2026",
    headline: "Fifty facilities. *One year. No invoice.*",
    footer: "Twelve months of Vedge, every module, every seat, every branch — for thirty minutes a week.",
  });
}
