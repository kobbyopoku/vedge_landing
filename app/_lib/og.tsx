import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Open Graph card renderer shared by every `opengraph-image.tsx` in the
 * tree. One composition, three inputs (kicker, headline, footer line), so
 * a WhatsApp or LinkedIn preview of any Vedge page looks like the same
 * company. The headline supports the house italic by wrapping a run in
 * `*asterisks*`, which is the only markup it understands.
 *
 * Fonts are read from disk, not fetched: `next/font/google` cannot serve
 * `ImageResponse`, and a network call at render time is a dependency a
 * social crawler should not have to wait on. The three files under
 * `assets/fonts` are OFL-licensed subsets (Latin only) — see the LICENSE
 * files beside them. `process.cwd()` + a literal path is the form Next's
 * file tracer recognises, so the fonts ship with the serverless bundle.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0B0B09";
const BONE = "#F3ECDF";
const FOREST = "#1B3B2F";
const FOREST_DEEP = "#0E2319";
const CLAY = "#C8553D";
const SUN = "#E8B04A";

type OgInput = {
  /** Mono, uppercase, clay — "For laboratories", "Pricing", a facility type. */
  kicker: string;
  /** Fraunces. Wrap a run in *asterisks* for the italic. Two lines fit at 72px. */
  headline: string;
  /** One sentence under the headline. Omit for a bare card. */
  footer?: string;
};

let fontCache: Promise<FontFace[]> | null = null;

type FontFace = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal" | "italic";
};

function loadFonts(): Promise<FontFace[]> {
  if (fontCache) return fontCache;
  const dir = join(process.cwd(), "assets", "fonts");
  const face = async (file: string, name: string, weight: 400 | 600, style: "normal" | "italic"): Promise<FontFace> => {
    const buf = await readFile(join(dir, file));
    return { name, data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), weight, style };
  };
  fontCache = Promise.all([
    face("fraunces-latin-600-normal.woff", "Fraunces", 600, "normal"),
    face("fraunces-latin-400-italic.woff", "Fraunces", 400, "italic"),
    face("geist-mono-latin-400-normal.woff", "Geist Mono", 400, "normal"),
  ]);
  return fontCache;
}

/** Split "Built for *the way* Africa works" into runs, italic flagged. */
function runs(headline: string): { text: string; italic: boolean }[] {
  return headline
    .split("*")
    .map((text, i) => ({ text, italic: i % 2 === 1 }))
    .filter((r) => r.text.length > 0);
}

export async function renderOgImage({ kicker, headline, footer }: OgInput) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px 0",
          background: BONE,
          color: INK,
          fontFamily: "Fraunces",
        }}
      >
        {/* masthead: wordmark + clay square, mirroring the site header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>vedge</span>
            <span style={{ width: 12, height: 12, background: CLAY, marginTop: 4 }} />
          </div>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: `${INK}99`,
            }}
          >
            tryvedge.com
          </span>
        </div>

        {/* body: kicker, headline, footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 36, height: 1, background: FOREST }} />
            <span
              style={{
                fontFamily: "Geist Mono",
                fontSize: 20,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: CLAY,
              }}
            >
              {kicker}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 72,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
            }}
          >
            {runs(headline).map((r, i) => (
              <span
                key={i}
                style={{
                  fontWeight: r.italic ? 400 : 600,
                  fontStyle: r.italic ? "italic" : "normal",
                  color: r.italic ? FOREST : INK,
                  whiteSpace: "pre-wrap",
                }}
              >
                {r.text}
              </span>
            ))}
          </div>
          {footer ? (
            <div
              style={{
                fontFamily: "Geist Mono",
                fontSize: 22,
                lineHeight: 1.4,
                color: `${INK}B3`,
                maxWidth: 900,
              }}
            >
              {footer}
            </div>
          ) : null}
        </div>

        {/* foot: the kente rhythm from the site divider, flattened to a strip */}
        <div style={{ display: "flex", height: 14, width: "100%" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ display: "flex", flex: 1 }}>
              <div style={{ flex: 2, background: FOREST_DEEP }} />
              <div style={{ flex: 1, background: CLAY }} />
              <div style={{ flex: 1, background: SUN }} />
              <div style={{ flex: 2, background: FOREST }} />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
