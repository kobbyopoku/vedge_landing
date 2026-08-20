import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aSummary } from "./fixtures";
import { hrefsIn, renderedText, walk } from "./tree";

/**
 * The directory: `getFacilities` at the fetch boundary, and what
 * `/facilities` does with what it gets back.
 *
 * `getFacilities` is exercised against a stubbed `fetch` rather than a
 * stubbed `getFacilities`, because the whole defect under test lives in
 * the gap between "the fetch threw" and "the page got an empty array" —
 * mocking the function would mock away the bug.
 */

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

// ── what the page does with it ───────────────────────────────────────

const getFacilities = vi.hoisted(() => vi.fn());
vi.mock("../app/_lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/_lib/api")>();
  return { ...actual, getFacilities };
});

async function renderDirectory(page: Record<string, string>, result: Record<string, unknown>) {
  const mod = await import("../app/facilities/page");
  getFacilities.mockResolvedValue(result);
  const tree = await mod.default({ searchParams: Promise.resolve(page) });
  const [names] = walk(tree);
  return { names, text: renderedText(tree) };
}

const AVAILABLE_EMPTY = {
  facilities: [],
  page: 0,
  size: 24,
  totalPages: 0,
  totalElements: 0,
  unavailable: false,
};
const UNREACHABLE = { ...AVAILABLE_EMPTY, unavailable: true };

describe("/facilities tells an outage apart from an empty result", () => {
  it("shows the empty state, not an error, when the directory is genuinely empty", async () => {
    const { names, text } = await renderDirectory({}, AVAILABLE_EMPTY);

    expect(names).toContain("EmptyState");
    expect(names).not.toContain("DirectoryUnavailable");
    expect(text).toContain("The directory is still filling up.");
  });

  it("shows the unreachable state, not the empty state, when the fetch failed", async () => {
    const { names, text } = await renderDirectory({}, UNREACHABLE);

    expect(names).toContain("DirectoryUnavailable");
    expect(names).not.toContain("EmptyState");
    expect(text).toContain("We couldn’t reach the directory just now.");
  });

  it("never tells a visitor their search matched nothing during an outage", async () => {
    // With filters applied — the case that used to produce the most
    // convincing lie, because it named the visitor's own search back
    // to them.
    const { text } = await renderDirectory({ type: "PHARMACY", location: "Kumasi" }, UNREACHABLE);

    expect(text).not.toContain("Nothing here matches that yet.");
    expect(text).not.toContain("Try a broader type");
  });

  it("suppresses the result count during an outage rather than reporting zero", async () => {
    const { text } = await renderDirectory({ type: "PHARMACY" }, UNREACHABLE);

    expect(text).not.toContain("0 facilities");
  });

  it("still reports a real zero when the directory really is empty", async () => {
    const { text } = await renderDirectory({ type: "PHARMACY" }, AVAILABLE_EMPTY);

    expect(text).toContain("0 facilities");
  });

  it("offers a retry that keeps the visitor's filters", async () => {
    const mod = await import("../app/facilities/page");
    getFacilities.mockResolvedValue(UNREACHABLE);
    const tree = await mod.default({
      searchParams: Promise.resolve({ type: "PHARMACY", location: "Kumasi" }),
    });

    // A retry that dropped the filters would silently discard what the
    // visitor searched for, and look like it had worked.
    expect(hrefsIn(tree)).toContain("/facilities?type=PHARMACY&location=Kumasi");
  });
});

describe("/facilities metadata during an outage", () => {
  it("does not offer an unreachable directory to the index", async () => {
    const mod = await import("../app/facilities/page");
    getFacilities.mockResolvedValue(UNREACHABLE);

    const meta = await mod.generateMetadata({ searchParams: Promise.resolve({ type: "PHARMACY" }) });

    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("indexes a type view that really does have results", async () => {
    const mod = await import("../app/facilities/page");
    getFacilities.mockResolvedValue({
      ...AVAILABLE_EMPTY,
      facilities: [aSummary()],
      totalElements: 1,
      totalPages: 1,
    });

    const meta = await mod.generateMetadata({ searchParams: Promise.resolve({ type: "PHARMACY" }) });

    expect(meta.robots).toBeUndefined();
  });
});

describe("the directory no longer states the removed listing rule", () => {
  it("does not tell visitors a facility must write a description first", async () => {
    const { text } = await renderDirectory({}, AVAILABLE_EMPTY);

    // Both strings were true until backend c8e53df and are now false.
    expect(text).not.toContain("once it has written its own description");
    expect(text).not.toContain("the moment it writes a description");
  });
});
