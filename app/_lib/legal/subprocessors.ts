/**
 * The sub-processor list. One source of truth used by:
 * - /legal/sub-processors — the public-facing page
 * - /legal/privacy — the cross-border transfer disclosure
 * - /legal/dpa — the Annex II "approved sub-processors" list
 *
 * <p>Add a new vendor here and it automatically shows up in all three
 * surfaces. Keeping the data in TypeScript (not markdown or a CMS)
 * means procurement engineers can read it via a typed object and
 * surface it in their own compliance tooling too.</p>
 */

export interface SubProcessor {
  /** Legal entity name as it would appear on an invoice. */
  name: string;
  /** What we use them for, in plain language. */
  purpose: string;
  /** Data categories shared with this vendor. */
  dataCategories: readonly string[];
  /** Country / region where processing happens. */
  location: string;
  /** Legal mechanism for the cross-border flow (if applicable). */
  transferMechanism: string;
  /** Whether any PHI / clinical data is transmitted to this vendor. */
  transmitsClinicalData: boolean;
  /** Link to the vendor's own DPA / security page (for the curious reader). */
  vendorDpaUrl?: string;
}

export const SUB_PROCESSORS: readonly SubProcessor[] = [
  {
    name: "Amazon Web Services EMEA SARL",
    purpose: "Infrastructure hosting — application servers, database, object storage",
    dataCategories: ["All tenant data, including PHI"],
    location: "af-south-1 (Cape Town) / eu-west-1 (Ireland)",
    transferMechanism: "Standard Contractual Clauses + Data Processing Addendum",
    transmitsClinicalData: true,
    vendorDpaUrl: "https://aws.amazon.com/compliance/gdpr-center/",
  },
  {
    name: "Cloudflare, Inc.",
    purpose: "CDN + DDoS mitigation + object storage (R2) for uploaded documents",
    dataCategories: ["Uploaded documents (lab reports, imaging PDFs, ID scans)", "Request metadata"],
    location: "United States (global edge)",
    transferMechanism: "Standard Contractual Clauses + DPA",
    transmitsClinicalData: true,
    vendorDpaUrl: "https://www.cloudflare.com/cloudflare-customer-dpa/",
  },
  {
    name: "OpenAI, LLC",
    purpose: "Optional AI-assisted diagnostic support (tenant-opt-in only)",
    dataCategories: ["De-identified clinical prompts submitted by practitioners"],
    location: "United States",
    transferMechanism: "Zero-data-retention agreement + SCCs",
    transmitsClinicalData: true,
    vendorDpaUrl: "https://openai.com/enterprise-privacy",
  },
  {
    name: "Resend, Inc.",
    purpose: "Transactional email delivery (appointment reminders, lab results, notifications)",
    dataCategories: ["Recipient email, sender, subject, body"],
    location: "United States",
    transferMechanism: "Standard Contractual Clauses + DPA",
    transmitsClinicalData: false,
    vendorDpaUrl: "https://resend.com/legal/dpa",
  },
  {
    name: "mNotify Ltd",
    purpose: "SMS delivery (appointment reminders, patient welcome, critical alerts)",
    dataCategories: ["Recipient phone number, sender ID, message body (no clinical content)"],
    location: "Ghana",
    transferMechanism: "N/A — intra-jurisdiction",
    transmitsClinicalData: false,
    vendorDpaUrl: "https://www.mnotify.com/privacy",
  },
  {
    name: "Paystack Payments Limited",
    purpose: "Card + mobile money payment processing (Ghana + Nigeria)",
    dataCategories: ["Payer name, email, amount, currency, card/MoMo instrument metadata"],
    location: "Nigeria",
    transferMechanism: "Intra-African processor + SCCs",
    transmitsClinicalData: false,
    vendorDpaUrl: "https://paystack.com/legal/dpa",
  },
  {
    name: "Flutterwave Technology Solutions Ltd",
    purpose: "Card + mobile money payment processing (pan-African)",
    dataCategories: ["Payer name, email, amount, currency, payment instrument metadata"],
    location: "Nigeria / United States",
    transferMechanism: "SCCs",
    transmitsClinicalData: false,
    vendorDpaUrl: "https://flutterwave.com/legal/privacy",
  },
  {
    name: "Stripe Payments Europe Ltd",
    purpose: "Card payment processing (international / premium tenants)",
    dataCategories: ["Payer name, email, amount, currency, card instrument metadata"],
    location: "Ireland / United States",
    transferMechanism: "Standard Contractual Clauses + DPA",
    transmitsClinicalData: false,
    vendorDpaUrl: "https://stripe.com/legal/dpa",
  },
  {
    name: "Daily.co, Inc.",
    purpose: "Teleconsultation video rooms (feature-gated)",
    dataCategories: ["Room metadata, participant identifiers, no recordings retained"],
    location: "United States",
    transferMechanism: "SCCs",
    transmitsClinicalData: false,
    vendorDpaUrl: "https://www.daily.co/legal/privacy",
  },
] as const;
