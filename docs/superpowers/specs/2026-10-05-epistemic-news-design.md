# Epistemic News: Product Design and Delivery Plan

**Status:** Updated written design awaiting review before an execution-ready implementation plan. The user has requested implementation; no application code has been written yet.
**Project:** `/Users/sanzgiri/projects/eg-news` — no existing application or Git repository. The user supplied the main and supplementary PDFs.
**Decisions confirmed:** Hybrid epistemic personalization with quality/breadth safeguards; quantify interest-prediction improvement, keep world learning qualitative; local coverage Portland/Oregon; international coverage India first; AllSides/Open RSS replaces Ground News.
**Initial build:** A local/private, single-user MVP with real source adapters, a finite reader, persisted feedback, measurable preference learning and explicitly experimental EG. Research superiority and a successful pilot are not prerequisites for a runnable reader or claims this design makes.

## 1. Goal and success criteria

Build a personal news reader that becomes better at finding worthwhile news, articles, and blogs while helping you explore more of the world—not merely more of what you already click. Make its developing understanding inspectable and correctable. Avoid clickbait, quick-reward optimization, and compulsive consumption.

Success means:
- Primary: interest predictions improve on explicitly rated, broadly sampled unseen article cards relative to a fixed onboarding-only baseline. Measure paired Brier-score reduction, with sample counts, uncertainty and response selection limitations.
- Supporting: recommendations earn explicit “worth my attention” feedback without sacrificing breadth or article quality.
- Familiar interests do not crowd out other subjects, local developments, or important world events.
- You can discover interests you did not specify at onboarding.
- The app explains both what it believes about you and where evidence remains weak.
- Your own learning reports are separate from model improvement and passive reading activity.
- Quality gates, privacy controls, and diversity constraints remain effective even when one topic dominates your feedback.

**Initial defaults for review:** Single user; responsive web app; English initially; finite daily editions; local/private operation before any hosted deployment. Portland/Oregon is the user-selected local region; India is the first international priority, not the only permitted international subject. Use the agreed source set and explicitly imported feeds/links. Paid-source access and Morning Brew acquisition remain unresolved and must be visibly pending, not fabricated. No multi-user platform, social feed, ad system, native mobile app, or mandatory external LLM in the initial scope.

## 2. Research basis and limits

