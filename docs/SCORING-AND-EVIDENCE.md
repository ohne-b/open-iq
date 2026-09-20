# Scoring, accuracy, and evidence development

## 1. What “accurate” must mean

Accuracy has several distinct requirements:

1. **Content correctness:** the item has a defensible answer and measures the intended demand.
2. **Administration fidelity:** the user actually received the specified task, timing, and response opportunity.
3. **Software correctness:** saved answers reproduce the displayed result exactly.
4. **Measurement precision:** the score is sufficiently stable and informative for its proposed interpretation.
5. **Construct evidence:** the score behaves like the ability it is said to represent.
6. **Reference validity:** the comparison population is appropriate and adequately characterized.
7. **Fairness and comparability:** changes in language background, devices, or access conditions do not invalidate the interpretation.

Perfect software can satisfy the first three and still fail the last four. The [Testing Standards](https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf) provide the overarching rationale for linking interpretations to evidence.

## 2. A score policy that the application enforces

| Evidence level | What can be shown | What cannot be implied |
| --- | --- | --- |
| E0: specified, technically checked | Actual task scores, errors, omissions, recall, fixed-block performance | Population IQ, percentile, reliability estimate, ability diagnosis |
| E1: described volunteer cohort | Frozen-cohort percentiles where the procedure and group match | World/national population percentile or clinical equivalence |
| E2: investigated measurement model | Supported model scores, uncertainty, and documented scope | Transfer to unstudied countries, devices, ages, or clinical use |
| E3: appropriate norms and external evidence | An IQ-scale estimate only for supported uses and populations | Universal accuracy, diagnosis, or an official WAIS result |

**The launch is E0.** None of these labels is a certification. They are internal release states with public plain-language explanations. No source is claiming that these four exact categories constitute an official standard.

At E0 the header says “Your assessment results,” not “Your IQ.” It reports completion, the ten subtests, and the conditions of the attempt. The project can retain the Open IQ name while explaining its actual development stage prominently.

If someone declines all optional future research participation, they still receive the same result calculation available to anyone at that evidence level.

## 3. Launch scoring rules

### Accuracy tasks

Store the option ID, not its screen position. Correctness is `response.optionId === item.correctOptionId` for ordinary one-answer items. Validate both IDs first.

Report `correct`, `incorrect`, `omitted`, and `notAdministered` separately. Percent correct for a completed fixed section uses all scheduled scored items, including deliberate omissions; the result states the denominator. An interrupted partial section shows completed-item counts and is labeled partial. Never present it as directly comparable to a completed form.

Do not attach arbitrary author-assigned weights to “hard” items. Do not assume every item contributes equal information to a latent trait just because the raw score assigns one point.

### Memory tasks

Preserve the ordered response and the expected ordered sequence. Derive position-correct recall and whole-trial success from that record. Report separately by task and trial subtype if their procedures differ.

A recalled sequence can be partly correct; choose and document the partial-credit rule before launch. Do not let incidental UI behavior such as typing spaces or pressing a key twice change the memory construct. Trial-level missingness and processing-task errors remain visible.

### Speed tasks

Count only responses accepted inside the actual block window. Record correct and incorrect responses, number attempted, response accuracy, and interruptions. A precise timestamp and a fixed deadline determine eligibility, not a delayed JavaScript callback.

Report raw correct count at the specified duration and accuracy alongside it. Median response time may be an optional descriptive detail, but is not a replacement for examining speed–accuracy tradeoffs. No cross-device adjustment is applied using an invented offset.

### Overall summary

At E0, summarize completion and task performance. Do **not** average percentages across tasks into an “overall intelligence” number. The tasks have different difficulties, measurement units, and trial dependence. A simple sum can be mathematically reproducible and still psychologically misleading.

Five area headings may group the results, but each underlying subtest retains its unit. Do not give them matching progress bars that suggest 60% recall equals 60% matrix accuracy.

