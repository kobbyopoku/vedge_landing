import { NextResponse } from "next/server";

/**
 * Contact form handler (UX-023).
 *
 * The form used to log to the console and show "Message received". This
 * route forwards the message to the backend's public contact-requests
 * endpoint, which saves it and emails hello@. It answers `{ ok: true }`
 * only when the backend answered 201; every other outcome is an error the
 * form shows, with the email address as a fallback.
 *
 * Never log the message, the sender's name or their email address.
 */

const FIELDS = {
  name: 200,
  email: 255,
  facility: 300,
  facility_type: 30,
  team_size: 100,
  message: 5000,
} as const;

type Field = keyof typeof FIELDS;
type ContactMessage = Record<Field, string>;

const REQUIRED: Field[] = ["name", "email", "facility", "facility_type", "message"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACKEND_TIMEOUT_MS = 10_000;
const FAILED = "We could not send your message. Please email hello@tryvedge.com instead.";

function validate(body: unknown): { ok: true; data: ContactMessage } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Expected a JSON object." };
  }
  const raw = body as Record<string, unknown>;
  const data = {} as ContactMessage;
  for (const field of Object.keys(FIELDS) as Field[]) {
    const value = raw[field];
    if (value !== undefined && typeof value !== "string") {
      return { ok: false, error: `Field ${field} must be text.` };
    }
    const text = (value ?? "").trim();
    if (REQUIRED.includes(field) && text.length === 0) {
      return { ok: false, error: `Please fill in ${field.replace("_", " ")}.` };
    }
    if (text.length > FIELDS[field]) {
      return { ok: false, error: `${field.replace("_", " ")} is too long.` };
    }
    data[field] = text;
  }
  if (!EMAIL_REGEX.test(data.email)) {
    return { ok: false, error: "That email address does not look valid." };
  }
  return { ok: true, data };
}

/**
 * The address the hosting platform saw, for the backend's per-visitor limit.
 * The platform sets x-real-ip; failing that, it appends the connecting
 * address as the right-most x-forwarded-for entry. The left-most entry is
 * whatever the visitor chose to write, so it is never used.
 */
function visitorIp(headers: Headers): string | undefined {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  return headers.get("x-forwarded-for")?.split(",").map((hop) => hop.trim()).filter(Boolean).at(-1);
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
  // The backend rate-limits per visitor. It believes a visitor address only
  // with the key it shares with this server; without both, every message
  // shares this server's bucket.
  const landingKey = process.env.VEDGE_CONTACT_LANDING_KEY;
  const visitor = visitorIp(request.headers);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);
  let backend: Response;
  try {
    backend = await fetch(`${apiBase}/api/public/contact-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(landingKey && visitor ? { "X-Vedge-Landing-Key": landingKey, "X-Visitor-Ip": visitor } : {}),
      },
      body: JSON.stringify({
        name: result.data.name,
        email: result.data.email,
        facility: result.data.facility,
        facilityType: result.data.facility_type,
        teamSize: result.data.team_size || undefined,
        message: result.data.message,
      }),
      signal: controller.signal,
    });
  } catch {
    console.error("[vedge-landing] contact: backend unreachable");
    return NextResponse.json({ error: FAILED }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  if (backend.status === 201) {
    return NextResponse.json({ ok: true });
  }
  if (backend.status === 429) {
    return NextResponse.json(
      { error: "Too many messages from here. Please try again in an hour, or email hello@tryvedge.com." },
      { status: 429 },
    );
  }
  if (backend.status === 400) {
    return NextResponse.json(
      { error: "Some details were not accepted. Please check the form and try again." },
      { status: 400 },
    );
  }
  console.error(`[vedge-landing] contact: backend answered ${backend.status}`);
  return NextResponse.json({ error: FAILED }, { status: 502 });
}
