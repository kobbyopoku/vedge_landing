import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Data Processing Agreement · Vedge",
  description:
    "The Data Processing Agreement between Vedge and its tenant customers, forming part of the Terms of Service.",
};

const TOC = [
  { id: "preamble", label: "Preamble" },
  { id: "definitions", label: "1. Definitions" },
  { id: "roles", label: "2. Roles + responsibilities" },
  { id: "processing", label: "3. Scope of processing" },
  { id: "instructions", label: "4. Controller instructions" },
  { id: "security", label: "5. Security measures" },
  { id: "staff", label: "6. Staff confidentiality" },
  { id: "subprocessors", label: "7. Sub-processors" },
  { id: "transfer", label: "8. International transfers" },
  { id: "rights", label: "9. Data subject rights" },
  { id: "dpia", label: "10. DPIAs + consultation" },
  { id: "breach", label: "11. Breach notification" },
  { id: "audit", label: "12. Audit" },
  { id: "return", label: "13. Return + deletion" },
  { id: "term", label: "14. Term + liability" },
  { id: "annex-i", label: "Annex I — Processing details" },
  { id: "annex-ii", label: "Annex II — Approved sub-processors" },
  { id: "annex-iii", label: "Annex III — Security measures" },
];

export default function DpaPage() {
  return (
    <LegalPageLayout
      kicker="Tenant Agreement"
      title="Data Processing Agreement"
      toc={TOC}
      intro={
        <>
          This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of
          the <Link href="/legal/terms">Terms of Service</Link> between{" "}
          {LEGAL_CONFIG.companyName} (&ldquo;Processor&rdquo;) and the
          healthcare organisation subscribing to Vedge
          (&ldquo;Controller&rdquo;). It satisfies §30 of the Data
          Protection Act 2012 (Act 843) and is written to sit alongside
          GDPR Art. 28 for tenants with EU patient flows.
        </>
      }
    >
      <LegalCallout variant="review">
        This DPA is an executable template. Blanks marked{" "}
        <code>[REVIEW: ...]</code> must be filled during tenant
        onboarding and confirmed by counsel for enterprise tenants.
      </LegalCallout>

      <LegalSection id="preamble" title="Preamble">
        <p>
          The Controller is a licensed healthcare facility processing
          patient health information in the course of providing care.
          Vedge supplies the Controller with SaaS infrastructure (the
          &ldquo;Service&rdquo;) and in doing so Processes Personal Data
          on the Controller&rsquo;s behalf. This DPA sets out the terms
          on which that Processing takes place.
        </p>
      </LegalSection>

      <LegalSection id="definitions" title="1. Definitions">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>DPA 2012</strong> — the Ghana Data Protection Act
            2012 (Act 843).
          </li>
          <li>
            <strong>Personal Data</strong>, <strong>Processing</strong>,{" "}
            <strong>Controller</strong>, <strong>Processor</strong>,{" "}
            <strong>Data Subject</strong>, <strong>Special Category
            Data</strong> — as defined in the DPA 2012.
          </li>
          <li>
            <strong>Patient Data</strong> — Personal Data relating to
            patients of the Controller, including clinical records,
            demographics, and identifiers.
          </li>
          <li>
            <strong>Authorised Sub-processor</strong> — a third party
            listed on our current{" "}
            <Link href="/legal/sub-processors">Sub-processors page</Link>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="roles" title="2. Roles + responsibilities">
        <p>
          The parties agree that for Patient Data, the Controller is the
          Controller and Vedge is the Processor. For data Vedge collects
          directly from the Controller&rsquo;s staff (e.g. login
          records, billing contact), Vedge acts as Controller and its{" "}
          <Link href="/legal/privacy">Privacy Policy</Link> applies.
        </p>
      </LegalSection>

      <LegalSection id="processing" title="3. Scope of processing">
        <p>The Processing by Vedge is:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Subject matter</strong>: delivery of the Service —
            electronic health records, appointment management, billing,
            clinical workflow, analytics.
          </li>
          <li>
            <strong>Duration</strong>: the term of the subscription plus
            the export window defined in §13.
          </li>
          <li>
            <strong>Nature + purpose</strong>: storage, retrieval,
            analysis, transmission, and deletion of Patient Data as
            instructed by the Controller through use of the Service.
          </li>
          <li>
            <strong>Categories of Data Subjects</strong>: the
            Controller&rsquo;s patients, dependants, and staff.
          </li>
          <li>
            <strong>Types of Personal Data</strong>: identity,
            demographics, contact, clinical observations, diagnoses,
            prescriptions, lab + imaging results, insurance claim data,
            appointment history, billing records.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="instructions" title="4. Controller instructions">
        <p>
          Vedge Processes Personal Data only on the Controller&rsquo;s
          documented instructions, which are:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Use of the Service by the Controller&rsquo;s Authorised
            Users according to its configured settings.
          </li>
          <li>
            Any written instruction sent to{" "}
            <a href={`mailto:${LEGAL_CONFIG.dpoEmail}`}>
              {LEGAL_CONFIG.dpoEmail}
            </a>
            .
          </li>
        </ul>
        <p>
          Vedge will inform the Controller without undue delay if, in
          its opinion, an instruction infringes the DPA 2012 or any
          other applicable law.
        </p>
      </LegalSection>

      <LegalSection id="security" title="5. Security measures">
        <p>
          Vedge implements the technical and organisational measures
          described in <em>Annex III</em>, including encryption at rest
          and in transit, role-based access control, audit logging, and
          multi-tenant schema isolation.
        </p>
      </LegalSection>

      <LegalSection id="staff" title="6. Staff confidentiality">
        <p>
          Every Vedge employee or contractor with potential access to
          Personal Data signs a written confidentiality undertaking
          before access is granted, and receives data-protection
          training annually.
        </p>
      </LegalSection>

      <LegalSection id="subprocessors" title="7. Sub-processors">
        <p>
          The Controller grants Vedge general written authorisation to
          engage the Sub-processors listed on our{" "}
          <Link href="/legal/sub-processors">Sub-processors page</Link>.
          Vedge will notify the Controller by email at least{" "}
          <strong>30 days</strong> before adding or replacing a
          Sub-processor. The Controller may object on reasonable data
          protection grounds within that window; if the objection cannot
          be resolved, the Controller may terminate its subscription for
          convenience with pro-rata refund of prepaid fees.
        </p>
        <p>
          Vedge imposes on every Sub-processor contractual obligations
          at least as protective as those in this DPA and remains liable
          to the Controller for Sub-processor performance.
        </p>
      </LegalSection>

      <LegalSection id="transfer" title="8. International transfers">
        <p>
          Where Vedge transfers Patient Data outside Ghana, the transfer
          is executed under Standard Contractual Clauses and only to
          jurisdictions providing an adequate level of protection under
          §§47–48 DPA 2012, or with explicit Data Subject consent where
          that is the operative lawful basis.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="9. Data subject rights">
        <p>
          Taking into account the nature of the Processing, Vedge assists
          the Controller in responding to Data Subject requests under
          §§32–36 DPA 2012. Requests received directly by Vedge are
          forwarded to the Controller without undue delay, and the
          Controller remains responsible for the substantive response.
        </p>
      </LegalSection>

      <LegalSection id="dpia" title="10. DPIAs + prior consultation">
        <p>
          Vedge assists the Controller in carrying out Data Protection
          Impact Assessments and prior consultations with the Data
          Protection Commission, to the extent reasonable given the
          information available to Vedge as Processor.
        </p>
      </LegalSection>

      <LegalSection id="breach" title="11. Breach notification">
        <p>
          If Vedge becomes aware of a Personal Data Breach affecting
          Patient Data, Vedge notifies the Controller without undue
          delay and in any case within{" "}
          <strong>{LEGAL_CONFIG.breach.vedgeToTenantHours} hours</strong>{" "}
          of confirmation. The notification will include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The nature of the breach and categories of data affected.</li>
          <li>The approximate number of Data Subjects concerned.</li>
          <li>
            The likely consequences and the measures Vedge has taken or
            proposes to take.
          </li>
          <li>The Vedge contact point for follow-up enquiries.</li>
        </ul>
        <p>
          The Controller remains responsible for notifying the Data
          Protection Commission and affected Data Subjects under §§31
          DPA 2012; Vedge will provide the information reasonably
          required for the Controller to do so.
        </p>
      </LegalSection>

      <LegalSection id="audit" title="12. Audit">
        <p>
          Vedge makes available to the Controller, on reasonable written
          request at no more than annual cadence, the information
          necessary to demonstrate compliance with this DPA. Where the
          Controller requires an on-site audit, the parties will agree
          scope, timing, and costs in good faith, acting so as not to
          unreasonably disrupt the Service for other tenants. Vedge
          undertakes to provide, on request, its most recent SOC 2 / ISO
          27001 evidence package once obtained.
        </p>
      </LegalSection>

      <LegalSection id="return" title="13. Return + deletion">
        <p>
          On termination of the subscription, Vedge will:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Make the Controller&rsquo;s data available for export for{" "}
            {LEGAL_CONFIG.dataExport.windowDays} days in the following
            formats: {LEGAL_CONFIG.dataExport.formats.join(", ")}.
          </li>
          <li>
            Delete or irreversibly anonymise the data after the export
            window, subject to retention obligations imposed by law
            (billing records, audit log) or by the Controller&rsquo;s
            own retention policy.
          </li>
          <li>
            Certify the deletion in writing on request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="term" title="14. Term + liability">
        <p>
          This DPA takes effect on the commencement of the Controller&rsquo;s
          subscription and remains in force for as long as Vedge
          Processes Personal Data on the Controller&rsquo;s behalf,
          including during the export window in §13. Liability under
          this DPA is subject to the cap in the{" "}
          <Link href="/legal/terms">Terms of Service</Link>, save that
          either party&rsquo;s breach of its data-protection obligations
          is excluded from that cap to the extent required by the DPA
          2012.
        </p>
      </LegalSection>

      <LegalSection id="annex-i" title="Annex I — Processing details">
        <p>See §3 above. Processing details are fixed for the life of
          the subscription unless the parties agree otherwise in
          writing.</p>
      </LegalSection>

      <LegalSection id="annex-ii" title="Annex II — Approved sub-processors">
        <p>
          The authoritative, current list is the{" "}
          <Link href="/legal/sub-processors">Sub-processors page</Link>.
          That page incorporates by reference into this DPA and is
          updated in accordance with §7.
        </p>
      </LegalSection>

      <LegalSection id="annex-iii" title="Annex III — Security measures">
        <p>
          The current, detailed description of Vedge&rsquo;s technical
          and organisational measures is published on our{" "}
          <Link href="/legal/security">Security page</Link> and
          incorporated by reference. Vedge will not degrade its security
          posture during the term of the subscription and will notify
          the Controller of material changes to the posture.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
