import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../_components/Container";
import { Kicker } from "../../_components/Kicker";
import { KenteDivider } from "../../_components/KenteDivider";
import {
  branchDirectionsUrl,
  branchLocationLabel,
  facilityFactPhrases,
  facilityHasIndexableSubstance,
  facilityJsonLd,
  facilityTypeLabel,
  joinPhrases,
  locationLabel,
  type FacilityBranch,
  type FacilityDetail,
} from "../../_data/facilities";
import { getAllFacilities, getFacility } from "../../_lib/api";
import { LEGAL_CONFIG } from "../../_lib/legal/config";
import { ServicesList } from "./ServicesList";

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

/**
 * The one-line summary of a facility, in the facility's own terms —
 * `"Diagnostic centre in Accra, Ghana"`. Never empty: `facilityTypeLabel`
 * falls back to `"Facility"` for an unknown or absent `orgType`, and the
 * name is guaranteed by the API mapper.
 */
function facilityLead(facility: FacilityDetail): string {
  const location = locationLabel(facility.city, facility.countryCode);
  return `${facilityTypeLabel(facility.orgType)}${location ? ` in ${location}` : ""}`;
}

/**
 * Meta descriptions get truncated around 160 characters; cut at a word.
 *
 * **The fallback may not describe anything the page does not have.**
 * Facilities with no description are listed as of backend `c8e53df`, so
 * this branch is now load-bearing rather than defensive — and its old
 * wording, "Hours, services, and contact details on Vedge", was a
 * sentence about three sections that a description-less facility very
 * often has none of. Writing prose on a facility's behalf is what the
 * directory's design forbids; asserting content it does not have is the
 * same offence with worse consequences, because the assertion is what a
 * searcher reads in the result before deciding to click.
 *
 * So the fallback is assembled from {@link facilityFactPhrases}, which
 * counts the sections this page actually renders. Worst case — a
 * facility with a name, a type and nothing else — it degrades to
 * `"Name — Hospital in Accra, Ghana. Listed on Vedge."`, which is short
 * but is entirely true and is never empty.
 */
