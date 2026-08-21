import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aSummary } from "./fixtures";
import { hrefsIn, renderedText, walk } from "./tree";

/**
 * The service-category filter: what `/facilities` renders, and what it
 * sends.
 *
 * <p>Two things are worth stating about how this file is written, because
 * both are the difference between a test and a decoration.</p>
 *
 * <p><b>The option set is stubbed at the boundary, never at the page.</b>
 * `getServiceCategories` is mocked because the option set is a fact about
 * the deployment and this file is about what the page does with it. But
 * every assertion reads the rendered tree or the URL that was actually
 * requested — never the source of `page.tsx`, and never the shape of a
 * call the page made to a function this file also wrote. The defect this
 * whole design exists to prevent (an option that returns nothing when
 * clicked) lives in the relationship between the option set and the
 * request, so both ends are read.</p>
 *
 * <p><b>The `getFacilities`/`fetch` split is not stylistic.</b> `vi.mock`
 * is hoisted and file-wide, so tests that need to drive the render stub
 * `getFacilities`, and the tests about what actually goes over the wire
 * live in `service-category-api.test.ts` next door with a stubbed `fetch`
 * and the real module — the same split
 * `facilities-directory.test.ts`/`facilities-api.test.ts` already
 * established, and for the same reason: mocking the function would mock
 * away the thing under test.</p>
 */

const getFacilities = vi.hoisted(() => vi.fn());
const getServiceCategories = vi.hoisted(() => vi.fn());
vi.mock("../app/_lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/_lib/api")>();
  return { ...actual, getFacilities, getServiceCategories };
});

const AVAILABLE_EMPTY = {
  facilities: [],
  page: 0,
  size: 24,
  totalPages: 0,
  totalElements: 0,
  unavailable: false,
};

/** One facility, so the page renders its populated branch. */
const ONE_RESULT = {
  ...AVAILABLE_EMPTY,
  facilities: [aSummary()],
  totalElements: 1,
  totalPages: 1,
};

beforeEach(() => {
  getFacilities.mockResolvedValue(ONE_RESULT);
  getServiceCategories.mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

async function render(searchParams: Record<string, string> = {}) {
  const mod = await import("../app/facilities/page");
  return mod.default({ searchParams: Promise.resolve(searchParams) });
}

/**
 * Every `<select>` in the tree, by `name`, with its option values — the
 * rendered control, not the props the page happened to compute.
 */
function selectsIn(node: unknown, found: Record<string, string[]> = {}): Record<string, string[]> {
  if (!node || typeof node !== "object") return found;
  if (Array.isArray(node)) {
    node.forEach((child) => selectsIn(child, found));
    return found;
  }
  const element = node as { type?: unknown; props?: Record<string, unknown> };

  if (element.type === "select" && typeof element.props?.name === "string") {
    found[element.props.name] = optionValues(element.props.children);
  }

  if (typeof element.type === "function") {
    const error = console.error;
    console.error = () => {};
    try {
      selectsIn((element.type as (p: unknown) => unknown)(element.props ?? {}), found);
      return found;
    } catch {
      /* not callable as a plain function — fall through to children */
    } finally {
      console.error = error;
    }
  }
  if (element.props && "children" in element.props) selectsIn(element.props.children, found);
  return found;
}

/**
 * Every `<select>` in the tree with its full props, keyed by `name`.
 *
 * <p>Separate from {@link selectsIn} because that one answers "what can
 * the visitor choose" and this one answers "how does the control behave",
 * and folding them together would make both harder to read at the
 * assertion.</p>
 */
function selectPropsIn(
  node: unknown,
  found: Record<string, Record<string, unknown>> = {},
): Record<string, Record<string, unknown>> {
  if (!node || typeof node !== "object") return found;
  if (Array.isArray(node)) {
    node.forEach((child) => selectPropsIn(child, found));
    return found;
  }
  const element = node as { type?: unknown; props?: Record<string, unknown> };

  if (element.type === "select" && typeof element.props?.name === "string") {
    found[element.props.name] = element.props;
  }

  if (typeof element.type === "function") {
    const error = console.error;
    console.error = () => {};
    try {
      selectPropsIn((element.type as (p: unknown) => unknown)(element.props ?? {}), found);
      return found;
    } catch {
      /* not callable as a plain function — fall through to children */
    } finally {
      console.error = error;
    }
  }
  if (element.props && "children" in element.props) selectPropsIn(element.props.children, found);
  return found;
}

/**
 * The inline auto-submit script, as the page actually renders it.
 *
 * <p>Read out of the tree rather than off disk on purpose: this is the
 * string that ships, interpolated constant and all, not the source that
 * produces it.</p>
 */
function inlineScript(node: unknown): string | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = inlineScript(child);
      if (found !== null) return found;
    }
    return null;
  }
  const element = node as { type?: unknown; props?: Record<string, unknown> };

  if (element.type === "script") {
    const html = (element.props?.dangerouslySetInnerHTML as { __html?: string } | undefined)?.__html;
    if (typeof html === "string") return html;
  }

  if (typeof element.type === "function") {
    const error = console.error;
    console.error = () => {};
    try {
      return inlineScript((element.type as (p: unknown) => unknown)(element.props ?? {}));
    } catch {
      /* not callable as a plain function — fall through to children */
    } finally {
      console.error = error;
    }
  }
  if (element.props && "children" in element.props) return inlineScript(element.props.children);
  return null;
}