Paper: Daniel Nemirovsky et al., *There’s Something About You: Epistemic Recommendation for Latent Interest Discovery*, DOI [10.1145/3773078.3831822](https://doi.org/10.1145/3773078.3831822).

Primary sources: the complete user-supplied [10-page main PDF](../../../3773078.3831822.pdf) and [7-page supplementary PDF](../../../appendix_standalone.pdf), both read in full. Crossref and OpenAlex were initially used to locate metadata/abstract. Main-paper page references use printed proceedings pages 544–553. See the [supplementary review](../../appendix-review.md) for implementation guidance and unresolved issues.

Verified method and findings:
1. **EG is predictive belief revision, not human learning or Shannon entropy reduction** (§2.2, p. 546).
2. Append a positive/negative hypothetical interaction, re-encode user history, and recompute relevance with **base model weights frozen** (§3.1, Eqs. 3–5).
3. Convert catalog relevance scores into a **softmax distribution**, using temperature 1 in the experiments. Raw EG sums two Jensen–Shannon divergences; expected EG weights the divergences by predicted engagement (§3.1, Eqs. 6 and 10).
4. Positive-only sequence encoders have a no-op negative branch. A dual positive/negative-history encoder can represent explicit negative evidence (§3.1/§4).
5. The experiments use KuaiRec videos and MovieLens movies, offline evaluation and 20-round simulations—not news, a live personal reader, or measured human understanding (§4, Tables 2–3).
6. EG-augmented bandits show the strongest overall balance in the authors’ discussion, but not universal wins. On GRU/KuaiRec, NeuralTS+EG interest coverage is 0.8500 versus NeuralTS 0.7884; on GRU/MovieLens, it falls to 0.6593 versus greedy 0.7560 (Table 2). SASRec/KuaiRec’s improvement over plain NeuralTS is within reported standard error (§4.1).
7. Expected-EG weighting can suppress unfamiliar categories with low predicted engagement; raw EG can trade relevance for item coverage. Signal usefulness depends on the base representation (§4.1).

**Our extensions, not findings established by the paper:** Explicit subject-interest and article-fit feedback instead of engagement; quality gates; topic/source/geographic constraints; finite editions; public-interest coverage; changing-interest support; a user-facing tracker; and a separate tracker of user-reported learning. These require independent evaluation.

**Research limitations / quality check:** Appendices A–O are now available and reviewed. Algorithm L.1 supplies exact EG pseudocode; Appendix N specifies float64 JS calculation and reports Apple M4/24 GB execution; Appendix O gives computational costs. Detailed training/search configuration remains incomplete. The [linked code repository](https://github.com/egrec-paper/egrec), last checked on 2026-10-05 before this supplementary review, contained only a README saying code is coming soon pending approval. Do not plan around importing an available implementation without a fresh check.

Do not rely on the paper’s coverage guarantee as a product promise. The EG-gap condition was checked initially, not throughout exploration, and holds for only 33.7% of the reported KuaiRec/SASRec users (§3.3). There is also a notation inconsistency to resolve: Eq. 2 defines terminal coverage regret as a difference of category counts, bounded by the category count, whereas later claims describe regret accumulating linearly with time. Appendix A clarifies an intended cumulative per-round coverage regret, but does not reconcile that definition with Eq. 2. It also has mean-gap versus itemwise-ordering and alpha-condition concerns, plus an extra factor K in its Step 4 substitution. Appendix B retains a per-round model-error term after discovery. The text alternates between count/fraction descriptions of IC, and Table 2 includes values above 1. T1 must document these issues and establish the app’s own unambiguous metrics; no claim that every latent interest will be discovered.

## 3. Approaches considered

| Approach | Strength | Limitation |
|---|---|---|
| Rules-based quality/diversity reader | Simple, transparent, useful immediately | Limited latent-interest discovery and no principled interest uncertainty |
| **Hybrid epistemic reader — selected** | Useful baseline plus informative exploration; explicit safety rails | Requires careful feedback design and calibration; still an adaptation |
| Full research reproduction first | Strongest fidelity to the paper | Complete training configuration, released code and benchmark setup still needed; uncertain effort; delays reader usefulness |

Do not use a free-form LLM as the ranking authority. A numerical, versioned policy is easier to explain, replay, and audit. Language models, if added later, may assist content tagging and grounded explanations but cannot override quality gates or claim to know what you learned.

## 4. Reading experience

### Daily edition

Default: **12 items**, with no infinite scroll, streaks, badges, autoplay, engagement notifications, or unread-count pressure. Start with this proposed mix:
- 5 items from established interests.
- 3 bridges from familiar interests to adjacent subjects.
- 2 discovery items outside established interests.
- 2 public-interest items, including local/regional coverage when available.

These are planning defaults to evaluate, not research-derived optimal proportions. Items should not repeat across lanes. The familiar/bridge counts are targets, not obligations: redistribute unused familiar slots into bridges or discovery when interests are sparse or domain caps would be breached. Never reduce the protected discovery/public-interest minimums to fill familiar slots. If appropriate material is unavailable, publish a shorter edition and explain the gap rather than lowering quality or inventing coverage.

Each card provides the original headline, publisher, author/date when available, content type, approximate reading time when supported, topic tags, and “Why this is here.” Indicate original reporting, analysis, opinion, or blog commentary without treating blogs as inherently inferior. Link to the original source. Any later generated synopsis must be grounded in accessible content and labeled; metadata-only entries must not receive fabricated summaries.

### Explore and understand

Provide topic exploration without altering the learned profile unless the user supplies feedback. Topic pages assemble a small path: introductory context, a current development, and a deeper source. Cluster reporting about the same event and show meaningful updates instead of repeatedly recommending different headlines about an unchanged story.

Bridge examples might include AI agents → workplace organization → labor policy, or energy technology → electricity pricing → local infrastructure. Also reserve genuinely unrelated discovery; every path must not route back to AI.

### Feedback

Separate subject interest from article fit and human understanding; do not ask three mandatory questions on every card:
1. Main card: **Does this subject interest you?** Yes / no / unsure. This is the primary prediction label.
2. Optional after-reading assessment: **Worth your attention?** Useful / not useful / unsure. This feeds article-fit diagnostics separately.
3. Optional reflection: **Did it improve your understanding?** Learned something new / clarified something / already knew / not assessed. Keep qualitative and independent of the predictive metric.

Record predictions before displaying cards and receiving feedback. An unsure/missing answer is not a negative label. A topic-positive response with “wrong depth” updates interest positively while correcting article fit separately.

Optional reasons: topic mismatch, wrong depth, too repetitive, clickbait, weak evidence, bad timing, unavailable/paywalled, or “more of this.” Add save, mute topic/source, and “not today.” Reasons route to the relevant policy: bad timing is not permanent dislike; a paywall is not disinterest; already knowing something is not necessarily negative interest feedback.

A click, dwell time, scroll, or an ignored card never independently establishes usefulness or learning. Log impressions only for exposure auditing with consent; missing feedback is missing evidence, not a negative label. This is a deliberate departure from treating non-engagement as a response.

## 5. Quality before personalization

Start with the user's UniverRSS and CosmoRSS feed sets, Hacker News, AllSides through Open RSS (`https://openrss.org/feed/www.allsides.com/unbiased-balanced-news`), and Morning Brew once an authorized ingestion route is agreed. AllSides replaces Ground News. See the [source integration and provisional coverage plan](../../source-coverage-plan.md).

Review inventory across civic/local reporting, world affairs, economics, science, health, environment, technology, culture, history, and serious independent blogs. Assess independent publishers and geography, not simply the number of configured feeds. Report thin/absent domains to the user for additional feed suggestions; do not automatically add publishers. Current source-mix gaps are provisional until a rolling content audit is performed.

Screen content before it can earn a ranking score:
- Evidence/provenance and distinction between fact, inference, and opinion.
- Headline-to-body fidelity; unsupported sensational claims and curiosity-gap manipulation.
- Original reporting, useful synthesis, or clear explanatory value.
- Sponsorship disclosures, source correction practices, and authorship when available.
- Duplicate/event cluster status, freshness appropriate to content type, and access status.

Use documented rules and human-reviewable signals. Short reporting, emotionally consequential stories, unfamiliar viewpoints, and independent blogs must not be rejected merely for those traits. Serious breaking news and official alerts may be concise and still essential. “Different perspectives” never requires false balance or inclusion of unsupported claims.

When body text is unavailable, use authorized metadata and source evidence conservatively; mark content-based assessment unavailable. Do not bypass paywalls or republish unlicensed material. Unknown quality cannot be promoted simply because it appears highly informative to the preference model.

Clickbait penalties alone are insufficient: the recommender’s objective and feedback must also reject attention-maximization. Ban CTR, session length, refresh frequency, and notification opens as optimization targets.

## 6. Learning and selection policy

### Interest model and cold start

Preserve multiple interests explicitly, rather than averaging all feedback into a single vector. Start with a small, inspectable history-feature model; pretrained local embeddings can enrich content matching later without requiring an external LLM or large download to start the app. Separate mechanisms:
- **Interest state and frozen scoring function:** maintain positive/negative evidence per subject and distinct article-fit evidence for depth/format. Onboarding establishes editable priors; subsequent explicit labels update the user state. The scorer's mapping and hyperparameters remain fixed throughout each actual/counterfactual scoring round. The initial model uses Beta evidence estimates per subject and normalized topic membership weights to combine predictions; fractional updates across multiple subjects are an approximation, not a claim of exact Bayesian inference about a complete person.
- **Baseline:** fixed onboarding-only interest predictions. It receives no later feedback. Edits to onboarding create a new measurement version, preventing misleading comparisons across changed baselines.
- **Exploration:** compare a simple uncertainty-aware policy, EG blending and an EG-augmented contextual bandit when data supports the latter. Do not force a neural bandit or head trained on a tiny personal history into the first runnable release. Article-fit feedback remains a separate objective from the primary subject-interest label.

Do not train SASRec, GRU, or an EG-prediction MLP from a tiny personal history. The initial feature/evidence model is a cold-start adaptation, not the paper’s tested architecture; its cross-topic transfer and informativeness must earn their place in T8/T11. Appendices D/N specifically warn that pooled histories dilute hypothetical updates, so distinct/opposing interests must remain separate, and comparisons against richer history encoders are an evaluation requirement. Before probability calibration is defensible, label scores as estimates and prefer transparent baseline editions to overconfident EEG weighting.

Maintain separate descriptive hypotheses such as “interested in infrastructure economics; introductory treatment preferred; evidence limited.” Distinguish long-term interest from temporary session requests. Onboarding provides editable priors, not immutable labels. Allow interest drift and contradictions without forcing model confidence to improve monotonically. Sparse evidence stays sparse; the interface must not imply statistical calibration until evaluated.

### Epistemic scoring: verified definition, adapted feedback and catalog

For each quality-eligible candidate:
1. Create two temporary histories, appending interested and not-interested subject feedback respectively. Article-fit evidence is separate; unknown/unsure feedback is not converted into either branch.
2. Re-encode each history with the same versioned encoder; keep relevance scorer weights fixed and never write hypothetical states to the real profile.
3. Compute baseline and hypothetical relevance over the same catalog, using stable softmax of scores divided by temperature.
4. Compute the positive and negative Jensen–Shannon divergences separately.
5. Expose raw EG and, when probability calibration permits, expected EG as separate values.

Paper definitions (§3.1), with explicit subject-interest replacing engagement in our adaptation and `r` denoting estimated subject interest:

`q_state(j) = softmax_j(r(state, j) / τ)`

`EG(a) = JS(q_current, q_interested) + JS(q_current, q_not_interested)`

`EEG(a) = p(interested|a) × JS(q_current, q_interested) + (1 − p(interested|a)) × JS(q_current, q_not_interested)`

Use stable float64 softmax and JS computation with explicit zero-probability handling, following Appendix N; do not assume Apple MPS supports this numerical boundary. Use natural logarithms to match the paper: each JS is between 0 and ln(2), raw two-branch EG between 0 and 2ln(2), and EEG between 0 and ln(2). Start with τ = 1 for method parity, then test sensitivity. A positive-only encoder’s negative branch would be zero; our explicit-negative history must have a separately tested effect.

Begin with direct scoring over a small full eligible catalog to establish correctness. Then compare a balanced **anchor catalog** of approximately 256 items against full-catalog values and rankings before using it as a computational approximation. Keep broad-domain coverage in the anchors; freeze their version for within-period comparisons and mark changes visibly. This approximation and explicit-feedback substitution are not evaluated in the paper.

These scores measure predictive-distribution change, **not** Bayesian mutual information, a count of interests learned, or reader knowledge. Sensitivity to history encoding, score calibration, temperature, and catalog composition must be tested. A uniform offset to every score leaves softmax unchanged; distributional shift cannot capture every absolute usefulness change. If EG adds no reliable value over simple exploration, retain the baseline and describe the limitation rather than preserve a misleading meter.

The paper’s log/min-max transformed MLP head predicts approximate EG from frozen embeddings. Defer that head until direct scoring is genuinely too expensive and enough labels exist; require held-out rank/error checks and retain raw divergence units for tracker comparability. Candidate-relative min-max scores are ranking features, not comparable measurements of personal knowledge.

### Slate construction

Apply eligibility and mute rules first. Score candidates using estimated usefulness, adapted EG/EEG signals, contextual explanatory value, and freshness; then build a constrained slate rather than sorting by a single scalar. Rank discovery within its own budget so “interesting to the model” cannot commandeer the edition.

Proposed default constraints for a full 12-item edition:
- At least 6 broad subject domains when eligible inventory supports them.
- At most 3 items in any one domain; AI-agent subtopics share the technology domain.
- At most 2 items from one publisher; account for related outlets and syndication.
- No repeated unchanged event cluster.
- Preserve the 2 public-interest slots, independent of personal preference.
- Ordinarily at least 1 local/regional item when location is supplied and suitable sources exist.

Multi-label items must not evade caps by switching their nominal primary tag: record all substantial domain memberships. Apply constraints before accepting the slate. If inventory or user mutes prevent breadth targets, produce fewer items with an explicit coverage-gap explanation. A clearly labeled official emergency notice can sit outside the normal edition; do not silently relax diversity quotas.

Compare three integration modes inside identical quality/breadth constraints: calibrated usefulness plus raw-EG blending; EEG weighting; and a contextual bandit with versus without EG as a context feature. Bandit augmentation is the research-informed leading candidate, not an automatic winner. Keep raw-EG/discovery opportunities so low predicted usefulness does not eliminate every unfamiliar subject. Never append an uncalibrated EG number to a bandit and assume an exploration guarantee.

Retraining updates usefulness estimates but never relaxes breadth safeguards. Reduce redundant probes as evidence accumulates while retaining discovery slots and reopening uncertain/drifting interests. Provide an exploration control with a breadth-preserving minimum, plus temporary topic deep dives outside the daily edition.

## 7. Two honest trackers

### A. What the app is learning about you

Primary dashboard: **Interest-prediction improvement**. For binary subject-interest responses, compute `BS = mean((p_interest - response)^2)` and paired skill `1 - BS_model / BS_baseline` on the same calibration cards. Preserve negative skill (worse predictions); when baseline error is zero, display errors without dividing. This is prediction-error reduction, never a fraction of the person understood.

Offer an optional broadly sampled calibration panel, initially three cards twice weekly, independently of the personalized feed. Store model and baseline probabilities before the response; hide them until after answering. Use each response first to score its recorded prediction, then allow it to inform future predictions. Never reuse it as a fresh held-out evaluation label for a retrained past prediction. Unsure/missing responses are excluded from both paired errors; expose response rate and sampling/version details.

Show the rolling 30-day evaluation period and rated-card count. Below 20 binary calibration responses, display “Collecting evidence” instead of a headline improvement percentage; this is a cautious UI threshold, not a statistical guarantee. After that threshold, show an estimate with descriptive uncertainty, label it provisional and retain the response-selection caveat. Do not claim proven improvement or algorithm superiority merely because a point estimate is positive.

Supporting panels:
- An editable interest map: supported interests, tentative interests, and untested domains.
- Evidence counts and recent positive/negative/unsure signals.
- Model-based uncertainty with plain-language qualifications.
- Explicitly user-confirmed discoveries; inferred interests remain tentative until acknowledged.
- A timeline of hypotheses changed by explicit feedback.
- Advanced research details: predicted EG before feedback and observed distribution change afterward, labeled **experimental model-change estimates**, never substituted for the prediction-improvement headline.

Example: “You indicated interest in two transport topics. Infrastructure is now a tentative interest. We still have little evidence about arts and health.” Only show causal explanations backed by logged model updates.

Do not display “82% of you understood,” a cumulative knowledge meter, or endlessly increasing points. Actual feedback can increase uncertainty or reverse a hypothesis. Large distribution changes can reflect model instability; show them alongside evidence and validation warnings, not celebrate them automatically.

### B. What you report learning about the world

Show self-reported new understanding and clarifications, optional personal notes, topics explored, and connections noticed. Label reading exposure separately from reported learning. Count distinct notes/event clusters to avoid inflating totals through repeated coverage. Provide weekly reflection: “What became clearer?” and “What would you like to understand next?”

No automated claim that reading means comprehension. Optional recall/reflection checks can be considered later, but never mandatory quizzes or a competitive learning score. The two trackers must never be combined into one “epistemic gain” number.

## 8. Architecture and data boundaries

Initial stack: Next.js 16, React 19 and TypeScript with standard CSS for the responsive UI; Python 3.12+ and FastAPI for ingestion, preference/EG calculations and SQLite persistence. Use Python float64-compatible numerical operations for JS. No mandatory external LLM, hosted database, paid API, or pretrained model download. Start services on loopback only; proxy API calls through the web server for a same-origin interface. Public deployment/authentication is a later, explicit decision.

Use scheduled, bounded ingestion and a manual refresh action, not continuous polling or repeated force-refreshing of the user's existing apps. Morning Brew remains pending until its acquisition route is approved. Content service failures must not prevent inspecting saved articles, feedback or interest evidence.

Data flow:

`Curated sources → licensed extraction → quality/access assessment → event clustering + features → eligible inventory → preference/EG estimates → constrained daily slate → explicit feedback → model update + separate learning journal`

Components:
- **Content:** adapters, registry, extraction/access policy, freshness, deduplication.
- **Quality:** versioned rule results and exclusion explanations.
- **Preference:** immutable snapshots, explicit feedback application, uncertainty estimates.
- **Epistemic:** isolated hypothetical updates and versioned anchor scoring.
- **Selection:** quality-first eligibility, lane assignment, diversity constraints.
- **Tracker:** model evidence timeline versus user-authored learning journal.
- **Evaluation:** replayable policies, baselines, acceptance fixtures, audit reports.

Store sources, articles, clusters, article features, quality decisions, editions, selection reasons, explicit feedback, preference snapshots, anchor versions, model-change estimates, and learning notes. No inferred political, health, religious, or other sensitive identity attributes; do not create those as preference features. Location is entered voluntarily at city/region granularity.

Privacy controls: pause personalization, delete/undo feedback, edit/remove hypotheses, export data, reset profile, and delete learning notes independently. Undo/deletion requires rebuilding the preference state from retained evidence, not merely hiding the record. Profile-reset behavior must disclose what happens to saved articles and the separate learning journal. Reject unexpected public-network exposure; authentication is required before remote hosting. Third-party analytics are absent by default.

Fallbacks: cached quality/diversity-only edition when model services fail; shorter edition on inventory shortfall; original-source link when extraction is unauthorized or unavailable; no unsourced synopsis if optional generation fails. All fetched content is untrusted input; future LLM features cannot execute article instructions. Source fetches need URL validation, SSRF protection, redirect limits, timeouts, and content-size limits.

## 9. Phased delivery roadmap

These are planning tasks, not completed work. Engineering estimates are rough for one experienced developer: S = up to 1 day, M = 2–3 days, L = 4–6 days. Code/training-configuration access and local-source availability have unknown effort. Budget roughly 6–10 engineering weeks before a four-week personal pilot, subject to research findings and scope decisions; these are planning allowances, not a committed delivery date. A narrower quality/diversity-only reader can be delivered earlier at milestone 2.

| ID | Task / owner | Deliverable and acceptance | Effort | Prerequisites |
|---|---|---|---|---|
| T1 | Research verification / research + human | Main paper and all supplied appendices read; next resolve configuration/code gaps, document regret/IC issues, and produce numeric EG/EEG golden fixtures | M, unknown code/configuration access | — |
| T2 | Product/data policy / human + planning | Region/language/source/access/hosting decisions and approved feedback/privacy contracts | S | — |
| T3 | Content foundation / execution | User-approved source adapters including AllSides/Open RSS; authorized ingestion, access flags, clusters and domain-gap report; no duplicate events or paywall bypass | L | T2 |
| T4 | Quality screening / execution + critic | Rule explanations and labeled test set; distinguish clickbait from concise legitimate reporting | L | T3 |
| T5 | Baseline reader / execution | Finite edition, source links and explore pages; quality/breadth-only policy with shortage explanations | L | T4 |
| T6 | Feedback and privacy / execution | Independent interest/learning responses, notes, undo/export/reset; no-response stays unlabeled | M | T5 |
| T7 | Preference model / execution + data-analysis | Distinct interest evidence, separate article-fit state, frozen-round scorer and onboarding-only baseline; snapshots and paired calibration diagnostics; bandit alternatives remain experimental | L | T6 |
| T8 | Epistemic experiment / research + execution | Exact float64 EG/EEG golden fixtures, full-catalog scorer and validated anchor approximation; frozen-weight, non-mutation, tiny-divergence and temperature tests | L | T1, T7 |
| T9 | Constrained hybrid selector / execution | Lane/domain/publisher/cluster limits, public-interest coverage and alternative EG integration modes; adversarial AI-heavy fixtures | M | T5, T8 |
| T10 | Separate trackers / execution + critic | Gated interest-prediction improvement and evidence map; qualitative optional learning notes, no merged knowledge score | M | T6, T7, T8 |
| T11 | Replay and simulation / data-analysis + critic | Baseline comparisons, cold-start/drift/selection-bias report and versioned event logs | M | T9, T10 |
| T12 | Failure/privacy hardening / execution + critic | Model/ingestion outage fallbacks, SSRF tests, unauthorized-access checks and deletion/rebuild tests | M | T9, T10 |
| T13 | Personal pilot / human + data-analysis | Four-week pilot with predeclared comparisons and qualitative weekly reflections | L, elapsed 4 weeks | T11, T12 |
| T14 | Decision review / critic + human | Keep/tune/remove features based on usefulness, breadth, frustration and metric honesty—not CTR | S | T13 |

**Parallel opportunities:** T1/T2; T9/T10 after shared prerequisites; T11/T12. Source inventory curation can proceed alongside research. Integration-critical path under these estimates: T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T12 → T13 → T14. T1 can become a bottleneck if resolving incomplete implementation configuration or research inconsistencies blocks the experimental branch. Parallel groups indicate dependency independence; a single developer still needs to schedule their own work sequentially.

Milestones:
1. **Content readiness** after T4: broad source inventory and inspected quality fixtures.
2. **Useful non-personalized reader** after T6: finite edition, independent feedback and working privacy controls.
3. **Experimental hybrid** after T10: informative exploration, enforced constraints and two honest trackers.
4. **Pilot readiness** after T11/T12: diagnostics and failure/privacy tests pass.
5. **Product decision** after T14: pilot reviewed, limitations recorded, continuation explicitly approved.

The user has now requested implementation. After review of this updated design, create a test-first engineering plan for the runnable MVP and review that written plan before execution. The earlier research/pilot roadmap is not a requirement to wait weeks before producing a usable reader. Unreleased research code and missing benchmark configuration do not block implementing the documented exact-EG calculation with our explicitly labeled adaptation.

## 10. Evaluation and acceptance tests

Compare policies on the same quality-eligible inventory with identical breadth constraints: A) quality/diversity only; B) usefulness personalization; C) contextual bandit without EG; D) C + EG context; E) raw-EG blend; F) EEG weighting. Include simple category-novelty and randomized discovery controls to distinguish informative probing from merely showing different topics. Treat D as the leading experimental candidate, not a foregone conclusion.

