import type { Metadata } from "next";
import {
  LegalPageLayout,
  LegalSection,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Service Level Agreement · Vedge",
  description: "Vedge's uptime target, measurement method, and service credits.",
};

const TOC = [
  { id: "target", label: "1. Uptime target" },
  { id: "measurement", label: "2. Measurement" },
  { id: "credits", label: "3. Service credits" },
  { id: "exclusions", label: "4. Exclusions" },
  { id: "claim", label: "5. How to claim" },
];

export default function SlaPage() {
  return (
    <LegalPageLayout
      kicker="Service Level"
      title="Uptime + credits"
      toc={TOC}
      intro={<>
        This Service Level Agreement describes the uptime commitment we
        make to tenants, how we measure it, and what compensation
        applies if we miss it.
      </>}
    >
      <LegalSection id="target" title="1. Uptime target">
        <p>
          Vedge targets{" "}
          <strong>{LEGAL_CONFIG.sla.uptimeTarget} monthly uptime</strong>{" "}
          on the authenticated API and web application, measured per{" "}
          {LEGAL_CONFIG.sla.measurementWindow}.
        </p>
      </LegalSection>

      <LegalSection id="measurement" title="2. Measurement">
        <p>
          Uptime is measured as{" "}
          <code>(total minutes in month − downtime minutes) / total minutes × 100</code>
          . A minute counts as downtime if more than 50% of API requests
          in that minute fail with a 5xx error not attributable to the
          tenant&rsquo;s own misuse.
        </p>
        <p>
          Our external monitoring runs from three Ghanaian ISPs and one
          global synthetic monitor, and the measurement is the minimum
          across probes — i.e. we measure what tenants actually
          experience, not best-case from our own datacentre.
        </p>
      </LegalSection>

      <LegalSection id="credits" title="3. Service credits">
        <p>
          If monthly uptime drops below the target, tenants are
          entitled to a service credit on the following schedule,
          applied to the next invoice:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-[11px] uppercase tracking-[0.18em]"
                style={{
                  fontFamily:
                    "var(--font-mono), 'SF Mono', Menlo, Consolas, 'Courier New', monospace",
                  color: "#847567",
                  borderBottom: "1px solid rgba(11, 11, 9, 0.12)",
                }}
              >
                <th className="py-3 pr-4 font-medium">Monthly uptime</th>
                <th className="py-3 pr-4 font-medium">Service credit</th>
              </tr>
            </thead>
            <tbody>
              {LEGAL_CONFIG.sla.credits.map((c) => (
                <tr
                  key={c.credit}
                  style={{ borderBottom: "1px solid rgba(11, 11, 9, 0.06)" }}
                >
                  <td className="py-3 pr-4 tabular-nums">
                    {c.minUptime} – {c.maxUptime}
                  </td>
                  <td className="py-3 pr-4 font-medium tabular-nums">
                    {c.credit} of monthly fees
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Service credits are the Tenant&rsquo;s sole remedy for uptime
          shortfalls. They cannot exceed 50% of the monthly fee for any
          given month.
        </p>
      </LegalSection>

      <LegalSection id="exclusions" title="4. Exclusions">
        <p>The following do not count as downtime:</p>
        <ul className="list-disc pl-6 space-y-1">
          {LEGAL_CONFIG.sla.exclusions.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection id="claim" title="5. How to claim">
        <p>
          Email <a href={`mailto:${LEGAL_CONFIG.supportEmail}`}>
            {LEGAL_CONFIG.supportEmail}
          </a>{" "}
          within 30 days of the end of the affected month. Include the
          tenant name, the month in question, and any symptoms you
          observed. We respond within 10 business days and apply
          approved credits to the next scheduled invoice.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
