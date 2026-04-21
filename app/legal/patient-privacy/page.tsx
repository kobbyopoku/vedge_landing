import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
} from "@/app/_components/legal/LegalPageLayout";
import { LEGAL_CONFIG } from "@/app/_lib/legal/config";

export const metadata: Metadata = {
  title: "Patient Privacy Notice · Vedge",
  description:
    "Plain-language notice for patients whose health data is processed through Vedge by their clinic, hospital, or diagnostic centre.",
};

const TOC = [
  { id: "what-is-vedge", label: "1. What is Vedge?" },
  { id: "who-sees-what", label: "2. Who sees what?" },
  { id: "how-we-use", label: "3. How your data is used" },
  { id: "sms-email", label: "4. SMS + email from us" },
  { id: "ai", label: "5. AI features" },
  { id: "retention", label: "6. How long we keep it" },
  { id: "rights", label: "7. Your rights" },
  { id: "children", label: "8. Children" },
  { id: "contact", label: "9. How to contact us" },
];

export default function PatientPrivacyNoticePage() {
  return (
    <LegalPageLayout
      kicker="For Patients"
      title="Patient Privacy Notice"
      toc={TOC}
      intro={
        <>
          If your clinic, hospital, diagnostic centre, or pharmacy uses
          Vedge to manage its records, your data passes through our
          platform too. This notice is written in plain language to
          explain what happens to your information and what rights you
          have. The full, formal{" "}
          <Link href="/legal/privacy">Privacy Policy</Link> sits behind
          it.
        </>
      }
    >
      <LegalSection id="what-is-vedge" title="1. What is Vedge?">
        <p>
          Vedge is a software platform that your healthcare provider
          uses to keep your records safe, send you reminders, and share
          your results with the people treating you. We are a
          technology company — we do not provide medical care and we do
          not decide what goes into your record.
        </p>
        <p>
          Your clinic is <strong>the data controller</strong> — they
          decide what data to collect and how it&rsquo;s used. Vedge is
          a <strong>data processor</strong> — we hold the data on their
          behalf, keep it secure, and act only on their instructions.
        </p>
      </LegalSection>

      <LegalSection id="who-sees-what" title="2. Who sees what?">
        <p>
          <strong>Your clinic&rsquo;s authorised staff</strong> see
          everything they need to treat you — demographics, clinical
          notes, prescriptions, lab results, imaging reports.
        </p>
        <p>
          <strong>Vedge employees</strong> only access your record in
          narrow, logged circumstances: to fix a bug you or your clinic
          reported, to respond to a security incident, or under a legal
          order. Every access is recorded in an audit log your clinic
          can see.
        </p>
        <p>
          <strong>Other clinics that haven&rsquo;t been given access by
          you or your current clinic</strong> cannot see your record,
          except through the Master Patient Index which exists to
          prevent duplicate records and to route referrals — and even
          there, clinical content is not shared without an active
          referral.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use" title="3. How your data is used">
        <ul className="list-disc pl-6 space-y-1">
          <li>Delivering care through your clinic&rsquo;s staff.</li>
          <li>Sending you SMS or email reminders and notifications (see §4).</li>
          <li>
            Generating bills and processing insurance claims you consent
            to submit (NHIS or private).
          </li>
          <li>Keeping the platform secure and reliable.</li>
        </ul>
        <p>
          We <strong>do not</strong> sell your data, use it to advertise
          to you, or give it to training datasets for third-party AI
          models.
        </p>
      </LegalSection>

      <LegalSection id="sms-email" title="4. SMS + email from us">
        <p>
          Vedge may send you SMS or email on behalf of your clinic —
          appointment reminders, result-ready alerts, welcome messages,
          shareable links to imaging or lab reports. These messages are
          sent using your clinic&rsquo;s sender identity where configured,
          or using &ldquo;Vedge&rdquo; as the sender otherwise.
        </p>
        <p>
          You can opt out of any specific category of message at any time
          by replying STOP to an SMS or using the unsubscribe link in an
          email. Clinical safety messages (e.g. a critical result
          flagged by your doctor) will still reach you through your
          clinic&rsquo;s standard process.
        </p>
      </LegalSection>

      <LegalSection id="ai" title="5. AI features">
        <p>
          Your clinic may choose to enable AI features that help its
          practitioners interpret results or prepare notes. If enabled:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            AI suggestions are clinical decision support only — your
            doctor makes the final diagnosis.
          </li>
          <li>
            Data sent to the AI provider (OpenAI) is de-identified where
            feasible, and subject to a zero-retention agreement so it is
            not used to train any model.
          </li>
          <li>
            Your clinic can turn AI features off for your record on
            request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="retention" title="6. How long we keep it">
        <p>
          Your clinic decides the retention period for your clinical
          record, subject to the minimum windows set by Ghana&rsquo;s
          HEFRA standards:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Adult records: {LEGAL_CONFIG.retention.adultRecords}</li>
          <li>Minor records: {LEGAL_CONFIG.retention.minorRecords}</li>
          <li>
            Maternal and death records:{" "}
            {LEGAL_CONFIG.retention.maternalAndDeathRecords}
          </li>
        </ul>
        <p>
          Audit-log entries are kept for {LEGAL_CONFIG.retention.auditLog}{" "}
          so a doctor suspecting misuse can investigate.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="7. Your rights">
        <p>
          Under the Ghana Data Protection Act 2012, you have the right
          to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>See what data your clinic holds about you.</li>
          <li>Correct anything that is inaccurate.</li>
          <li>Ask for deletion (subject to legal retention).</li>
          <li>Object to specific uses (like marketing).</li>
          <li>Receive your data in a portable format.</li>
          <li>Complain to the Data Protection Commission.</li>
        </ul>
        <p>
          Contact your clinic first — they are the data controller and
          most requests are handled there. If you can&rsquo;t get a
          satisfactory response, write to Vedge&rsquo;s DPO at{" "}
          <a href={`mailto:${LEGAL_CONFIG.dpoEmail}`}>
            {LEGAL_CONFIG.dpoEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="children" title="8. Children">
        <p>
          For paediatric patients, a parent or guardian acts on the
          child&rsquo;s behalf until the age of majority (21 years in
          Ghana). At majority the patient takes over their own access
          and consent.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="9. How to contact us">
        <p>
          <strong>For anything about your clinical record</strong>:
          contact the clinic where you received care. Their contact
          details are in the portal or on any letter/SMS they sent you.
        </p>
        <p>
          <strong>For anything about Vedge itself</strong>:
        </p>
        <ul className="list-none space-y-1">
          <li>
            Data Protection Officer —{" "}
            <a href={`mailto:${LEGAL_CONFIG.dpoEmail}`}>
              {LEGAL_CONFIG.dpoEmail}
            </a>
          </li>
          <li>
            Ghana Data Protection Commission —{" "}
            <a href={LEGAL_CONFIG.regulators.ghanaDpc.complaintUrl}>
              file a complaint
            </a>
          </li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
