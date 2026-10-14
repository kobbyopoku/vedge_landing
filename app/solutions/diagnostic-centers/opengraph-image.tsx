import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../_lib/og";

export const alt = "Vedge for radiology and diagnostic centres";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "For radiology & diagnostic centres",
    headline: "Referral to report, *without the paper trail.*",
    footer: "Imaging orders, studies, reports, and billing on the same backbone as the referring hospital.",
  });
}
