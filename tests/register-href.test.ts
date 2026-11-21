import { describe, expect, it } from "vitest";

/**
 * UX-037: the landing site's sign-up links carry the facility type (and,
 * from pricing, the plan) so /register can preselect them instead of
 * defaulting everyone to Hospital.
 */

import { registerHref, verticalOrgType } from "../app/_data/plans";

describe("registerHref", () => {
  it("carries type and plan", () => {
    expect(registerHref("https://app.example", "PHARMACY", "PHARMACY_STARTER")).toBe(
      "https://app.example/register?type=PHARMACY&plan=PHARMACY_STARTER",
    );
  });

  it("carries type alone from a solution page", () => {
    expect(registerHref("https://app.example", "DIAGNOSTIC_CENTER")).toBe(
      "https://app.example/register?type=DIAGNOSTIC_CENTER",
    );
  });

  it("is plain /register with nothing to carry", () => {
    expect(registerHref("https://app.example")).toBe("https://app.example/register");
  });
});

describe("verticalOrgType", () => {
  it("maps every facility pricing segment to a registrable type, and patients to none", () => {
    expect(verticalOrgType).toEqual({
      hospital: "HOSPITAL",
      laboratory: "LABORATORY",
      pharmacy: "PHARMACY",
      diagnostic_center: "DIAGNOSTIC_CENTER",
      patient: null,
    });
  });
});