For our app, define **useful-interest coverage** as the count of distinct broad domains with at least one explicit useful response within the reporting period; report it as a count, not an unknown fraction of all latent interests. Show article exposure separately, and do not conflate item-catalog coverage with personal-interest coverage. Compare user-rated relevance and frustration alongside coverage.

Primary outcome: paired Brier-score reduction for subject-interest predictions against the frozen onboarding-only baseline on broadly sampled, pre-recorded calibration predictions. Report response rate, rated-card count, measurement/baseline version, date range and descriptive uncertainty. Predictions on the personalized feed can inform diagnostics but must not be mixed into the headline calibration metric without disclosure.

Supporting outcomes: explicit “worth my attention” rate, user-confirmed discoveries, edition topic/geographic/source coverage and relevance/frustration. World learning remains an optional qualitative reflection—not a second numerical optimization objective.

Additional diagnostics: calibration of estimated probabilities, history-encoder/anchor sensitivity, rank stability, model uncertainty, duplicate exposure and feedback burden. Do not optimize model-change magnitude itself. Low or declining EG can be healthy saturation; high EG can be instability.

Pilot: predeclare comparison periods or randomized balanced editions with the same safeguards, log policy versions and selection probabilities when randomized, and preserve all labeled exposures. Exposure and response selection bias limit conclusions; do not generalize from clicked items or treat unlabeled items as failures. A four-week single-user pilot is descriptive, not proof of general recommender superiority. Cold-start and synthetic-user simulations test mechanisms, not real human learning.

