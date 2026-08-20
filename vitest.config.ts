import { defineConfig } from "vitest/config";

/**
 * This repo's first test runner.
 *
 * `vedge_landing` shipped the facilities directory, its filters, its
 * server-side dedupe and two rounds of payload work with no automated
 * tests at all — every one of those changes was verified by review and
 * by throwaway Node scripts. That was a stated limitation each time,
 * and it stopped being affordable with this change: listing facilities
 * that have written no description turns several "this field is
 * probably never null" assumptions into live code paths, and the
 * things most worth pinning (a meta description that must never be
 * empty or invented, a `robots` tag that must actually be emitted, a
 * fetch failure that must stay distinguishable from an empty result)
 * are all invisible to a human reading a diff.
 *
 * **Deliberately minimal.** `vitest` and nothing else — no jsdom, no
 * Testing Library, no component-testing stack. Everything asserted here
 * is a pure function, a `generateMetadata` return value, or a React
 * element tree walked structurally, none of which needs a DOM. A
 * smaller footprint is easier to justify and easier for the next person
 * to keep.
 *
 * Tests live in `tests/` rather than beside the modules so nothing this
 * file governs sits inside `app/`, where Next's compiler walks. That is
 * belt-and-braces — a `.test.ts` is not a route and would not be
 * bundled anyway — but it makes "no test code reaches a client bundle"
 * true by construction rather than by argument.
 */
export default defineConfig({
  test: {
    // Node, not jsdom: nothing under test touches `window`.
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // `.next` holds compiled copies of the very modules under test.
    exclude: ["node_modules/**", ".next/**"],
  },
});