function optionValues(node: unknown, found: string[] = []): string[] {
  if (!node || typeof node !== "object") return found;
  if (Array.isArray(node)) {
    node.forEach((child) => optionValues(child, found));
    return found;
  }
  const element = node as { type?: unknown; props?: Record<string, unknown> };
  if (element.type === "option") found.push(String(element.props?.value ?? ""));
  if (element.props && "children" in element.props) optionValues(element.props.children, found);
  return found;
}

/** The `category` the page asked the API for on its own render. */
function requestedCategory(): unknown {
  const call = getFacilities.mock.calls.at(-1);
  return call?.[0]?.category;
}

/**
 * The result-count line's own text — "3 facilities · Laboratory tests · …".
 *
 * <p><b>Scoped rather than asserted against the whole page, and the first
 * draft of these tests was wrong for exactly that reason.</b> "Laboratory
 * tests" is also the dropdown's own option label, so a whole-page
 * `not.toContain` was satisfied only while the dropdown happened not to
 * render — it went red the moment a test offered two categories and asked
 * for neither. A page-wide assertion about a string the page renders in
 * two places says nothing about either.</p>
 *
 * <p>Found by `aria-live="polite"`, which is the line's own identity — it
 * is the region a screen reader is told about when the result set
 * changes — rather than by position among the paragraphs.</p>
 */
function resultLineText(node: unknown): string | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = resultLineText(child);
      if (found !== null) return found;
    }
    return null;
  }
  const element = node as { type?: unknown; props?: Record<string, unknown> };

  if (element.props?.["aria-live"] === "polite") {
    return renderedText(element.props.children);
  }

  if (typeof element.type === "function") {
    const error = console.error;
    console.error = () => {};
    try {
      return resultLineText((element.type as (p: unknown) => unknown)(element.props ?? {}));
    } catch {
      /* not callable as a plain function — fall through to children */
    } finally {
      console.error = error;
    }
  }
  if (element.props && "children" in element.props) {
    return resultLineText(element.props.children);
  }
  return null;
}

// ── when the control renders at all ──────────────────────────────────