Acceptance fixtures:
- Nearly all positive feedback is on AI agents: broad-domain caps and discovery/public-interest slots still hold.
- No feedback for a week: no invented interest updates or user-learning events.
- Subject-interest “yes” plus “already knew” and article-fit “useful”: keep explicit interest evidence; record no new-learning claim. Article-fit “useful” alone must not become a subject-interest label.
- “Not today” or “paywalled”: do not learn permanent topic dislike.
- High predicted informativeness but manipulative/unsupported content: quality gate excludes it.
- Legitimate short official reporting: not filtered solely by length or urgency.
- Sparse local coverage: disclose shortage; do not fabricate a local story or exceed mutes.
- Source concentration through syndication/multi-label topics: limits cannot be gamed.
- Contradictory/new interests: uncertainty may rise and hypotheses remain editable.
- Counterfactual evaluation: real history, base scorer weights and bandit posterior checksums unchanged.
- EG/EEG fixtures: identical distributions yield 0; raw EG equals the sum of branches; EEG equals their probability-weighted sum; values respect natural-log bounds; positive-only negative branch is 0.
- Softmax fixtures: temperature and uniform-shift invariance behave as specified; small EG is not exaggerated into a knowledge percentage by min-max scaling.
- Full-catalog versus balanced anchors: approximation rank/error report available before enabling anchors.
- Same model/anchor versions: repeatable scores; changed versions visibly break comparability.
- Undo/delete/reset: feedback-derived state is rebuilt, exports exclude deleted evidence, notes handled under separate controls.
- Source/model outage, malicious source URL, missing body text: safe fallback without hallucinated summaries.

