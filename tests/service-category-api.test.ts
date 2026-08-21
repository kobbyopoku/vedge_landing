import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The two halves of the category contract that only exist at the fetch
 * boundary: the URL the directory actually asks for, and what a refused
 * filter is turned into.
 *
 * <p>In its own file with the real `app/_lib/api`, because `vi.mock` is
 * hoisted and file-wide — the page tests next door must stub
 * `getFacilities` to drive a render, and these must not. Same split
 * `facilities-api.test.ts` already established.</p>
 */

import { getFacilities, getServiceCategories } from "../app/_lib/api";

const realFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const EMPTY_PAGE = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 24 };

let requested: string[];

beforeEach(() => {
  requested = [];
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  globalThis.fetch = realFetch;
  vi.restoreAllMocks();
});

/** Records every URL asked for and answers with `body`. */
function stubFetch(body: unknown, status = 200) {
  globalThis.fetch = vi.fn(async (url: unknown) => {
    requested.push(String(url));
    return jsonResponse(body, status);
  }) as unknown as typeof fetch;
}

// ── the wire name ────────────────────────────────────────────────────

describe("the category reaches the API under the name the API reads", () => {
  it("sends it as ?category=", async () => {
    // The backend deliberately ignores query parameters it does not
    // recognise, so a name that drifts on either side produces no error
    // anywhere — only an unfiltered directory. There is nothing else in
    // this repo that would notice.
    stubFetch(EMPTY_PAGE);

    await getFacilities({ category: "LAB" });

    expect(requested[0]).toContain("category=LAB");
  });

  it("omits it entirely when there is none", async () => {
    // Not `category=`, which the server reads as blank-is-absent but
    // which would still be a parameter we send for no reason — and, if
    // the blank-is-absent rule ever tightened, a 400 on every unfiltered
    // page load.
    stubFetch(EMPTY_PAGE);

    await getFacilities({});

    expect(requested[0]).not.toContain("category");
  });

  it("carries the category alongside the other filters rather than replacing one", async () => {
    stubFetch(EMPTY_PAGE);

    await getFacilities({ type: "CLINIC", location: "Kumasi", service: "mri", category: "IMAGING" });

    const url = requested[0];
    expect(url).toContain("type=CLINIC");
    expect(url).toContain("location=Kumasi");
    expect(url).toContain("service=mri");
    expect(url).toContain("category=IMAGING");
  });

  it("asks the option endpoint for the option set", async () => {
    stubFetch(["IMAGING"]);

    await getServiceCategories();

    // The length assertion first, deliberately: without it a
    // `getServiceCategories` that returned a written-down list and made
    // no request at all fails on `undefined` with a type complaint rather
    // than a statement about behaviour, and the reason it went red is
    // then something a reader has to reconstruct.
    expect(requested).toHaveLength(1);
    expect(requested[0]).toContain("/api/public/facilities/filters/service-categories");
  });
});

// ── the option set ───────────────────────────────────────────────────

describe("the option set comes from the API and nowhere else", () => {
  it("returns exactly what the endpoint said, in order", async () => {
    stubFetch(["IMAGING", "LAB"]);

    expect(await getServiceCategories()).toEqual(["IMAGING", "LAB"]);
  });

  it("returns an empty set when the endpoint is unreachable", async () => {
    // Read as "we have no options to offer", never as "there are none" —
    // which is why `/facilities` still forwards a category from the URL
    // in this state. See `service-category-filter.test.ts`.
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    expect(await getServiceCategories()).toEqual([]);
  });

  it("returns an empty set on an error status rather than a broken option list", async () => {
    stubFetch({ status: 500 }, 500);

    expect(await getServiceCategories()).toEqual([]);
  });

  it("drops anything on the wire that is not a renderable name", async () => {
    // Defensive in the same spirit as `toFacility`: a null in the array
    // would render an <option> with no value and no label, which reads as
    // a second "All services" and filters to nothing.
    stubFetch(["IMAGING", null, "", 7, "LAB"]);

    expect(await getServiceCategories()).toEqual(["IMAGING", "LAB"]);
  });

  it("returns an empty set when the body is not a list at all", async () => {
    stubFetch({ categories: ["IMAGING"] });

    expect(await getServiceCategories()).toEqual([]);
  });
});

// ── a refused filter is not an outage ────────────────────────────────

describe("a refused filter is an empty result, not an unreachable directory", () => {
  it("reads a 400 as an answer", async () => {
    // The server refuses a category outside its enum rather than
    // returning everything. That refusal is a fact about the request:
    // "we couldn't reach the directory" would be a claim about us made
    // at the moment we know we reached it, and it invites a retry that
    // cannot succeed.
    stubFetch({ status: 400, message: "Unknown service category." }, 400);

    const result = await getFacilities({ category: "NOT_A_CATEGORY" });

    expect(result.unavailable).toBe(false);
    expect(result.facilities).toEqual([]);
    expect(result.totalElements).toBe(0);
  });

  it("still reads a 429 as unreachable", async () => {
    // The narrowness is the point. Rendering a rate-limited visitor an
    // empty directory tells them Vedge has no facilities.
    stubFetch({ status: 429 }, 429);

    expect((await getFacilities({})).unavailable).toBe(true);
  });

  it("still reads a 404 as unreachable", async () => {
    stubFetch({ status: 404 }, 404);

    expect((await getFacilities({})).unavailable).toBe(true);
  });

  it("still reads a 5xx as unreachable", async () => {
    stubFetch({ status: 503 }, 503);

    expect((await getFacilities({})).unavailable).toBe(true);
  });

  it("still reads a transport failure as unreachable", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    expect((await getFacilities({})).unavailable).toBe(true);
  });
});
