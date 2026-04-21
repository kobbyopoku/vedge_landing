import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Regional Annexes · Vedge",
  description:
    "Country-specific privacy and data-protection annexes for markets Vedge is expanding into.",
};

const TOC = [
  { id: "nigeria", label: "Nigeria — NDPA 2023" },
  { id: "kenya", label: "Kenya — DPA 2019" },
  { id: "south-africa", label: "South Africa — POPIA" },
];

export default function RegionalAnnexesPage() {
  return (
    <LegalPageLayout
      kicker="Expansion"
      title="Regional Annexes"
      toc={TOC}
      intro={<>
        Vedge launches in Ghana and is expanding across Africa. When we
        begin processing data for a tenant in another jurisdiction, the
        country annex for that jurisdiction takes effect and the core{" "}
        <Link href="/legal/privacy">Privacy Policy</Link> and{" "}
        <Link href="/legal/dpa">DPA</Link> apply subject to the country-specific
        overrides below.
      </>}
    >
      <LegalCallout variant="info">
        <p>
          <strong>Status of each market:</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Ghana — <strong>live</strong> (primary jurisdiction).</li>
          <li>Nigeria — planned. Not yet operating.</li>
          <li>Kenya — planned. Not yet operating.</li>
          <li>South Africa — planned. Not yet operating.</li>
        </ul>
      </LegalCallout>

      <LegalSection id="nigeria" title="Nigeria — NDPA 2023">
        <p>
          On Nigerian launch, the Nigeria Data Protection Act 2023 and
          the NDPR 2019 apply to all personal data originating from or
          relating to data subjects in Nigeria.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>NDPC registration:</strong> Vedge will register as
            Major Data Processor of Major Importance with the Nigeria
            Data Protection Commission when our patient count in
            Nigeria crosses the threshold (200 data subjects / year for
            sensitive categories, including health).
          </li>
          <li>
            <strong>Breach clock:</strong> 72 hours to the NDPC after
            becoming aware of the breach — stricter than Ghana&rsquo;s
            &ldquo;as soon as reasonably practicable.&rdquo;
          </li>
          <li>
            <strong>DPO:</strong> mandatory under NDPR; our Ghana DPO
            also serves as DPO for Nigerian processing.
          </li>
          <li>
            <strong>Annual filing:</strong> Vedge will file the annual
            NDPC compliance audit by the statutory deadline.
          </li>
          <li>
            <strong>Cross-border:</strong> transfers out of Nigeria
            follow NDPR §2.11; SCCs in place with every relevant
            sub-processor.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="kenya" title="Kenya — DPA 2019">
        <p>
          On Kenyan launch, the Data Protection Act 2019 (Kenya) and the
          Office of the Data Protection Commissioner&rsquo;s regulations
          apply.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>ODPC registration:</strong> mandatory for health-data
            processors regardless of size. Vedge will register as Data
            Processor before onboarding the first Kenyan tenant.
          </li>
          <li>
            <strong>Breach clock:</strong> 72 hours to the ODPC.
          </li>
          <li>
            <strong>DPIA:</strong> Vedge will complete a Data Protection
            Impact Assessment for health-data processing and file it
            with ODPC as required.
          </li>
          <li>
            <strong>Data localisation:</strong> while the Kenyan DPA
            does not mandate localisation, tenant preference is
            typically for af-south-1 (Cape Town) or a Kenyan region.
            Vedge can accommodate this on contract.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="south-africa" title="South Africa — POPIA">
        <p>
          On South African launch, the Protection of Personal Information
          Act 2013 (POPIA) and the Regulations made under it apply to
          personal information entering or leaving South Africa.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Information Officer:</strong> Vedge will register
            an Information Officer with the Information Regulator.
          </li>
          <li>
            <strong>§57 Prior Authorisation:</strong> processing
            personal information for health purposes combined with
            unique identifiers and transborder flows requires prior
            authorisation — Vedge will file this <em>before</em>{" "}
            go-live in SA.
          </li>
          <li>
            <strong>Operator Agreement (§21):</strong> every SA tenant
            signs a POPIA-compliant Operator Agreement in place of or
            as a rider to our standard DPA.
          </li>
          <li>
            <strong>Breach clock:</strong> &ldquo;as soon as reasonably
            possible&rdquo; to the Information Regulator and affected
            data subjects.
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