## 11. Risks and mitigations

| Tasks | Risk | Mitigation |
|---|---|---|
| T1/T8 | Code/configuration incomplete, theoretical definitions inconsistent, or news adaptation fails to transfer | Golden fixtures from Algorithm L.1 and verified equations, clearly separate app metrics/adaptations, retain baseline, do not borrow guarantees |
| T3 | Sparse/expensive local sources and copyrighted content | Manual location and source registry; authorized metadata/link-out; shorter editions; review access terms |
| T4 | Clickbait detector suppresses serious reporting or unfamiliar perspectives | Human-reviewed fixtures, separate fidelity/evidence signals, correction/override controls |
| T5/T9 | Token diversity via mislabeled AI subtopics, syndication, or redundant events | Broad multi-label accounting, publisher ownership/syndication metadata, event clustering |
| T7 | Sparse feedback creates false certainty or confounds depth with topic | Regularization, explicit reasons, untested-domain labels, uncertainty validation and editable priors |
| T8 | Distribution-change proxy measures instability rather than useful learning | Anchor/update sensitivity tests; calibration; compare simpler uncertainty and posterior-EIG alternatives; never reward large tracker changes |
| T9 | Exploration becomes irrelevant or burdensome | Fixed discovery budget, relevance/quality safeguards, user controls and pilot frustration measures |
| T10 | Tracker claims comprehension or gamifies knowledge | Separate labels, evidence-backed explanations, self-report only, no combined percentage/streak |
| T11/T13 | Selection bias and changing inventory imply false improvement | Same eligibility rules across policies, temporal holdout, logged exposures/response rates, cautious descriptive conclusions |
| T12 | Profile leakage, unsafe fetches, or incomplete deletion | Local/private default, network/auth review, SSRF protections and replay-based deletion tests |
| T13 | Personal pilot too short or burdensome | Optional feedback, weekly qualitative review, stop/tune criteria, extend only by user choice |

