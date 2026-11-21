export const CONTACT_EMAIL = "hello@tryvedge.com";

const FALLBACK = `We could not send your message. Please email ${CONTACT_EMAIL} instead.`;

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the contact form to /api/contact (UX-023). Sent means the route
 * answered 2xx, which it does only once the backend saved the message.
 * Anything else is an error the form shows, never a quiet success.
 */
export async function sendContactMessage(data: Record<string, string>): Promise<SendResult> {
  let res: Response;
  try {
    res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    return { ok: false, error: FALLBACK };
  }
  if (res.ok) return { ok: true };

  let error = FALLBACK;
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string") {
      error = (body as { error: string }).error;
    }
  } catch {
    /* not JSON: keep the fallback */
  }
  return { ok: false, error };
}
