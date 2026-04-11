# Vedge — Landing Site

The marketing site for **Vedge**, a healthcare operating system built for West Africa. Multi-page site covering product, pricing, and company.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v3
- `next/font` (Fraunces + Geist + Geist Mono, self-hosted at build time)
- Zero runtime JS libraries — CSS-only animations, native scroll behaviors

## Design direction

Afro-modernist editorial. Warm bone background, deep forest primary, burnt clay and sun accents. Fraunces serif display paired with Geist sans body. Generous negative space, magazine kickers, big stat numbers, Adinkra-inspired geometric dividers. Deliberately distinct from generic SaaS aesthetics.

Tokens are defined in [tailwind.config.ts](./tailwind.config.ts) and consumed as utility classes everywhere.

## Pages

- `/` — Home
- `/hospitals` — Hospital product page
- `/laboratories` — Laboratory product page
- `/pricing` — All 11 plans, segmented by facility type
- `/about` — Mission, story, Ghana focus
- `/contact` — Demo request

## Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deployment

Deploys cleanly to Vercel (detected automatically). No environment variables required — the site is fully static. Connect the repo and ship.

## Notes

- All pricing shown in Ghanaian Cedis (₵). Plan data is defined in [`app/_data/plans.ts`](./app/_data/plans.ts) and mirrors the Vedge backend catalog.
- The contact form currently logs to console; wire up to a form service (Formspree, Resend, etc.) before going live.
