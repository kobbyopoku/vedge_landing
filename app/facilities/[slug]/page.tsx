import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../_components/Container";
import { Kicker } from "../../_components/Kicker";
import { KenteDivider } from "../../_components/KenteDivider";
import {
  facilityTypeLabel,
  locationLabel,
  type FacilityDetail,
} from "../../_data/facilities";
import { getAllFacilities, getFacility } from "../../_lib/api";
import { LEGAL_CONFIG } from "../../_lib/legal/config";

/** Canonical production origin — see the note in `app/facilities/page.tsx`. */
const SITE_URL = LEGAL_CONFIG.urls.marketing;

/** Where the facility's own public request form lives, in the app. */
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5177";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Prerender the first page of the directory; everything past it renders
 * on demand and is then cached for the same five minutes as the fetch.
 *
 * **Bounded on purpose.** `generateStaticParams` running unbounded would
 * turn one deploy into one request per facility against a rate-limited
 * public endpoint (`PublicFacilityRateLimiter`, 300/min per IP — and a
 * build is a single IP). One page of 100 is comfortably inside that and
 * covers the directory many times over at launch. If it ever stops
 * doing so, the answer is to keep prerendering the first 100 and let ISR
 * cover the tail, which is exactly what happens today with no change.
 *
 * `getAllFacilities` swallows a failed fetch into an empty list, so a
 * backend that is down at build time costs static pages, not the build.
 */
export async function generateStaticParams() {
  const facilities = await getAllFacilities(1);
  return facilities.map((facility) => ({ slug: facility.slug }));
}

