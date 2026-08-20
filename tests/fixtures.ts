import type { Facility, FacilityBranch, FacilityDetail, FacilityService } from "../app/_data/facilities";

/**
 * Fixture builders for the facility shapes.
 *
 * **Every optional field defaults to `null` / empty**, so a fixture
 * carries only what a test explicitly gives it. That direction matters:
 * these tests exist because facilities with missing fields became
 * listable, and a builder that helpfully pre-filled a description would
 * quietly make the interesting cases untestable.
 *
 * It also removes a specific trap. A test asserting that some string is
 * *absent* proves nothing if the fixture never had it — and the cheapest
 * way to write that mistake is to assert against a fixture whose fields
 * you did not actually check. Here the baseline is "nothing", so a test
 * that wants a value has to say so on the line above the assertion.
 */
export function aFacility(overrides: Partial<FacilityDetail> = {}): FacilityDetail {
  return {
    slug: "ridge-diagnostics",
    name: "Ridge Diagnostics",
    orgType: "DIAGNOSTIC_CENTER",
    description: null,
    address: null,
    city: null,
    countryCode: null,
    hours: null,
    phone: null,
    email: null,
    website: null,
    logoUrl: null,
    accentColorHex: null,
    acceptsRequests: false,
    services: [],
    branches: [],
    ...overrides,
  };
}

export function aService(overrides: Partial<FacilityService> = {}): FacilityService {
  return {
    id: "t-1",
    code: "RAD-001",
    description: "Magnetic resonance imaging, brain",
    modality: "MRI",
    bodyPart: "Brain",
    ...overrides,
  };
}

export function aBranch(overrides: Partial<FacilityBranch> = {}): FacilityBranch {
  return {
    name: "East Legon",
    addressLine: null,
    city: null,
    region: null,
    countryCode: null,
    phone: null,
    latitude: null,
    longitude: null,
    isMainBranch: false,
    ...overrides,
  };
}

export function aSummary(overrides: Partial<Facility> = {}): Facility {
  return {
    slug: "ridge-diagnostics",
    name: "Ridge Diagnostics",
    orgType: "DIAGNOSTIC_CENTER",
    city: null,
    countryCode: null,
    logoUrl: null,
    shortDescription: null,
    acceptsRequests: false,
    ...overrides,
  };
}

/** `n` distinct services, so a count assertion cannot pass on a shared id. */
export function services(n: number): FacilityService[] {
  return Array.from({ length: n }, (_, i) => aService({ id: `t-${i}`, code: `RAD-${i}` }));
}

/** `n` distinct branches. */
export function branches(n: number): FacilityBranch[] {
  return Array.from({ length: n }, (_, i) => aBranch({ name: `Branch ${i}` }));
}
