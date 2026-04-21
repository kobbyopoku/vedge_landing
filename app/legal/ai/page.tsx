import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageLayout,
  LegalSection,
  LegalCallout,
} from "@/app/_components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Responsible AI Statement · Vedge",
  description:
    "How Vedge uses AI — scope, human-in-the-loop, data handling, and the guard rails.",
};

const TOC = [
  { id: "where", label: "1. Where AI is used" },
  { id: "hitl", label: "2. Human-in-the-loop" },
  { id: "data", label: "3. What data we send" },
  { id: "training", label: "4. No training on your data" },
  { id: "limits", label: "5. Known limitations" },
  { id: "opt-in", label: "6. Opt-in + opt-out" },
  { id: "liability", label: "7. Clinical responsibility" },
];

export default function ResponsibleAiPage() {
  return (
    <LegalPageLayout
      kicker="AI"
      title="Responsible AI Statement"
      toc={TOC}
      intro={
        <>
          Vedge uses AI selectively and transparently. This page
          describes exactly where, how, and on what terms — so
          tenants, practitioners, and patients can make an informed
          choice about turning it on.
        </>
      }
    >
      <LegalCallout variant="warning">
        <p>
          <strong>AI features are disabled by default.</strong> A
          tenant admin must explicitly enable them per organisation,
          and the enablement is recorded in the audit log.
        </p>
      </LegalCallout>

      <LegalSection id="where" title="1. Where AI is used">
        <p>Today, AI appears in three places inside Vedge:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Diagnostic assist</strong> — surfacing differential
            diagnoses and suggested investigations from a doctor&rsquo;s
            chief-complaint + findings input.
          </li>
          <li>
            <strong>Lab / imaging interpretation support</strong> — a
            plain-language summary alongside the raw result a
            practitioner reviews.
          </li>
          <li>
            <strong>Documentation helpers</strong> — summarising long
            encounter notes into structured fields on request.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> use AI for autonomous decisions
          about care, billing, eligibility, or claim adjudication.
        </p>
      </LegalSection>

      <LegalSection id="hitl" title="2. Human-in-the-loop">
        <p>
          Every AI output in Vedge is surfaced to a licensed
          practitioner for review and acceptance. Nothing written by AI
          is persisted into the clinical record until a practitioner
          takes an action on it — either accepting, editing, or
          discarding.
        </p>
      </LegalSection>

      <LegalSection id="data" title="3. What data we send">
        <p>
          AI features send the minimum data needed to produce a useful
          suggestion:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            The specific clinical prompt (e.g. chief complaint, current
            findings, relevant history) the practitioner composes.
          </li>
          <li>
            Where it would harm accuracy to remove them, anonymised
            references like &ldquo;45-year-old female&rdquo; — never the
            patient&rsquo;s name, ID number, phone, or address.
          </li>
        </ul>
        <p>
          The AI provider we use today is OpenAI (United States),
          accessed under an enterprise zero-retention agreement.
          Prompts and responses are not stored by the provider beyond
          the duration of the request.
        </p>
      </LegalSection>

      <LegalSection id="training" title="4. No training on your data">
        <p>
          We do not allow our AI providers to train or fine-tune their
          models on your prompts or clinical content. The contractual
          zero-data-retention posture is backed by the sub-processor&rsquo;s
          own enterprise terms.
        </p>
      </LegalSection>

      <LegalSection id="limits" title="5. Known limitations">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            AI suggestions reflect patterns in general medical
            literature and may miss locally-specific disease
            prevalence, drug availability, or formulary preferences.
          </li>
          <li>
            Output quality degrades with ambiguous or extremely brief
            prompts. Practitioners should review every suggestion
            against the patient&rsquo;s full record.
          </li>
          <li>
            AI is not a substitute for imaging interpretation by a
            radiologist, nor for laboratory interpretation by a
            pathologist — it provides decision support only.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="opt-in" title="6. Opt-in + opt-out">
        <p>
          Tenants opt in by flipping the AI feature in the tenant admin
          console. They may opt out at any time; on opt-out, the
          feature is disabled for every practitioner in the tenant.
          Individual patients may ask their clinic to disable AI for
          their record only.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="7. Clinical responsibility">
        <p>
          AI-generated suggestions are clinical decision support only
          and do not constitute a diagnosis. Final clinical judgment
          rests with the licensed practitioner, and the employing
          facility retains its duty of care.
        </p>
        <p>
          See also: our{" "}
          <Link href="/legal/terms">Terms of Service</Link> §14
          (warranties + disclaimers) and{" "}
          <Link href="/legal/compliance">Compliance</Link> §4 (health-professions councils).
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
