import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "../_components/Container";
import { Kicker } from "../_components/Kicker";
import { KenteDivider } from "../_components/KenteDivider";
import {
  FACILITY_TYPES,
  facilityTypeLabel,
  facilityTypePluralLabel,
  locationLabel,
  type Facility,
} from "../_data/facilities";
import { getFacilities, FACILITY_PAGE_SIZE } from "../_lib/api";
import { LEGAL_CONFIG } from "../_lib/legal/config";

/**
 * The canonical marketing origin. `LEGAL_CONFIG.urls.marketing` is this
 * repo's existing single source of truth for it — canonical tags must
 * always name production, never a preview deployment's own hostname, so
 * this is deliberately a constant and not an env var.
 */
const SITE_URL = LEGAL_CONFIG.urls.marketing;

/** Next 16 hands both `params` and `searchParams` to a page as promises. */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** First value only — `?type=A&type=B` is a hand-typed URL, not a UI state. */
function one(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();
  return trimmed ? trimmed : undefined;
}

/** The filters this page understands, normalised out of the query string. */
type Filters = {
  /** Only ever a value from {@link FACILITY_TYPES}; anything else is dropped. */
  type?: string;
  country?: string;
  /** Matches a facility's own city, or any active branch's city, region, or address. */
  location?: string;
  /** Matches a facility's own name and description only — geography lives in {@link location}. */
  q?: string;
  /** Contains-match on a facility's published service names, e.g. "MRI". */
  service?: string;
  /** Zero-based. */
  page: number;
};

function readFilters(raw: Record<string, string | string[] | undefined>): Filters {
  const requestedType = one(raw.type)?.toUpperCase();
  const requestedCountry = one(raw.country)?.toUpperCase();
  const parsedPage = Number.parseInt(one(raw.page) ?? "0", 10);

  return {
    // An unknown type is dropped rather than forwarded. The backend
    // answers an unrecognised type with an empty page (deliberately —
    // it must not 500 on a hand-typed query string), but forwarding one
    // would render a chip row where nothing is selected above an empty
    // result, which reads as a bug rather than as "no such type".
    type: FACILITY_TYPES.some((t) => t.value === requestedType) ? requestedType : undefined,
    // ISO 3166-1 alpha-3. Shape-checked only: the set of countries Vedge
    // operates in is the backend's to know, not this file's.
    country: requestedCountry && /^[A-Z]{3}$/.test(requestedCountry) ? requestedCountry : undefined,
    // `location` replaced `city` on the backend contract. The API now
    // silently ignores `?city=` rather than rejecting it, so an old
    // bookmark or shared link carrying it would otherwise render an
    // unfiltered directory with no error. Falling back to `city` here
    // keeps every old link working exactly as before it shipped, and
    // `directoryHref` below never emits `city` again — so the old
    // parameter cannot resurface from a link this site generates itself.
    location: one(raw.location) ?? one(raw.city),
    q: one(raw.q),
    service: one(raw.service),
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 0,
  };
}

/** Rebuild this page's own URL from a set of filters. */
function directoryHref(filters: Partial<Filters>): string {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.country) params.set("country", filters.country);
  if (filters.location) params.set("location", filters.location);
  if (filters.q) params.set("q", filters.q);
  if (filters.service) params.set("service", filters.service);
  if (filters.page && filters.page > 0) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/facilities?${query}` : "/facilities";
}

/**
 * Whether a filtered view is worth putting in the index.
 *
 * `type` and `country` come from closed sets, so `?type=PHARMACY` is a
 * finite, genuinely useful landing page — "pharmacies on Vedge" is a
 * thing people search for. `location`, `q` and `service` are free text,
 * so indexing them would open an unbounded URL space off a single page:
 * every misspelling of every town, or every service name, becomes its
 * own crawlable, near-empty result page. That is the textbook
 * internal-search crawler trap, and it costs crawl budget that should be
 * going to the facility pages themselves. Those views stay
 * `noindex, follow` — still crawled through to the facilities they list,
 * never indexed in their own right.
 *
 * A view that returned nothing is never indexable either, whatever its
 * filters. While the directory is filling up, most type chips lead
 * somewhere empty, and an empty result page is thin content pointed at
 * the exact pages that should be ranking.
 */
function isIndexable(filters: Filters, resultCount: number): boolean {
  return resultCount > 0 && !filters.location && !filters.q && !filters.service;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const filters = readFilters(await searchParams);
  const typeLabel = filters.type ? facilityTypePluralLabel(filters.type) : null;

  // Same URL and options as the page's own call below, so in production
  // this is served from the request's fetch cache rather than costing a
  // second round trip.
  const { totalElements } = await getFacilities({
    type: filters.type,
    country: filters.country,
    location: filters.location,
    q: filters.q,
    service: filters.service,
    page: filters.page,
    size: FACILITY_PAGE_SIZE,
  });
  const indexable = isIndexable(filters, totalElements);

  const title = typeLabel ? `${typeLabel} on Vedge` : "Facility directory";
  const description = typeLabel
    ? `Find ${typeLabel.toLowerCase()} running on Vedge — opening hours, services, and how to send them a request.`
    : "Every hospital, clinic, laboratory, pharmacy, and diagnostic centre running on Vedge — with opening hours, published services, and a direct line to each one.";

  // Canonical always names the clean, indexable form of this view, so a
  // location or search variant consolidates onto the page that should
  // rank rather than competing with it.
  const canonicalFilters: Partial<Filters> = indexable
    ? { type: filters.type, country: filters.country, page: filters.page }
    : { type: filters.type, country: filters.country };

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${directoryHref(canonicalFilters)}` },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title: `${title} · Vedge`, description, type: "website" },
  };
}

