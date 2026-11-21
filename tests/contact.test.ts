import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * UX-023: the contact form used to log to the console, wait 600 ms and
 * say "Message received". Every demo, quote and trial enquiry was lost.
 *
 * Two layers are pinned here, both against a stubbed `fetch`:
 *  - the Next route, which forwards to the backend and says ok only on 201;
 *  - the form's sender, which says sent only on a 2xx from the route.
 * Neither may ever report success it did not get.
 */

import { POST } from "../app/api/contact/route";
import { sendContactMessage } from "../app/contact/sendContactMessage";

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const message = {
  name: "Akosua Mensah",
  email: "akosua@example.com",
  facility: "Example Pharmacy",
  facility_type: "pharmacy",
  team_size: "6",
  message: "Please call me about a trial.",
};

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function backendAnswers(status: number, body: unknown = {}) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe("POST /api/contact", () => {
  it("forwards the message to the backend and says ok only when it was saved", async () => {
    const fetchMock = backendAnswers(201, { id: "abc" });

    const res = await POST(post(message));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/api\/public\/contact-requests$/);
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Akosua Mensah",
      email: "akosua@example.com",
      facility: "Example Pharmacy",
      facilityType: "pharmacy",
      teamSize: "6",
      message: "Please call me about a trial.",
    });
  });

  /*
   * The backend's per-visitor limit used to key on the left-most
   * X-Forwarded-For entry, which the visitor writes. A new value per
   * request got a fresh bucket. Only the address the hosting platform saw
   * may be passed on, and only with the shared landing key.
   */
  function sentHeaders(fetchMock: ReturnType<typeof backendAnswers>) {
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    return init.headers as Record<string, string>;
  }

  it("passes on the platform's x-real-ip with the landing key, never a forwarded-for entry", async () => {
    vi.stubEnv("VEDGE_CONTACT_LANDING_KEY", "landing-secret");
    const fetchMock = backendAnswers(201, { id: "abc" });

    await POST(post(message, { "x-real-ip": "198.51.100.4", "x-forwarded-for": "10.7.0.1, 198.51.100.4" }));

    const headers = sentHeaders(fetchMock);
    expect(headers["X-Visitor-Ip"]).toBe("198.51.100.4");
    expect(headers["X-Vedge-Landing-Key"]).toBe("landing-secret");
    expect(headers["X-Forwarded-For"]).toBeUndefined();
  });

  it("without x-real-ip takes the right-most forwarded-for entry, not the visitor-written left-most", async () => {
    vi.stubEnv("VEDGE_CONTACT_LANDING_KEY", "landing-secret");
    const fetchMock = backendAnswers(201, { id: "abc" });

    await POST(post(message, { "x-forwarded-for": "10.7.0.1, 1.2.3.4, 203.0.113.9" }));

    expect(sentHeaders(fetchMock)["X-Visitor-Ip"]).toBe("203.0.113.9");
  });

  it("sends no visitor address when the landing key is not set", async () => {
    vi.stubEnv("VEDGE_CONTACT_LANDING_KEY", "");
    const fetchMock = backendAnswers(201, { id: "abc" });

    await POST(post(message, { "x-real-ip": "198.51.100.4", "x-forwarded-for": "198.51.100.4" }));

    const headers = sentHeaders(fetchMock);
    expect(headers["X-Visitor-Ip"]).toBeUndefined();
    expect(headers["X-Vedge-Landing-Key"]).toBeUndefined();
    expect(headers["X-Forwarded-For"]).toBeUndefined();
  });

  it("reports an error with the email fallback when the backend fails", async () => {
    backendAnswers(500);

    const res = await POST(post(message));

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBeUndefined();
    expect(body.error).toContain("hello@tryvedge.com");
  });

  it("reports an error when the backend cannot be reached", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    const res = await POST(post(message));

    expect(res.status).toBe(502);
    expect((await res.json()).error).toContain("hello@tryvedge.com");
  });

  it("refuses a message with a missing field without calling the backend", async () => {
    const fetchMock = backendAnswers(201);

    const res = await POST(post({ ...message, email: "" }));

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses an over-long message without calling the backend", async () => {
    const fetchMock = backendAnswers(201);

    const res = await POST(post({ ...message, message: "x".repeat(5001) }));

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passes the backend's rate limit on as 429", async () => {
    backendAnswers(429);

    const res = await POST(post(message));

    expect(res.status).toBe(429);
  });
});

describe("sendContactMessage", () => {
  it("is sent only when the route answers ok", async () => {
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })) as unknown as typeof fetch;

    expect(await sendContactMessage(message)).toEqual({ ok: true });
  });

  it("shows the route's error when it refuses", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response(JSON.stringify({ error: "Too many messages." }), { status: 429 }),
    ) as unknown as typeof fetch;

    expect(await sendContactMessage(message)).toEqual({ ok: false, error: "Too many messages." });
  });

  it("never claims success when the route cannot be reached", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("offline");
    }) as unknown as typeof fetch;

    const result = await sendContactMessage(message);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("hello@tryvedge.com");
  });

  it("never claims success on a server error with no message", async () => {
    globalThis.fetch = vi.fn(async () => new Response("Bad gateway", { status: 502 })) as unknown as typeof fetch;

    const result = await sendContactMessage(message);

    expect(result.ok).toBe(false);
  });
});
