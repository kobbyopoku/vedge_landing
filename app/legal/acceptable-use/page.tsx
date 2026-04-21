import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
} from "@/app/_components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Acceptable Use Policy · Vedge",
  description:
    "What tenants and their authorised users may and may not do on the Vedge platform.",
};

const TOC = [
  { id: "scope", label: "1. Scope" },
  { id: "prohibited", label: "2. Prohibited conduct" },
  { id: "phi", label: "3. Lawful PHI use" },
  { id: "security", label: "4. Security boundaries" },
  { id: "automation", label: "5. Automation + rate limits" },
  { id: "enforcement", label: "6. Enforcement" },
];

export default function AcceptableUsePage() {
  return (
    <LegalPageLayout
      kicker="Usage Rules"
      title="Acceptable Use Policy"
      toc={TOC}
      intro={
        <>
          This Acceptable Use Policy (&ldquo;AUP&rdquo;) describes what
          you may and may not do on Vedge. It is part of the{" "}
          <Link href="/legal/terms">Terms of Service</Link>. Breach is a
          material breach of those Terms.
        </>
      }
    >
      <LegalSection id="scope" title="1. Scope">
        <p>
          This policy applies to every Tenant, every Authorised User,
          and any third party accessing the Vedge Service on a
          Tenant&rsquo;s behalf.
        </p>
      </LegalSection>

      <LegalSection id="prohibited" title="2. Prohibited conduct">
        <p>You must not:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Upload or process data for which you lack a lawful basis,
            patient consent, or a supervisory relationship required by
            Ghanaian health-professions law.
          </li>
          <li>
            Use the Service to practise or facilitate medicine, dentistry,
            pharmacy, optometry, nursing, or any regulated profession
            without the applicable council&rsquo;s current licensure.
          </li>
          <li>
            Upload child sexual abuse material, content inciting
            violence, malware, phishing material, or content that
            violates Ghanaian criminal law.
          </li>
          <li>
            Transmit unsolicited commercial communications
            (&ldquo;spam&rdquo;) to patients or third parties through
            any Vedge-delivered channel.
          </li>
          <li>
            Impersonate another person, misrepresent your affiliation,
            or tamper with clinical records to obstruct investigation or
            audit.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="phi" title="3. Lawful PHI use">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Upload patient data only when you have the lawful basis and
            notice described in the{" "}
            <Link href="/legal/dpa">DPA</Link> and §§20, 27 DPA 2012.
          </li>
          <li>
            Do not export or forward clinical records outside the
            Service in a way that breaches your own retention, access,
            or confidentiality obligations.
          </li>
          <li>
            Controlled substances: prescribe and dispense only in
            accordance with the Narcotics Control Commission Act 2020.
          </li>
          <li>
            Where you act as a data processor for another controller
            (e.g. a lab sub-contracting diagnostic work), ensure your
            back-to-back contract mirrors the flow-downs in our DPA.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="security" title="4. Security boundaries">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Do not probe, scan, or attempt to penetrate the Service
            outside a written coordinated disclosure agreement with
            Vedge.
          </li>
          <li>
            Do not attempt to access records outside your Tenant
            context, bypass rate limits, or interfere with other
            tenants&rsquo; use of the Service.
          </li>
          <li>
            Report security concerns responsibly to{" "}
            <a href="mailto:security@tryvedge.com">security@tryvedge.com</a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="automation" title="5. Automation + rate limits">
        <p>
          Programmatic access to the Vedge API is permitted within
          published rate limits and the feature flags on your
          subscription plan. Do not circumvent limits, schedule bulk
          operations to coincide with known peak windows in a manner
          that degrades other tenants, or scrape the UI where an API
          exists.
        </p>
      </LegalSection>

      <LegalSection id="enforcement" title="6. Enforcement">
        <p>
          Vedge enforces this AUP proportionately. For first-time minor
          breaches we will contact the Tenant admin. For serious or
          repeated breaches — especially those that put other tenants
          or patients at risk — we may suspend Authorised User access,
          suspend the Tenant account, or terminate the subscription
          under §12 of the{" "}
          <Link href="/legal/terms">Terms of Service</Link>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
