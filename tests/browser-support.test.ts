import { describe, expect, it, vi } from "vitest";
import vm from "node:vm";
import { BROWSER_SUPPORT_SCRIPT } from "../app/_components/browserSupport";

function run(opts: { oldBrowser: boolean; revealMounted?: boolean; noLookbehind?: boolean }) {
  vi.useFakeTimers();
  const documentElement = { className: "font-sans" };
  const notice = { hidden: true, removeAttribute(name: string) { if (name === "hidden") this.hidden = false; } };
  const window: Record<string, unknown> = {};
  const context: Record<string, unknown> = {
    document: { documentElement, getElementById: (id: string) => (id === "legacy-browser-notice" ? notice : null) },
    window,
    setTimeout,
  };
  vm.createContext(context);
  if (opts.oldBrowser) {
    // A browser older than Chrome 93 has no Object.hasOwn.
    vm.runInContext("Object.hasOwn = undefined;", context);
  }
  if (opts.noLookbehind) {
    // Safari 15.4–16.3: has Object.hasOwn but rejects lookbehind regexes.
    vm.runInContext(
      'var R = RegExp; RegExp = function (p, f) { if (/\\(\\?<[=!]/.test(p)) throw new SyntaxError("lookbehind"); return new R(p, f); };',
      context,
    );
  }
  vm.runInContext(BROWSER_SUPPORT_SCRIPT, context);
  if (opts.revealMounted) window.__vedgeRevealMounted = true;
  vi.advanceTimersByTime(4000);
  vi.useRealTimers();
  return { cls: documentElement.className, noticeHidden: notice.hidden };
}

describe("browser support script", () => {
  it("arms the scroll reveal on a browser that can run the site", () => {
    const { cls, noticeHidden } = run({ oldBrowser: false, revealMounted: true });
    expect(cls).toContain("reveal-armed");
    expect(cls).not.toContain("legacy-browser");
    expect(noticeHidden).toBe(true);
  });

  it("never arms the reveal on an old browser, and shows the notice instead", () => {
    const { cls, noticeHidden } = run({ oldBrowser: true });
    expect(cls).toContain("legacy-browser");
    expect(cls).not.toContain("reveal-armed");
    expect(noticeHidden).toBe(false);
  });

  it("treats a browser without regex lookbehind (Safari 15.4–16.3) as old", () => {
    const { cls, noticeHidden } = run({ oldBrowser: false, noLookbehind: true });
    expect(cls).toContain("legacy-browser");
    expect(cls).not.toContain("reveal-armed");
    expect(noticeHidden).toBe(false);
  });

  it("disarms the reveal after 4 s if the bundle never started, so the page is never left blank", () => {
    const { cls, noticeHidden } = run({ oldBrowser: false, revealMounted: false });
    expect(cls).not.toContain("reveal-armed");
    expect(noticeHidden).toBe(true);
    expect(cls).toContain("font-sans");
  });

  it("is written so an old browser can parse it: no ES2015+ syntax, no eval", () => {
    expect(BROWSER_SUPPORT_SCRIPT).not.toMatch(/=>|\blet\b|\bconst\b|`|\?\.|\?\?|new Function|\beval\(/);
  });
});
