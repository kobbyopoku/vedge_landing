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

// ── description-less facilities ──────────────────────────────────────

/**
 * The facts a facility page carries **about itself**, as short phrases,
 * in the order the page renders the corresponding sections.
 *
 * This exists because on 2026-08-20 the backend stopped requiring a
 * public description to be listed (`OrganizationRepository#LISTED_PREDICATE`,
 * backend `c8e53df`), so this site now has to render facilities that
 * have never written a paragraph. Every phrase here is a **count or a
 * presence check over a structured field the facility filled in
 * itself** — never an adjective, never a claim, never a sentence anyone
 * at Vedge wrote on their behalf. That constraint is the point: the
 * directory's design forbids composing marketing copy for a tenant, so
 * the only honest thing to put where their prose would go is a
 * restatement of their own data.
 *
 * Two callers, deliberately the same list. The page renders these as its
 * "At a glance" line, and `generateMetadata` composes its fallback
 * description out of them — so the meta description enumerates the
 * sections the page actually has, and cannot drift into promising
 * "hours, services and contact details" to a facility that has none of
 * the three. That drift was real: it was the previous fallback's literal
 * wording.
 *
 * Empty is a legitimate return. A facility with a slug, a name and
 * nothing else has no facts, and the callers must handle that rather
 * than inventing one — see {@link facilityHasIndexableSubstance}.
 */
export function facilityFactPhrases(facility: FacilityDetail): string[] {
  const phrases: string[] = [];
  const services = facility.services.length;
  const branches = facility.branches.length;

  if (services > 0) phrases.push(`${services} published service${services === 1 ? "" : "s"}`);
  if (branches > 0) phrases.push(`${branches} location${branches === 1 ? "" : "s"}`);
  if (facility.hours) phrases.push("opening hours");
  if (facility.phone || facility.email || facility.website) phrases.push("contact details");

  return phrases;
}

/**
 * Join phrases into one clause: `a`, `a and b`, `a, b, and c`.
 * Sentence-cased, because a caller may start a sentence with it.
 */
export function joinPhrases(phrases: string[]): string {
  const joined =
    phrases.length <= 1
      ? (phrases[0] ?? "")
      : phrases.length === 2
        ? `${phrases[0]} and ${phrases[1]}`
        : `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
  return joined ? joined.charAt(0).toUpperCase() + joined.slice(1) : joined;
}

/**
 * Whether a facility page carries enough of its own substance to be
 * worth a search result.
 *
 * **This is the landing site's half of the trade the owner made**, and
 * it deliberately does not implement the rule the corrected spec names.
 *
 * The spec (`2026-08-17-facilities-directory-design.md` §1.2) says that
 * if `/pricing` and `/solutions` lose ground after the listing floor
 * came down, the response is "`noindex` on description-less facility
 * pages, or a `<meta robots>` threshold on rendered content length".
 * This is the second of those two, and it is the second on purpose:
 *
 *   * **"Description-less" is a bad proxy for "thin".** The facility
 *     this whole reversal exists for — the one the ledger describes as
 *     "published services but never wrote one" — has forty tariffs and
 *     five branches with addresses and phone numbers. That page is
 *     substantially *more* unique, useful, locally-relevant content than
 *     a facility whose entire profile is two sentences of prose. Keying
 *     `noindex` off the description column would de-index the exact
 *     pages the owner overrode the floor to make findable, which is the
 *     reversal undone in a different file.
 *
 *   * **`noindex` and "findable by name" are not compatible**, whatever
 *     §1.2 says. A `noindex` page is not in the index; nobody finds it
 *     by searching its name. It survives only for someone who already
 *     has the link. So the description-less rule would cost far more
 *     than §1.2 prices it at, and that is worth saying out loud rather
 *     than discovering later.
 *
 * So the threshold measures substance directly. A page is indexable if
 * it has any of: the facility's own description; at least one published
 * service; at least one branch; or a street address. Each of those
 * independently makes the page answer a question a searcher actually
 * asked. What is excluded is the case the original §1 named and got
 * right — "a page carrying a name and a phone number is not a page" —
 * so a lone phone, email, website or opening-hours string is not
 * substance on its own. That case is rare and its pages genuinely
 * cannot rank for anything; keeping them out of the index costs the
 * facility nothing it had.
 *
 * @see the `robots` block in `app/facilities/[slug]/page.tsx`, the only
 *      caller, and the section on this in the landing report.
 */
export function facilityHasIndexableSubstance(facility: FacilityDetail): boolean {
  return Boolean(
    facility.description ||
      facility.services.length > 0 ||
      facility.branches.length > 0 ||
      facility.address,
  );
}

/**
 * The schema.org payload for a facility page.
 *
 * Lives here rather than in the page component for two reasons: it is a
 * pure function of the facility and can therefore be tested without a
 * renderer, and structured data is the one lever §1.2 of the directory
 * spec names for recovering the search value the removed content floor
 * used to guarantee. That lever is worth having somewhere it can be
 * asserted on.
 *
 * `MedicalOrganization` deliberately, not `LocalBusiness`: it is the
 * type Google documents for healthcare providers, and it is the honest
 * description of every `OrgType` in the directory.
 *
 * **Every key is conditional, and that is the whole design.** A field
 * the facility never filled in is absent from the payload — never
 * present-and-empty, never `null`, never a placeholder. A description-less
 * facility simply has no `description` key, which is a valid and
 * complete `MedicalOrganization`; emitting `"description": ""` would be
 * strictly worse than emitting nothing, because it asserts that the
 * answer is the empty string.
 *
 * `location` carries the branches, and for a facility with no prose it
 * is the most valuable thing on the page: real addresses, real phone
 * numbers, real coordinates, each one the facility's own. `location`
 * rather than `department` — a department is a unit *within* a site
 * ("a store with a pharmacy"), whereas these are separate sites, which
 * is exactly what `Place` describes. A branch contributes only the
 * subset of fields it actually has, and `geo` appears only when
 * `branchDirectionsUrl` would also have produced a link, so the two
 * cannot disagree about whether a coordinate pair is usable.
 */
export function facilityJsonLd(
  facility: FacilityDetail,
  siteUrl: string,
): Record<string, unknown> {
  const branchPlaces = facility.branches.map((branch) => {
    const hasAddress = Boolean(
      branch.addressLine || branch.city || branch.region || branch.countryCode,
    );
    const hasGeo = branchDirectionsUrl(branch.latitude, branch.longitude) !== null;

    return {
      "@type": "Place",
      name: branch.name,
      ...(branch.phone ? { telephone: branch.phone } : {}),
      ...(hasAddress
        ? {
            address: {
              "@type": "PostalAddress",
              ...(branch.addressLine ? { streetAddress: branch.addressLine } : {}),
              ...(branch.city ? { addressLocality: branch.city } : {}),
              ...(branch.region ? { addressRegion: branch.region } : {}),
              ...(branch.countryCode ? { addressCountry: branch.countryCode } : {}),
            },
          }
        : {}),
      ...(hasGeo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: branch.latitude,
              longitude: branch.longitude,
            },
          }
        : {}),
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: facility.name,
    url: `${siteUrl}/facilities/${facility.slug}`,
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
    ...(branchPlaces.length > 0 ? { location: branchPlaces } : {}),
  };
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
