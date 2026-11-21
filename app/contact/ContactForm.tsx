"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL, sendContactMessage } from "./sendContactMessage";

type Status = "idle" | "submitting" | "success" | "error";

const facilityTypes = [
  { value: "hospital", label: "Hospital / clinic" },
  { value: "laboratory", label: "Laboratory" },
  { value: "diagnostic_center", label: "Radiology / Diagnostic Centre" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "other", label: "Other" },
] as const;

/**
 * Contact form. Sends through /api/contact, which saves the message on the
 * backend and emails the team (UX-023). It says "received" only when the
 * message was saved; otherwise it shows the error and our email address.
 *
 * No `.reveal` here: the success panel (and the form, after "send another")
 * mount after RevealMount has run, so they would stay at opacity 0.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // The long form collapses into a short panel, which leaves the visitor
  // looking at empty space below it; bring the answer into view.
  const answer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status === "success" || status === "error") {
      answer.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const data = Object.fromEntries(
      Array.from(new FormData(form).entries(), ([k, v]) => [k, String(v)]),
    );

    const result = await sendContactMessage(data);
    if (result.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  if (status === "success") {
    return (
      <div ref={answer} role="status" className="border border-forest bg-forest/5 p-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest">Message received</div>
        <h2 className="mt-4 font-display text-3xl">We&rsquo;ll be in touch within one working day.</h2>
        <p className="mt-4 max-w-md text-ink/75">
          Expect an email soon. If it&rsquo;s urgent, write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-clay underline underline-offset-4 hover:text-clay-deep"
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Field label="Your name" name="name" type="text" required placeholder="Your full name" />
      <Field label="Work email" name="email" type="email" required placeholder="you@yourfacility.com" />
      <Field label="Facility name" name="facility" type="text" required placeholder="Your facility's name" />
      <SelectField
        label="Facility type"
        name="facility_type"
        required
        options={facilityTypes}
        placeholder="Choose one"
      />
      <Field label="Team size" name="team_size" type="text" required placeholder="50 clinicians, 10 admin" />

      <div>
        <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
          What should we know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="We run a 60-bed district hospital and currently use paper charts + an Excel claims log. Looking to digitise end-to-end by Q3."
          className="mt-3 w-full border-0 border-b border-ink/25 bg-transparent py-3 font-display text-xl text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none"
        />
      </div>

      {status === "error" && (
        <div ref={answer} role="alert" className="border border-clay bg-clay/5 p-6 text-ink">
          <p>{error}</p>
          <p className="mt-3">
            Or write to us directly:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono underline underline-offset-4">{CONTACT_EMAIL}</a>
          </p>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-3 bg-ink px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-all hover:bg-forest disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
          <span aria-hidden="true">→</span>
        </button>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
          By sending this form you agree to be contacted by the Vedge team.
        </p>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

function Field({ label, name, type, required, placeholder }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full border-0 border-b border-ink/25 bg-transparent py-3 font-display text-xl text-ink placeholder:text-ink/30 focus:border-forest focus:outline-none"
      />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  options: readonly { value: string; label: string }[];
  placeholder: string;
};

function SelectField({ label, name, required, options, placeholder }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="mt-3 w-full appearance-none border-0 border-b border-ink/25 bg-transparent py-3 font-display text-xl text-ink focus:border-forest focus:outline-none"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
