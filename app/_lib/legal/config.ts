/**
 * Single source of truth for every "fill-in-the-blank" value that
 * appears on our legal pages. When the lawyer or the data-protection
 * officer updates these (DPC registration number, DPO details, etc.),
 * every page that references them updates automatically — no scanning
 * 12 pages for a stale registered address.
 *
 * <p>Placeholders that a lawyer or the business MUST confirm before
 * launch are flagged with {@code _REVIEW} suffix in their name, and
 * rendered on-page with a {@code [REVIEW: ...]} marker so they're
 * impossible to miss in review.</p>
 */

export const LEGAL_CONFIG = {
  // ── Vedge entity + registration details ───────────────────────────
  companyName: "Vedge Technologies Ltd",
  /** Registered office. REVIEW before launch. */
  registeredAddress_REVIEW:
    "[REVIEW: registered office address — Ghana company registration]",
  /** Ghana Companies House / RGD number. REVIEW. */
  companyRegistrationNumber_REVIEW:
    "[REVIEW: Ghana RGD company registration number]",
  /** Ghana Data Protection Commission processor registration. Required by §46 DPA 2012. */
  dpcRegistrationNumber_REVIEW:
    "[REVIEW: Ghana DPC Data Processor Registration Number — §46 DPA 2012]",
  dpcRegistrationValidUntil_REVIEW:
    "[REVIEW: DPC registration expiry date]",

  // ── Data Protection Officer ───────────────────────────────────────
  dpoName_REVIEW: "[REVIEW: named DPO — required by §58 DPA 2012]",
  dpoEmail: "dpo@tryvedge.com",
  dpoPhone_REVIEW: "[REVIEW: DPO contact number]",

  // ── General contact ───────────────────────────────────────────────
  contactEmail: "hello@tryvedge.com",
  supportEmail: "support@tryvedge.com",
  securityEmail: "security@tryvedge.com",
  billingEmail: "billing@tryvedge.com",
  legalEmail: "legal@tryvedge.com",

  // ── Policy dates ──────────────────────────────────────────────────
  /**
   * When the current generation of legal pages took effect. Updated on
   * every material policy change; surfaced as "Last updated" on each
   * page so users can tell at a glance whether they've seen this
   * version.
   */
  lastUpdated: "21 April 2026",
  /** Version tag for internal audit + external "which policy did they accept" reconstruction. */
  policyVersion: "2026.04-rev1",

  // ── Retention (exposed on Privacy + Patient Notice pages) ─────────
  /**
   * HEFRA Minimum Standards retention windows. The policy only cites
   * these — the actual retention is owned by each tenant controller.
   */
  retention: {
    adultRecords: "6 years from last interaction",
    minorRecords: "12 years from the minor's age of majority (21)",
    maternalAndDeathRecords: "indefinitely",
    auditLog: "6 years from event",
    billingRecords: "6 years (Ghana Revenue Authority requirement)",
    marketingContact: "until unsubscribed, + 2 years",
  },

  // ── Breach notification commitments ───────────────────────────────
  breach: {
    /** Our internal SLA to tenants — stricter than the DPA's "as soon as reasonably practicable" so they can meet theirs. */
    vedgeToTenantHours: 48,
    /** CSA Cybersecurity Act 2020 CII operator clock to CSA. */
    cii24hClock: "24 hours to CSA for designated CII operators",
  },

  // ── Governing law + jurisdiction ──────────────────────────────────
  governingLaw: "Republic of Ghana",
  arbitrationSeat: "Accra, Ghana",

  // ── Liability cap (on the Tenant ToS) ─────────────────────────────
  liabilityCapMonths_REVIEW:
    12, // [REVIEW: 12 months of fees is the SaaS-standard default

  // ── SLA commitments ───────────────────────────────────────────────
  sla: {
    uptimeTarget: "99.5%",
    measurementWindow: "calendar month",
    /** Credit schedule in percentage of monthly fees. */
    credits: [
      { minUptime: "99.0%", maxUptime: "99.5%", credit: "10%" },
      { minUptime: "97.0%", maxUptime: "99.0%", credit: "25%" },
      { minUptime: "0%",    maxUptime: "97.0%", credit: "50%" },
    ],
    exclusions: [
      "Scheduled maintenance announced at least 48 hours in advance",
      "Force majeure (natural disaster, nationwide network outage, sovereign action)",
      "Customer misuse, unsupported integrations, or traffic exceeding the stated plan limits",
      "Upstream outages at sub-processors we do not control (cloud region, SMS gateway, payment rails)",
    ],
  },

  // ── Data export on termination ────────────────────────────────────
  dataExport: {
    windowDays: 60,
    formats: ["PostgreSQL dump (tenant schema)", "CSV bundle per entity", "FHIR R4 bundle (selected resources)"],
  },

  // ── URLs ─────────────────────────────────────────────────────────
  urls: {
    marketing: "https://tryvedge.com",
    app: "https://app.tryvedge.com",
    docs: "https://docs.tryvedge.com",
  },

  // ── Regulator references ─────────────────────────────────────────
  regulators: {
    ghanaDpc: {
      name: "Data Protection Commission, Ghana",
      url: "https://www.dataprotection.org.gh",
      complaintUrl: "https://www.dataprotection.org.gh/complaints",
    },
    ghanaCsa: {
      name: "Cyber Security Authority, Ghana",
      url: "https://www.csa.gov.gh",
    },
    ghanaHefra: {
      name: "Health Facilities Regulatory Agency, Ghana",
      url: "https://www.hefra.gov.gh",
    },
    ghanaNhia: {
      name: "National Health Insurance Authority, Ghana",
      url: "https://www.nhis.gov.gh",
    },
    ghanaMdc: {
      name: "Medical and Dental Council, Ghana",
      url: "https://www.mdcghana.org",
    },
  },
} as const;

export type LegalConfig = typeof LEGAL_CONFIG;