describe("the category filter renders only when there is a real choice", () => {
  it("renders nothing at all when only one category has been published", async () => {
    // **This is the state the directory is in today.** The publish screen
    // hardcoded IMAGING until 2026-08-20 and its Labs tab ships dark, so
    // imaging is the only category any tenant has ever been able to
    // publish. A dropdown reading "All services / Imaging and scans" has
    // two settings that return the same rows.
    getServiceCategories.mockResolvedValue(["IMAGING"]);

    const selects = selectsIn(await render());

    expect(selects.category).toBeUndefined();
    // The control asserted absent must not be absent because the whole
    // form is: Type is right beside it and is unconditional.
    expect(selects.type).toBeDefined();
  });

  it("renders nothing when no category has been published", async () => {
    getServiceCategories.mockResolvedValue([]);

    const selects = selectsIn(await render());

    expect(selects.category).toBeUndefined();
    expect(selects.type).toBeDefined();
  });

  it("renders the moment a second category is published, with no deploy", async () => {
    // The whole point of deriving the option set: nothing here changes
    // but what facilities have published.
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    const selects = selectsIn(await render());

    expect(selects.category).toEqual(["", "IMAGING", "LAB"]);
  });

  it("offers exactly the categories it was given, in the order it was given them", async () => {
    // Not a subset, not a superset, not re-sorted. A hardcoded list would
    // name categories that are not here; a filtered one would drop a
    // category the backend says is real, which hides facilities.
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB", "CONSULTATION"]);

    const selects = selectsIn(await render());

    expect(selects.category).toEqual(["", "IMAGING", "LAB", "CONSULTATION"]);
  });

  it("offers a category this site has no label for rather than dropping it", async () => {
    // A category added to the Java enum and published by a facility is a
    // filter that works. Rendering it as "Bed day" beats not offering it.
    getServiceCategories.mockResolvedValue(["IMAGING", "SOMETHING_NEW"]);

    const tree = await render();

    expect(selectsIn(tree).category).toEqual(["", "IMAGING", "SOMETHING_NEW"]);
    expect(renderedText(tree)).toContain("Something new");
  });

  it("renders no disabled control and no single-option select", async () => {
    // Belt and braces on the two shapes explicitly ruled out: below the
    // floor there is no <select name="category"> in the tree at all, so
    // there is nothing to be disabled and nothing to be single-option.
    getServiceCategories.mockResolvedValue(["IMAGING"]);

    const [names] = walk(await render());
    const selectCount = names.filter((n) => n === "select").length;

    expect(selectCount).toBe(1);
  });
});

// ── the behaviour the hint promises ──────────────────────────────────

/**
 * <b>Added after a surviving mutation.</b> Deleting `data-autosubmit`
 * from the category select left all 92 tests green — and the failure it
 * produces is silent: the control still works via the Search button, so
 * nothing breaks, while the hint two elements up promises in writing that
 * choosing a service "searches straight away". A benign fallback plus a
 * false promise is not benign; the same sentence already appears in
 * `page.tsx`'s own note about why the `focusout` cancel is narrow.
 *
 * <p>The attribute exists precisely so a select added to this form cannot
 * be left out of the delegated listener, which is what the previous
 * `id === 'facility-type'` check made easy. That argument is only worth
 * anything if something notices when the attribute is the thing left
 * out.</p>
 */