## 4. One immutable report record

Every saved report identifies:

- Application version and build identifier.
- Test/form version, language, and administration manifest.
- Item-bank and stimulus-renderer versions/hashes.
- Scoring version and exact rules used.
- Evidence level and evidence release ID.
- Calibration and norm IDs, explicitly absent at E0.
- Input mode, major interruptions, accommodation/procedure notes, completion state, and attempt status.
- Raw response reference, locally stored unless explicitly shared.

The application stores the result as issued and can also recompute it with the original supported scorer. A later scorer can produce a separately labeled revised report. Updating the website must not silently turn last month's saved score into a different claim.

## 5. What can be improved without funding or response collection

These are the guaranteed work packages:

- Review every solution and distractor; test geometry and arithmetic independently of UI rendering.
- Publish the protocol and score rules in ordinary language.
- Verify all timing and recovery rules in automated and manual tests.
- Review readability, language dependence, and accessibility limits.
- Reproduce published analysis techniques on legally reusable example/synthetic data, clearly labeled as such.
- Invite code and content feedback through ordinary open-source contributions if contributors appear.
- Keep empirical claims disabled until corresponding evidence exists.

Simulation can show that our estimator recovers a simulated parameter under assumed conditions. It cannot demonstrate real human validity, fairness, or representative norms. AI-generated “participants” cannot supply a human reference population.

If the owner's resource constraint also rules out unpaid participant contributions, stop the evidence work at this point. The product release remains complete at E0.

## 6. Optional evidence program, if participation becomes feasible

No recruitment, data collection, institutional approval, or professional involvement is assumed to exist. These are possible future studies, not tasks secretly required before a usable website can ship.

### Stage A: understand the response process

Planning range: roughly **20–40 diverse adult volunteers**, across language backgrounds, ages, and device experience, if available. This is a usability/content investigation, not norming.

Observe whether instructions are understood, whether solvers use the intended rules, whether distractors are ambiguous, and whether visual details are legible. Gather explanations after an item or in a separate review session; concurrent think-aloud performance is not standard-administration score data. Record what changed and why.

### Stage B: experimental pilot

Planning range: **100–300 first-time completions** of a stable candidate form. These are rough scoping numbers, not minimums guaranteeing reliable models.

Inspect omissions, item difficulty, response-time distributions, practice failures, ceilings/floors, interruption rates, and completion burden. Check item–rest associations within the intended task, distractor use, and inconsistent answer keys. Negative associations trigger review, not automatic deletion: content, multidimensionality, and data quality can explain them.

Avoid a public launch form that changes every day while its responses are pooled into a single analysis. Use documented pilot versions and prohibit unsupported cross-version pooling.

### Stage C: calibration and independent evaluation

Planning range: potentially **1,000–3,000+ relevant completions**, depending on the final model, item count, difficulty coverage, missing-data design, and subgroup questions. Establish the actual sample requirements with parameter-recovery and precision simulations. Per-item exposure and per-group coverage matter more than a large total visitor counter.

Use connected, balanced incomplete forms with anchor items if the bank outgrows what each person can take. Record the assignment rule and distinguish planned nonadministration from refusal or timeout. Do not just show random items and hope the resulting response matrix is connected.

Divide evidence into development and untouched evaluation samples by participant. Where generated families are involved, also hold out families or variants to test any claimed generalization. A new version evaluated on the same data used to tune it has not passed independent validation.

### Stage D: repeatability and administration comparisons

Separate studies can investigate retest stability, practice effects, alternate forms, touch/keyboard differences, and interruptions. Initial planning might use **100–200 paired participants per focused question**, but actual requirements come from the desired precision and smallest meaningful difference.

Counterbalance order where appropriate. A person taking form A before form B is not evidence of equivalence unless order and learning are handled. Examine agreement, systematic bias, heteroscedasticity, and uncertainty—not correlation alone.