## 12. Optional follow-up configuration (not blockers for the initial local MVP)

1. Preferred languages beyond the initial English default, and any India state/regional preferences. Portland/Oregon and India-first international scope are confirmed.
2. Any later private hosting or public-product deployment; the initial implementation is local/private.
3. Additional user-supplied feeds for thin domains; preferred/blocked sources, subscription access, and Morning Brew ingestion route. AllSides/Open RSS replaces Ground News.
4. Whether the proposed 12-item edition and 5/3/2/2 mix suit your reading budget.
5. Whether optional generated explanations are desired at all; recommended to defer them until content-grounding tests exist.
6. Whether source code and remaining training/configuration details can be obtained; both supplied PDFs are now fully reviewed.

## Planning review checklist

- [x] Inspect project context and retrieve available research.
- [x] Confirm separate app-learning and user-learning trackers.
- [x] Compare approaches and confirm hybrid direction.
- [x] Draft product architecture, task dependencies, milestones and risks.
- [x] Read the full supplied PDF and correct EG versus EEG, softmax/log units, and frozen-weight history semantics.
- [x] Separate verified paper equations from explicit-feedback, cold-start and catalog-sampling adaptations.
- [x] Check linked code availability and record mixed outcomes and theoretical-definition concerns.
- [x] Review all supplied supplementary appendices, refresh availability notes and record numerical/representation/reproduction implications.
- [x] Check that model-change estimates are not represented as human knowledge gain.
- [x] Incorporate interest-prediction measurement, separate article-fit feedback, proposed UI, Portland/Oregon and India-first coverage.
- [ ] User reviews this updated written design before an execution-ready engineering plan or implementation.

