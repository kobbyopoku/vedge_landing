import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Security · Vedge",
  description:
    "How Vedge protects health data — encryption, access control, audit, backups, incident response.",
};

const TOC = [
  { id: "posture", label: "1. Security posture" },
  { id: "encryption", label: "2. Encryption" },
  { id: "access", label: "3. Access control" },
  { id: "isolation", label: "4. Tenant isolation" },
  { id: "audit", label: "5. Audit log" },
  { id: "backups", label: "6. Backups + DR" },
  { id: "pentest", label: "7. Testing" },
  { id: "disclosure", label: "8. Responsible disclosure" },
  { id: "incident", label: "9. Incident response" },
  { id: "compliance-frameworks", label: "10. Compliance frameworks" },
];

export default function SecurityPage() {
  return (
    <LegalPageLayout
      kicker="Security"
      title="How we protect your data"
      toc={TOC}
      intro={
        <>
          Vedge handles patient health information — some of the most
          sensitive data a platform can touch. This page describes the
          technical and organisational measures we apply, in the
          concrete terms a procurement team or the Ghana DPC would
          expect to see on inspection.
        </>
      }
    >
      <LegalCallout variant="info">
        Our security posture is also incorporated by reference into
        every tenant&rsquo;s{" "}
        <Link href="/legal/dpa">Data Processing Agreement</Link> as
        Annex III. We will not materially degrade it during the term of
        a subscription.
      </LegalCallout>

      <LegalSection id="posture" title="1. Security posture">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Defence-in-depth: every request passes through perimeter
            filtering, authentication, authorisation, tenant scoping,
            and per-resource access checks before reaching data.
          </li>
          <li>
            Least-privilege by default. Production access is
            just-in-time and logged; no standing admin sessions.
          </li>
          <li>
            Security review is mandatory for changes to authentication,
            authorisation, billing, payments, and any code path that
            handles PHI.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="encryption" title="2. Encryption">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>At rest:</strong> AES-256 (AWS KMS-managed keys).
            Database volumes, object storage, backups, and audit logs
            are all encrypted.
          </li>
          <li>
            <strong>In transit:</strong> TLS 1.2+ on every public
            endpoint. HTTP Strict Transport Security enforced. Modern
            cipher suites only.
          </li>
          <li>
            <strong>Application-level encryption:</strong> secrets and
            payment-token material are encrypted with a separate
            envelope key before they touch storage.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="access" title="3. Access control">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Role-based access control (RBAC) with hierarchical roles —
            PLATFORM_OWNER &gt; SUPER_ADMIN &gt; ORG_ADMIN &gt; clinical
            roles.
          </li>
          <li>
            Multi-factor authentication available for every account;
            required for PLATFORM_OWNER and SUPER_ADMIN.
          </li>
          <li>
            JWT sessions with refresh rotation; revoked centrally on
            logout or suspected compromise.
          </li>
          <li>
            Patient app sessions signed with a separate key and a
            distinct audience — they can&rsquo;t be used against staff
            surfaces.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="isolation" title="4. Tenant isolation">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Per-tenant PostgreSQL schema. The &ldquo;search_path&rdquo;
            is set at connection acquisition time and cleared at
            release — one tenant&rsquo;s query cannot cross into another
            tenant&rsquo;s schema.
          </li>
          <li>
            Row-level access checks in every service. Tenant ID is
            never trusted from a request body; it is resolved from the
            authenticated session and validated against every resource.
          </li>
          <li>
            Shared &ldquo;public&rdquo; schema carries only cross-tenant
            infrastructure (user accounts, Master Patient Index, billing
            registry) — never clinical content.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="audit" title="5. Audit log">
        <p>
          Every view, create, update, and delete of PHI is recorded to
          an append-only audit log with actor, timestamp, resource,
          tenant, and before/after where applicable. Retention:{" "}
          {LEGAL_CONFIG.retention.auditLog}. Tenants can view their own
          audit log through the admin console.
        </p>
      </LegalSection>

      <LegalSection id="backups" title="6. Backups + disaster recovery">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Continuous point-in-time recovery on the primary database
            (last 14 days).
          </li>
          <li>
            Nightly snapshot retained for 30 days.
          </li>
          <li>
            Target RPO: 15 minutes. Target RTO: 4 hours.
          </li>
          <li>
            Restore drills quarterly; results logged internally.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="pentest" title="7. Testing">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Annual third-party penetration test covering the web
            application, public API, mobile apps, and supporting
            infrastructure.
          </li>
          <li>
            Continuous dependency scanning (CVE monitoring with
            time-bound patching SLAs).
          </li>
          <li>
            Static application security testing (SAST) and dependency
            analysis in CI for every pull request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="disclosure" title="8. Responsible disclosure">
        <p>
          We welcome reports from independent researchers. Report
          vulnerabilities to{" "}
          <a href={`mailto:${LEGAL_CONFIG.securityEmail}`}>
            {LEGAL_CONFIG.securityEmail}
          </a>{" "}
          — we acknowledge within 2 business days and will work with
          you on remediation and (where appropriate) public disclosure
          timing. Good-faith research that stays within the rules below
          will not trigger legal action:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            No testing against production records of real patients; use
            your own test accounts.
          </li>
          <li>
            No denial-of-service, social engineering, or physical
            attacks.
          </li>
          <li>
            Keep findings confidential until we&rsquo;ve had a
            reasonable chance to fix them (90 days default).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="incident" title="9. Incident response">
        <p>
          Our incident-response plan runs on a 24-hour clock. On
          confirmation of an incident we:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Open an internal incident channel and assign an Incident
            Commander.
          </li>
          <li>
            Notify affected tenants within{" "}
            <strong>{LEGAL_CONFIG.breach.vedgeToTenantHours} hours</strong>
            .
          </li>
          <li>
            For incidents meeting the CSA Critical Information
            Infrastructure threshold, notify{" "}
            {LEGAL_CONFIG.breach.cii24hClock}.
          </li>
          <li>
            Publish a post-incident review after resolution, with
            tenant-facing detail proportional to impact.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="compliance-frameworks"
        title="10. Compliance frameworks"
      >
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Ghana Data Protection Act 2012 (Act 843)</strong> —
            registered processor. See{" "}
            <Link href="/legal/privacy">Privacy Policy</Link>.
          </li>
          <li>
            <strong>Ghana Cybersecurity Act 2020 (Act 1038)</strong> —
            we monitor CSA directives and will register on designation.
          </li>
          <li>
            <strong>SOC 2 Type I</strong> — roadmap: Q4 2026 observation
            window, report Q1 2027.
          </li>
          <li>
            <strong>PCI-DSS</strong> — card data is handled exclusively
            by our payment sub-processors; Vedge is a SAQ-A merchant
            scope only.
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
