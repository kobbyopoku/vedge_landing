/**
 * Full pricing catalog — 11 plans across 4 facility verticals.
 * Mirrors the Vedge backend subscription catalog (V27 migration).
 *
 * Prices are in Ghanaian Cedis per month. Annual billing gets ~17% off,
 * computed at render time, so we only store the monthly figure here.
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

export const plans: Plan[] = [
  // ── Hospitals & clinics ─────────────────────────────────────────────
  {
    code: "HOSPITAL_CLINIC",
    vertical: "hospital",
    name: "Clinic",
    tagline: "For single-site clinics and outpatient practices.",
    monthly: 349,
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
    name: "Hospital",
    tagline: "For mid-size hospitals with inpatient care.",
    monthly: 1499,
    trialDays: 30,
    badge: "Most popular",
    includes: [
      "Up to 50 staff",
      "5 departments",
      "Everything in Clinic",
      "Inpatient management & wards",
      "Medication Administration Record (MAR)",
      "NHIS claims submission",
      "Critical lab alerts",
    ],
  },
  {
    code: "HOSPITAL_HEALTH_SYSTEM",
    vertical: "hospital",
    name: "Health System",
    tagline: "For multi-facility health systems.",
    monthly: 3999,
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
    name: "Enterprise",
    tagline: "For regional hospital groups and ministries.",
    monthly: "custom",
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

  // ── Laboratories ────────────────────────────────────────────────────
  {
    code: "LAB_STARTER",
    vertical: "laboratory",
    name: "Lab Starter",
    tagline: "For standalone diagnostic labs.",
    monthly: 449,
    trialDays: 14,
    includes: [
      "Up to 5 technicians",
      "Order entry & results",
      "Hospital integrations (HL7)",
      "Patient results portal",
      "Community support",
    ],
  },
  {
    code: "LAB_PRO",
    vertical: "laboratory",
    name: "Lab Pro",
    tagline: "For busy reference labs running QC.",
    monthly: 899,
    trialDays: 14,
    badge: "Most popular",
    includes: [
      "Up to 20 technicians",
      "Everything in Lab Starter",
      "Levey-Jennings QC charts",
      "Reagent inventory & lot tracking",
      "Reference range library",
      "Test panel builder",
    ],
  },
  {
    code: "LAB_DIRECTOR",
    vertical: "laboratory",
    name: "Lab Director",
    tagline: "For multi-branch clinical labs.",
    monthly: 1899,
    trialDays: 14,
    includes: [
      "Unlimited technicians",
      "Everything in Lab Pro",
      "Director dashboard & KPIs",
      "Cross-branch analytics",
      "Instrument interfaces",
      "Priority support",
    ],
  },

  // ── Pharmacies ──────────────────────────────────────────────────────
  {
    code: "PHARMACY_STARTER",
    vertical: "pharmacy",
    name: "Pharmacy Starter",
    tagline: "For single-counter community pharmacies.",
    monthly: 149,
    trialDays: 14,
    includes: [
      "1 counter",
      "POS & inventory",
      "Prescription filling",
      "Supplier orders",
      "Community support",
    ],
  },
  {
    code: "PHARMACY_GROWTH",
    vertical: "pharmacy",
    name: "Pharmacy Growth",
    tagline: "For pharmacies that need inventory analytics.",
    monthly: 349,
    trialDays: 14,
    badge: "Most popular",
    includes: [
      "Up to 3 counters",
      "Everything in Starter",
      "Demand forecasting",
      "Expiry tracking",
      "Controlled-drug ledger",
      "NHIS reimbursement",
    ],
  },
  {
    code: "PHARMACY_CHAIN",
    vertical: "pharmacy",
    name: "Pharmacy Chain",
    tagline: "For multi-branch pharmacy operators.",
    monthly: 699,
    trialDays: 14,
    includes: [
      "Unlimited counters",
      "Everything in Growth",
      "Central warehouse",
      "Inter-branch transfers",
      "Multi-site reporting",
      "Priority support",
    ],
  },

  // ── Patient app ─────────────────────────────────────────────────────
  {
    code: "PATIENT_APP",
    vertical: "patient",
    name: "Vedge for Patients",
    tagline: "The mobile companion for anyone receiving care on Vedge.",
    monthly: 0,
    trialDays: 7,
    includes: [
      "Appointment booking",
      "Lab results & prescriptions",
      "NHIS verification",
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
    blurb: "Inpatient, outpatient, pharmacy, and claims — one chart, one record.",
    href: "/hospitals",
  },
  {
    key: "laboratory",
    label: "Laboratories",
    blurb: "Order to result with Levey-Jennings QC and reagent tracking built in.",
    href: "/laboratories",
  },
  {
    key: "pharmacy",
    label: "Pharmacies",
    blurb: "Counter operations, stock depth, and NHIS reimbursement on one screen.",
    href: "/pharmacies",
  },
  {
    key: "patient",
    label: "Patients",
    blurb: "A free mobile app that keeps patients connected to their care team.",
    href: "/pricing#patient",
  },
];

/** Currency formatter — Ghanaian Cedi, no decimals for whole prices. */
export function formatPrice(amount: number | "custom"): string {
  if (amount === "custom") return "Custom";
  if (amount === 0) return "Free";
  return `₵${amount.toLocaleString("en-GH")}`;
}

/** Annual price with 17% discount, rounded to nearest 10 cedis. */
export function annualPrice(monthly: number | "custom"): number | "custom" {
  if (monthly === "custom" || monthly === 0) return monthly;
  return Math.round((monthly * 12 * 0.83) / 10) * 10;
}
