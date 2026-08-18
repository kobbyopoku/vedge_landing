import type { MetadataRoute } from "next";
import { FACILITY_TYPES } from "./_data/facilities";
import { getAllFacilities } from "./_lib/api";
import { LEGAL_CONFIG } from "./_lib/legal/config";

/** Canonical production origin — see the note in `app/facilities/page.tsx`. */
const SITE_URL = LEGAL_CONFIG.urls.marketing;

/**
 * Rebuilt on the same 5-minute clock as the directory fetch underneath
 * it, so a facility that lists itself is in the sitemap within the same
 * window its page goes live — rather than at the next deploy.
 */
export const revalidate = 300;

/**
 * Every page on this site that is worth crawling.
 *
 * **Hand-maintained, and that is the trade.** Next has no way to
 * enumerate an app router's static routes at runtime, so a new page must
 * be added here by hand or it stays out of the sitemap. The alternative
 * — globbing the filesystem at build time — reads well until it starts
 * emitting route groups, private folders and API handlers as crawlable
 * URLs. A list you can read is worth more than a clever one you cannot.
 *
 * `changeFrequency` and `priority` are advisory at best (Google has said
 * publicly it ignores both), so they are set once, coarsely, and not
 * fussed over.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/facilities", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/solutions/hospitals-clinics", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/medical-labs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/pharmacies", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/diagnostic-centers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/companions/vedge-staff", priority: 0.7, changeFrequency: "monthly" },
  { path: "/companions/vedge-patient", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/legal", priority: 0.4, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/patient-privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/dpa", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/security", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/compliance", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/acceptable-use", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/sla", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/refund", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/ai", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/sub-processors", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/regional-annexes", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Never throws: `getAllFacilities` funnels through `getFacilities`,
  // which falls back to an empty list. A backend outage during a build
  // costs the facility URLs in this file, not the file — and not the
  // build.
  const facilities = await getAllFacilities();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    // The type-filtered directory views — but only for types that
    // actually have a facility in them.
    //
    // The closed set is what makes these safe to list at all (unlike the
    // free-text city and search views, which `app/facilities/page.tsx`
    // marks `noindex` precisely because they are unbounded). Filtering
    // to the occupied types is the second half of that: submitting
    // `?type=BLOOD_BANK` while no blood bank has listed itself asks a
    // crawler to spend budget on a page we already know is empty, and
    // fifteen of those around a near-empty launch directory is a thin
    // content signal aimed at the very pages we want ranking.
    ...FACILITY_TYPES.filter((type) => facilities.some((f) => f.orgType === type.value)).map(
      (type) => ({
        url: `${SITE_URL}/facilities?type=${type.value}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }),
    ),

    // The point of the whole file: one entry per listed facility.
    ...facilities.map((facility) => ({
      url: `${SITE_URL}/facilities/${facility.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
