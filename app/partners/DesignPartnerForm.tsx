"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const facilityTypes = [
  { value: "hospital", label: "Hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "laboratory", label: "Laboratory" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "other", label: "Other" },
] as const;

const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
  { value: "rwanda", label: "Rwanda" },
  { value: "uganda", label: "Uganda" },
  { value: "tanzania", label: "Tanzania" },
  { value: "ethiopia", label: "Ethiopia" },
  { value: "cote-divoire", label: "Côte d\u2019Ivoire" },
  { value: "senegal", label: "Senegal" },
  { value: "togo", label: "Togo" },
  { value: "egypt", label: "Egypt" },
  { value: "morocco", label: "Morocco" },
  { value: "other", label: "Elsewhere in Africa" },
] as const;

/**
 * Design partner application form. POSTs to /api/design-partners where
 * the route handler validates and persists the lead.
 *
 * On success we render a congratulatory panel; on error we show a generic
 * recovery message with a retry affordance — no raw server errors leak
 * to the visitor.
 */
export function DesignPartnerForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/design-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Submission failed");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong on our side. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="reveal border border-sun/40 bg-sun/5 p-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-sun">Application received</div>
        <h2 className="mt-5 font-display text-3xl text-bone">
          We&rsquo;ll be back to you before the end of the week.
        </h2>
        <p className="mt-4 max-w-md text-bone/75">
          Every application gets a real reply from a real person at Vedge — yes or no — within two working days. No auto-responders, no silence.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-sun underline underline-offset-4 hover:text-bone"
        >
          Submit another application →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <DarkField label="Your name" name="name" type="text" required placeholder="Dr. Ama Owusu" />
        <DarkField label="Role" name="role" type="text" required placeholder="Medical director" />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <DarkField label="Work email" name="email" type="email" required placeholder="ama@ridgehospital.gh" />
        <DarkField label="Phone" name="phone" type="tel" required placeholder="+233 24 000 0000" />
      </div>

      <DarkField label="Facility name" name="facility" type="text" required placeholder="Ridge Hospital" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <DarkSelect label="Facility type" name="facility_type" required options={facilityTypes} placeholder="Choose one" />
        <DarkSelect label="Country" name="country" required options={countries} placeholder="Choose one" />
      </div>

      <DarkField label="Team size" name="team_size" type="text" required placeholder="50 clinicians, 10 admin" />

      <div>
        <label htmlFor="current_system" className="block font-mono text-[10px] uppercase tracking-[0.22em] text-sun/80">
          What do you run today?
        </label>
        <input
          id="current_system"
          name="current_system"
          type="text"
          required
          placeholder="Paper charts, Excel for claims, Dopass pharmacy"
          className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent py-3 font-display text-xl text-bone placeholder:text-bone/30 focus:border-sun focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="problem" className="block font-mono text-[10px] uppercase tracking-[0.22em] text-sun/80">
          What do you want to solve?
        </label>
        <textarea
          id="problem"
          name="problem"
          rows={5}
          required
          placeholder="We lose about 20% of our insurance claims to submission errors. I want every claim filed correctly the same day the patient leaves."
          className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent py-3 font-display text-xl text-bone placeholder:text-bone/30 focus:border-sun focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="why_you" className="block font-mono text-[10px] uppercase tracking-[0.22em] text-sun/80">
          Why you, as a design partner?
        </label>
        <textarea
          id="why_you"
          name="why_you"
          rows={4}
          required
          placeholder="We pilot new tools fast, our matron has been asking for digital charts for three years, and we are the only mission hospital in the sub-district."
          className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent py-3 font-display text-xl text-bone placeholder:text-bone/30 focus:border-sun focus:outline-none"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-bone/75">
        <input
          type="checkbox"
          name="agree_terms"
          required
          className="mt-[5px] h-4 w-4 accent-sun"
        />
        <span>
          I have read the benefits and expectations above and agree that a design partnership is a two-way commitment.
        </span>
      </label>

      {status === "error" && errorMessage && (
        <div role="alert" className="border border-clay/60 bg-clay/10 p-5 text-sm text-bone">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">Could not submit</div>
          <p className="mt-2">{errorMessage}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-3 bg-sun px-9 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-forest-deep transition-all hover:bg-bone disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Apply for design partner"}
          <span aria-hidden="true">→</span>
        </button>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/45">
          We reply to every application within two working days.
        </p>
      </div>
    </form>
  );
}

type DarkFieldProps = {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

function DarkField({ label, name, type, required, placeholder }: DarkFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-[0.22em] text-sun/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full border-0 border-b border-bone/30 bg-transparent py-3 font-display text-xl text-bone placeholder:text-bone/30 focus:border-sun focus:outline-none"
      />
    </div>
  );
}

type DarkSelectProps = {
  label: string;
  name: string;
  required?: boolean;
  options: readonly { value: string; label: string }[];
  placeholder: string;
};

function DarkSelect({ label, name, required, options, placeholder }: DarkSelectProps) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-[0.22em] text-sun/80">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="mt-3 w-full appearance-none border-0 border-b border-bone/30 bg-transparent py-3 font-display text-xl text-bone focus:border-sun focus:outline-none"
      >
        <option value="" disabled className="bg-forest-deep">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-forest-deep">{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
