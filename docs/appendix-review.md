# Supplementary PDF Review

**Source:** [appendix_standalone.pdf](../appendix_standalone.pdf), all 7 pages and Appendices A–O reviewed.
**Scope:** Research review and planning only. No implementation or experimental reproduction performed.

## Verdict

Yes: the supplement materially improves implementation guidance and experimental design. The core EG calculation is sufficiently specified to implement and test independently. It does not establish that EG will improve a personal news reader, that every latent interest will be discovered, or that a user-facing EG number measures human understanding. It is not a complete replacement for released code and training configuration.

## What it adds

| Evidence | Useful detail | Implication for this app |
|---|---|---|
| Appendix L, Algorithm L.1 | Compute baseline catalog softmax; append positive/negative hypothetical feedback; re-encode histories; compute both catalog softmaxes; sum JS divergences | An exact reference calculation can precede any prediction head or sampled-catalog approximation. Counterfactual histories must remain isolated. |
| Appendix N | JS computations use float64; the authors disable MPS for EG computation because float64 is required | Specify stable float64 softmax/divergence calculation, zero-probability handling and numerical fixtures. An embedding/encoder can use another backend, but precision at the distribution/divergence boundary must be explicit. |
| Appendix N | Experiments ran on Apple M4 with 24 GB RAM; three seeds: 17, 22, 99 | GPU/web-scale infrastructure is not a prerequisite for a small research prototype. This is not a measured latency or memory guarantee for our app. |
| Appendix O, Table O.1 | Exact scoring costs O(K × N × F), where K is candidates and N the catalog; head inference reuses embeddings | Cache the baseline distribution within a scoring state, batch hypothetical evaluations where safe, and measure cost before adding a learned head. Head inference still scales with candidate count and hidden size. |
| Appendices D/N | Aggregated or mean-pooled histories dilute individual hypothetical interactions; stronger sequential representations produce stronger signals | Our signed, recency-weighted aggregate is a cold-start baseline, not a justified final EG backbone. Compare it with multiple interest representations and a richer history encoder before claiming useful latent-interest discovery. |
| Appendix N | Reported EG-head Spearman correlation is 0.65–0.67 for SASRec | A head may support ranking but cannot be assumed to reproduce absolute EG values. Prefer direct scoring for the tracker until approximation error is independently measured. |
| Appendix E | Positive raw-EG gap reported for 33.7% of initial snapshots versus 4.0% using EEG | Strengthens the case against relying solely on engagement/usefulness-weighted EG. Preserve raw-EG or other exploration opportunities and fixed breadth safeguards. The gap diagnostic itself has definition issues noted below. |
| Appendix H footnote | Ablation tables use pre-gBCE SASRec checkpoints, while main simulation tables use gBCE-trained checkpoints | Label checkpoint/training/calibration versions when comparing results. Differences across those table families are not automatically implementation failures. |
| Appendix G | Full exploration strategy results include MMR and EG/EEG-augmented bandits | Compare diversity, plain bandit, bandit+EG and novelty/random controls under identical quality constraints. Do not assume EG replaces diversity policy. |

## What remains unresolved

### 1. Coverage proof is not a product guarantee

Appendix A explicitly sums per-round missing-coverage fractions. That explains the intended cumulative interpretation behind linear regret, but the main paper's Eq. 2 defines a terminal difference of category counts instead. These are different metrics.

There are additional proof issues:
- **Mean gap versus itemwise ordering:** the main assumption is a category-average EG gap. Appendix A Step 1 treats this as an itemwise advantage sufficient to select an undiscovered cluster. A mean gap alone does not establish that ordering.
- **Alpha condition:** Step 1 needs alpha > 1/(1 + gamma) for worst-case dominance; the main theorem states alpha > 0 more generally. The discovery-time expression also contains 1 − alpha in its denominator, so the endpoint alpha = 1 needs separate treatment.
- **Extra factor K:** Step 4 derives tau1 × (K + 1)/2. Substituting its defined tau1 = m/((1 − alpha)gamma delta_min) gives (K + 1)m/(2(1 − alpha)gamma delta_min), not the displayed expression with an additional K.
- **Post-discovery relevance:** Appendix B includes an irreducible-error term epsilon_model × (T − T_explore). This does not yield horizon-independent relevance regret unless that error is zero or otherwise controlled.

These concerns do not invalidate the exact EG definition or the possibility of empirical benefit. They do prevent using the theoretical bound as a blanket promise. Define our own useful-interest coverage as an explicit count, evaluate it directly, and retain quality/breadth constraints regardless of EG.

### 2. EG-gap validation needs consistent units and sampling

Appendix E measures gamma as a relative ratio, whereas the main assumption defines an absolute difference. The same reported gamma cannot be inserted into the theorem without reconciling the units. Validation pools across seeds and checks initial partitions; it does not show that the gap persists throughout discovery. Reported user counts pooled over seeds should not be interpreted as independent unique people without clarification.

### 3. Some reproduction configuration is still missing

The main paper points to Appendix N for detailed search ranges and selection criteria. The supplied N gives precision, hardware, seeds and head-correlation information, but not a complete training/search specification. Label sampling, exact transform constants, optimizer settings, early stopping, selection protocol and all implementation semantics still need configuration decisions or source-code confirmation. Algorithm L.1 specifies the calculation, not the full benchmark reproduction.

### 4. Statistical certainty requires care

Appendix M concatenates user observations across seeds before paired testing. Repeated observations of the same users across seeds may be dependent; the reported tests should not be imported as independent evidence of news-reader improvement. Our pilot should report descriptive uncertainty and paired/user-level comparisons appropriate to its sample, rather than borrow these p-values.

## Recommended planning changes

1. Mark supplementary review complete, but keep code/training reproduction as a separate unresolved issue.
2. Add float64 and stable-softmax/JS numerical requirements to the eventual scoring task, including tests for tiny divergences and zero probabilities.
3. Benchmark direct full-catalog EG first; retain the planned sampled-anchor and learned-head gates.
4. Strengthen the history-representation evaluation: include opposing interests, long histories, changing preferences and cross-topic probes so a pooled vector cannot silently erase distinct interests. Consider per-interest representations as an alternative; do not assume an untested replacement is proven.
5. Evaluate raw EG, EEG and plain/EG-augmented exploration separately. Preserve public-interest, quality and diversity constraints independently.
6. Keep app-learning and user-reported-learning trackers separate. Describe model change as model change, not comprehension or cumulative knowledge.

**Bottom line:** This removes a meaningful documentation blocker for implementing a small exact-EG experiment. It strengthens—not weakens—the case for a hybrid reader with explicit usefulness feedback, fixed breadth/quality protections, and empirical validation before relying on the epistemic tracker.
