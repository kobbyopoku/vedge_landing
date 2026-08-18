/**
 * Types and static data for the public facilities directory.
 *
 * **This file is the landing site's mirror of the backend's public
 * facility projections** — `PublicFacilitySummary` and
 * `PublicFacilityDetail` in
 * `vedge-app/src/main/java/com/vedge/app/facilities/dto/`. Those two
 * records are hand-written allowlists pinned by
 * `PublicFacilityProjectionTest`, so a column added to `organizations`
 * cannot widen this surface by accident. Keep the shapes below in step
 * with them: if a component is added there, add it here deliberately —
 * never by widening a type to `Record<string, unknown>`.
 *
 * Unlike `plans.ts`, this file carries **no rows**. See
 * `facilitiesFallback` at the bottom for why that is the correct
 * fallback for a directory and not an oversight.
 */

// ── shapes ───────────────────────────────────────────────────────────

/**
 * One publishable service on a facility's page — the landing mirror of
 * `com.vedge.billing.tariff.dto.PublicServiceOption`.
 *
 * There is deliberately **no price field**, because there is none on the
 * backend record either: the tenant's rate card must never reach an
 * unauthenticated visitor, and the query behind it never loads the price
 * columns at all. Do not add one here "for later" — a field that exists
 * is a field something will eventually populate.
 */
export type FacilityService = {
  /** `tariffCodeId` on the wire. Used only as a React key. */
  id: string;
  code: string;
  description: string | null;
  modality: string | null;
  bodyPart: string | null;
};

/** A facility as the directory list shows it (`PublicFacilitySummary`). */
export type Facility = {
  slug: string;
  name: string;
  /** The raw `OrgType` enum name, e.g. `DIAGNOSTIC_CENTER`. Render it through {@link facilityTypeLabel}. */
  orgType: string | null;
  city: string | null;
  /** ISO 3166-1 **alpha-3**, e.g. `GHA` — not alpha-2. `organizations.country_code` is `VARCHAR(3)`. */
  countryCode: string | null;
  logoUrl: string | null;
  /** Capped at ~200 characters server-side and cut at a word boundary. */
  shortDescription: string | null;
  acceptsRequests: boolean;
};

/**
 * One of a facility's physical locations (`PublicFacilityBranch`).
 *
 * `latitude`/`longitude` are nullable exactly as they are on the backend
 * record — no tenant could set them until this shipped, so a branch with
 * no coordinates on file is the normal case, not an error. Render it
 * anyway; it simply gets no directions link (see
 * {@link branchDirectionsUrl}).
 */
export type FacilityBranch = {
  name: string;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  /** ISO 3166-1 **alpha-3**, same convention as {@link Facility.countryCode}. */
  countryCode: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  isMainBranch: boolean;
};

/** A facility as its own page shows it (`PublicFacilityDetail`). */
export type FacilityDetail = {
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
  /** `#rrggbb`, already validated by the mapper — anything else arrives as `null`. */
  accentColorHex: string | null;
  acceptsRequests: boolean;
  services: FacilityService[];
  /** Active branches, main branch first then alphabetical — the backend's own order, kept as-is. */
  branches: FacilityBranch[];
};

// ── display labels ───────────────────────────────────────────────────

/**
 * Every `OrgType` a facility can be, with the label this site shows for
 * it.
 *
 * `PLATFORM` is absent on purpose — it is Vedge's own organisation, and
 * `PublicFacilityDirectoryService.isListed` excludes it from both halves
 * of the listing rule, so it can never appear here. Listing it as a
 * filter would offer a chip that is guaranteed to return nothing.
 *
 * The backend deliberately sends the enum **name**, not its
 * `displayName` — "the label is the client's call"
 * (`PublicFacilityDirectoryService#orgTypeName`). So these labels use
 * this site's own house spelling ("centre", not "center") while the
 * `value` stays byte-identical to the Java enum constant, which is what
 * `?type=` is matched against.
 */
export const FACILITY_TYPES: { value: string; label: string }[] = [
  { value: "HOSPITAL", label: "Hospitals" },
  { value: "CLINIC", label: "Clinics" },
  { value: "POLYCLINIC", label: "Polyclinics" },
  { value: "LABORATORY", label: "Laboratories" },
  { value: "PHARMACY", label: "Pharmacies" },
  { value: "DIAGNOSTIC_CENTER", label: "Diagnostic centres" },
  { value: "MATERNITY_HOME", label: "Maternity homes" },
  { value: "DENTAL_CLINIC", label: "Dental clinics" },
  { value: "EYE_CLINIC", label: "Eye clinics" },
  { value: "MENTAL_HEALTH", label: "Mental health" },
  { value: "REHAB_CENTER", label: "Rehabilitation" },
  { value: "NURSING_HOME", label: "Nursing homes" },
  { value: "BLOOD_BANK", label: "Blood banks" },
  { value: "AMBULANCE_SERVICE", label: "Ambulance services" },
  { value: "TELEHEALTH", label: "Telehealth" },
];

