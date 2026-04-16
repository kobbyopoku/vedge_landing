/**
 * Full pricing catalog — 10 plans across 3 verticals + 1 consumer app.
 *
 * **This file is the frontend mirror of the backend catalog seeded by
 * vedge_backend/vedge-app/src/main/resources/db/migration/V27__subscription_module.sql.**
 * Plan `code` values here must match the backend exactly. Prices are in
 * Ghanaian Cedis per month. The annual figure is derived from the monthly
 * using the same 20% discount the backend applies.
 *
 * If you need to change pricing, change the backend migration FIRST and
 * then update this file to match. Never drift.
 */

export type Vertical = "hospital" | "laboratory" | "pharmacy" | "patient";

export type Plan = {
  code: string;
  vertical: Vertical;
  name: string;
  tagline: string;
  monthly: number | "custom";
  trialDays: number;
  badge?: string;
  includes: string[];
  excludes?: string[];
};

/** Annual discount the backend applies. Keep in sync with V27's pricing math. */
const ANNUAL_DISCOUNT = 0.80; // 20% off the sticker monthly × 12

export const plans: Plan[] = [
  // ── Hospitals & clinics ─────────────────────────────────────────────
  {
    code: "HOSPITAL_CLINIC",
    vertical: "hospital",
    name: "Vedge Clinic",
    tagline: "For single-site clinics and outpatient practices.",
    monthly: 1200,
    trialDays: 30,
    includes: [
      "Up to 10 staff",
      "2 departments",
      "Patient records & scheduling",
      "Pharmacy + basic lab",
      "Mobile app for staff",
      "Community support",
    ],
  },
  {
    code: "HOSPITAL_TIER2",
    vertical: "hospital",
    name: "Vedge Hospital",
    tagline: "For mid-size hospitals with inpatient care.",
    monthly: 4500,
    trialDays: 30,
    badge: "Most popular",
    includes: [
      "Up to 50 staff",
      "5 departments",
      "Everything in Clinic",
      "Inpatient management & wards",
      "Medication Administration Record (MAR)",
      "Insurance claims (NHIS, private, corporate)",
      "Critical lab alerts",
    ],
  },
  {
    code: "HOSPITAL_HEALTH_SYSTEM",
    vertical: "hospital",
    name: "Vedge Health System",
    tagline: "For multi-facility health systems.",
    monthly: 12000,
    trialDays: 30,
    includes: [
      "Up to 200 staff",
      "Unlimited departments",
      "Everything in Hospital",
      "Multi-site dashboards",
      "AI diagnostic assist",
      "Custom roles & audit",
      "Priority support (24h)",
    ],
  },
  {
    code: "HOSPITAL_ENTERPRISE",
    vertical: "hospital",
    name: "Vedge Enterprise",
    tagline: "For regional hospital groups and ministries.",
    monthly: 20000,
    trialDays: 30,
    includes: [
      "Unlimited staff",
      "Unlimited sites",
      "Everything in Health System",
      "Dedicated deployment",
      "On-premise option",
      "Named account engineer",
      "Custom SLA",
    ],
  },

  // ── Laboratories (freemium) ────────────────────────────────────────
  {
    code: "LAB_ESSENTIALS",
    vertical: "laboratory",
    name: "Vedge Lab Essentials",
    tagline: "A free starting point for any lab that wants to digitise.",
    monthly: 0,
    trialDays: 0,
    badge: "Free",
    includes: [
      "Up to 5 technicians",
      "Order entry & results",
      "Basic patient results portal",
      "Community support",
      "Upgrade any time",
    ],
  },
  {
    code: "LAB_PRO",
    vertical: "laboratory",
    name: "Vedge Lab Pro",
    tagline: "For busy reference labs running real quality control.",
    monthly: 1500,
    trialDays: 14,
    badge: "Most popular",
    includes: [
      "Up to 20 technicians",
      "Everything in Essentials",
      "Levey-Jennings QC charts",
      "Reagent inventory & lot tracking",
      "Reference range library",
      "Test panel builder",
      "Hospital HL7 integrations",
    ],
  },
  {
    code: "LAB_ENTERPRISE",
    vertical: "laboratory",
    name: "Vedge Lab Accredited",
    tagline: "For accredited reference labs and multi-branch operators.",
    monthly: 4500,
    trialDays: 14,
    includes: [
      "Unlimited technicians",
      "Everything in Pro",
      "ISO 15189 accreditation toolkit",
      "Director dashboard & KPIs",
      "Cross-branch analytics",
      "Instrument interfaces",
      "Priority support",
    ],
  },

  // ── Pharmacies (freemium) ──────────────────────────────────────────
  {
    code: "PHARMACY_BASIC",
    vertical: "pharmacy",
    name: "Vedge Pharmacy Basic",
    tagline: "A free base tier for any community pharmacy in Africa.",
    monthly: 0,
    trialDays: 0,
    badge: "Free",
    includes: [
      "1 counter",
      "POS & basic inventory",
      "Prescription filling",
      "Listed in the Vedge patient app",
      "Community support",
    ],
  },
  {
    code: "PHARMACY_STARTER",
    vertical: "pharmacy",
    name: "Vedge Pharmacy Recommended Starter",
    tagline: "Appear when Vedge doctors prescribe nearby.",
    monthly: 149,
    trialDays: 14,
    badge: "Recommended",
    includes: [
      "Up to 2 counters",
      "Everything in Basic",
      "Appears in patient app for prescriptions",
      "Demand forecasting",
      "Supplier orders",
    ],
  },
  {
    code: "PHARMACY_PLUS",
    vertical: "pharmacy",
    name: "Vedge Pharmacy Recommended Plus",
    tagline: "For pharmacies that need inventory analytics and insurance claims.",
    monthly: 349,
    trialDays: 14,
    includes: [
      "Up to 5 counters",
      "Everything in Recommended Starter",
      "Expiry tracking",
      "Controlled-drug ledger",
      "Insurance reimbursement (NHIS + private)",
      "Multi-supplier reconciliation",
    ],
  },
  {
    code: "PHARMACY_CHAIN",
    vertical: "pharmacy",
    name: "Vedge Pharmacy Chain",
    tagline: "For multi-branch pharmacy operators.",
    monthly: 699,
    trialDays: 14,
    includes: [
      "Unlimited counters",
      "Everything in Recommended Plus",
      "Central warehouse",
      "Inter-branch transfers",
      "Multi-site reporting",
      "Priority support",
    ],
  },

  // ── Patient app ─────────────────────────────────────────────────────
  // Note: the backend does NOT have a row for this in subscription_plans —
  // the patient mobile app is a consumer product, not a facility plan.
  // We keep it in the catalog for the marketing site's "four verticals"
  // narrative, flagged with a sentinel code of PATIENT_APP so it's obvious
  // it isn't a billed plan.
  {
    code: "PATIENT_APP",
    vertical: "patient",
    name: "Vedge for Patients",
    tagline: "The free mobile app that connects patients to every facility on Vedge.",
    monthly: 0,
    trialDays: 0,
    badge: "Free",
    includes: [
      "Appointment booking",
      "Lab results & prescriptions",
      "Insurance verification",
      "Teleconsult (pay per use)",
      "Family profiles",
    ],
  },
];

