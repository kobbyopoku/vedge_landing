import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Healthcare Compliance · Vedge",
  description:
    "Ghana regulator posture — HEFRA, NHIA, MoH / GHS, the health-professions councils, and CSA.",
};

const TOC = [
  { id: "hefra", label: "1. HEFRA — facility standards" },
  { id: "nhia", label: "2. NHIA / NHIS claims" },
  { id: "moh", label: "3. MoH + DHIS2 reporting" },
  { id: "councils", label: "4. Health-professions councils" },
  { id: "narcotics", label: "5. Controlled substances" },
  { id: "csa", label: "6. Cybersecurity Authority" },
];

export default function CompliancePage() {
  return (
    <LegalPageLayout
      kicker="Regulator Posture"
      title="Healthcare compliance"
      toc={TOC}
      intro={
        <>
          This page sets out, in concrete terms, Vedge&rsquo;s posture
          towards each Ghanaian health regulator. We avoid overclaiming
          — certifications we don&rsquo;t hold are clearly called out
          as roadmap items, not current status.
        </>
      }
    >
      <LegalCallout variant="warning">
        We do not claim endorsement by any regulator or ministry.
        Tenant facilities remain responsible for their own licences and
        statutory reporting; Vedge provides the tools to make those
        duties easier to meet.
      </LegalCallout>

      <LegalSection id="hefra" title="1. HEFRA — facility record standards">
        <p>
          Vedge is designed around the Health Facilities Regulatory
          Agency (HEFRA) Minimum Standards for clinics, hospitals,
          diagnostic centres, pharmacies, and eye-care providers.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Retention:</strong> clinical records are retained
            per HEFRA windows — adult: {LEGAL_CONFIG.retention.adultRecords};
            minor: {LEGAL_CONFIG.retention.minorRecords}; maternal +
            death: {LEGAL_CONFIG.retention.maternalAndDeathRecords}.
          </li>
          <li>
            <strong>Non-alterability:</strong> clinical entries are
            append-only; corrections are addenda with actor + timestamp
            audit. Original entries are never overwritten.
          </li>
          <li>
            <strong>Portability:</strong> on tenant exit we provide a
            complete export of the facility&rsquo;s records in formats
            suitable for hand-over to a successor system —{" "}
            {LEGAL_CONFIG.dataExport.formats.join(", ")}.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="nhia" title="2. NHIA / NHIS claims">
        <p>
          Vedge supports NHIS claim preparation in the format required
          by NHIA&rsquo;s e-Claims system. Final submission and
          adjudication occur through NHIA&rsquo;s official channels.
          Claim adjudication outcomes are determined solely by NHIA.
        </p>
        <p>
          We do <strong>not</strong> claim NHIA accreditation or
          certification. When Vedge obtains a formal e-Claims
          accreditation from NHIA, the accreditation letter will be
          published on this page.
        </p>
      </LegalSection>

      <LegalSection id="moh" title="3. MoH + DHIS2 reporting">
        <p>
          Vedge supports generation of HMIS monthly returns and IDSR
          weekly reports in DHIS2-compatible ADX format. Submission to
          DHIS2 remains the responsibility of each tenant facility&rsquo;s
          designated M&E officer.
        </p>
        <p>
          Vedge is not endorsed by, affiliated with, or certified by the
          Ministry of Health or the Ghana Health Service.
        </p>
      </LegalSection>

      <LegalSection id="councils" title="4. Health-professions councils">
        <p>
          Vedge verifies practitioner licence numbers against the
          issuing council&rsquo;s register at onboarding. Ongoing
          licence validity is the responsibility of the practitioner
          and the employing facility.
        </p>
        <p>
          Vedge does not enforce scope-of-practice limits in real time;
          each practitioner is responsible for practising within their
          registration with the{" "}
          <a href={LEGAL_CONFIG.regulators.ghanaMdc.url}>
            Medical and Dental Council
          </a>
          , the Nursing and Midwifery Council, the Pharmacy Council, or
          the Allied Health Professions Council as applicable.
        </p>
        <p>
          Electronic prescriptions generated through Vedge must be
          issued by a practitioner registered with the MDC or another
          authorised prescriber under the Health Professions Regulatory
          Bodies Act 2013 (Act 857).
        </p>
      </LegalSection>

      <LegalSection id="narcotics" title="5. Controlled substances">
        <p>
          Prescribing and dispensing of controlled substances through
          Vedge must comply with the Narcotics Control Commission Act
          2020 (Act 1019) and its subsidiary regulations, including
          schedule-specific prescriber authorisation, register
          maintenance, and disposal reporting.
        </p>
      </LegalSection>

      <LegalSection id="csa" title="6. Cybersecurity Authority">
        <p>
          The Cybersecurity Act 2020 (Act 1038) designates health as a
          sector that may host Critical Information Infrastructure.
          Vedge monitors CSA&rsquo;s CII directives and will register
          on designation. Our internal incident-response playbook
          commits to a {LEGAL_CONFIG.breach.cii24hClock} so tenant CII
          operators can meet their own reporting clock.
        </p>
        <p>
          Vedge does not currently provide &ldquo;cybersecurity
          services&rdquo; as defined under §49 of the Act and therefore
          holds no CSA service-provider licence; should our offering
          evolve to include such services, we will register before
          offering them.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
