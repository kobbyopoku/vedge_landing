"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const facilityTypes = [
  { value: "hospital", label: "Hospital / clinic" },
  { value: "laboratory", label: "Laboratory" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "other", label: "Other" },
] as const;

/**
 * Minimal client-side form. Captures facility details and a free-text message.
 * On submit, logs the payload and shows a success state. Wire to Formspree,
 * Resend, or a custom API route before launch — no PII is stored client-side.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Deliberate placeholder — swap for a real endpoint before launch.
    // eslint-disable-next-line no-console
    console.log("[vedge-landing] contact form submission", data);

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="reveal border border-forest bg-forest/5 p-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest">Message received</div>
        <h2 className="mt-4 font-display text-3xl">We&rsquo;ll be in touch within one working day.</h2>
        <p className="mt-4 max-w-md text-ink/75">
          If it&rsquo;s urgent, call Accra on <span className="font-mono">+233 30 000 0000</span> between 08:00 and 19:00 GMT. Otherwise, expect an email soon.
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
    <form onSubmit={handleSubmit} className="reveal space-y-10">
      <Field label="Your name" name="name" type="text" required placeholder="Dr. Ama Owusu" />
      <Field label="Work email" name="email" type="email" required placeholder="ama@ridgehospital.gh" />
      <Field label="Facility name" name="facility" type="text" required placeholder="Ridge Hospital" />
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
