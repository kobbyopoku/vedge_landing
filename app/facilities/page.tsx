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
  city?: string;
  q?: string;
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
    city: one(raw.city),
    q: one(raw.q),
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 0,
  };
}

/** Rebuild this page's own URL from a set of filters. */
function directoryHref(filters: Partial<Filters>): string {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.country) params.set("country", filters.country);
  if (filters.city) params.set("city", filters.city);
  if (filters.q) params.set("q", filters.q);
  if (filters.page && filters.page > 0) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/facilities?${query}` : "/facilities";
}

/**
 * Whether a filtered view is worth putting in the index.
 *
 * `type` and `country` come from closed sets, so `?type=PHARMACY` is a
 * finite, genuinely useful landing page — "pharmacies on Vedge" is a
 * thing people search for. `city` and `q` are free text, so indexing
 * them would open an unbounded URL space off a single page: every
 * misspelling of every town becomes its own crawlable, near-empty
 * result page. That is the textbook internal-search crawler trap, and it
 * costs crawl budget that should be going to the facility pages
 * themselves. Those views stay `noindex, follow` — still crawled through
 * to the facilities they list, never indexed in their own right.
 *
 * A view that returned nothing is never indexable either, whatever its
 * filters. While the directory is filling up, most type chips lead
 * somewhere empty, and an empty result page is thin content pointed at
 * the exact pages that should be ranking.
 */
function isIndexable(filters: Filters, resultCount: number): boolean {
  return resultCount > 0 && !filters.city && !filters.q;
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
    city: filters.city,
    q: filters.q,
    page: filters.page,
    size: FACILITY_PAGE_SIZE,
  });
  const indexable = isIndexable(filters, totalElements);

  const title = typeLabel ? `${typeLabel} on Vedge` : "Facility directory";
  const description = typeLabel
    ? `Find ${typeLabel.toLowerCase()} running on Vedge — opening hours, services, and how to send them a request.`
    : "Every hospital, clinic, laboratory, pharmacy, and diagnostic centre running on Vedge — with opening hours, published services, and a direct line to each one.";

  // Canonical always names the clean, indexable form of this view, so a
  // city or search variant consolidates onto the page that should rank
  // rather than competing with it.
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
    city: filters.city,
    q: filters.q,
    page: filters.page,
    size: FACILITY_PAGE_SIZE,
  });

  const hasNarrowing = Boolean(filters.type || filters.country || filters.city || filters.q);
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
          {/* Type chips. Plain links, so filtering works with no JS at
              all and every filtered view is a real, shareable URL. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-kicker text-ink/50">
              Type
            </span>
            <Link
              href={directoryHref({ country: filters.country, city: filters.city, q: filters.q })}
              aria-current={filters.type ? undefined : "page"}
              className={`rounded-full border px-4 py-[6px] font-mono text-[10px] uppercase tracking-kicker transition-colors ${
                filters.type
                  ? "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
                  : "border-forest bg-forest text-bone"
              }`}
            >
              All
            </Link>
            {FACILITY_TYPES.map((option) => {
              const active = filters.type === option.value;
              return (
                <Link
                  key={option.value}
                  href={directoryHref({
                    type: option.value,
                    country: filters.country,
                    city: filters.city,
                    q: filters.q,
                  })}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full border px-4 py-[6px] font-mono text-[10px] uppercase tracking-kicker transition-colors ${
                    active
                      ? "border-forest bg-forest text-bone"
                      : "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          {/* A native GET form: no client component, no JS, and the
              result is a URL the visitor can bookmark or share. */}
          <form action="/facilities" method="get" className="mt-8 flex flex-wrap items-end gap-4">
            {filters.type && <input type="hidden" name="type" value={filters.type} />}
            {filters.country && <input type="hidden" name="country" value={filters.country} />}

            <div className="flex-1 min-w-[14rem]">
              <label
                htmlFor="facility-q"
                className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
              >
                Facility name
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
                htmlFor="facility-city"
                className="block font-mono text-[10px] uppercase tracking-kicker text-ink/50"
              >
                City
              </label>
              <input
                id="facility-city"
                name="city"
                type="text"
                defaultValue={filters.city ?? ""}
                placeholder="Accra, Kumasi, Takoradi…"
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
            {filters.city ? ` · ${filters.city}` : ""}
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
