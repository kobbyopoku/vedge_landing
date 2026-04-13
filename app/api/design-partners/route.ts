import { NextResponse } from "next/server";

/**
 * Design-partner application handler.
 *
 * This route accepts a JSON body from `DesignPartnerForm`, validates the
 * required fields client-side-style (fast feedback, cheap filter), and then
 * proxies the submission to the Vedge backend's public
 * `design-partner-applications` endpoint.
 *
 * The backend owns persistence, rate-limiting, and duplicate detection. This
 * handler is a thin translator: snake_case form payload -> camelCase API
 * payload, and backend status codes -> the `{ ok, id }` / `{ error }` shape
 * the form already expects.
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
const BACKEND_TIMEOUT_MS = 10_000;

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

  // Preserve the agree_terms signal through validation so the proxy layer
  // can forward it as a boolean to the backend.
  data.agree_terms = app.agree_terms === "on" ? "on" : undefined;

  return { ok: true, data };
}

function toBackendPayload(data: DesignPartnerApplication) {
  return {
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    facility: data.facility,
    facilityType: data.facility_type,
    country: data.country,
    teamSize: data.team_size,
    currentSystem: data.current_system,
    problem: data.problem,
    whyYou: data.why_you,
    agreeTerms: data.agree_terms === "on",
  };
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

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8050";
  const backendUrl = `${apiBase}/api/public/design-partner-applications`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBackendPayload(result.data)),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error("[vedge-landing] Backend request failed", error);
    return NextResponse.json(
      { error: "We could not save your application. Please try again." },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }

  // Parse JSON defensively — backend may return non-JSON on some error paths.
  let payload: unknown = null;
  try {
    payload = await backendResponse.json();
  } catch {
    payload = null;
  }

  if (backendResponse.status === 201) {
    const id =
      payload && typeof payload === "object" && "id" in payload
        ? (payload as { id: unknown }).id
        : undefined;

    console.log(
      `[vedge-landing] Design partner lead: ${result.data.facility} (${result.data.facility_type}) — ${result.data.email} [id=${id ?? "unknown"}]`
    );

    return NextResponse.json({ ok: true, id });
  }

  if (backendResponse.status === 400) {
    const message =
      payload && typeof payload === "object" && "error" in payload && typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : "Your application could not be accepted. Please review the fields and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (backendResponse.status === 429) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in about an hour." },
      { status: 429 }
    );
  }

  console.error(
    `[vedge-landing] Backend returned unexpected status ${backendResponse.status}`,
    payload
  );
  return NextResponse.json(
    { error: "We could not save your application. Please try again." },
    { status: 500 }
  );
}
