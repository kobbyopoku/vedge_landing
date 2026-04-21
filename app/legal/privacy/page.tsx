import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Privacy Policy · Vedge",
  description:
    "How Vedge collects, processes, and protects personal data — for healthcare organisations (tenants) and for patients whose data we process on their behalf.",
};

const TOC = [
  { id: "who-we-are", label: "1. Who we are" },
  { id: "scope", label: "2. Scope of this policy" },
  { id: "data-we-collect", label: "3. Data we collect" },
  { id: "lawful-basis", label: "4. Lawful basis for processing" },
  { id: "how-we-use", label: "5. How we use your data" },
  { id: "retention", label: "6. Retention" },
  { id: "sharing", label: "7. Sharing + sub-processors" },
  { id: "transfer", label: "8. International transfers" },
  { id: "rights", label: "9. Your rights" },
  { id: "security", label: "10. Security" },
  { id: "breach", label: "11. Breach notification" },
  { id: "children", label: "12. Children" },
  { id: "dpo", label: "13. Data Protection Officer" },
  { id: "changes", label: "14. Changes to this policy" },
  { id: "complaints", label: "15. Complaints" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      kicker="Privacy"
      title="Privacy Policy"
      toc={TOC}
      intro={
        <>
          This Privacy Policy explains how {LEGAL_CONFIG.companyName}{" "}
          (&ldquo;Vedge&rdquo;) collects, processes, and protects personal
          data. It applies to visitors of {LEGAL_CONFIG.urls.marketing},
          healthcare organisations that use Vedge as a SaaS product
          (&ldquo;tenants&rdquo;), and — where Vedge acts as a{" "}
          <em>data processor</em> on a tenant&rsquo;s behalf — the patients
          whose records flow through the platform.
        </>
      }
    >
      <LegalCallout variant="review">
        <p>
          <strong>Review required before launch.</strong> Items tagged{" "}
          <code>[REVIEW: ...]</code> below are placeholders the business must
          confirm with counsel and the Ghana Data Protection Commission
          before this policy goes live. Every occurrence is resolved via
          the single source of truth at{" "}
          <code>src/lib/legal/config.ts</code>.
        </p>
      </LegalCallout>

      <LegalSection id="who-we-are" title="1. Who we are">
        <p>
          {LEGAL_CONFIG.companyName} is a company incorporated in the
          Republic of Ghana under registration number{" "}
          {LEGAL_CONFIG.companyRegistrationNumber_REVIEW}, with its
          registered office at {LEGAL_CONFIG.registeredAddress_REVIEW}.
        </p>
        <p>
          Vedge is registered with the{" "}
          <a href={LEGAL_CONFIG.regulators.ghanaDpc.url}>
            Ghana Data Protection Commission
          </a>{" "}
          as a Data Processor under §46 of the Data Protection Act 2012
          (Act 843). Our registration number is{" "}
          <strong>{LEGAL_CONFIG.dpcRegistrationNumber_REVIEW}</strong>,
          valid until {LEGAL_CONFIG.dpcRegistrationValidUntil_REVIEW}.
        </p>
      </LegalSection>

      <LegalSection id="scope" title="2. Scope of this policy">
        <p>
          Vedge plays two distinct roles depending on whose data is being
          processed. This policy covers both, and you should read the
          section relevant to your relationship with us.
        </p>
        <h3 className="mt-6 mb-2 font-semibold">
          2.1 Data Vedge controls directly
        </h3>
        <p>
          We are the &ldquo;data controller&rdquo; for information we collect
          directly from you:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Visitors to {LEGAL_CONFIG.urls.marketing}</li>
          <li>Prospective customers who request a demo or contact us</li>
          <li>Tenant admins who register and use the dashboard</li>
          <li>Staff of tenants who log in to perform their work</li>
        </ul>
        <h3 className="mt-6 mb-2 font-semibold">
          2.2 Data Vedge processes on a tenant&rsquo;s behalf
        </h3>
        <p>
          When a healthcare organisation (hospital, clinic, lab, pharmacy,
          diagnostic centre) uses Vedge to record patient information,
          <strong> that organisation is the data controller</strong> and
          Vedge is the &ldquo;data processor.&rdquo; We process patient
          health information (PHI) only on the tenant&rsquo;s documented
          instructions, under a binding{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link>. For
          patient-facing questions about how your clinic uses Vedge, see
          our <Link href="/legal/patient-privacy">Patient Privacy Notice</Link>.
        </p>
      </LegalSection>

      <LegalSection id="data-we-collect" title="3. Data we collect">
        <h3 className="mt-4 mb-2 font-semibold">
          3.1 As controller (our data)
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Identity + contact:</strong> name, work email, phone,
            job title, organisation name.
          </li>
          <li>
            <strong>Authentication:</strong> password hashes, MFA device
            tokens, login history.
          </li>
          <li>
            <strong>Device + usage telemetry:</strong> IP address, browser,
            pages visited, feature usage, error traces.
          </li>
          <li>
            <strong>Cookies + local storage:</strong> strictly-necessary,
            analytics (consented), and preference cookies. See{" "}
            <Link href="/legal/cookies">Cookie Policy</Link>.
          </li>
          <li>
            <strong>Billing:</strong> card metadata (last 4 digits,
            expiry) via our payment processors. We never see full PANs.
          </li>
        </ul>
        <h3 className="mt-6 mb-2 font-semibold">
          3.2 As processor (patient health data)
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Patient demographics, contact, and identifiers (Ghana Card,
            NHIS, passport).
          </li>
          <li>
            Clinical records: encounters, diagnoses, prescriptions, lab
            results, imaging reports, referrals, vitals, allergies.
          </li>
          <li>
            Appointment and billing records generated by the tenant&rsquo;s
            facility.
          </li>
          <li>
            Audit metadata — who looked at what, when — retained for{" "}
            {LEGAL_CONFIG.retention.auditLog}.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="lawful-basis" title="4. Lawful basis for processing">
        <p>
          Under §27 of the Data Protection Act 2012, every processing
          activity must have a lawful basis. We rely on the following:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Contract performance (§27(1)(b))</strong> — for
            everything we do to run the SaaS product for our tenants.
          </li>
          <li>
            <strong>Consent (§27(1)(a))</strong> — for marketing
            communications, analytics cookies, and the AI diagnostic
            assist feature (which is tenant-opt-in only).
          </li>
          <li>
            <strong>Legal obligation (§27(1)(c))</strong> — for tax,
            statutory reporting to the Ministry of Health (via DHIS2),
            anti-money-laundering checks on payment flows.
          </li>
          <li>
            <strong>Legitimate interest (§27(1)(f))</strong> — for
            security logging, fraud prevention, and service improvement
            (with data minimisation).
          </li>
          <li>
            <strong>Vital interests (§27(1)(d))</strong> — narrowly, for
            emergency clinical access flows where a treating clinician
            needs a patient record without prior consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="how-we-use" title="5. How we use your data">
        <p>We process personal data to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Provide, maintain, and secure the Vedge platform for our
            tenants.
          </li>
          <li>Authenticate users and enforce access controls (RBAC).</li>
          <li>
            Route clinical workflows — appointment reminders, lab result
            notifications, imaging report share-links — on the tenant&rsquo;s
            behalf.
          </li>
          <li>
            Bill tenants for their subscription and any enabled
            add-ons.
          </li>
          <li>
            Communicate service changes, security advisories, and
            required legal notices.
          </li>
          <li>
            Improve the platform through aggregated, de-identified
            analytics.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> sell personal data, use it to train
          third-party AI models, or share it for advertising.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="6. Retention">
        <p>
          Retention periods vary by data type:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Patient clinical records (processor role):</strong>{" "}
            retained for the duration of the tenant&rsquo;s relationship
            with the patient, plus the windows below to meet HEFRA
            minimum standards —
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Adult records: {LEGAL_CONFIG.retention.adultRecords}</li>
              <li>Minor records: {LEGAL_CONFIG.retention.minorRecords}</li>
              <li>
                Maternal + death records:{" "}
                {LEGAL_CONFIG.retention.maternalAndDeathRecords}
              </li>
            </ul>
          </li>
          <li>
            <strong>Audit log:</strong> {LEGAL_CONFIG.retention.auditLog}.
          </li>
          <li>
            <strong>Billing records:</strong>{" "}
            {LEGAL_CONFIG.retention.billingRecords}.
          </li>
          <li>
            <strong>Marketing contacts:</strong>{" "}
            {LEGAL_CONFIG.retention.marketingContact}.
          </li>
        </ul>
        <p>
          On termination of a tenant&rsquo;s subscription, data is
          exportable for {LEGAL_CONFIG.dataExport.windowDays} days in the
          following formats:{" "}
          {LEGAL_CONFIG.dataExport.formats.join(", ")}. After the export
          window, data is deleted or irreversibly anonymised.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="7. Sharing + sub-processors">
        <p>
          We share personal data only with sub-processors who help us
          deliver the service. Every sub-processor is bound by a
          contractual DPA with terms at least as strict as ours, and
          each is listed on our{" "}
          <Link href="/legal/sub-processors">Sub-processors page</Link>{" "}
          — it is the authoritative, always-current list.
        </p>
        <p>
          We do not share your personal data for any other purpose
          without your consent, unless required by Ghanaian law (e.g. a
          court order or lawful request from the Data Protection
          Commission).
        </p>
      </LegalSection>

      <LegalSection id="transfer" title="8. International transfers">
        <p>
          Under §§47–48 of the Data Protection Act 2012, patient data
          may be transferred outside Ghana only where the destination
          provides an adequate level of protection or the data subject
          has consented. Vedge maintains Standard Contractual Clauses
          (SCCs) with every sub-processor that processes data outside
          Ghana. The current destinations are:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>AWS / Cloudflare</strong> — infrastructure hosting +
            CDN (South Africa, Ireland, US edge). SCCs in place.
          </li>
          <li>
            <strong>OpenAI</strong> — optional AI diagnostic assist
            (United States). Tenant-opt-in only; zero-data-retention
            agreement in effect.
          </li>
          <li>
            <strong>Stripe</strong> — card processing (Ireland / United
            States). No clinical data transmitted.
          </li>
          <li>
            <strong>Paystack, Flutterwave</strong> — mobile money + card
            (Nigeria / United States). No clinical data transmitted.
          </li>
          <li>
            <strong>mNotify</strong> — SMS delivery (Ghana;
            intra-jurisdiction).
          </li>
          <li>
            <strong>Resend</strong> — transactional email (United
            States). No clinical data in message bodies.
          </li>
        </ul>
        <p>
          Tenants may opt out of AI-based processing at any time via the
          tenant admin console.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="9. Your rights">
        <p>
          Under §§32–36 of the Data Protection Act 2012 you have the
          right to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Access</strong> — a copy of the personal data we
            hold about you.
          </li>
          <li>
            <strong>Rectification</strong> — correction of inaccurate or
            incomplete data.
          </li>
          <li>
            <strong>Erasure</strong> — deletion of personal data, subject
            to overriding legal retention obligations.
          </li>
          <li>
            <strong>Objection</strong> — to specific processing activities,
            including direct marketing.
          </li>
          <li>
            <strong>Portability</strong> — your data in a structured,
            machine-readable format.
          </li>
          <li>
            <strong>Withdraw consent</strong> — at any time, without
            affecting the lawfulness of prior processing.
          </li>
        </ul>
        <p>
          Requests should be sent to {LEGAL_CONFIG.dpoEmail}. We respond
          within <strong>21 calendar days</strong>, as required by the
          DPA.
        </p>
        <p>
          <strong>Patients</strong>: for data your clinic holds in Vedge,
          contact your clinic first — they are the data controller.
          Vedge acts as a fallback if they do not respond.
        </p>
      </LegalSection>

      <LegalSection id="security" title="10. Security">
        <p>
          We apply technical and organisational measures appropriate to
          the risk, as required by §§17–18 of the DPA. A full list is
          on our <Link href="/legal/security">Security page</Link>.
          Highlights:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            AES-256 encryption at rest, TLS 1.2+ in transit.
          </li>
          <li>
            Role-based access control, least-privilege, just-in-time
            admin access to production.
          </li>
          <li>
            Multi-tenant schema isolation — one tenant cannot access
            another tenant&rsquo;s data through the application or the
            database.
          </li>
          <li>
            Append-only audit log of every PHI access, retained for{" "}
            {LEGAL_CONFIG.retention.auditLog}.
          </li>
          <li>
            Annual third-party penetration test.
          </li>
          <li>
            Documented responsible-disclosure channel at{" "}
            {LEGAL_CONFIG.securityEmail}.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="breach" title="11. Breach notification">
        <p>
          If Vedge experiences a personal-data breach, we notify the
          affected tenant within{" "}
          <strong>{LEGAL_CONFIG.breach.vedgeToTenantHours} hours</strong>{" "}
          of confirming the breach. Tenants remain the notifiers of
          record to the Data Protection Commission and to data subjects,
          and we provide the technical information they need to meet
          their own obligations.
        </p>
        <p>
          For incidents that meet the Cybersecurity Authority&rsquo;s
          Critical Information Infrastructure reporting threshold, we
          commit to a {LEGAL_CONFIG.breach.cii24hClock} so tenant CII
          operators can meet their own clock.
        </p>
      </LegalSection>

      <LegalSection id="children" title="12. Children">
        <p>
          Vedge does not knowingly collect data directly from children.
          Paediatric records in the platform exist because a tenant
          clinic is caring for that child; the child&rsquo;s parent or
          guardian provides the consent and exercises the data-subject
          rights on their behalf until they reach the age of majority.
        </p>
      </LegalSection>

      <LegalSection id="dpo" title="13. Data Protection Officer">
        <p>
          Our Data Protection Officer, appointed under §58 of the DPA,
          is the named contact point for all data-protection matters:
        </p>
        <ul className="list-none space-y-1 mt-2">
          <li>
            <strong>Name:</strong> {LEGAL_CONFIG.dpoName_REVIEW}
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${LEGAL_CONFIG.dpoEmail}`}>
              {LEGAL_CONFIG.dpoEmail}
            </a>
          </li>
          <li>
            <strong>Phone:</strong> {LEGAL_CONFIG.dpoPhone_REVIEW}
          </li>
          <li>
            <strong>Postal:</strong>{" "}
            {LEGAL_CONFIG.registeredAddress_REVIEW}
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to this policy">
        <p>
          We review this policy at least annually and update it whenever
          there is a material change to our processing activities. The{" "}
          &ldquo;Last updated&rdquo; date at the top of the page reflects
          the most recent material change. For changes that affect your
          rights, we provide reasonable advance notice by email to
          tenant admins and by in-dashboard notification.
        </p>
      </LegalSection>

      <LegalSection id="complaints" title="15. Complaints">
        <p>
          If you believe we have mishandled your personal data, please
          write to {LEGAL_CONFIG.dpoEmail} first — we would like the
          chance to resolve it. If you are not satisfied with our
          response, you have the right to lodge a complaint with the{" "}
          <a href={LEGAL_CONFIG.regulators.ghanaDpc.url}>
            {LEGAL_CONFIG.regulators.ghanaDpc.name}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
