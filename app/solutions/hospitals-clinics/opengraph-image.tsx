import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../_lib/og";

export const alt = "Vedge for hospitals and clinics";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "For hospitals and clinics",
    headline: "Inpatient, outpatient, pharmacy, labs, and claims — *on one chart.*",
    footer: "NHIS, private, and corporate plans captured during the visit, not at month-end.",
  });
}
