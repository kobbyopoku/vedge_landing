import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B09",
        bone: "#F3ECDF",
        "bone-deep": "#E8DFCC",
        forest: "#1B3B2F",
        "forest-deep": "#0E2319",
        clay: "#C8553D",
        "clay-deep": "#9B3E2C",
        sun: "#E8B04A",
        sage: "#9BAB8B",
        dust: "#847567",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        kicker: "0.22em",
      },
      fontSize: {
        mega: ["clamp(3rem, 10vw, 9rem)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
        hero: ["clamp(2.25rem, 6vw, 5rem)", { lineHeight: "0.96", letterSpacing: "-0.03em" }],
        display: ["clamp(1.75rem, 4vw, 3.25rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        shell: "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
