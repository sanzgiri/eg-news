# Epistemic News MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build a local/private single-user news reader that aggregates the approved feeds, publishes a finite broad edition, learns explicit subject interest, and displays honest prediction metrics.

**Architecture:** A Next.js App Router application will expose one server-side news route that fetches and normalizes UniverRSS, CosmoRSS, AllSides/Open RSS, and Hacker News. The browser stores feedback, saved articles, profile state, calibration predictions, and notes in localStorage; pure recommendation/metric functions remain isolated and tested.

**Tech Stack:** Next.js 16, React 19, TypeScript, native CSS, rss-parser, Vitest, localStorage. No external LLM or database in MVP.

**Spec:** `docs/superpowers/specs/2026-10-05-epistemic-news-design.md`

## Global Constraints

- Local/private single-user MVP; no authentication or public deployment.
- Portland/Oregon local priority; India-first international priority.
- AllSides/Open RSS replaces Ground News.
- No infinite scroll, click optimization, streaks, or combined knowledge score.
- Explicit subject-interest feedback is distinct from article-fit feedback and learning notes.
- Below 20 eligible binary calibration responses, show “Collecting evidence.”
- Never fabricate missing metadata, summaries, sources, or coverage.

## Review Focus

- Feed failures or malformed items must yield a partial edition with a visible source warning.
- Duplicate syndicated URLs/events must not consume multiple edition slots.
- Subject-interest feedback must not be inferred from clicks, saves, or article-fit ratings.
- Calibration predictions must be immutable and recorded before feedback.
- Breadth constraints must still hold when AI/technology feedback dominates.

---

### Task 1: Project scaffold and pure domain tests

**Files:** Create `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `src/lib/types.ts`, `src/lib/metrics.ts`, `src/lib/recommendation.ts`, tests under `src/lib/*.test.ts`.

- [ ] Write failing tests for deduplication, Brier score, gated skill, source normalization, and 12-item breadth selection.
- [ ] Run `npm test`; expected failure because modules do not exist.
- [ ] Implement typed article/source/feedback models and pure functions.
- [ ] Run the full test suite; expected pass.
- [ ] Initialize git and commit scaffold.

### Task 2: Live feed ingestion API

**Files:** Create `src/lib/feeds.ts`, `src/app/api/news/route.ts`, `src/app/api/health/route.ts`, tests for feed normalization.

- [ ] Add tests for malformed XML/items, duplicate URLs, missing dates, and partial source failure.
- [ ] Run targeted tests and verify expected failures.
- [ ] Implement bounded fetches for UniverRSS, CosmoRSS, AllSides RSS, and HN; parse XML using `rss-parser`; classify Portland/Oregon, India, and broad domains deterministically.
- [ ] Add timeout, URL validation, HTML stripping/sanitization, event/link dedupe, source freshness, and error reporting.
- [ ] Run tests and build.
- [ ] Commit ingestion milestone.

### Task 3: Application shell and live Today view

**Files:** Create `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/components/NewsApp.tsx`, `src/components/StoryCard.tsx`, `src/components/EditionSidebar.tsx`.

- [ ] Add UI tests for loading, error/partial-source states, empty inventory, story links, and bounded edition rendering.
- [ ] Verify red tests.
- [ ] Implement calm editorial responsive shell, navigation, filters, finite edition, selection explanations, Portland/India badges, source freshness, and manual refresh.
- [ ] Run tests and `npm run build`.
- [ ] Commit Today milestone and report URL/start command.

### Task 4: Local feedback, Saved, Explore, and Sources

**Files:** Create `src/lib/storage.ts`, `src/components/ExploreView.tsx`, `src/components/InterestsView.tsx`, `src/components/SavedView.tsx`, `src/components/SourcesView.tsx`.

- [ ] Test storage round trips, feedback separation, undo/reset, and saved-note behavior.
- [ ] Implement localStorage versioning and resilient parsing; add Yes/No/Unsure subject feedback, optional article-fit and learning note controls; add views and source-gap report.
- [ ] Run suite/build.
- [ ] Commit product flow milestone.

### Task 5: Interest prediction and dashboard

**Files:** Modify `src/lib/recommendation.ts`, `src/lib/metrics.ts`, `src/components/InterestsView.tsx`, tests.

- [ ] Add failing tests for onboarding-only baseline, per-domain evidence updates, immutable prediction records, 20-response gating, and negative skill.
- [ ] Implement per-domain Beta-style evidence estimates, frozen baseline version, calibration cards, Brier skill, uncertainty copy, and editable/resettable profile.
- [ ] Run full tests/build.
- [ ] Commit measurement milestone.

### Task 6: Experimental EG diagnostics and hardening

**Files:** Create `src/lib/epistemic.ts`, tests; modify dashboard advanced section and API.

- [ ] Add failing tests for stable float64-compatible softmax, JS bounds, EG/EEG formulas, and counterfactual non-mutation.
- [ ] Implement direct small-catalog EG/EEG diagnostics using subject-interest scores; keep them out of the primary skill metric.
- [ ] Add privacy/reset/export controls, keyboard focus, reduced motion, safe external links, and source outage fallback.
- [ ] Run `npm test`, `npm run build`, and a local smoke check.
- [ ] Commit MVP milestone.

### Final verification

- [ ] Run the complete test command and read the result.
- [ ] Run production build and read the result.
- [ ] Start the site and verify `/`, `/api/health`, `/api/news` response, navigation, feedback, Saved, and My interests.
- [ ] Report exact commands/results and any remaining limitations; do not claim recommendation improvement before real feedback accumulation.