## 13. Initial UI and runnable-MVP scope

### Visual design and navigation

A calm editorial reader: warm off-white background, dark navy text, muted teal accents, serif story headings and sans-serif controls. Generous reading spacing, accessible contrast, visible keyboard focus, text labels rather than color-only status, and reduced-motion support. No streaks, competitive points, infinite scroll or intrusive notifications. Prefer real text and optional licensed source images to a thumbnail-heavy feed.

Navigation: **Today · Explore · My interests · Saved · Sources**, with Settings accessible from the header. Desktop Today uses a main story column and a compact edition/status sidebar; mobile stacks the content and uses an accessible compact navigation. Do not render illustrative mockup counts or stories as real data.

### Today

A dated finite edition, category/lane filters, breadth overview, last-source-update information and a manual refresh action. Each card shows original headline, source, publication time/access status, content type, safe source excerpt where available, selection reason, Read original, Save, and optional Yes/No/Unsure subject-interest feedback. Unknown reading time or publication date stays unknown rather than being invented. External source links open safely with attribution.

The sidebar gives current domain distribution and a restrained model-learning status such as “Collecting evidence.” Link to the interest map rather than show a continuously rising knowledge score. A clearly marked optional calibration panel uses broadly sampled cards without revealing prediction probabilities before feedback.

