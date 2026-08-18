import { plans as staticPlans, type Plan, type Vertical } from "../_data/plans";
import {
  facilitiesFallback,
  type Facility,
  type FacilityBranch,
  type FacilityDetail,
  type FacilityService,
} from "../_data/facilities";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8050";

/**
 * How long any public read may take before we stop waiting for it.
 *
 * **Without this, the static fallback below does not actually work.** It
 * catches a fetch that *fails* — `ECONNREFUSED` when nothing is
 * listening, `ENOTFOUND` when DNS is gone. It does nothing at all for a
 * backend that accepts the connection and then never answers, because
 * that raises no error to catch: the fetch simply waits, forever.
 * Measured on this repo before this constant existed, a build against a
 * connect-and-stall backend was still hung at "Collecting page data"
 * when it was force-killed at 120 seconds. `/facilities` is a dynamic
 * route, so every production request could hang the same way.
 *
 * **Why 8 seconds.** Two ceilings and one floor.
 *
 * The floor: it must sit far above a healthy response, or a
 * slow-but-working backend silently empties a directory that would have
 * rendered. These endpoints are served behind a five-minute
 * `Cache-Control` and a partial index built for exactly this query, so a
 * healthy p99 is low hundreds of milliseconds even across a
 * trans-Atlantic hop. Eight seconds is roughly an order of magnitude of
 * headroom over that.
 *
 * The first ceiling: it must fire *before* the hosting platform's own
 * function timeout, or the protection is theoretical — the platform
 * kills the function first and the visitor gets a 504 instead of our
 * fallback. Vercel's default Node function budget is 10s on the
 * tightest plan, so 8s wins that race with margin on every plan.
 *
 * The second ceiling: it bounds a bad build. A stalled backend costs at
 * most this long per call site, and the call sites self-limit — when
 * `generateStaticParams` times out it falls back to an empty list, so no
 * per-facility fetches follow it. Worst case is a handful of these, not
 * one per facility.
 *
 * The consumer here is a crawler or a build, not an impatient human, so
 * this is deliberately more patient than a UI fetch would be — but not
 * so patient that the protection stops protecting.
 */
const FETCH_TIMEOUT_MS = 8_000;

/**
 * Fetch options shared by every public read on this site: no-store in
 * dev so a local backend change shows up immediately, 5-minute ISR in
 * production, and a deadline on all of them. Extracted so `plans` and
 * `facilities` cannot drift into two different caching — or two
 * different timeout — stories.
 *
 * Called per request, so each fetch gets its own signal with its own
 * clock rather than sharing one deadline across a page's worth of calls.
 *
 * The signal is safe to combine with ISR: Next's patched fetch passes it
 * straight through to the origin fetch and strips it only when
 * refreshing an already-stale entry in the background — a fetch nobody
 * is waiting on, which is the one place a deadline would be pointless
 * anyway. Caching is not disabled by its presence.
 */
function publicFetchInit(): RequestInit {
  const isDev = process.env.NODE_ENV === "development";
  return {
    // In dev: no-store forces a fresh fetch every request.
    // In production: ISR revalidates every 5 minutes.
    cache: isDev ? "no-store" : undefined,
    ...(!isDev && { next: { revalidate: 300 } }),
    // Rejects with a TimeoutError, which every call site below treats as
    // the failure it is: `getPlans` and `getFacilities` fall back,
    // `getFacility` re-throws so a stalled backend surfaces as a fast
    // 5xx rather than a fabricated 404.
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  };
}

/**
 * Shape returned by the backend's PlanWithFeaturesResponse.
 * Only the fields the landing site actually uses are typed here.
 */
interface ApiPlan {
  code: string;
  name: string;
  orgType: string;
  monthlyPriceGhs: number;
  annualPriceGhs: number;
  trialDays: number;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  tagline: string | null;
  badge: string | null;
  includes: string[];
  features: string[];
  limits: Record<string, number | null>;
}

/** Map backend orgType strings to the landing's Vertical type. */
function toVertical(orgType: string): Vertical | null {
  switch (orgType) {
    case "HOSPITAL":
    case "CLINIC":
      return "hospital";
    case "LABORATORY":
      return "laboratory";
    case "PHARMACY":
      return "pharmacy";
    case "PATIENT":
      return "patient";
    case "DIAGNOSTIC_CENTER":
      return "diagnostic_center";
    default:
      return null;
  }
}

/** Convert an API plan to the landing's Plan shape. */
function toPlan(api: ApiPlan): Plan | null {
  const vertical = toVertical(api.orgType);
  if (!vertical) return null;

  return {
    code: api.code,
    vertical,
    name: api.name,
    tagline: api.tagline ?? api.description ?? "",
    monthly: api.monthlyPriceGhs,
    trialDays: api.trialDays,
    badge: api.badge ?? undefined,
    includes: api.includes ?? [],
  };
}

