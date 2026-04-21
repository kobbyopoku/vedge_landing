import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";
import { SUB_PROCESSORS } from "@/app/_lib/legal/subprocessors";

export const metadata: Metadata = {
  title: "Sub-processors · Vedge",
  description:
    "The authoritative, always-current list of Vedge sub-processors. Bookmark for change notifications.",
};

export default function SubProcessorsPage() {
  return (
    <LegalPageLayout
      kicker="Vendors"
      title="Sub-processors"
      intro={
        <>
          This page is the authoritative, always-current list of
          third-party services Vedge engages to deliver the platform.
          It is incorporated by reference into every tenant&rsquo;s{" "}
          <Link href="/legal/dpa">Data Processing Agreement</Link> as
          Annex II.
        </>
      }
    >
      <LegalCallout variant="info">
        We notify tenants by email <strong>at least 30 days</strong>{" "}
        before adding or replacing a sub-processor. To subscribe to
        change notifications, email{" "}
        <a href="mailto:legal@tryvedge.com">legal@tryvedge.com</a>{" "}
        with subject &ldquo;sub-processor updates&rdquo;.
      </LegalCallout>

      <LegalSection id="list" title="Current sub-processors">
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
                <th className="py-3 pr-4 font-medium">Vendor</th>
                <th className="py-3 pr-4 font-medium">Purpose</th>
                <th className="py-3 pr-4 font-medium">Data</th>
                <th className="py-3 pr-4 font-medium">Location</th>
                <th className="py-3 pr-4 font-medium">Transfer</th>
                <th className="py-3 pr-4 font-medium">PHI?</th>
              </tr>
            </thead>
            <tbody>
              {SUB_PROCESSORS.map((v) => (
                <tr
                  key={v.name}
                  style={{
                    borderBottom: "1px solid rgba(11, 11, 9, 0.06)",
                    verticalAlign: "top",
                  }}
                >
                  <td className="py-3 pr-4">
                    <div style={{ color: "#0B0B09" }} className="font-medium">
                      {v.name}
                    </div>
                    {v.vendorDpaUrl && (
                      <a
                        href={v.vendorDpaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline mt-1 inline-block"
                        style={{ color: "#847567" }}
                      >
                        vendor DPA
                      </a>
                    )}
                  </td>
                  <td className="py-3 pr-4">{v.purpose}</td>
                  <td className="py-3 pr-4">
                    <ul className="list-disc pl-4 space-y-0.5 text-[13px]">
                      {v.dataCategories.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 pr-4">{v.location}</td>
                  <td className="py-3 pr-4 text-[13px]">
                    {v.transferMechanism}
                  </td>
                  <td className="py-3 pr-4">
                    {v.transmitsClinicalData ? (
                      <span
                        className="inline-block px-2 py-0.5 text-[11px] uppercase tracking-wider"
                        style={{
                          backgroundColor: "#FCE7E3",
                          color: "#8A2D1E",
                          border: "1px solid #C8553D",
                        }}
                      >
                        Yes
                      </span>
                    ) : (
                      <span
                        className="inline-block px-2 py-0.5 text-[11px] uppercase tracking-wider"
                        style={{
                          backgroundColor: "#FBF7EE",
                          color: "#1B3B2F",
                          border: "1px solid rgba(11, 11, 9, 0.12)",
                        }}
                      >
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="flow-down" title="Flow-down obligations">
        <p>
          Every sub-processor above is bound by a contractual DPA with
          terms at least as strict as our{" "}
          <Link href="/legal/dpa">tenant DPA</Link> — including
          confidentiality, security measures, breach notification, and
          sub-processor change notice. Vedge remains liable to tenants
          for sub-processor performance under the limits set in our{" "}
          <Link href="/legal/terms">Terms of Service</Link>.
        </p>
      </LegalSection>

      <LegalSection id="objection" title="Objection rights">
        <p>
          Tenants may object to a new sub-processor on reasonable data
          protection grounds within 30 days of notification. If the
          objection cannot be resolved, the tenant may terminate the
          subscription for convenience with pro-rata refund of prepaid
          fees — see Terms §7 (sub-processor clause of the DPA).
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