describe("both dropdowns behave the way the hint says they do", () => {
  it("marks the category select for auto-submit, exactly as the type select is", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    const props = selectPropsIn(await render());

    // Asserted against Type rather than against a literal, so the two
    // controls cannot drift apart whatever the opt-in mechanism becomes.
    expect(props.category?.["data-autosubmit"]).toBe(props.type?.["data-autosubmit"]);
    expect(props.category?.["data-autosubmit"]).toBeDefined();
  });

  /**
   * <b>A backstop, and it says so.</b> This is the one assertion in either
   * file that matches text rather than reading a returned value, and it is
   * here because the alternative is nothing: the listener is ES5 inside
   * `dangerouslySetInnerHTML`, this runner has no DOM by design
   * (`vitest.config.ts` — "nothing under test touches `window`"), and
   * adding jsdom to execute one string would cost more than it pins.
   *
   * <p><b>Two mutations survived without it</b>, and they are the reason
   * it exists rather than a hypothetical: dropping `data-autosubmit` from
   * the category select (caught by the sibling test above, which reads
   * props), and reverting the listener's matcher to
   * `n.id === 'facility-type'` — the minimal-diff resolution of a merge
   * conflict against `main`, which leaves the attribute in the markup,
   * every other test green, and the category dropdown silently not
   * auto-submitting under a hint that promises it does.
   *
   * <p><b>The trap this file is written against.</b> A "does not contain"
   * over a string that was never fetched passes for the wrong reason — the
   * failure diagnosed in the tabs work and again in this repo's own
   * sitemap tests. So every negative here is paired with a positive
   * anchor: the script is asserted present, non-trivial, and carrying the
   * two things it cannot work without. And the attribute name is taken
   * from the RENDERED select rather than written out a second time, so
   * this compares two live values instead of one value and one literal.
   */
  it("keys the auto-submit listener on the attribute the selects actually carry", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    const tree = await render();
    const script = inlineScript(tree);
    const props = selectPropsIn(tree);

    // Positive anchors first. A missing script must fail here, not slip
    // through the negatives below.
    expect(script).toBeTruthy();
    expect(script!.length).toBeGreaterThan(400);
    expect(script).toContain("requestSubmit");
    expect(script).toContain("focusout");

    // The cross-check: the attribute the listener looks for is the one the
    // controls were rendered with. Neither side is a literal in this file.
    const attribute = Object.keys(props.type ?? {}).find((k) => k.startsWith("data-"));
    expect(attribute).toBeDefined();
    expect(Object.keys(props.category ?? {})).toContain(attribute);
    expect(script).toContain(attribute!);

    // And it selects on nothing else. An id comparison is what the
    // listener had before there were two dropdowns, and going back to one
    // is a silent regression rather than a broken page.
    expect(script).not.toMatch(/\.id\s*===/);
  });

  it("describes both dropdowns from the hint the type select already points at", async () => {
    // One hint, two `aria-describedby` — so the sentence a screen reader
    // hears on focus is the same one, and there is only one place for it
    // to go stale.
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    const props = selectPropsIn(await render());

    expect(props.category?.["aria-describedby"]).toBe(props.type?.["aria-describedby"]);
  });

  it("only promises that a service searches straight away when a service dropdown exists", async () => {
    // WCAG 3.2.2 is closed by advising the user BEFORE the change of
    // context (technique G13), so the advice has to describe the controls
    // actually on screen. Below the option floor there is no service
    // dropdown, and the hint must not mention one.
    getServiceCategories.mockResolvedValue(["IMAGING"]);
    const withoutCategory = renderedText(await render());

    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);
    const withCategory = renderedText(await render());

    expect(withoutCategory).toContain("Choosing a type searches straight away");
    expect(withoutCategory).not.toContain("or a service");
    expect(withCategory).toContain("Choosing a type or a service searches straight away");
  });
});

// ── what the page sends ──────────────────────────────────────────────

describe("the category the page asks for", () => {
  it("forwards a category from the URL", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    await render({ category: "LAB" });

    expect(requestedCategory()).toBe("LAB");
  });

  it("forwards a category even when the option probe returned nothing", async () => {
    // **The failure this prevents is silent widening.** With the probe
    // down the dropdown cannot render — but dropping the filter would
    // send the request unfiltered and answer with every facility on the
    // platform, which the visitor reads as "these all offer lab tests".
    getServiceCategories.mockResolvedValue([]);

    await render({ category: "LAB" });

    expect(requestedCategory()).toBe("LAB");
    expect(selectsIn(await render({ category: "LAB" })).category).toBeUndefined();
  });

  it("forwards a category the option set does not currently offer", async () => {
    // Same reasoning one step further: the option set says what to
    // render, never what to send. The server decides what a category
    // means — it returns an empty page for a real category nobody
    // publishes and refuses anything else.
    getServiceCategories.mockResolvedValue(["IMAGING", "CONSULTATION"]);

    await render({ category: "LAB" });

    expect(requestedCategory()).toBe("LAB");
  });

  it("upper-cases a hand-typed category", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    await render({ category: "lab" });

    expect(requestedCategory()).toBe("LAB");
  });

  it("drops a value that is not shaped like an enum constant", async () => {
    // A shape check, not a value allowlist — which categories exist is
    // the backend's to know. This stops a path or a script fragment being
    // round-tripped to an unauthenticated endpoint, nothing more.
    await render({ category: "../../etc/passwd" });
    expect(requestedCategory()).toBeUndefined();

    await render({ category: "" });
    expect(requestedCategory()).toBeUndefined();

    await render({ category: "A".repeat(200) });
    expect(requestedCategory()).toBeUndefined();
  });

  it("sends no category when the visitor picked none", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    await render();

    expect(requestedCategory()).toBeUndefined();
  });
});

// ── what the page says ───────────────────────────────────────────────

