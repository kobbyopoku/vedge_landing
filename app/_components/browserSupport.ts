/**
 * Runs before the page paints, written in ES5 so even a very old browser
 * can execute it.
 *
 * The site's JavaScript needs at least Chrome 93 (`?.`, `??`, `??=`,
 * `globalThis`, `Object.hasOwn`). A visitor on Windows 7 with a Chrome
 * that never updated (seen 2026-11-20) got every chunk failing with
 * "Unexpected token" and "globalThis is not defined". Two things went
 * wrong for them, and this script fixes both:
 *
 * 1. Forty-one `.reveal` sections start invisible and only appear when
 *    `RevealMount` adds `.is-visible`. With the bundle dead, they never
 *    did, so most of the home page was blank. Hiding is now armed only
 *    when this check says the bundle can run (`html.reveal-armed`), and
 *    disarmed after 4 s if `RevealMount` still has not started, so a
 *    failed or very slow bundle can never leave the page empty.
 * 2. The visitor got no hint why. `html.legacy-browser` now shows a
 *    plain notice saying what to install.
 *
 * The test has three parts, each an engine feature that needs no eval:
 * `globalThis` (Chrome 71), `Object.hasOwn` (Chrome 93 / Firefox 92 /
 * Safari 15.4) and regex lookbehind (Safari 16.4 / Firefox 78). Together
 * they pass only Chrome 93+, Firefox 92+ and Safari 16.4+. Lookbehind is
 * there for Safari 15.4–16.3 (older iPads): it has `Object.hasOwn` but not
 * class static blocks, which Next 16.2's own runtime uses, so without it
 * those devices would pass the test and still get a dead page. No eval-based
 * probe: a future Content-Security-Policy without 'unsafe-eval' would make
 * one fail on every modern browser and show the notice to everyone. Comments stay out of the script string: it ships.
 *
 * The notice is hidden with the HTML `hidden` attribute, not CSS, and this
 * script must run AFTER it in the document: if the stylesheet fails to load,
 * a CSS-hidden notice would show to every visitor.
 */
export const BROWSER_SUPPORT_SCRIPT = `(function () {
  var d = document.documentElement;
  var lookbehind = true;
  try { new RegExp("(?<=a)b"); } catch (e) { lookbehind = false; }
  var modern = typeof globalThis !== "undefined" &&
    typeof Object.hasOwn === "function" && lookbehind;
  if (!modern) {
    d.className += " legacy-browser";
    var n = document.getElementById("legacy-browser-notice");
    if (n) n.removeAttribute("hidden");
    return;
  }
  d.className += " reveal-armed";
  setTimeout(function () {
    if (!window.__vedgeRevealMounted) {
      d.className = d.className.replace(/(^|\\s)reveal-armed(?=\\s|$)/g, " ");
    }
  }, 4000);
})();`;
