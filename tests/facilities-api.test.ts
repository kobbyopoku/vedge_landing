import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `getFacilities` at the fetch boundary.
 *
 * Exercised against a stubbed `fetch` rather than a stubbed
 * `getFacilities`, because the defect under test lives in the gap
 * between "the fetch threw" and "the page got an empty array" — mocking
 * the function would mock away the bug.
 *
 * In its own file, deliberately: `vi.mock` is hoisted and file-wide, so
 * the page tests next door (which must stub `getFacilities` to drive the
 * render) cannot share a module with tests that need the real one.
 */

import { getAllFacilities, getFacilities } from "../app/_lib/api";

const realFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  globalThis.fetch = realFetch;
  vi.restoreAllMocks();
});

describe("getFacilities distinguishes a failure from an empty directory", () => {
  beforeEach(() => {
    // The failure paths log deliberately; keep the run readable.
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("reports an empty directory as an answer, not a failure", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 24 }),
    ) as unknown as typeof fetch;

    const result = await getFacilities();

    expect(result.unavailable).toBe(false);
    expect(result.facilities).toEqual([]);
    expect(result.totalElements).toBe(0);
  });

  it("reports a transport failure as unavailable", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    const result = await getFacilities();

    expect(result.unavailable).toBe(true);
    expect(result.facilities).toEqual([]);
  });

  it("reports a 5xx as unavailable", async () => {
    globalThis.fetch = vi.fn(async () => jsonResponse({}, 503)) as unknown as typeof fetch;

    expect((await getFacilities()).unavailable).toBe(true);
  });

  it("reports a timeout as unavailable", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw Object.assign(new Error("The operation was aborted due to timeout"), {
        name: "TimeoutError",
      });
    }) as unknown as typeof fetch;

    expect((await getFacilities()).unavailable).toBe(true);
  });

  it("reports a successful page of results as available", async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse({
        content: [{ slug: "ridge", name: "Ridge", acceptsRequests: true }],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 24,
      }),
    ) as unknown as typeof fetch;

    const result = await getFacilities();

    expect(result.unavailable).toBe(false);
    expect(result.facilities).toHaveLength(1);
  });

  it("stops the sitemap walk on a failed page instead of counting it as the end", async () => {
    let call = 0;
    globalThis.fetch = vi.fn(async () => {
      call += 1;
      if (call === 1) {
        return jsonResponse({
          content: [{ slug: "a", name: "A", acceptsRequests: false }],
          totalElements: 200,
          totalPages: 2,
          number: 0,
          size: 100,
        });
      }
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    const all = await getAllFacilities(5);

    // Partial results kept, and the walk stopped rather than continuing
    // to hammer a backend that is already failing.
    expect(all.map((f) => f.slug)).toEqual(["a"]);
    expect(call).toBe(2);
  });
});

