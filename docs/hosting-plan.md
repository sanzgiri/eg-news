# Hosting Plan

**Status:** Planning only; no deployment performed.

## Recommended first host: Vercel

The app is Next.js with server-side source fetching, so Vercel is the shortest path to a public/private URL. Source requests remain server-side; browser clients receive normalized article metadata, not source credentials. The current MVP does not use API keys or a hosted database.

### Initial deployment shape

- Next.js App Router on Vercel.
- `/api/news` serverless route fetches the four approved public sources.
- `Cache-Control` should be added after freshness policy is finalized; do not cache longer than the 24-hour time-sensitive window without preserving source timestamps and an explicit stale warning.
- User feedback, saved articles and notes remain browser-local in the first hosted version. This preserves privacy but does not provide cross-device sync.
- No external LLM, email access, or secrets are required for the MVP.

### Before production deployment

1. Add a short server-side cache with stale-source metadata so every visitor does not fan out to all sources simultaneously.
2. Add bounded concurrency, retry/backoff, and an overall route duration budget.
3. Add rate limiting if the endpoint becomes public; source fetching is an upstream-cost and abuse concern even without API keys.
4. Decide whether the app should be public, protected by Vercel Authentication, or deployed privately on a local network.
5. If cross-device feedback is desired, add authenticated persistence only after defining deletion/export semantics. Do not put preference data in analytics.
6. Add canonical metadata, robots/sitemap decisions, and a single canonical domain only if public discovery is wanted.

## Alternatives

- **Private local deployment:** best for privacy and no hosting cost; inaccessible away from the local network unless secured.
- **Vercel Hobby:** easiest public preview and good Next.js fit; verify current plan limits before relying on frequent scheduled refreshes.
- **Private hosted Vercel deployment:** useful if the URL should be reachable from multiple devices; requires authentication/deployment protection and explicit handling of browser-local data.

No deployment, domain claim, authentication setup, or public indexing should happen until the user chooses the exposure model.
