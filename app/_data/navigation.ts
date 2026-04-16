/**
 * Single source of truth for the landing site's primary nav.
 *
 * Two dropdowns (Solutions, Companions) + two flat items (Pricing, Partners).
 * Reserved sub-nav slots for Wave 7 are commented in place — uncomment when
 * DENTAL_* and OPTICAL_* plan families ship.
 */

export type NavLeaf = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  children: NavLeaf[];
};

export type NavItem = NavLeaf | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup =>
  "children" in item;

export const nav: NavItem[] = [
  {
    label: "Solutions",
    children: [
      {
        label: "Hospitals & clinics",
        href: "/solutions/hospitals-clinics",
        description: "Inpatient, outpatient, pharmacy, labs, insurance.",
      },
      {
        label: "Medical laboratories",
        href: "/solutions/medical-labs",
        description: "Accessioning, QC, result validation, reference labs.",
      },
      {
        label: "Pharmacies",
        href: "/solutions/pharmacies",
        description: "POS, inventory, NHIS dispensing, counselling.",
      },
      {
        label: "Diagnostic centres",
        href: "/solutions/diagnostic-centers",
        description: "Imaging orders, PACS, branded reports, referrals.",
      },
      // Wave 7 slots — uncomment when pages ship:
      // { label: "Dental practices",  href: "/solutions/dental-practices", description: "Tooth charting, periodontal, treatment plans." },
      // { label: "Optical centres",   href: "/solutions/optical-centers",  description: "Refraction, dispensing, contact lens fitting." },
    ],
  },
  {
    label: "Companions",
    children: [
      {
        label: "Vedge Staff",
        href: "/companions/vedge-staff",
        description: "The mobile app for doctors, nurses, and every role in the building.",
      },
      {
        label: "Vedge Patient",
        href: "/companions/vedge-patient",
        description: "Patients carry their records, results, and appointments.",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Partners", href: "/partners" },
];