/** Meta descriptions get truncated around 160 characters; cut at a word. */
function metaDescription(facility: FacilityDetail): string {
  const location = locationLabel(facility.city, facility.countryCode);
  const fallback = `${facility.name} — ${facilityTypeLabel(facility.orgType)}${
    location ? ` in ${location}` : ""
  }. Hours, services, and contact details on Vedge.`;

  const source = facility.description ?? fallback;
  if (source.length <= 155) return source;
  const head = source.slice(0, 155);
  const lastSpace = head.lastIndexOf(" ");
  return `${(lastSpace > 80 ? head.slice(0, lastSpace) : head).trimEnd()}…`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const facility = await getFacility(slug);

  // Nothing to describe. The page itself calls notFound(), which is what
  // sets the 404 status; this only keeps the tab title sensible.
  if (!facility) return { title: "Facility not found" };

  const location = locationLabel(facility.city, facility.countryCode);
  const title = location ? `${facility.name} · ${location}` : facility.name;
  const description = metaDescription(facility);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/facilities/${facility.slug}` },
    openGraph: {
      title: `${facility.name} · Vedge`,
      description,
      type: "website",
      url: `${SITE_URL}/facilities/${facility.slug}`,
      ...(facility.logoUrl ? { images: [{ url: facility.logoUrl }] } : {}),
    },
  };
}

export default async function FacilityPage({ params }: PageProps) {
  const { slug } = await params;
  const facility = await getFacility(slug);

  // `null` means the API answered 404 — which it does identically for a
  // slug that does not exist and for a facility that is not listed. That
  // is deliberate on the backend's side, so there is nothing here that
  // tries to tell them apart, and nothing should be added that does.
  if (!facility) notFound();

  const location = locationLabel(facility.city, facility.countryCode);
  const accent = facility.accentColorHex;
  const contactRows = [
    facility.address ? { label: "Address", value: facility.address } : null,
    facility.hours ? { label: "Opening hours", value: facility.hours } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <>
      <FacilityJsonLd facility={facility} />

      {/* ═══════════════ HEADER ═══════════════ */}
      <section className="border-b border-ink/15">
        <Container className="pt-12 pb-16 md:pt-16 md:pb-20">
          <nav aria-label="Breadcrumb">
            <Link
              href="/facilities"
              className="link-grow font-mono text-[10px] uppercase tracking-kicker text-ink/55"
            >
              ← Facility directory
            </Link>
          </nav>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            {facility.logoUrl ? (
              // Plain <img> — tenant-supplied host, see the note on the
              // directory card for why next/image is the wrong tool here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={facility.logoUrl}
                alt={`${facility.name} logo`}
                width={112}
                height={112}
                className="h-28 w-28 shrink-0 border border-ink/15 bg-bone object-contain p-3"
              />
            ) : null}

            <div className="min-w-0">
              <Kicker>
                {facilityTypeLabel(facility.orgType)}
                {location ? ` · ${location}` : ""}
              </Kicker>
              <h1 className="reveal mt-6 font-display text-hero">{facility.name}</h1>

              {/* The accent colour is the facility's own, already
                  validated to #rgb / #rrggbb by the API mapper — an
                  unvalidated tenant string in an inline style is a CSS
                  injection, so anything else arrives here as null and
                  this falls back to the site's palette. */}
              <div
                aria-hidden="true"
                className="mt-8 h-[3px] w-24 bg-clay"
                style={accent ? { backgroundColor: accent } : undefined}
              />

              {facility.acceptsRequests && (
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a href={`${appUrl}/request/${encodeURIComponent(facility.slug)}`} className="btn-ink">
                    Send a request
                    <span aria-hidden="true" className="inline-block translate-y-[-1px]">→</span>
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                    No account needed
                  </span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ ABOUT + CONTACT ═══════════════ */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-12 gap-x-6 gap-y-14">
            <div className="col-span-12 md:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                About
              </p>
              {facility.description ? (
                // `whitespace-pre-line` keeps the facility's own
                // paragraph breaks. React escapes the text itself, so
                // this renders their prose, never their markup.
                <p className="mt-6 whitespace-pre-line font-display text-xl leading-snug text-ink/85">
                  {facility.description}
                </p>
              ) : (
                <p className="mt-6 text-ink/60">
                  This facility has not written a description yet.
                </p>
              )}
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9 md:border-l md:border-ink/15 md:pl-10">
              <p className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                Find them
              </p>
              <dl className="mt-6 space-y-6">
                {contactRows.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/45">
                      {row.label}
                    </dt>
                    <dd className="mt-2 whitespace-pre-line text-ink/80">{row.value}</dd>
                  </div>
                ))}

                {facility.phone && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/45">
                      Phone
                    </dt>
                    <dd className="mt-2">
                      <a href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`} className="link-grow text-ink/80">
                        {facility.phone}
                      </a>
                    </dd>
                  </div>
                )}

                {facility.email && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/45">
                      Email
                    </dt>
                    <dd className="mt-2">
                      <a href={`mailto:${encodeURIComponent(facility.email)}`} className="link-grow text-ink/80">
                        {facility.email}
                      </a>
                    </dd>
                  </div>
                )}

                {facility.website && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-kicker text-ink/45">
                      Website
                    </dt>
                    <dd className="mt-2">
                      {/* rel="nofollow" — this is a link the facility
                          typed about itself. Passing our ranking to an
                          unvetted destination is how a directory turns
                          into a link farm. */}
                      <a
                        href={facility.website}
                        rel="nofollow noopener noreferrer"
                        target="_blank"
                        className="link-grow break-all text-ink/80"
                      >
                        {facility.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      {facility.services.length > 0 && (
        <section className="border-t border-ink/15 bg-bone-deep py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4">
                <Kicker>Published services</Kicker>
                <h2 className="reveal mt-6 font-display text-display">
                  What they <span className="italic-display">offer.</span>
                </h2>
                <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                  Published by the facility itself. Prices are not listed here — ask them directly, or send a request and they will quote you.
                </p>
              </div>

              <div className="col-span-12 md:col-span-8">
                <ul className="border-t border-ink/20">
                  {facility.services.map((service) => (
                    <li
                      key={service.id}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink/15 py-5"
                    >
                      <span className="font-display text-xl text-ink">
                        {service.description ?? service.code}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                        {[service.modality, service.bodyPart, service.code]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      )}

      <KenteDivider className="bg-bone py-4" />

      {/* ═══════════════ FOOTER CTA ═══════════════ */}
      <section className="bg-forest text-bone">
        <Container className="py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <Kicker className="!text-sun">On Vedge</Kicker>
              <h2 className="reveal mt-8 font-display text-display text-bone">
                {facility.name} runs on <span className="italic-display !text-sun">Vedge.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Records, results, prescriptions, and claims on one backbone — and a free patient app that keeps every visit in your pocket.
              </p>
            </div>
            <div className="col-span-12 md:col-span-5 md:flex md:items-end md:justify-end">
              <div className="reveal reveal-delay-2 flex flex-wrap gap-4">
                <Link href="/facilities" className="btn-ghost !border-bone/40 !text-bone hover:!bg-bone hover:!text-forest">
                  All facilities
                  <span aria-hidden="true" className="inline-block translate-y-[-1px]">→</span>
                </Link>
                <Link href="/companions/vedge-patient" className="btn-ghost !border-bone/40 !text-bone hover:!bg-bone hover:!text-forest">
                  The patient app
                  <span aria-hidden="true" className="inline-block translate-y-[-1px]">→</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * schema.org structured data, so a facility page can win a rich result
 * rather than a bare blue link — the difference between a directory
 * being indexed and a directory being *used*.
 *
 * `MedicalOrganization` deliberately, not `LocalBusiness`: it is the
 * type Google documents for healthcare providers, and it is the honest
 * description of every `OrgType` in the directory.
 *
 * The JSON is emitted through `JSON.stringify` with `<` escaped. That
 * escape is not cosmetic: without it a facility whose description
 * contained `</script>` would close this tag early and turn its own
 * profile text into markup on our origin.
 */
function FacilityJsonLd({ facility }: { facility: FacilityDetail }) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: facility.name,
    url: `${SITE_URL}/facilities/${facility.slug}`,
    ...(facility.description ? { description: facility.description } : {}),
    ...(facility.logoUrl ? { logo: facility.logoUrl } : {}),
    ...(facility.website ? { sameAs: [facility.website] } : {}),
    ...(facility.phone ? { telephone: facility.phone } : {}),
    ...(facility.email ? { email: facility.email } : {}),
    ...(facility.hours ? { openingHours: facility.hours } : {}),
    ...(facility.address || facility.city || facility.countryCode
      ? {
          address: {
            "@type": "PostalAddress",
            ...(facility.address ? { streetAddress: facility.address } : {}),
            ...(facility.city ? { addressLocality: facility.city } : {}),
            ...(facility.countryCode ? { addressCountry: facility.countryCode } : {}),
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
