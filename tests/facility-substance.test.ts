import { describe, expect, it } from "vitest";
import {
  facilityFactPhrases,
  facilityHasIndexableSubstance,
  facilityJsonLd,
  joinPhrases,
} from "../app/_data/facilities";
import { aBranch, aFacility, aService, branches, services } from "./fixtures";

const SITE = "https://tryvedge.com";

describe("facilityFactPhrases", () => {
  it("names only the sections the facility actually has", () => {
    const bare = aFacility();
    expect(facilityFactPhrases(bare)).toEqual([]);
  });

  it("counts services and locations, and singularises both", () => {
    expect(facilityFactPhrases(aFacility({ services: services(1), branches: branches(1) }))).toEqual(
      ["1 published service", "1 location"],
    );
    expect(
      facilityFactPhrases(aFacility({ services: services(42), branches: branches(3) })),
    ).toEqual(["42 published services", "3 locations"]);
  });

  it("treats any one contact channel as contact details, and hours separately", () => {
    expect(facilityFactPhrases(aFacility({ hours: "Mon-Fri 8-5" }))).toEqual(["opening hours"]);
    expect(facilityFactPhrases(aFacility({ email: "hi@ridge.gh" }))).toEqual(["contact details"]);
    expect(facilityFactPhrases(aFacility({ website: "https://ridge.gh" }))).toEqual([
      "contact details",
    ]);
    // One phrase, not three, when all three channels are present.
    expect(
      facilityFactPhrases(
        aFacility({ phone: "+233...", email: "hi@ridge.gh", website: "https://ridge.gh" }),
      ),
    ).toEqual(["contact details"]);
  });
});

describe("joinPhrases", () => {
  it("builds a sentence-cased clause for one, two, and three or more phrases", () => {
    expect(joinPhrases(["opening hours"])).toBe("Opening hours");
    expect(joinPhrases(["3 locations", "contact details"])).toBe("3 locations and contact details");
    expect(joinPhrases(["42 published services", "3 locations", "contact details"])).toBe(
      "42 published services, 3 locations, and contact details",
    );
  });

  it("returns an empty string for no phrases rather than stray punctuation", () => {
    expect(joinPhrases([])).toBe("");
  });
});

describe("facilityHasIndexableSubstance", () => {
  // The four clauses, each proven to carry the decision on its own. If
  // any one stopped counting, exactly one of these goes red and names
  // which.
  it("counts a description as substance", () => {
    expect(facilityHasIndexableSubstance(aFacility({ description: "We run a CT scanner." }))).toBe(
      true,
    );
  });

  it("counts published services as substance, with no description at all", () => {
    const facility = aFacility({ services: services(40) });
    expect(facility.description).toBeNull();
    expect(facilityHasIndexableSubstance(facility)).toBe(true);
  });

  it("counts branches as substance, with no description at all", () => {
    const facility = aFacility({ branches: branches(2) });
    expect(facility.description).toBeNull();
    expect(facilityHasIndexableSubstance(facility)).toBe(true);
  });

  it("counts a street address as substance", () => {
    expect(facilityHasIndexableSubstance(aFacility({ address: "12 Boundary Road" }))).toBe(true);
  });

  // The line the original spec §1 drew and this change keeps.
  it("does not count a name and a phone number as a page", () => {
    expect(facilityHasIndexableSubstance(aFacility({ phone: "+233 30 000 0000" }))).toBe(false);
  });

  it("does not count contact channels or hours alone as substance", () => {
    expect(
      facilityHasIndexableSubstance(
        aFacility({ hours: "Mon-Fri 8-5", email: "hi@ridge.gh", website: "https://ridge.gh" }),
      ),
    ).toBe(false);
  });

  it("gives a facility with nothing but a name and a type no substance", () => {
    expect(facilityHasIndexableSubstance(aFacility())).toBe(false);
  });
});

describe("facilityJsonLd", () => {
  it("omits description entirely rather than emitting an empty one", () => {
    const jsonLd = facilityJsonLd(aFacility(), SITE);
    // `not.toHaveProperty`, not `toBe("")` — the failure being guarded
    // against is a present-but-empty key, which asserts that the answer
    // is the empty string.
    expect(jsonLd).not.toHaveProperty("description");
    // The payload is still a complete, valid organisation without it.
    expect(jsonLd["@type"]).toBe("MedicalOrganization");
    expect(jsonLd.name).toBe("Ridge Diagnostics");
    expect(jsonLd.url).toBe(`${SITE}/facilities/ridge-diagnostics`);
  });

  it("carries the description when there is one", () => {
    const jsonLd = facilityJsonLd(aFacility({ description: "We run a CT scanner." }), SITE);
    expect(jsonLd.description).toBe("We run a CT scanner.");
  });

  it("publishes branches as structured locations, which is all a description-less page has", () => {
    const jsonLd = facilityJsonLd(
      aFacility({
        branches: [
          aBranch({
            name: "East Legon",
            addressLine: "12 Boundary Road",
            city: "Accra",
            region: "Greater Accra",
            countryCode: "GHA",
            phone: "+233 30 000 0000",
          }),
        ],
      }),
      SITE,
    );

    expect(jsonLd.location).toEqual([
      {
        "@type": "Place",
        name: "East Legon",
        telephone: "+233 30 000 0000",
        address: {
          "@type": "PostalAddress",
          streetAddress: "12 Boundary Road",
          addressLocality: "Accra",
          addressRegion: "Greater Accra",
          addressCountry: "GHA",
        },
      },
    ]);
  });

  it("omits location entirely when there are no branches", () => {
    expect(facilityJsonLd(aFacility(), SITE)).not.toHaveProperty("location");
  });

  it("emits geo only for coordinates a directions link would also accept", () => {
    const good = facilityJsonLd(
      aFacility({ branches: [aBranch({ latitude: 5.6, longitude: -0.18 })] }),
      SITE,
    );
    expect((good.location as Record<string, unknown>[])[0].geo).toEqual({
      "@type": "GeoCoordinates",
      latitude: 5.6,
      longitude: -0.18,
    });

    // Out of range. The page refuses to build a directions link from
    // this; the structured data must not publish it either, or the two
    // disagree about whether the same pair is usable.
    const bad = facilityJsonLd(
      aFacility({ branches: [aBranch({ latitude: 991, longitude: -0.18 })] }),
      SITE,
    );
    expect((bad.location as Record<string, unknown>[])[0]).not.toHaveProperty("geo");
  });

  it("keeps a branch with no address at all, as a named place", () => {
    const jsonLd = facilityJsonLd(aFacility({ branches: [aBranch({ name: "Osu" })] }), SITE);
    const place = (jsonLd.location as Record<string, unknown>[])[0];
    expect(place.name).toBe("Osu");
    expect(place).not.toHaveProperty("address");
  });

  it("never serialises a null or undefined into the payload", () => {
    // A facility with a few fields set and most absent — the shape this
    // whole change makes common. Serialising is what a crawler sees.
    const json = JSON.stringify(
      facilityJsonLd(
        aFacility({ city: "Accra", countryCode: "GHA", services: [aService()], branches: branches(2) }),
        SITE,
      ),
    );
    expect(json).not.toContain("null");
    expect(json).not.toContain("undefined");
  });
});
