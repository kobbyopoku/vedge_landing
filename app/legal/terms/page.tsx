import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Terms of Service · Vedge",
  description:
    "The master services agreement between Vedge and the healthcare organisations (tenants) that subscribe to the platform.",
};

const TOC = [
  { id: "parties", label: "1. Parties + acceptance" },
  { id: "service", label: "2. The Service" },
  { id: "access", label: "3. Accounts + access" },
  { id: "licensure", label: "4. Tenant licensure warranty" },
  { id: "content", label: "5. Tenant content" },
  { id: "fees", label: "6. Fees + billing" },
  { id: "sla", label: "7. Service level" },
  { id: "ip", label: "8. Intellectual property" },
  { id: "privacy", label: "9. Privacy + DPA" },
  { id: "security", label: "10. Security" },
  { id: "aup", label: "11. Acceptable use" },
  { id: "suspension", label: "12. Suspension + termination" },
  { id: "export", label: "13. Data export on exit" },
  { id: "warranty", label: "14. Warranties + disclaimers" },
  { id: "liability", label: "15. Limitation of liability" },
  { id: "indemnity", label: "16. Indemnity" },
  { id: "confidentiality", label: "17. Confidentiality" },
  { id: "changes", label: "18. Changes" },
  { id: "force", label: "19. Force majeure" },
  { id: "assignment", label: "20. Assignment + general" },
  { id: "law", label: "21. Governing law" },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      kicker="Tenant Agreement"
      title="Terms of Service"
      toc={TOC}
      intro={
        <>
          These Terms of Service (&ldquo;Terms&rdquo;) form a binding
          agreement between {LEGAL_CONFIG.companyName}{" "}
          (&ldquo;Vedge&rdquo;) and the healthcare organisation
          (&ldquo;Tenant&rdquo;) that subscribes to the Vedge platform.
          Together with the{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link> and the{" "}
          <Link href="/legal/privacy">Privacy Policy</Link>, they are the
          entire agreement for provision of the Service.
        </>
      }
    >
      <LegalCallout variant="review">
        Commercial terms (liability caps, payment cycles, governing-law
        tuning for non-Ghana tenants) marked{" "}
        <code>[REVIEW: ...]</code> below must be confirmed by Vedge
        counsel and the tenant&rsquo;s procurement team before
        execution.
      </LegalCallout>

      <LegalSection id="parties" title="1. Parties + acceptance">
        <p>
          These Terms are between <strong>{LEGAL_CONFIG.companyName}</strong>{" "}
          (Ghana RGD No. {LEGAL_CONFIG.companyRegistrationNumber_REVIEW},
          registered office at {LEGAL_CONFIG.registeredAddress_REVIEW}),
          and the legal entity whose authorised representative
          subscribes to the Service. By creating a Tenant account or by
          clicking &ldquo;I accept&rdquo; during onboarding, that
          representative warrants they have authority to bind the
          entity.
        </p>
      </LegalSection>

      <LegalSection id="service" title="2. The Service">
        <p>
          Vedge provides a cloud-hosted multi-tenant health operating
          system (the &ldquo;Service&rdquo;) covering — as configured in
          the Tenant&rsquo;s subscription tier — electronic health
          records, appointments, billing, lab + imaging workflows,
          pharmacy, and reporting. Feature availability is defined by
          the Tenant&rsquo;s subscribed plan plus any Add-ons enabled
          from the tenant admin console.
        </p>
      </LegalSection>

      <LegalSection id="access" title="3. Accounts + access">
        <p>
          The Tenant is responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Identifying each Authorised User, provisioning credentials,
            assigning roles, and promptly revoking access when staff
            leave.
          </li>
          <li>
            Maintaining the confidentiality of credentials. Vedge treats
            any action performed through a valid credential as the act
            of the Tenant.
          </li>
          <li>
            Enabling multi-factor authentication for all admin accounts.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="licensure" title="4. Tenant licensure warranty">
        <p>
          The Tenant warrants that it and every Authorised User hold the
          licences and registrations required to provide the health
          services they record in the platform, including where
          applicable:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            HEFRA facility licence (or equivalent per country).
          </li>
          <li>
            Medical and Dental Council / AHPC / Nursing and Midwifery
            Council / Pharmacy Council registration for each
            practitioner.
          </li>
          <li>
            Narcotics Control Commission authorisation where controlled
            substances are prescribed or dispensed.
          </li>
          <li>
            Data Protection Commission registration as Data Controller.
          </li>
        </ul>
        <p>
          Vedge does not verify clinical-licensure compliance in real
          time; the warranty is the Tenant&rsquo;s.
        </p>
      </LegalSection>

      <LegalSection id="content" title="5. Tenant content">
        <p>
          The Tenant retains all rights in data uploaded to or generated
          in the platform. The Tenant grants Vedge a limited,
          non-exclusive, worldwide licence to process that data solely
          to provide the Service — the scope is defined in the{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link>.
        </p>
        <p>
          The Tenant warrants that it has a lawful basis under §27 DPA
          2012 for every upload of patient data, and has given (or
          caused the patient&rsquo;s clinic to give) the notice required
          by §20.
        </p>
      </LegalSection>

      <LegalSection id="fees" title="6. Fees + billing">
        <p>
          Fees are set out in the Tenant&rsquo;s subscription tier
          (Plan) plus any enabled Add-ons. Unless otherwise agreed in
          writing:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Billing cycle is monthly, in advance, in the currency shown
            at checkout (GHS, NGN, USD).
          </li>
          <li>
            Payment is due within 14 days of invoice issue. Failed
            recurring charges enter a 7-day grace window before
            suspension under §12.
          </li>
          <li>
            Taxes (VAT, NHIL, GETFund, COVID-19 Health Recovery Levy as
            applicable) are added to the Tenant-facing price unless the
            Tenant provides a tax-exempt certificate.
          </li>
          <li>
            Refunds follow the{" "}
            <Link href="/legal/refund">Refund + Billing Policy</Link>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sla" title="7. Service level">
        <p>
          Vedge targets{" "}
          <strong>{LEGAL_CONFIG.sla.uptimeTarget}</strong> monthly
          uptime, measured per the methodology in our{" "}
          <Link href="/legal/sla">Service Level page</Link>. Shortfalls
          are compensated by service credits on that page&rsquo;s
          schedule; service credits are the Tenant&rsquo;s sole remedy
          for uptime shortfalls.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="8. Intellectual property">
        <p>
          Vedge owns all rights in the Service and its underlying
          software, documentation, and trademarks. The Tenant owns its
          content. Neither party receives any rights not explicitly
          granted in these Terms.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="9. Privacy + DPA">
        <p>
          Personal-data processing is governed by the{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link>,
          which is incorporated by reference and takes precedence over
          these Terms in case of conflict on data-protection matters.
        </p>
      </LegalSection>

      <LegalSection id="security" title="10. Security">
        <p>
          Vedge&rsquo;s current security measures are on the{" "}
          <Link href="/legal/security">Security page</Link> and
          incorporated by reference. Vedge will not materially degrade
          its security posture during the term.
        </p>
      </LegalSection>

      <LegalSection id="aup" title="11. Acceptable use">
        <p>
          Use of the Service is subject to the{" "}
          <Link href="/legal/acceptable-use">Acceptable Use Policy</Link>.
          Breach of the AUP is a material breach of these Terms.
        </p>
      </LegalSection>

      <LegalSection
        id="suspension"
        title="12. Suspension + termination"
      >
        <p>
          Vedge may suspend access if:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Payment is more than 14 days overdue and unresolved after a
            7-day reminder.
          </li>
          <li>
            A material breach of these Terms, the AUP, or the DPA
            continues more than 7 days after notice.
          </li>
          <li>
            Law, regulator direction, or an evident risk to the Service
            or other tenants requires it.
          </li>
        </ul>
        <p>
          Either party may terminate for convenience on 30 days&rsquo;
          notice; fees already paid are non-refundable (except pro-rata
          where termination follows a Vedge material breach).
        </p>
      </LegalSection>

      <LegalSection id="export" title="13. Data export on exit">
        <p>
          On termination, Vedge makes the Tenant&rsquo;s data available
          for export for {LEGAL_CONFIG.dataExport.windowDays} days in
          the formats described in the DPA.
        </p>
      </LegalSection>

      <LegalSection id="warranty" title="14. Warranties + disclaimers">
        <p>
          Vedge warrants that the Service will materially conform to the
          documentation and will be delivered with reasonable skill and
          care. <strong>To the fullest extent permitted by Ghanaian
          law</strong>, all other warranties are disclaimed, including
          merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>
        <p>
          The Service is a tool. It does not replace clinical judgement,
          regulatory compliance, or the Tenant&rsquo;s own duties of
          care. AI-assisted features, where enabled, are clinical
          decision support only — see{" "}
          <Link href="/legal/ai">Responsible AI Statement</Link>.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="15. Limitation of liability">
        <p>
          Except for (a) breach of the DPA by either party, (b) the
          Tenant&rsquo;s payment obligations, (c) either party&rsquo;s
          indemnity under §16, and (d) liability that cannot be limited
          by law: each party&rsquo;s aggregate liability arising out of
          or in connection with these Terms is capped at the fees paid
          by the Tenant in the{" "}
          <strong>{LEGAL_CONFIG.liabilityCapMonths_REVIEW} months</strong>{" "}
          preceding the event giving rise to the liability.
        </p>
        <p>
          Neither party is liable for indirect, incidental,
          consequential, or punitive damages, or for loss of profits,
          revenue, goodwill, or anticipated savings.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" title="16. Indemnity">
        <p>
          The Tenant will indemnify and hold Vedge harmless against
          claims arising from (a) Tenant content that was unlawful or
          breached a third party&rsquo;s rights, (b) the Tenant&rsquo;s
          breach of its licensure warranty under §4, or (c) the
          Tenant&rsquo;s use of the Service in breach of the AUP.
        </p>
        <p>
          Vedge will indemnify and hold the Tenant harmless against
          third-party claims that the Service infringes their
          intellectual property, subject to the liability cap in §15.
        </p>
      </LegalSection>

      <LegalSection id="confidentiality" title="17. Confidentiality">
        <p>
          Each party will protect the other&rsquo;s confidential
          information with at least the same care it uses for its own
          (and never less than reasonable care), and will use it only to
          perform these Terms. Confidentiality obligations survive
          termination for 5 years.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="18. Changes">
        <p>
          Vedge may update these Terms by posting the revised version
          here and notifying the Tenant by email + in-dashboard
          notification at least 30 days before the change takes effect.
          Continued use of the Service after the effective date
          constitutes acceptance. If a change materially disadvantages
          the Tenant and they do not accept, they may terminate for
          convenience before the change takes effect with a pro-rata
          refund of prepaid fees.
        </p>
      </LegalSection>

      <LegalSection id="force" title="19. Force majeure">
        <p>
          Neither party is liable for delay or failure caused by events
          beyond its reasonable control — natural disaster, act of
          government, nationwide network or power outage, act of war —
          provided it mitigates diligently and resumes performance as
          soon as practicable.
        </p>
      </LegalSection>

      <LegalSection id="assignment" title="20. Assignment + general">
        <p>
          Neither party may assign these Terms without the other&rsquo;s
          prior written consent, except that either party may assign to
          a successor in a merger, acquisition, or sale of substantially
          all assets, on written notice.
        </p>
        <p>
          If any clause is held unenforceable, the rest stands. A
          failure to enforce a right is not a waiver. Notices are
          effective when delivered to the email addresses in each
          party&rsquo;s account (Tenant) or to{" "}
          {LEGAL_CONFIG.legalEmail} (Vedge).
        </p>
      </LegalSection>

      <LegalSection id="law" title="21. Governing law + dispute resolution">
        <p>
          These Terms are governed by the laws of the{" "}
          {LEGAL_CONFIG.governingLaw}. The parties will try first to
          resolve disputes by good-faith discussion; unresolved disputes
          are referred to arbitration under the Alternative Dispute
          Resolution Act 2010 (Act 798), with the seat in{" "}
          {LEGAL_CONFIG.arbitrationSeat}.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
