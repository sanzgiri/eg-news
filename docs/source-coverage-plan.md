# Source Integration and Coverage Plan

**Status:** Planning only. No connectors implemented or accounts connected.
**Confirmed changes:** AllSides via the supplied Open RSS feed replaces Ground News. Local coverage is **Portland, Oregon, plus statewide Oregon reporting**; non-U.S. coverage prioritizes **India first**, without excluding significant developments elsewhere. Do not add more sources without the user's approval; report coverage gaps so the user can supply feeds.

## Initial source set

| Source | Planned input | Verification / limitation |
|---|---|---|
| UniverRSS | `https://universs-xi.vercel.app/api/feeds`; its configured publisher RSS/Atom list for faster upstream updates | Repository and live endpoint inspected during this planning conversation. 92 configured feeds. Custom browser-local subscription lists require explicit export/import; the public aggregate does not automatically include them. |
| CosmoRSS | `https://cosmorss.vercel.app/api/feeds`; configured publisher feeds where freshness requires direct fetching | Repository and live endpoint inspected. 343 configured feeds; substantially technology-oriented. Existing caching can make aggregate snapshots daily rather than breaking-news fresh. |
| Hacker News | Official public API, new/top/best story IDs and item metadata | Public API documented. Points are optional context, not the learning or quality objective. Much overlap with the other two readers requires URL and event deduplication. |
| AllSides through Open RSS | `https://openrss.org/feed/www.allsides.com/unbiased-balanced-news` | Actual XML endpoint fetched and parsed successfully: 10 items, most recent publication `2026-10-05T12:02:14Z`, channel lastBuildDate `2026-10-05T17:42:02Z`. This is a snapshot, not a guaranteed update schedule. |
| Morning Brew | Explicitly forwarded newsletter messages or permitted public issue access | Still planned/conditional. User's preferred acquisition route is unanswered; no mailbox access or integration has been established. |

Ground News is not part of this source set.

### AllSides endpoint details

The user-supplied URL, `https://openrss.org/www.allsides.com/unbiased-balanced-news`, returned an HTML preview. Its RSS discovery link identifies the `/feed/` endpoint above. The preview showed older stories than the XML snapshot, so a connector must fetch the actual feed, not scrape the preview.

The verified RSS items contain titles, links, publication dates and HTML descriptions. The inspected items have no RSS category tags: subject classification must be performed independently and reviewed rather than inferred from supplied category metadata.

Descriptions include source links and, in some cases, AllSides' outlet-bias labels. Treat those as source-attributed judgments, not our independent ratings or proof of truth. Retain quality checks and avoid false balance. Feed availability does not establish unlimited republication rights; use appropriate attribution, excerpts and original links after an access/terms review. Sanitize feed HTML before display.

## Current coverage assessment

This is a provisional source-mix assessment based on the inspected configurations and one AllSides snapshot, not a completed longitudinal content audit. An isolated article does not establish reliable subject coverage.

**Strongly represented:** technology, software, AI, security, indie technical writing.

**Expanded by the AllSides snapshot:** U.S. politics, courts, national policy, economics/jobs and international/geopolitical developments. Healthcare and culture appear primarily in policy/political contexts; this is not equivalent to broad medicine or arts coverage.

**Potentially thin or unconfirmed; ask the user for feeds:**
1. **Local/regional reporting and civic life:** Portland/Oregon is selected; a dependable local source set has not yet been supplied or verified.
2. **Health, medicine and public health:** scientific/explanatory coverage beyond healthcare policy.
3. **Climate, environment and nature:** dedicated reporting beyond occasional energy or political stories.
4. **General science:** science is present in both reader configurations, but dependable breadth across biology, physics, space and other non-computing fields has not been established.
5. **Arts, literature, history and education:** some culture/design blogs are present, but regular coverage of these domains is not assured.
6. **Non-U.S. regional reporting — India first:** prioritize reporting from within India, including national and state/regional developments beyond U.S.-framed geopolitics or technology. A dependable India source set has not yet been supplied or verified.

Sports, recreation and other additional domains can be included if the user wants them; do not presume they are required.

## How the app will identify gaps

Audit the eligible inventory **before personalization**, not just the articles selected into the edition. A subject omitted by the recommender is not necessarily absent from the sources.

The Sources screen should show, for each broad subject:
- Recent quality-eligible articles and distinct event clusters.
- Independent publisher coverage, separate from connector/discovery-origin counts.
- Publication freshness versus connector last-checked time.
- Coverage status: present, thin, absent, or not yet assessed.

Evaluate current-news inventory over a proposed rolling 7-day window and slower essays/explainers over a 30-day window. Keep these definitions visible; a weekly lull is not proof that a domain never appears. Repeatedly summarize the same event only once when assessing breadth. Maintain a coverage history rather than claim completeness from a single snapshot.

When a domain has no suitable inventory or has fragile/single-source coverage, report the domain and the relevant evidence to the user. Request additional feeds; do not automatically subscribe to new publishers. If needed, show a shorter edition and an explicit coverage-gap notice.

## Freshness and privacy

Reuse existing aggregate snapshots for efficient initial discovery. Obtain permission for the underlying feed lists and poll eligible upstream feeds directly where aggregate caching is too slow; use conditional GETs, backoff, source-specific intervals and last-success metadata. Do not continuously trigger refresh endpoints in the user's existing apps.

Newsletter ingestion, if chosen, should receive only messages the user explicitly forwards to a dedicated address—not broad inbox access. Imported reading history and bookmarks are separate optional data, not implicit consent for preference training.

## Remaining user inputs

- Portland/Oregon and India source suggestions where the existing inventory is insufficient; geography itself is confirmed.
- Additional feeds for the other thin domains above, when desired.
- Morning Brew ingestion preference: newsletter forwarding or permitted website/issue access.