export default async function FacilitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = readFilters(await searchParams);
  const { facilities, page, totalPages, totalElements } = await getFacilities({
    type: filters.type,
    country: filters.country,
    location: filters.location,
    q: filters.q,
    service: filters.service,
    page: filters.page,
    size: FACILITY_PAGE_SIZE,
  });

  const hasNarrowing = Boolean(
    filters.type || filters.country || filters.location || filters.q || filters.service,
  );
  const typeLabel = filters.type ? facilityTypePluralLabel(filters.type) : null;

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="border-b border-ink/15">
        <Container className="pt-20 pb-16 md:pt-28 md:pb-20">
          <Kicker>The directory</Kicker>
          <h1 className="reveal mt-8 max-w-4xl font-display text-hero">
            {typeLabel ? (
              <>
                {typeLabel} <span className="italic-display">on Vedge.</span>
              </>
            ) : (
              <>
                Every facility <span className="italic-display">on Vedge.</span>
              </>
            )}
          </h1>
          <p className="reveal reveal-delay-1 mt-8 max-w-xl font-display text-xl leading-snug text-ink/80">
            Hospitals, clinics, laboratories, pharmacies, and imaging centres running on Vedge — each page written by the facility itself. Opening hours, published services, and, where they take them, a way to send a request before you travel.
          </p>
        </Container>
      </section>

      {/* ═══════════════ FILTERS ═══════════════ */}
      <section className="border-b border-ink/15 bg-bone-deep">
        <Container className="py-10">
          {/* One native GET form for every filter, `type` included: no
              client component, no hydration, and the result of every
              submit is a real URL the visitor can bookmark or share.
              Three of the four fields are free text over different
              things — name and description, geography, and services — so
              each is labelled for exactly what it searches; see the
              field notes below. */}
          <form action="/facilities" method="get" className="flex flex-wrap items-end gap-6">
            {filters.country && <input type="hidden" name="country" value={filters.country} />}

            <div className="min-w-[11rem]">
              <label
                htmlFor="facility-type"
                className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
              >
                Type
              </label>
              {/* A dropdown, not a chip row — same select convention as
                  ContactForm / DesignPartnerForm, styled to match this
                  form's own text inputs rather than their dark-panel
                  variant. */}
              <select
                id="facility-type"
                name="type"
                defaultValue={filters.type ?? ""}
                className="mt-2 w-full appearance-none border-0 border-b border-ink/25 bg-transparent pb-2 font-display text-lg text-ink outline-none focus:border-ink"
              >
                <option value="">All types</option>
                {FACILITY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Picking a type submits the form. The most-used filter went
                from one click (the old pill row) to three interactions
                when it became a dropdown, and this gives two of them
                back without turning anything into a client component:
                an inline script is ~230 bytes of HTML, no `"use client"`,
                no hydration, no boundary, and the page's measured client
                bundle is unchanged.

                Delegated on `document` rather than bound to the element,
                deliberately: that works whether React renders this script
                in place or hoists it, survives a client-side navigation
                (pagination, "Clear filters") because `document` outlives
                the re-render, and needs no DOMContentLoaded guard. The
                flag makes a second execution a no-op.

                Degrades perfectly: without JS the Search button — which
                stays, and is the only path for anyone whose browser fires
                `change` per arrow key on a closed select — still submits
                the identical form to the identical URL. ES5 on purpose:
                inline scripts are not transpiled, and a parse error here
                would silently drop the enhancement. */}
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "if(!window.__vedgeTypeAutoSubmit){window.__vedgeTypeAutoSubmit=1;" +
                  "document.addEventListener('change',function(e){var t=e.target;" +
                  "if(!t||t.id!=='facility-type'||!t.form)return;" +
                  "if(t.form.requestSubmit)t.form.requestSubmit();else t.form.submit();});}",
              }}
            />

            <div className="flex-1 min-w-[14rem]">
              <label
                htmlFor="facility-q"
                className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
              >
                Name or description
              </label>
              <input
                id="facility-q"
                name="q"
                type="search"
                defaultValue={filters.q ?? ""}
                placeholder="Korle Bu, Nyaho, MedLab…"
                className="mt-2 w-full border-b border-ink/25 bg-transparent pb-2 font-display text-lg text-ink outline-none placeholder:text-ink/35 focus:border-ink"
              />
            </div>

            <div className="flex-1 min-w-[12rem]">
              <label
                htmlFor="facility-location"
                className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
              >
                City, region, or address
              </label>
              {/* Every word of the label is true of the server clause:
                  the facility's own city and its own street address, and
                  any active branch's city, region or address — so a
                  facility headquartered in Accra with a Kumasi branch is
                  found by searching Kumasi, and a single-site clinic at
                  "12 Boundary Road, East Legon" is found by searching
                  East Legon. Region is the one part that comes from
                  branches alone; there is no org region column. */}
              <input
                id="facility-location"
                name="location"
                type="text"
                defaultValue={filters.location ?? ""}
                placeholder="Accra, Kumasi, Takoradi…"
                className="mt-2 w-full border-b border-ink/25 bg-transparent pb-2 font-display text-lg text-ink outline-none placeholder:text-ink/35 focus:border-ink"
              />
            </div>

            <div className="flex-1 min-w-[12rem]">
              <label
                htmlFor="facility-service"
                className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
              >
                Service offered
              </label>
              <input
                id="facility-service"
                name="service"
                type="text"
                defaultValue={filters.service ?? ""}
                placeholder="MRI, dialysis, ultrasound…"
                className="mt-2 w-full border-b border-ink/25 bg-transparent pb-2 font-display text-lg text-ink outline-none placeholder:text-ink/35 focus:border-ink"
              />
            </div>

            <button type="submit" className="btn-ink">
              Search
              <span aria-hidden="true" className="inline-block translate-y-[-1px]">→</span>
            </button>

            {hasNarrowing && (
              <Link
                href="/facilities"
                className="link-grow pb-2 font-mono text-[10px] uppercase tracking-kicker text-clay"
              >
                Clear filters
              </Link>
            )}
          </form>
        </Container>
      </section>

      {/* ═══════════════ RESULTS ═══════════════ */}
      <section className="py-16 md:py-20">
        <Container>
          <p
            className="font-mono text-[10px] uppercase tracking-kicker text-ink/55"
            aria-live="polite"
          >
            {totalElements === 1 ? "1 facility" : `${totalElements} facilities`}
            {typeLabel ? ` · ${typeLabel}` : ""}
            {filters.location ? ` · ${filters.location}` : ""}
            {filters.service ? ` · “${filters.service}”` : ""}
            {filters.q ? ` · “${filters.q}”` : ""}
          </p>

          {facilities.length === 0 ? (
            <EmptyState hasNarrowing={hasNarrowing} />
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-px border border-ink/15 bg-ink/15 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <FacilityCard key={facility.slug} facility={facility} />
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Directory pages"
              className="mt-12 flex items-center justify-between border-t border-ink/15 pt-6"
            >
              {page > 0 ? (
                <Link
                  href={directoryHref({ ...filters, page: page - 1 })}
                  rel="prev"
                  className="link-grow font-mono text-[11px] uppercase tracking-kicker text-ink"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="font-mono text-[10px] uppercase tracking-kicker text-ink/50">
                Page {page + 1} of {totalPages}
              </span>
              {page + 1 < totalPages ? (
                <Link
                  href={directoryHref({ ...filters, page: page + 1 })}
                  rel="next"
                  className="link-grow font-mono text-[11px] uppercase tracking-kicker text-ink"
                >
                  Next →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </Container>
      </section>

      <KenteDivider className="bg-bone py-4" />

      {/* ═══════════════ CROSS-LINKS ═══════════════ */}
      <section className="bg-forest text-bone">
        <Container className="py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <Kicker className="!text-sun">Run one of these?</Kicker>
              <h2 className="reveal mt-8 font-display text-display text-bone">
                Your page is <span className="italic-display !text-sun">already yours.</span>
              </h2>
              <p className="reveal reveal-delay-1 mt-6 max-w-xl text-bone/75">
                Every facility on Vedge gets a directory page the moment it writes a description — nothing to buy, nothing to apply for. Write it in your settings screen, or opt out entirely and keep the profile.
              </p>
            </div>
            <div className="col-span-12 md:col-span-5 md:border-l md:border-bone/20 md:pl-10">
              <p className="font-mono text-[10px] uppercase tracking-kicker text-sun">
                What Vedge does for each
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { label: "Hospitals & clinics", href: "/solutions/hospitals-clinics" },
                  { label: "Medical laboratories", href: "/solutions/medical-labs" },
                  { label: "Pharmacies", href: "/solutions/pharmacies" },
                  { label: "Diagnostic centres", href: "/solutions/diagnostic-centers" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-grow font-display text-lg text-bone/90 hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * One directory card.
 *
 * The whole card is a link to the facility's own page. `acceptsRequests`
 * is surfaced here as a badge rather than as a second link, because a
 * request needs the facility's service list to make sense — that lives
 * one click away, on the page itself.
 */
function FacilityCard({ facility }: { facility: Facility }) {
  const location = locationLabel(facility.city, facility.countryCode);

  return (
    <li className="bg-bone">
      <Link
        href={`/facilities/${facility.slug}`}
        className="group flex h-full flex-col p-8 transition-colors hover:bg-bone-deep"
      >
        <div className="flex items-start gap-4">
          {facility.logoUrl ? (
            // Plain <img>, not next/image: these are tenant-supplied URLs
            // on arbitrary hosts, and next/image would need every one of
            // them enumerated in `images.remotePatterns` — a config file
            // that would have to be redeployed each time a facility
            // changes its logo host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={facility.logoUrl}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 shrink-0 object-contain"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/20 font-display text-xl text-ink/40"
            >
              {facility.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-display text-2xl leading-tight text-ink">{facility.name}</h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-kicker text-ink/55">
              {facilityTypeLabel(facility.orgType)}
              {location ? ` · ${location}` : ""}
            </p>
          </div>
        </div>

        {facility.shortDescription && (
          <p className="mt-5 text-sm leading-relaxed text-ink/75">{facility.shortDescription}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          {facility.acceptsRequests ? (
            <span className="rounded-full border border-forest bg-forest/10 px-3 py-[3px] font-mono text-[9px] uppercase tracking-kicker text-forest">
              Takes requests
            </span>
          ) : (
            <span />
          )}
          <span
            aria-hidden="true"
            className="font-mono text-[10px] uppercase tracking-kicker text-clay"
          >
            View →
          </span>
        </div>
      </Link>
    </li>
  );
}

/**
 * The empty state.
 *
 * **It says the same thing whether the directory is empty, the filters
 * matched nothing, or the backend is unreachable — and that is
 * deliberate.** This page cannot tell those apart and must not pretend
 * to: `getFacilities` returns an empty list for a legitimately empty
 * directory and for a failed fetch alike, by design. The only signal it
 * does have is whether the visitor narrowed anything, which is the one
 * distinction worth making, because it changes what they should do next.
 */
function EmptyState({ hasNarrowing }: { hasNarrowing: boolean }) {
  return (
    <div className="mt-10 border border-ink/15 px-8 py-20 text-center">
      <p className="mx-auto max-w-lg font-display text-2xl leading-snug text-ink/80">
        {hasNarrowing
          ? "Nothing here matches that yet."
          : "The directory is still filling up."}
      </p>
      <p className="mx-auto mt-4 max-w-lg text-sm text-ink/60">
        {hasNarrowing
          ? "Try a broader type, or clear the filters and browse everything listed."
          : "A facility appears here once it has written its own description — so this page grows as facilities join and fill theirs in."}
      </p>
      {hasNarrowing && (
        <div className="mt-8">
          <Link href="/facilities" className="btn-ghost">
            Browse everything
            <span aria-hidden="true" className="inline-block translate-y-[-1px]">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
