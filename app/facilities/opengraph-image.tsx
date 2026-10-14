import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../_lib/og";

export const alt = "Vedge facility directory";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Facility directory",
    headline: "Find a hospital, lab, or pharmacy *running on Vedge.*",
    footer: "Services, hours, branches, and whether they take requests online.",
  });
}
