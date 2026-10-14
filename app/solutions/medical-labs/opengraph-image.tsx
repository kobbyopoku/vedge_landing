import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../_lib/og";

export const alt = "Vedge for laboratories";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "For laboratories",
    headline: "Order to result, *with the QC built in.*",
    footer: "Levey-Jennings QC, reagent lot tracking, instrument interfaces, HL7 results out to any hospital.",
  });
}
