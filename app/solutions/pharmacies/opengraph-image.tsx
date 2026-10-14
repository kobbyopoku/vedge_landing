import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../_lib/og";

export const alt = "Vedge for pharmacies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "For pharmacies",
    headline: "POS, inventory, and reimbursement — *free to start.*",
    footer: "NHIS and private plan claims from the counter, and visibility when doctors prescribe.",
  });
}