/** Fetch plans from the backend API with ISR (5-minute revalidation). */
async function fetchPlans(): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/api/public/plans`, publicFetchInit());
  if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
  const apiPlans: ApiPlan[] = await res.json();
  return apiPlans
    .map(toPlan)
    .filter((p): p is Plan => p !== null);
}

/**
 * Get plans — fetches from the backend API with a static fallback.
 * Used by the pricing page (Server Component).
 */
export async function getPlans(): Promise<Plan[]> {
  try {
    const plans = await fetchPlans();
    // If the API returned an empty list, fall back to static data
    if (plans.length === 0) {
      console.warn("API returned 0 plans, using static fallback");
      return staticPlans;
    }
    return plans;
  } catch (e) {
    console.warn("Failed to fetch plans from API, using static fallback", e);
    return staticPlans;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Facilities directory — GET /api/public/facilities[/{slug}]
// ═══════════════════════════════════════════════════════════════════════

/** Shape returned by the backend's `PublicServiceOption`. No price field — by design on both sides. */
interface ApiServiceOption {
  tariffCodeId: string;
  code: string;
  description: string | null;
  modality: string | null;
  bodyPart: string | null;
}

/** Shape returned by the backend's `PublicFacilitySummary`. */
interface ApiFacilitySummary {
  slug: string;
  name: string;
  orgType: string | null;
  city: string | null;
  countryCode: string | null;
  logoUrl: string | null;
  shortDescription: string | null;
  acceptsRequests: boolean;
}

/** Shape returned by the backend's `PublicFacilityBranch`. */
interface ApiFacilityBranch {
  name: string;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  countryCode: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  isMainBranch: boolean;
}

/** Shape returned by the backend's `PublicFacilityDetail`. */
interface ApiFacilityDetail {
  slug: string;
  name: string;
  orgType: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  countryCode: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
  accentColorHex: string | null;
  acceptsRequests: boolean;
  services: ApiServiceOption[] | null;
  branches: ApiFacilityBranch[] | null;
}

/**
 * Spring Data's `Page<T>`, read defensively.
 *
 * Spring Boot 3.4 serialises `PageImpl` with the pagination counters as
 * siblings of `content` (the shape `vedge_frontend`'s `Page<T>` types).
 * Boot has deprecated that shape and a future
 * `spring.data.web.pageable.serialization-mode=via_dto` flips the same
 * counters into a nested `page` object. Reading both costs four optional
 * fields and means that flip — made for the app frontend's benefit, on a
 * repo whose CI never builds this one — cannot silently turn every
 * directory page into "page 1 of 0".
 */
interface ApiPage<T> {
  content?: T[] | null;
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
  page?: {
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
  };
}

/** One page of directory results, plus what a pager needs to render. */
export type FacilityPage = {
  facilities: Facility[];
  /** Zero-based, matching the API. */
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

/** Every filter `GET /api/public/facilities` accepts. All optional. */
export type FacilityQuery = {
  /** ISO 3166-1 alpha-3, e.g. `GHA`. */
  country?: string;
  /** An `OrgType` name. An unrecognised value returns an empty page rather than an error. */
  type?: string;
  /**
   * Replaced `city` on the backend contract. Matches the org's own city
   * or street address, or any active branch's city, region, or address —
   * a facility headquartered in Accra with a Kumasi branch is now found
   * by searching Kumasi, and a single-site clinic is found by its own
   * address. The API silently ignores an inbound `city` param
   * rather than rejecting it, so this type has no `city` field at all:
   * nothing here can accidentally send the parameter the backend no
   * longer reads. See `app/facilities/page.tsx#readFilters` for how an
   * old `?city=` link is mapped onto this field instead of being dropped.
   */
  location?: string;
  /** Free-text search over a facility's own name and description only — no longer city. */
  q?: string;
  /**
   * Contains-match over a facility's published services — description,
   * code, modality and body part, the same four fields the facility
   * page's own "Filter this list" box matches client-side
   * (`app/facilities/[slug]/ServicesList.tsx`). So "MRI" finds a tariff
   * described "Magnetic resonance imaging, brain" whose modality is MRI.
   */
  service?: string;
  /** Zero-based. */
  page?: number;
  size?: number;
};

/**
 * The server caps `size` at 100 (`PublicFacilityController.MAX_PAGE_SIZE`)
 * and silently narrows anything larger, so asking for more is not an
 * error — it just quietly does not do what the caller asked. Never send
 * more than this.
 */
