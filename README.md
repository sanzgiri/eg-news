# Wider

**News for understanding more, not scrolling more.**

Wider is a finite, broad-news edition designed to help a reader understand more without an endless feed. It separates **topic** from **geography**, prioritizes Portland/Oregon and India, filters stale reporting, and learns from explicit Yes/No/Unsure feedback rather than passive engagement.

## What it does

- Aggregates UniverRSS, CosmoRSS, Hacker News, and AllSides/Open RSS sources.
- Uses Jev's typed decisions to classify topic, region, content type, and time sensitivity.
- Keeps editions finite: at most 10 stories per topic, tapering to 7, 5, then 3 as feedback accumulates.
- Excludes stale time-sensitive stories and reports source gaps.
- Provides saved stories, notes, exploration, source health, and a visible **My interests** learning view.
- Keeps feedback, saved stories, and notes in browser-local storage.
- Has no load-more control or infinite scroll.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For Jev classification, create `.env.local` (never commit it):

```bash
TYPESAFE_API_KEY=your_key
TYPESAFE_BASE_URL=https://api.typesafe.ai
TYPESAFE_DEFAULT_MODEL=jev-latest
```

Without a Jev key, Wider uses its deterministic fallback classifier.

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set `TYPESAFE_API_KEY`, `TYPESAFE_BASE_URL`, and `TYPESAFE_DEFAULT_MODEL` in the Vercel project environment before deploying production. The key is read only by the server-side `/api/news` route and is never sent to browser JavaScript.

The intended production URL is:

**https://wider.vercel.app**

## Related projects and source systems

Wider builds on other projects in this workspace:

- [UniverRSS](https://github.com/sanzgiri/universs) — broad RSS aggregation and feed normalization.
- [CosmoRSS](https://github.com/sanzgiri/cosmorss) — small-web feed discovery and Hacker News enrichment.
- [Jev contextual inventory ranker](https://github.com/sanzgiri/jev-contextual-inventory-ranker) — Jev evaluation and typed-decision integration patterns.
- [Hacker News](https://news.ycombinator.com/) — technical-news signal and discussion context.
- [AllSides](https://www.allsides.com/) / Open RSS sources — additional perspective and general-news inputs.

Wider is a separate app; it does not claim that a source's presence means its reporting is correct. Source coverage and classification remain visible so the reader can inspect gaps.

## Verification

```bash
npm test
npm run build
```