Retest intervals are study design variables. Do not announce a waiting period that magically returns users to a first-exposure state. See the [retest evidence](RESEARCH.md#7-retesting-changes-performance).

### Stage E: appropriate reference data and external comparison

This is the hardest part under the current constraints and has **no promised completion date**.

An international English-speaking reference population needs a defensible sampling frame or carefully justified alternative, a clear age range, operational language criteria, and treatment of country/region and technology access. Ordinary website visitors are not a substitute. Samples of several thousand still leave many country-by-age-by-language groups sparse.

A future comparison with professionally administered measures requires suitable permission, qualified administration where required, counterbalanced procedures, adequate coverage of the intended population, and lawful handling of sensitive records. Self-reported historical IQ can be exploratory metadata, not the main calibration truth. No user should upload protected test protocols or clinical records into a public repository.

This program may require resources the project never acquires. The plan does not promise to solve that through “AI calibration.”

## 7. Analysis plan

### Before looking at outcome patterns

Write a dated analysis specification: hypotheses, intended comparisons, sample inclusion, missingness, quality flags, model candidates, primary endpoints, and reporting range. Timestamp or preregister it publicly where appropriate; keep personal data out of that record. Publish deviations instead of retroactively presenting exploratory decisions as planned.

### Data quality

Preserve the original records. Derive exclusions in a separate, reproducible analysis layer. Flag impossible event ordering, duplicate submissions, incompatible versions, incomplete procedures, and clearly invalid timing. Very low scores or very fast responses alone do not prove fraud.

Preregister rules for handling repeated attempts and prior exposure. Compare included and excluded samples, and report sensitivity analyses. Do not remove low performers merely to obtain attractive reliability or correlations.

### Classical diagnostics

Report distributions, missingness, accuracy by item, distractor frequencies, item–rest relationships, and uncertainty. Examine speededness and order/fatigue effects. Estimate reliability using methods appropriate to the score structure, with intervals. Cronbach's alpha is not sufficient evidence of unidimensionality or validity.

Check for local dependence: two near-identical items, multiple responses within a memory trial, and repeated rows within a speed block are not automatically independent indicators. Analyze at suitable levels or use models that represent that dependence.

### Latent structure

Use exploratory work on development data followed by specified confirmatory comparisons on held-out data. Compare a general-factor model, correlated broad areas, and an appropriate hierarchical model. Consider bifactor models only with identification, stability, and interpretability checks; a more flexible model fitting better is not proof that its subscores are useful.

Evaluate broad-score reliability beyond general-score variance before reporting detailed “strengths” and “weaknesses.” Small differences between two scores are not meaningful merely because the website draws them at different heights.

### Item response models

Start with plausible simple models and compare fit. Dichotomous power-task items may support Rasch/1PL or 2PL models; partial-credit memory outcomes may need a different model. Do not apply one binary IRT model to the entire battery including timed throughput counts.

Use established offline tools such as [mirt](https://cran.r-project.org/web/packages/mirt/index.html) and [lavaan](https://lavaan.ugent.be/). Three-parameter guessing models, response-time models, and multidimensional adaptive selection add substantial estimation demands and are not default upgrades.

Check parameter uncertainty, residual dependence, item fit, instability at the extremes, and sensitivity to priors. Preserve the parameterization: an exported `a`/`d` model must not be interpreted as `a`/`b` without the correct conversion.

### International and device checks

Where sample coverage allows, examine measurement invariance and differential item functioning by language background, age, region, input mode, and relevant access conditions. Use effect sizes and practical score impact, with multiple-comparison handling and substantive review. A statistical DIF flag is not automatically proof of bias; absence of significance in a tiny group is not proof of fairness.

Do not create ethnic, national, sex, or education-based score adjustments to make distributions look equal. If comparability is unsupported, narrow the interpretation or withhold that comparison. Report the limits of sparse groups.

### External evidence

Assess correlations with intervals, mean bias, individual agreement, and subgroup behavior. Distinguish observed from disattenuated correlations and state any correction assumptions. Do not claim a universal accuracy percentage by squaring a correlation or citing a corrected coefficient from another instrument.

## 8. Reference scores and uncertainty

Only after a reference population and score meaning are supported may the project use a transformation such as:

`IQ-scale estimate = 100 + 15 × z_reference`

The difficult work is establishing `z_reference`, not applying the formula. It is not an author's difficulty score or a z-score computed from whatever visitors happened to arrive this week. Age handling and reference weighting must be justified, frozen, and documented. [cNORM](https://www.psychometrica.de/cNorm.html) is an optional method for appropriate data, not a remedy for selection bias.

For illustration only, classical `SEM = SD × sqrt(1 − reliability)` gives about **3.35 IQ-scale points** at SD 15 and reliability .95. A simple normal 95% interval would then span roughly **±6.6 points**, before accounting for other uncertainties. These are mathematical examples, not Open IQ's achieved precision.

Under an appropriate IRT model, conditional standard error depends on test information and estimator assumptions. Report uncertainty on the transformed scale correctly; nonlinear transforms can produce asymmetric intervals. Do not label a posterior interval a frequentist confidence interval without explanation.

Propagate item/calibration and reference-sample uncertainty where estimable, and describe selection bias separately. A narrow model interval must not imply that unmeasured cultural, device, or sampling effects have been quantified.

Do not extrapolate extreme scores from sparse observations. Under a normal reference distribution, a 3,000-person sample would average only about four people above +3 SD before splitting by age or other groups. Report supported bounds or “outside the well-measured range,” not fabricated IQs of 170 or 190.

## 9. Candidate quality targets

These are proposed development targets, **not achieved results or universal scientific cutoffs**:

| Property | Candidate target and decision rule |
| --- | --- |
| Software scoring | Exact agreement on discrete outputs; documented numeric tolerances against independently generated fixtures |
| Composite precision | Aim for reliability at least .90, preferably .95 for fine individual interpretation, with uncertainty and suitable estimator |
| Conditional precision | If a supported IQ scale exists, aim for SEM around 4 points or less in the advertised central range |
| Broad-area reports | Require sufficient reliability and distinct information; otherwise report underlying task scores |
| External comparison | Specify an a priori target based on intended use; inspect individual agreement, not just a favorable correlation |
| Comparability | No consequential unexplained mode/group effects within the claimed scope; insufficient evidence means narrower claims |
| Coverage | Publish the actual supported range, populations, and devices; no extrapolated extremes |

Passing a reliability target does not permit E3. The complete argument—content, procedure, structure, comparison, fairness, and reference data—must support the claim.

## 10. Adaptive testing: a conditional later change

Only consider adaptive or multistage administration after the relevant items are calibrated and form equivalence is investigated. A large bank with guessed difficulty is not adaptive measurement.

Before activation, simulate bias, RMSE, interval coverage, content balance, exposure, stopping, missing responses, extreme ability, and prior sensitivity. Enforce minimum content from each supported area, maximum length, item-family constraints, and valid stopping criteria. Validate against the fixed form on held-out real data.

The launch fixed form remains a useful reference. Adaptivity should reduce burden while retaining the intended interpretation; it should not be added as a marketing feature.

## 11. Public evidence dossier

For each evidence release publish a readable methods report, recruitment description, data dictionary, exclusions, analysis scripts, exact form/calibration IDs, supported score range, subgroup limits, and known failures. Publish aggregate and synthetic data first. Individual responses require a separate disclosure-risk and permission decision.

Each claim has an owner, a source, a scope, and a last-review date. If no competent independent review is available, state that directly. Model fitting by a maintainer is not independent scientific review.

Keep commercial or flattering claims out of the evidence process. The result wording must follow the evidence level automatically; a marketing change cannot enable an unsupported IQ score.