export const verticals: {
  key: Vertical;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    key: "hospital",
    label: "Hospitals & clinics",
    blurb: "Inpatient, outpatient, pharmacy, and insurance claims — one chart, one record.",
    href: "/solutions/hospitals-clinics",
  },
  {
    key: "laboratory",
    label: "Medical laboratories",
    blurb: "Starts free. Levey-Jennings QC and reagent tracking on Pro.",
    href: "/solutions/medical-labs",
  },
  {
    key: "pharmacy",
    label: "Pharmacies",
    blurb: "Free base tier. Paid Recommended tier puts you in the prescribing doctor's app.",
    href: "/solutions/pharmacies",
  },
  {
    key: "patient",
    label: "Patients",
    blurb: "A free mobile app that keeps patients connected to every facility on Vedge.",
    href: "/companions/vedge-patient",
  },
];

/** Currency formatter — Ghanaian Cedi, no decimals for whole prices. */
export function formatPrice(amount: number | "custom"): string {
  if (amount === "custom") return "Custom";
  if (amount === 0) return "Free";
  return `₵${amount.toLocaleString("en-GH")}`;
}

/**
 * Annual price: 20% off the sticker monthly × 12, rounded to the nearest cedi.
 * Matches the backend's V27 seed math.
 */
export function annualPrice(monthly: number | "custom"): number | "custom" {
  if (monthly === "custom" || monthly === 0) return monthly;
  return Math.round(monthly * 12 * ANNUAL_DISCOUNT);
}