describe("a narrowed page says it is narrowed", () => {
  it("names the category in the result line", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    expect(resultLineText(await render({ category: "LAB" }))).toContain("Laboratory tests");
  });

  it("names it even when the dropdown could not render", async () => {
    // The case that matters: the probe failed, so nothing on the page
    // shows the filter, and without this line a short list reads as the
    // whole directory.
    getServiceCategories.mockResolvedValue([]);

    const tree = await render({ category: "LAB" });

    expect(selectsIn(tree).category).toBeUndefined();
    expect(resultLineText(tree)).toContain("Laboratory tests");
  });

  it("says nothing about a category in the result line when none was asked for", async () => {
    // What stops the two assertions above passing on a page that names a
    // category unconditionally — and scoped to the result line, because
    // the dropdown renders the same words as an option label and a
    // page-wide assertion here would be measuring the dropdown.
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);

    const tree = await render();

    expect(selectsIn(tree).category).toContain("LAB");
    expect(resultLineText(tree)).not.toContain("Laboratory tests");
    expect(resultLineText(tree)).toContain("1 facility");
  });

  it("offers to clear the filters when only a category is set", async () => {
    // `hasNarrowing` drives both the "Clear filters" link and the empty
    // state's wording. A category that did not count as narrowing would
    // tell a visitor with an empty lab search that "the directory is
    // still filling up" — a claim about the directory, not their search.
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);
    getFacilities.mockResolvedValue(AVAILABLE_EMPTY);

    const text = renderedText(await render({ category: "LAB" }));

    expect(text).toContain("Nothing here matches that yet.");
    expect(text).not.toContain("The directory is still filling up.");
  });
});

// ── the links the page builds for itself ─────────────────────────────

/**
 * <b>Added after a surviving mutation.</b> Deleting the `category` line
 * from `directoryHref` left all 96 tests green, and what it breaks is
 * every link the page builds back to itself: page 2 of a lab search
 * returns page 2 of the unfiltered directory, and "Try again" after an
 * outage retries without the filter. Both look like they worked.
 *
 * <p>`facilities-directory.test.ts` already pins this shape for the
 * outage retry with `type` and `location` — the filter that goes missing
 * is always the newest one, because it is the one nobody's assertion
 * mentions yet.</p>
 */
describe("the page's own links keep the category", () => {
  it("keeps it on the pagination links", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);
    getFacilities.mockResolvedValue({
      ...ONE_RESULT,
      totalElements: 60,
      totalPages: 3,
      page: 1,
    });

    const hrefs = hrefsIn(await render({ category: "LAB", page: "1" }));

    // Both directions, because a pager builds them separately.
    expect(hrefs).toContain("/facilities?category=LAB");
    expect(hrefs).toContain("/facilities?category=LAB&page=2");
  });

  it("keeps it on the retry offered after an outage", async () => {
    getServiceCategories.mockResolvedValue(["IMAGING", "LAB"]);
    getFacilities.mockResolvedValue({ ...AVAILABLE_EMPTY, unavailable: true });

    const hrefs = hrefsIn(await render({ category: "LAB", location: "Kumasi" }));

    // A retry that quietly discards what they searched for is worse than
    // no retry: it returns a different, larger result and looks correct.
    expect(hrefs).toContain("/facilities?location=Kumasi&category=LAB");
  });
});

// ── indexing ─────────────────────────────────────────────────────────

describe("a category view is not offered to the index", () => {
  async function meta(searchParams: Record<string, string>) {
    const mod = await import("../app/facilities/page");
    return mod.generateMetadata({ searchParams: Promise.resolve(searchParams) });
  }

  it("noindexes a category view", async () => {
    // ?type=LABORATORY already serves this intent and is indexed; two
    // pages competing for it is cannibalisation.
    expect((await meta({ category: "LAB" })).robots).toEqual({ index: false, follow: true });
  });

  it("still indexes a plain type view, which is what the rule must not break", async () => {
    expect((await meta({ type: "PHARMACY" })).robots).toBeUndefined();
  });

  it("consolidates a category view onto the type/country page that should rank", async () => {
    const canonical = (await meta({ type: "LABORATORY", category: "LAB" })).alternates?.canonical;

    expect(String(canonical)).toContain("/facilities?type=LABORATORY");
    expect(String(canonical)).not.toContain("category");
  });
});