Publish up to 12 items according to the earlier lane targets and caps. Protect discovery/public-interest slots; use Portland/Oregon and India-first priorities when approved inventory supports them. If no suitable regional inventory exists, label the gap instead of inserting unrelated stories under that region.

### Explore

Browse subject and geography filters. Where real inventory supports it, show background, current developments and deeper reading, plus related topics. Browsing itself does not establish an interest label. Missing background or deep-reading inventory is an explicit empty section, not a generated reading path. India-first is a regional priority, not an inference about nationality, politics or personal identity.

### My interests

Prediction-improvement headline with period, response count, baseline and uncertainty qualifiers; show “Collecting evidence” during cold start. Below it: distinct topic interests with evidence/uncertainty, tentative and user-confirmed discoveries, corrections and an auditable feedback timeline. Put raw/expected EG and model-change diagnostics under an Advanced section. Allow profile correction, pause, export and reset. Do not describe an uncertain or untested subject as disliked.

### Saved and reflection

A persisted saved-article list and optional “This clarified something” notes. Interest feedback, article fit, and learning reflections remain independent. Show source links/access limitations; do not promise offline full-text access that has not been licensed or cached.

### Sources and Settings

Show the agreed connectors, last successful check, publisher/content update times, errors and coverage gaps. Morning Brew displays “Needs setup,” not “Connected.” Permit the user to explicitly import source lists or add links; do not automatically add publishers. Local/private defaults, geography, language, exploration settings and retained-data controls are visible. Deleting/undoing feedback rebuilds the learned state; reset offers explicit handling of saved articles and separate notes.

### First-release boundaries and checks

The first build includes real public-source ingestion, deduplicated finite editions, all five primary screens, persisted explicit feedback, an inspectable multi-interest model, a frozen baseline, correctly gated prediction metrics, direct experimental EG scoring, source-gap warnings, local/private operation and automated tests. Full neural reproduction, an EG prediction head, generalized proof guarantees, paid-source bypass, broad email access and public cloud deployment are excluded.

Automated acceptance must cover: first-run/empty inventory with no fabricated articles or metrics; backend/source outages; HTML sanitization and safe fetches; invalid dates and missing fields; duplicate events and publisher/topic caps; topic-positive feedback with article-fit rejection; unsure/missing labels; overwrite/undo/reset/replay; identical immutable paired predictions; negative/zero-baseline skill cases; calibration-count display gating; counterfactual non-mutation and JS bounds; source gaps for Portland/Oregon and India; keyboard/mobile layouts and the complete source → edition → feedback → saved/profile flow.

A live initial fetch and runnable UI can be verified during implementation. The four-week personal pilot and any evidence of real recommendation improvement remain subsequent evaluation work; they must not be marked completed by synthetic tests.