export const MAX_FACILITY_PAGE_SIZE = 100;

/** How many cards a directory page shows. */
export const FACILITY_PAGE_SIZE = 24;

/**
 * A URL we are willing to put in an `href` or an `img src`.
 *
 * Every value behind this is typed by a tenant into their own settings
 * screen, which makes it attacker-controlled text arriving on a page we
 * host. `javascript:` and `data:` URLs are the reason this exists:
 * React will not stop a `javascript:` href from being rendered, and a
 * `data:` logo is an arbitrary payload served from our origin's context.
 * Anything that is not plain http(s) becomes `null`, and the page simply
 * does not render that link.
 *
 * A bare host ("korlebu.gov.gh") is upgraded to `https://` rather than
 * dropped — tenants type a website without a scheme constantly, and
 * discarding it would silently lose a field they filled in correctly by
 * their own lights.
 */
function safeHttpUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // A scheme is anything up to the first colon that looks like one.
  // "javascript:alert(1)" matches here and is rejected by the check below.
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * A hex colour we are willing to put in a `style` attribute. Same reason
 * as {@link safeHttpUrl}: the value is tenant-typed, and an unvalidated
 * string in an inline style is a CSS injection. Three- and six-digit
 * forms only; anything else falls back to the site's own palette.
 */
function safeHexColor(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed) ? trimmed : null;
}

