# Nile Flow House

Website for Nile Flow House, a recording studio in Zurich. React + Vite + Tailwind, first exported from Readdy (23 Oct 2026).

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer (the LTS installer is fine).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Other commands

- `npm run build`: production build into `out/`
- `npm run preview`: serve the production build
- `npm run type-check`: TypeScript check

## Where things are

- `src/pages/home/components/`: the homepage sections (Hero, Sessions, Reviews, FinalCta, ...)
- `src/mocks/`: the site's text and data (sessions, team, reviews, FAQ, work)
- `src/design/assets.ts`: image URLs
- `src/components/booking/`: the `/book` panel (5 steps); `src/components/quote/`: the `/quote` panel
- `src/pages/admin/`: the hidden `/admin` dashboard (mock data for now)

Images are still hosted on Readdy's storage, and the quote form still posts to Readdy's form endpoint. Both move when the backend is set up.