/** Singular labels, for a card badge and a facility page's header. */
const FACILITY_TYPE_SINGULAR: Record<string, string> = {
  HOSPITAL: "Hospital",
  CLINIC: "Clinic",
  POLYCLINIC: "Polyclinic",
  LABORATORY: "Laboratory",
  PHARMACY: "Pharmacy",
  DIAGNOSTIC_CENTER: "Diagnostic centre",
  MATERNITY_HOME: "Maternity home",
  DENTAL_CLINIC: "Dental clinic",
  EYE_CLINIC: "Eye clinic",
  MENTAL_HEALTH: "Mental health centre",
  REHAB_CENTER: "Rehabilitation centre",
  NURSING_HOME: "Nursing home",
  BLOOD_BANK: "Blood bank",
  AMBULANCE_SERVICE: "Ambulance service",
  TELEHEALTH: "Telehealth provider",
};

/**
 * A human label for an `OrgType` name.
 *
 * Falls back to a title-cased version of whatever arrived rather than to
 * an empty string: a facility type added to the Java enum after this
 * deploy must still render its own page legibly, not as a blank badge.
 */
export function facilityTypeLabel(orgType: string | null | undefined): string {
  if (!orgType) return "Facility";
  const known = FACILITY_TYPE_SINGULAR[orgType];
  if (known) return known;
  return orgType
    .toLowerCase()
    .split("_")
    .map((word, i) => (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

/** The plural label used on filter chips and list headings. */
export function facilityTypePluralLabel(orgType: string | null | undefined): string | null {
  if (!orgType) return null;
  return FACILITY_TYPES.find((t) => t.value === orgType)?.label ?? null;
}

/**
 * ISO 3166-1 alpha-3 → country name, for the markets Vedge names on this
 * site. Anything else renders as the raw code, which is still meaningful
 * to a reader and cannot break a card.
 */
const COUNTRY_NAMES: Record<string, string> = {
  GHA: "Ghana",
  NGA: "Nigeria",
  KEN: "Kenya",
  ZAF: "South Africa",
  RWA: "Rwanda",
  TZA: "Tanzania",
  UGA: "Uganda",
  CIV: "Côte d'Ivoire",
  SEN: "Senegal",
  ETH: "Ethiopia",
};

export function countryLabel(code: string | null | undefined): string | null {
  if (!code) return null;
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/** Where a card's location line comes from — city, country, or both. */
export function locationLabel(
  city: string | null | undefined,
  countryCode: string | null | undefined,
): string | null {
  const country = countryLabel(countryCode);
  if (city && country) return `${city}, ${country}`;
  return city || country || null;
}

/**
 * Where a branch card's location line comes from — city, region, and
 * country, whichever of the three are present. Unlike {@link locationLabel}
 * this also carries `region`, because a branch (unlike the facility
 * itself) has one.
 */
export function branchLocationLabel(
  city: string | null | undefined,
  region: string | null | undefined,
  countryCode: string | null | undefined,
): string | null {
  const parts = [city, region, countryLabel(countryCode)].filter(
    (part): part is string => Boolean(part && part.trim()),
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * A "Directions" link for a branch with known coordinates — never an
 * embedded map, which would cost a tile provider, an API key, and payload
 * on a route already slimmed twice. Google's documented query-only URL
 * scheme (`?api=1&query=lat,lng`) needs neither: it opens the visitor's
 * own maps app on mobile and Google Maps on the web, built entirely from
 * two numbers.
 *
 * `null` whenever either coordinate is missing or out of range — the
 * normal case for a branch (see {@link FacilityBranch}), and, per the
 * brief this shipped under, a link built from a bad number is worse than
 * no link at all, so this stays conservative rather than rendering
 * anything it isn't sure of.
 */
export function branchDirectionsUrl(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): string | null {
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

// ── static fallback ──────────────────────────────────────────────────

/**
 * The static fallback for {@link getFacilities} — **deliberately empty,
 * and it must stay that way.**
 *
 * `plans.ts` can carry real rows because the plan catalogue is ours: it
 * mirrors a backend migration we wrote, so a hard-coded copy is a
 * faithful copy. A facility directory is the opposite. Every word on
 * every entry — the description, the hours, the address — is written by
 * the facility itself, with no seeding anywhere in the system. There is
 * no copy of it for this file to hold, and inventing rows would publish
 * facilities that either do not exist or never agreed to be listed,
 * under `tryvedge.com`'s own name.
 *
 * So the fallback's job here is narrower than `plans.ts`'s, and worth
 * stating plainly: it keeps the build and the page **alive** when the
 * backend is unreachable. It does not keep them **populated**. What
 * survives an outage is the page shell, the filter chips, and the
 * static routes in the sitemap — all of which come from this file.
 *
 * If Vedge ever does want a hand-curated launch set on this page, it
 * goes here — but it should be facilities that have agreed to it, and it
 * should be reviewed as marketing copy, not slipped in as a fallback.
 */
export const facilitiesFallback: Facility[] = [];