function metaDescription(facility: FacilityDetail): string {
  const facts = facilityFactPhrases(facility);
  const lead = `${facility.name} — ${facilityLead(facility)}.`;
  const fallback =
    facts.length > 0 ? `${lead} ${joinPhrases(facts)} on Vedge.` : `${lead} Listed on Vedge.`;

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
    // `noindex, follow` for a page with nothing of its own on it — see
    // `facilityHasIndexableSubstance`, which explains why the threshold
    // is substance and deliberately not the description column the
    // corrected spec names. `follow` so a crawler that lands here still
    // walks back out to `/facilities`; the page is not being hidden,
    // only kept out of an index it cannot earn a place in. This is the
    // same posture `app/facilities/page.tsx#isIndexable` already takes
    // for the directory's own thin views.
    ...(facilityHasIndexableSubstance(facility)
      ? {}
      : { robots: { index: false, follow: true } }),
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
  // Only rendered on the no-description path, but computed here so the
  // page and `generateMetadata` are demonstrably reading one list.
  const facts = facilityFactPhrases(facility);
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
            {/* ── What this column leads with ──────────────────────
                With a description: their prose, under "About", exactly
                as before.

                Without one — a state that only became reachable when
                the backend dropped the description requirement from its
                listing rule (`c8e53df`) — this is NOT an "About"
                heading with an apology under it. That is what it used
                to be ("This facility has not written a description
                yet."), and it was three bad things at once: a section
                header promising prose that never arrives, the first
                sentence in the body being a negative statement about a
                tenant on a page we host *for* them, and a paragraph
                whose entire content is the absence of content — which
                is the literal definition of the thin-page signal §1 of
                the directory spec was worried about.

                So the heading changes with the content instead of
                staying put and being wrong. "At a glance" leads with
                the single most useful true sentence available — what
                they are and where — and then names what this page
                holds. Every word of both comes from a structured field
                the facility filled in itself; see
                `facilityFactPhrases`, which is also what the meta
                description is built from, so the summary and the search
                result cannot drift apart.

                The fact line doubles as a signpost: a description-less
                facility's real content is the services and locations
                further down, and this is the only thing above the fold
                that says so. ────────────────────────────────────── */}
            <div className="col-span-12 md:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                {facility.description ? "About" : "At a glance"}
              </p>
              {facility.description ? (
                // `whitespace-pre-line` keeps the facility's own
                // paragraph breaks. React escapes the text itself, so
                // this renders their prose, never their markup.
                <p className="mt-6 whitespace-pre-line font-display text-xl leading-snug text-ink/85">
                  {facility.description}
                </p>
              ) : (
                <>
                  <p className="mt-6 font-display text-xl leading-snug text-ink/85">
                    {facilityLead(facility)}.
                  </p>
                  {facts.length > 0 && (
                    <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-kicker text-ink/55">
                      {facts.join(" · ")}
                    </p>
                  )}
                </>
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
                <ServicesList services={facility.services} />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════ LOCATIONS ═══════════════ */}
      {facility.branches.length > 0 && (
        <section className="border-t border-ink/15 py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-4">
                <Kicker>Locations</Kicker>
                <h2 className="reveal mt-6 font-display text-display">
                  Where to <span className="italic-display">find them.</span>
                </h2>
                <p className="reveal reveal-delay-1 mt-6 max-w-sm text-ink/70">
                  Every active location {facility.name} has listed, main branch first.
                </p>
              </div>

              <div className="col-span-12 md:col-span-8">
                <ul className="grid grid-cols-1 border-t border-ink/20 sm:grid-cols-2">
                  {facility.branches.map((branch, index) => (
                    <BranchCard key={`${branch.name}-${index}`} branch={branch} index={index} />
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

/** `tel:` needs digits and a leading `+` only — strip everything else a tenant typed. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/**
 * One branch. Alternates the right-hand border on the 2-up grid the same
 * way the capability grids on the solutions pages do, so a facility with
 * an odd number of branches doesn't leave a dangling half-divider.
 *
 * A branch with no coordinates on file (the normal case — see
 * {@link FacilityBranch}) still renders every other field; it simply
 * gets no "Directions" link, never a dead or guessed one.
 */
function BranchCard({ branch, index }: { branch: FacilityBranch; index: number }) {
  const location = branchLocationLabel(branch.city, branch.region, branch.countryCode);
  const directionsHref = branchDirectionsUrl(branch.latitude, branch.longitude);

  return (
    <li
      className={`border-b border-ink/15 p-7 ${index % 2 === 0 ? "sm:border-r sm:border-ink/15" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-tight text-ink">{branch.name}</h3>
        {branch.isMainBranch && (
          <span className="shrink-0 rounded-full border border-forest bg-forest/10 px-3 py-[3px] font-mono text-[9px] uppercase tracking-kicker text-forest">
            Main
          </span>
        )}
      </div>

      {(branch.addressLine || location) && (
        <address className="mt-3 not-italic text-sm leading-relaxed text-ink/70">
          {branch.addressLine && <div>{branch.addressLine}</div>}
          {location && <div>{location}</div>}
        </address>
      )}

      {(branch.phone || directionsHref) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {branch.phone && (
            <a
              href={telHref(branch.phone)}
              className="link-grow font-mono text-[10px] uppercase tracking-kicker text-ink/60"
            >
              {branch.phone}
            </a>
          )}
          {directionsHref && (
            <a
              href={directionsHref}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`Get directions to ${branch.name}`}
              className="link-grow font-mono text-[10px] uppercase tracking-kicker text-clay"
            >
              Directions <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      )}
    </li>
  );
}

/**
 * schema.org structured data, so a facility page can win a rich result
 * rather than a bare blue link — the difference between a directory
 * being indexed and a directory being *used*. Doubly so now that
 * facilities with no prose are listed: structured data is the lever the
 * corrected spec (§1.2) names for recovering the search value the
 * removed content floor used to guarantee, and a facility's branches and
 * contact rows are real, specific, machine-readable facts even when its
 * "About" column has nothing to say.
 *
 * The payload itself is built by `facilityJsonLd`, a pure function in
 * `app/_data/facilities.ts` — put there so it can be asserted on without
 * a renderer. This component only serialises it.
 *
 * The JSON is emitted through `JSON.stringify` with `<` escaped. That
 * escape is not cosmetic: without it a facility whose description
 * contained `</script>` would close this tag early and turn its own
 * profile text into markup on our origin.
 */
function FacilityJsonLd({ facility }: { facility: FacilityDetail }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(facilityJsonLd(facility, SITE_URL)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
