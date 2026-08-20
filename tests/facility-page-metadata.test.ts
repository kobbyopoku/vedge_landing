import { beforeEach, describe, expect, it, vi } from "vitest";
import { aFacility, aService, branches, services } from "./fixtures";
import { renderedText, walk } from "./tree";

/**
 * `generateMetadata` for `/facilities/[slug]`, exercised as the real
 * exported function rather than a re-implementation of its rules.
 *
 * The only thing stubbed is the network boundary. That matters: a test
 * that copied the composition logic would agree with itself forever,
 * and every assertion below is about a string a searcher actually sees.
 */
const getFacility = vi.hoisted(() => vi.fn());
vi.mock("../app/_lib/api", () => ({
  getFacility,
  // `generateStaticParams` imports this from the same module.
  getAllFacilities: vi.fn(async () => []),
}));

const { generateMetadata } = await import("../app/facilities/[slug]/page");

const params = Promise.resolve({ slug: "ridge-diagnostics" });

beforeEach(() => {
  getFacility.mockReset();
});

/** The `description` field, narrowed — it is a string on every path here. */
async function metadataFor(facility: ReturnType<typeof aFacility>) {
  getFacility.mockResolvedValue(facility);
  return generateMetadata({ params });
}

describe("meta description for a facility with no description", () => {
  it("is neither empty nor a placeholder for the barest possible facility", async () => {
    const meta = await metadataFor(aFacility({ orgType: "HOSPITAL" }));
    const description = meta.description as string;

    expect(description.length).toBeGreaterThan(0);
    expect(description).not.toMatch(/undefined|null|NaN|\[object/);
    // A facility page whose meta description is just the site name would
    // technically pass the checks above.
    expect(description).toContain("Ridge Diagnostics");
    expect(description).toContain("Hospital");
  });

  it("does not claim hours, services or contact details it does not have", async () => {
    // The fixture is built with all three absent — asserted here rather
    // than assumed, because a `not.toContain` against a fixture that
    // never held the value proves nothing.
    const bare = aFacility();
    expect(bare.hours).toBeNull();
    expect(bare.phone).toBeNull();
    expect(bare.services).toHaveLength(0);

    const description = (await metadataFor(bare)).description as string;

    // The exact wording of the fallback this replaced.
    expect(description).not.toContain("Hours, services, and contact details");
    expect(description.toLowerCase()).not.toContain("service");
    expect(description.toLowerCase()).not.toContain("opening hours");
  });

  it("names services and locations when the facility does have them", async () => {
    const description = (await metadataFor(
      aFacility({ services: services(42), branches: branches(3), city: "Accra", countryCode: "GHA" }),
    )).description as string;

    expect(description).toContain("42 published services");
    expect(description).toContain("3 locations");
    expect(description).toContain("Accra, Ghana");
  });

  it("prefers the facility's own words whenever there are any", async () => {
    const description = (await metadataFor(
      aFacility({ description: "We run the only 3T MRI in the Volta Region.", services: services(9) }),
    )).description as string;

    expect(description).toBe("We run the only 3T MRI in the Volta Region.");
    // Their sentence is not padded out with our derived facts.
    expect(description).not.toContain("9 published services");
  });

  it("gives openGraph the same non-empty description, never a blank one", async () => {
    const meta = await metadataFor(aFacility());
    const og = meta.openGraph as { description?: string; title?: string };

    expect(og.description).toBe(meta.description);
    expect(og.description).toBeTruthy();
  });
});

describe("indexing", () => {
  it("does not noindex a facility whose services are its content", async () => {
    // The exact case the owner overrode the listing floor for. If this
    // page were noindexed, the reversal would be undone here.
    const facility = aFacility({ services: services(40) });
    expect(facility.description).toBeNull();

    expect((await metadataFor(facility)).robots).toBeUndefined();
  });

  it("does not noindex a facility whose branches are its content", async () => {
    const facility = aFacility({ branches: branches(5) });
    expect(facility.description).toBeNull();

    expect((await metadataFor(facility)).robots).toBeUndefined();
  });

  it("emits noindex, follow for a page carrying nothing but a name and a phone", async () => {
    const meta = await metadataFor(aFacility({ phone: "+233 30 000 0000" }));

    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("still gives a noindexed page a real description and a canonical", async () => {
    // noindex is not "give up on the page" — a visitor with the link,
    // and any social unfurl, still gets the full treatment.
    const meta = await metadataFor(aFacility({ phone: "+233 30 000 0000" }));

    expect(meta.description).toBeTruthy();
    expect(meta.alternates?.canonical).toBe(
      "https://tryvedge.com/facilities/ridge-diagnostics",
    );
  });
});

describe("a facility the API does not know", () => {
  it("returns a title and never invents a description", async () => {
    getFacility.mockResolvedValue(null);
    const meta = await generateMetadata({ params });

    expect(meta.title).toBe("Facility not found");
    expect(meta.description).toBeUndefined();
  });
});

describe("truncation", () => {
  it("cuts a long description at a word and marks it, rather than mid-word", async () => {
    const long = `${"Magnetic resonance imaging ".repeat(20)}end`;
    const description = (await metadataFor(aFacility({ description: long }))).description as string;

    expect(description.length).toBeLessThanOrEqual(156);
    expect(description.endsWith("…")).toBe(true);
    expect(description).not.toContain("  ");
    // Cut on a boundary: the last word before the ellipsis is whole.
    expect(description.slice(0, -1)).toMatch(/(imaging|resonance|Magnetic)$/);
  });

  it("leaves a short description exactly as the facility wrote it", async () => {
    const description = (await metadataFor(aFacility({ description: "Small clinic in Ho." })))
      .description as string;

    expect(description).toBe("Small clinic in Ho.");
    expect(description).not.toContain("…");
  });
});

describe("the fact line the page and the metadata share", () => {
  it("keeps one service singular in the meta description too", async () => {
    const description = (await metadataFor(aFacility({ services: [aService()] })))
      .description as string;

    expect(description).toContain("1 published service");
    expect(description).not.toContain("1 published services");
  });
});

// ── the rendered page ────────────────────────────────────────────────

/**
 * What a description-less facility page actually puts on screen.
 *
 * `notFound()` from `next/navigation` throws when called, which is
 * exactly the behaviour these tests want on the null path and never
 * reach on the others.
 */
async function renderFacility(facility: ReturnType<typeof aFacility>) {
  getFacility.mockResolvedValue(facility);
  const mod = await import("../app/facilities/[slug]/page");
  const tree = await mod.default({ params });
  const [names] = walk(tree);
  return { names, text: renderedText(tree) };
}

describe("a facility page with no description", () => {
  it("renders without crashing and puts a real sentence where prose would go", async () => {
    const { text } = await renderFacility(
      aFacility({ orgType: "DIAGNOSTIC_CENTER", city: "Accra", countryCode: "GHA" }),
    );

    expect(text).toContain("At a glance");
    expect(text).toContain("Diagnostic centre in Accra, Ghana.");
  });

  it("does not apologise on the facility's behalf", async () => {
    // The exact sentence this replaced. A page whose first body line is
    // a negative statement about the tenant reads as broken, and a
    // paragraph whose content is the absence of content is the thin-page
    // signal spelled out.
    const { text } = await renderFacility(aFacility());

    expect(text).not.toContain("has not written a description yet");
  });

  it("does not head the block 'About' when there is nothing about them", async () => {
    const { text } = await renderFacility(aFacility());

    expect(text).not.toContain("About");
  });

  it("emits no empty paragraph where the description would be", async () => {
    const { text } = await renderFacility(aFacility());

    // Every rendered string carries something. An empty <p> would show
    // up here as "" — and would render as a blank gap under a heading.
    expect(text).not.toMatch(/undefined|null/);
    expect(text.trim().length).toBeGreaterThan(0);
  });

  it("signposts the services and locations further down the page", async () => {
    const { text } = await renderFacility(
      aFacility({ services: services(42), branches: branches(3) }),
    );

    expect(text).toContain("42 published services · 3 locations");
  });

  it("still leads with the facility's own words when it has them", async () => {
    const { text } = await renderFacility(
      aFacility({ description: "We run the only 3T MRI in the Volta Region." }),
    );

    expect(text).toContain("About");
    expect(text).toContain("We run the only 3T MRI in the Volta Region.");
    expect(text).not.toContain("At a glance");
  });

  it("still renders the request call to action, which is why they are listed", async () => {
    // The facility this reversal exists for: onboarded, taking external
    // requests, no paragraph written.
    const { text } = await renderFacility(
      aFacility({ acceptsRequests: true, services: services(12) }),
    );

    expect(text).toContain("Send a request");
  });
});
