import { plans as staticPlans, type Plan, type Vertical } from "../_data/plans";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8050";

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
  const isDev = process.env.NODE_ENV === "development";
  const res = await fetch(`${API_URL}/api/public/plans`, {
    // In dev: no-store forces a fresh fetch every request.
    // In production: ISR revalidates every 5 minutes.
    cache: isDev ? "no-store" : undefined,
    ...(!isDev && { next: { revalidate: 300 } }),
  });
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
