import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "../../_lib/og";
import { getFacility } from "../../_lib/api";
import { facilityTypeLabel, locationLabel } from "../../_data/facilities";

// A facility's own card: its name, type, and city — what a clinic shares
// on WhatsApp when it posts its Vedge directory link.
export const alt = "Facility on Vedge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facility = await getFacility(slug).catch(() => null);

  if (!facility) {
    return renderOgImage({
      kicker: "Facility directory",
      headline: "A facility *running on Vedge.*",
    });
  }

  const location = locationLabel(facility.city, facility.countryCode);
  const kicker = [facilityTypeLabel(facility.orgType), location].filter(Boolean).join(" · ");

  return renderOgImage({
    kicker: kicker || "On Vedge",
    headline: `*${facility.name}*`,
    footer: facility.acceptsRequests
      ? "Services, hours, and branches — and you can send a request online."
      : "Services, hours, and branches, listed on the Vedge facility directory.",
  });
}