/** Trim to null — the API sends `null` for an absent field, but a tenant can save "  ". */
function text(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function toFacilityService(api: ApiServiceOption): FacilityService {
  return {
    id: api.tariffCodeId,
    code: api.code,
    description: text(api.description),
    modality: text(api.modality),
    bodyPart: text(api.bodyPart),
  };
}

/**
 * Convert an API branch to the landing's shape. `latitude`/`longitude`
 * are read defensively — anything other than a JSON number (should never
 * happen, but this is attacker-adjacent tenant data by the time it is
 * theirs to set) becomes `null` rather than `NaN`, so a malformed value
 * quietly loses its directions link instead of building a wrong one.
 */
function toFacilityBranch(api: ApiFacilityBranch): FacilityBranch {
  return {
    name: api.name,
    addressLine: text(api.addressLine),
    city: text(api.city),
    region: text(api.region),
    countryCode: text(api.countryCode),
    phone: text(api.phone),
    latitude: typeof api.latitude === "number" ? api.latitude : null,
    longitude: typeof api.longitude === "number" ? api.longitude : null,
    isMainBranch: api.isMainBranch === true,
  };
}

/** Convert an API summary to the landing's Facility shape. */
function toFacility(api: ApiFacilitySummary): Facility | null {
  // A row with no slug has no page to link to. The backend's listing
  // rule already guarantees one (`LISTED_PREDICATE`), so this is a
  // belt-and-braces guard against a card that renders a dead link.
  if (!api?.slug || !api.name) return null;
  return {
    slug: api.slug,
    name: api.name,
    orgType: text(api.orgType),
    city: text(api.city),
    countryCode: text(api.countryCode),
    logoUrl: safeHttpUrl(api.logoUrl),
    shortDescription: text(api.shortDescription),
    acceptsRequests: api.acceptsRequests === true,
  };
}

/** Convert an API detail to the landing's FacilityDetail shape. */
function toFacilityDetail(api: ApiFacilityDetail): FacilityDetail {
  return {
    slug: api.slug,
    name: api.name,
    orgType: text(api.orgType),
    description: text(api.description),
    address: text(api.address),
    city: text(api.city),
    countryCode: text(api.countryCode),
    hours: text(api.hours),
    phone: text(api.phone),
    email: text(api.email),
    website: safeHttpUrl(api.website),
    logoUrl: safeHttpUrl(api.logoUrl),
    accentColorHex: safeHexColor(api.accentColorHex),
    acceptsRequests: api.acceptsRequests === true,
    services: (api.services ?? []).map(toFacilityService),
    branches: (api.branches ?? []).map(toFacilityBranch),
  };
}

/** Build the query string, omitting every filter the caller left blank. */
function facilityQueryString(query: FacilityQuery): string {
  const params = new URLSearchParams();
  if (query.country) params.set("country", query.country);
  if (query.type) params.set("type", query.type);
  if (query.location) params.set("location", query.location);
  if (query.q) params.set("q", query.q);
  if (query.service) params.set("service", query.service);
  if (query.page && query.page > 0) params.set("page", String(query.page));
  params.set("size", String(Math.min(query.size ?? FACILITY_PAGE_SIZE, MAX_FACILITY_PAGE_SIZE)));
  return params.toString();
}

/** Fetch one page of the directory with ISR (5-minute revalidation). */
async function fetchFacilities(query: FacilityQuery): Promise<FacilityPage> {
  const res = await fetch(
    `${API_URL}/api/public/facilities?${facilityQueryString(query)}`,
    publicFetchInit(),
  );
  if (!res.ok) throw new Error(`Failed to fetch facilities: ${res.status}`);

  const body: ApiPage<ApiFacilitySummary> = await res.json();
  const counters = body.page ?? body;
  return {
    facilities: (body.content ?? [])
      .map(toFacility)
      .filter((f): f is Facility => f !== null),
    page: counters.number ?? 0,
    size: counters.size ?? (query.size ?? FACILITY_PAGE_SIZE),
    totalPages: counters.totalPages ?? 0,
    totalElements: counters.totalElements ?? 0,
  };
}

/**
 * Get one page of the facilities directory — the API with a static
 * fallback, same shape as {@link getPlans}, with one deliberate
 * difference.
 *
 * **An empty list is NOT a failure here, and must never be turned into
 * one.** `getPlans` treats zero plans as a broken backend and swaps in
 * `staticPlans`, which is right for a catalogue we seed ourselves: a
 * pricing page with no prices is always a bug. This directory is the
 * opposite. It launches near-empty by design — a facility appears only
 * once it has written its own description, and nothing seeds one — so
 * "no facilities yet" is the true answer, not a symptom. Falling back on
 * empty would replace a correct empty state with stale marketing rows
 * and hide the very outcome the launch is measuring.
 *
 * So: fall back **only on a throw**. If you are here because this looks
 * inconsistent with `getPlans` twenty lines up, it is inconsistent on
 * purpose — please read the paragraph above before "fixing" it.
 */
export async function getFacilities(query: FacilityQuery = {}): Promise<FacilityPage> {
  try {
    return await fetchFacilities(query);
  } catch (e) {
    console.warn("Failed to fetch facilities from API, using static fallback", e);
    return {
      facilities: facilitiesFallback,
      page: 0,
      size: query.size ?? FACILITY_PAGE_SIZE,
      totalPages: facilitiesFallback.length > 0 ? 1 : 0,
      totalElements: facilitiesFallback.length,
    };
  }
}

/**
 * Get one facility's page.
 *
 * @returns the facility, or `null` when the API answered 404 — which it
 *          does both for a slug that does not exist and for a facility
 *          that is not listed, **deliberately indistinguishably**
 *          (`PublicFacilityDirectoryService.NOT_FOUND_REASON`). Whether
 *          a facility has written a description is not something the
 *          endpoint discloses, so there is nothing here that tries to
 *          tell the two apart, and nothing should be added that does.
 *
 * @throws on a transport failure or any non-404 error status — and that
 *         is the one place this function deliberately refuses to fall
 *         back. There is no static copy of a facility's page to serve
 *         (see `facilitiesFallback`), so the only "fallback" available
 *         would be to return `null` and let the page 404. That would
 *         answer a five-minute backend outage by telling every crawler
 *         that every real facility page is permanently gone, and Next
 *         would cache that 404 for the revalidate window. A thrown error
 *         surfaces as a 5xx instead: not cached, retried on the next
 *         request, and read by crawlers as "come back later" rather than
 *         "delete this URL". On a page whose entire point is being
 *         indexed, that difference is the whole ballgame.
 */
export async function getFacility(slug: string): Promise<FacilityDetail | null> {
  const res = await fetch(
    `${API_URL}/api/public/facilities/${encodeURIComponent(slug)}`,
    publicFetchInit(),
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch facility ${slug}: ${res.status}`);
  return toFacilityDetail(await res.json());
}

/** 5 pages × 100 = the first 500 listed facilities. */
export const MAX_SITEMAP_PAGES = 5;

/**
 * Every listed facility, for the sitemap and for prerendering.
 *
 * Pages at the server's own ceiling and stops at {@link MAX_SITEMAP_PAGES}
 * so a directory that grows to five figures cannot turn one sitemap
 * build into a thousand sequential requests against a rate-limited
 * public endpoint. If the directory ever approaches that ceiling, the
 * answer is a paginated sitemap index, not a bigger number here.
 *
 * Partial results are kept rather than discarded: a sitemap listing the
 * first 500 facilities is strictly better than one listing none.
 */
export async function getAllFacilities(limitPages = MAX_SITEMAP_PAGES): Promise<Facility[]> {
  const all: Facility[] = [];
  for (let page = 0; page < limitPages; page++) {
    const result = await getFacilities({ page, size: MAX_FACILITY_PAGE_SIZE });
    all.push(...result.facilities);
    if (result.facilities.length === 0 || page + 1 >= result.totalPages) break;
  }
  return all;
}
