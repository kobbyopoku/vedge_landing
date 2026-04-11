import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Design-partner application handler.
 *
 * This route accepts a JSON body from `DesignPartnerForm`, validates the
 * required fields, and persists one record per line to a JSONL file at
 * `data/design-partners.jsonl` (gitignored).
 *
 * ─── STORAGE NOTES ──────────────────────────────────────────────────────
 * JSONL on the local filesystem is a deliberate dev-time choice: it works
 * with zero infrastructure and lets us ship the marketing site immediately.
 *
 * On Vercel (or any serverless host) the filesystem is ephemeral and
 * read-only in most locations, so this will not persist across deploys.
 * BEFORE LAUNCH, replace the file-append block with a write to a real
 * backend — Firebase, Supabase, Neon, Resend, Formspree, or a tiny KV
 * store. The rest of this handler (shape, validation, response contract)
 * can stay the same.
 * ───────────────────────────────────────────────────────────────────────
 */

// Shape of an application — matches the form field names.
type DesignPartnerApplication = {
  name: string;
  role: string;
  email: string;
  phone: string;
  facility: string;
  facility_type: string;
  country: string;
  team_size: string;
  current_system: string;
  problem: string;
  why_you: string;
  agree_terms?: string;
};

const REQUIRED_FIELDS: (keyof DesignPartnerApplication)[] = [
  "name",
  "role",
  "email",
  "phone",
  "facility",
  "facility_type",
  "country",
  "team_size",
  "current_system",
  "problem",
  "why_you",
];

const MAX_FIELD_LENGTH = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: unknown): { ok: true; data: DesignPartnerApplication } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Expected a JSON object." };
  }

  const app = body as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    const value = app[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return { ok: false, error: `Missing required field: ${field}` };
    }
    if (value.length > MAX_FIELD_LENGTH) {
      return { ok: false, error: `Field ${field} is too long.` };
    }
  }

  if (typeof app.email === "string" && !EMAIL_REGEX.test(app.email)) {
    return { ok: false, error: "That email address does not look valid." };
  }

  if (app.agree_terms !== "on") {
    return { ok: false, error: "You must accept the design-partner terms." };
  }

  // Typed return — we've checked every required field is a string above.
  const data = REQUIRED_FIELDS.reduce<Record<string, string>>((acc, key) => {
    acc[key] = (app[key] as string).trim();
    return acc;
  }, {}) as unknown as DesignPartnerApplication;

  return { ok: true, data };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const lead = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "new" as const,
    ...result.data,
  };

  // Persist to JSONL — one application per line. Easy to tail, easy to grep,
  // easy to import into any tool later.
  try {
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    const file = path.join(dataDir, "design-partners.jsonl");
    await fs.appendFile(file, JSON.stringify(lead) + "\n", "utf8");
  } catch (error) {
    console.error("[vedge-landing] Failed to persist design partner lead", error);
    return NextResponse.json(
      { error: "We could not save your application. Please try again." },
      { status: 500 }
    );
  }

  // Always log so you can see applications in `npm run dev` output.
  console.log(
    `[vedge-landing] Design partner lead: ${lead.facility} (${lead.facility_type}) — ${lead.email}`
  );

  return NextResponse.json({ ok: true, id: lead.id });
}
