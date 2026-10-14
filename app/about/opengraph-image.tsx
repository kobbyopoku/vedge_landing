import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../_lib/og";

export const alt = "About Vedge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "About",
    headline: "Patient privacy *is a floor,* not a ceiling.",
    footer: "Why Vedge exists, who builds it, and what we believe about healthcare software in Africa.",
  });
}
