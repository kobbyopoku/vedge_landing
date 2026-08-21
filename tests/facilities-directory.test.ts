import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aSummary } from "./fixtures";
import { emptyProseBlocks, hrefsIn, renderedText, walk } from "./tree";

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
/**
 * Stubbed alongside `getFacilities` so `/facilities` does not make a real
 * network call from these tests. It is not what they are about — the
 * category filter has its own file — but leaving it unstubbed had it
 * reaching for a backend on every render here, failing, and logging a
 * connection error into an otherwise clean run.
 *
 * `[]` is the honest default for this suite: with no options the filter
 * does not render, which is the page these tests were written against.
 */
const getServiceCategories = vi.hoisted(() => vi.fn(async () => [] as string[]));
vi.mock("../app/_lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/_lib/api")>();
  return { ...actual, getFacilities, getServiceCategories };
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

/**
 * The populated grid — which had no test at all. `renderDirectory` was
 * only ever called with the empty and the unreachable fixtures, and the
 * one populated case called `generateMetadata` rather than the page, so
 * no test in this suite had ever rendered a `FacilityCard`.
 *
 * That is what made `landing-report.md`'s claim that the card's
 * supporting `<p>` was "pinned by tests" wrong: making the `<p>`
 * unconditional left the suite 55/55 green.
 */
describe("a directory card for a facility with no description", () => {
  const CARD_PROSE = "Same-day imaging in central Accra.";

  async function renderGrid(facility = aSummary()) {
    const mod = await import("../app/facilities/page");
    getFacilities.mockResolvedValue({
      ...AVAILABLE_EMPTY,
      facilities: [facility],
      totalElements: 1,
      totalPages: 1,
    });
    return mod.default({ searchParams: Promise.resolve({}) });
  }

  it("renders no empty prose block where the description would have gone", async () => {
    // The whole point of widening LISTED_PREDICATE is that
    // `shortDescription` is now routinely null, so this is the ordinary
    // card and not an edge case.
    const tree = await renderGrid(aSummary({ shortDescription: null }));

    expect(emptyProseBlocks(tree))
      // An unconditional <p> reads identically — same words, same
      // layout — and ships `<p></p>`, which is the thin-page signal this
      // change exists to remove, reintroduced by the markup rather than
      // by the copy.
      .toEqual([]);
  });

  it("still renders the description when the facility has written one", async () => {
    // What stops the assertion above from being satisfied by a card that
    // never renders a description at all.
    const tree = await renderGrid(aSummary({ shortDescription: CARD_PROSE }));

    expect(renderedText(tree)).toContain(CARD_PROSE);
    expect(emptyProseBlocks(tree)).toEqual([]);
  });

  it("still says who the facility is when it has no description", async () => {
    // The card must not degrade into a blank tile: the name and the
    // type/location line carry it, and those are unconditional on
    // purpose.
    const tree = await renderGrid(
      aSummary({ name: "Ridge Diagnostics", city: "Accra", countryCode: "GHA" }),
    );
    const text = renderedText(tree);

    expect(text).toContain("Ridge Diagnostics");
    expect(text).toContain("Accra");
    expect(text).not.toContain(CARD_PROSE);
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
