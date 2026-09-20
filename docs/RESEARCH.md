# Research, evidence, and reuse decisions

Reviewed 20 September 2026. This is a targeted planning review of primary studies, official project materials, standards, and technical documentation. It is **not** a systematic review, independent replication, or validation of Open IQ. No participant responses were collected.

Each finding below separates what the source supports from what we propose to do. Read the linked sources before implementing a dependent scoring or licensing decision. No protected test items, answer keys, or conversion tables have been copied into this repository.

## 1. WAIS is a reference point, not reusable project content

**Evidence.** Pearson restricts reproduction and adaptation of its clinical assessment content. Its remote WAIS-IV guidance describes examiner-mediated procedures and notes that the normative data came from in-person administration. Permission for professional telepractice is not permission to publish a self-administered open website.

Sources: [Pearson content use](https://www.pearsonassessments.com/footer/appropriate-use-of-pearson-clinical-assessment-content.html), [permissions and licensing](https://www.pearsonassessments.com/footer/permissions---licensing.html), [WAIS-IV telepractice guidance, pp. 1–3](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/telepractice/guidance-documents/telepractice-and-the-wais-iv.pdf).

**Decision.** No WAIS screenshots, close redraws, copied instructions, scoring tables, proprietary assets, or borrowed claims. Broad constructs such as memory and spatial reasoning can inform an original specification. Licensed professional assessments could become external comparators in a future properly arranged study; they are not dependencies of our website.

The US publisher now offers [WAIS-5](https://www.pearsonassessments.com/store/en/usd/p/P100071002.html?tab=product-details), published in 2024. A future comparison study should choose a current, locally appropriate measure; “WAIS-IV is the universal current gold standard” is not a sound planning assumption.

## 2. What OpenPsychometrics actually establishes

The [FSIQ introduction](https://openpsychometrics.org/tests/FSIQ/) describes six sections, a 20-minute design cap, and a typical 10–15-minute completion. The [results explanation](https://openpsychometrics.org/tests/FSIQ/results.php) says its IQ adjustment uses self-reported proctored-test and college-entrance scores. It reports a direct-comparison correlation of 0.57 in 64 undergraduates.

A detail matters: that results page calls the comparison instrument “WAIS-II.” The authors' [institutional record for Logos, Brewer, and Young (2021)](https://researchnow.flinders.edu.au/en/publications/convergent-validity-of-a-quick-online-self-administered-measure-o/) identifies **WASI-II**, the Wechsler Abbreviated Scale of Intelligence, Second Edition. It lists the work as a **preprint**. The record describes 104 undergraduates overall, 64 taking the online full-scale test, and 72 receiving full WASI-II. The page's reported correlation should not be presented as evidence from a large representative WAIS-IV validation.

**Interpretation.** Correlation describes association, not individual agreement or absence of bias. Similar sample averages do not establish accurate individual IQ. A restricted undergraduate sample also cannot resolve international norms, age coverage, or accessibility.

**What to adopt:** free access, public explanations, openness about limitations, and making research understandable.

**What to improve:** actual version records, clear evidence labels, explicit administration, accessible interaction, precise results terminology, and a reproducible scoring pipeline. These are achievable without declaring scientific superiority.

The FSIQ page displays **CC BY-NC-SA 4.0**. That is not blanket permission to relicense every item or asset as unrestricted open-source content. The [Creative Commons deed](https://creativecommons.org/licenses/by-nc-sa/4.0/) specifies noncommercial and share-alike conditions. The [Open Source Definition](https://opensource.org/osd) does not permit restrictions on fields of endeavor for an open-source software license. Inspect licenses per artifact; do not conflate a project name, a webpage license, and software licensing.

## 3. ICAR: useful evidence, with asset-level provenance required

Condon and Revelle's [2014 ICAR paper](https://www.sciencedirect.com/science/article/pii/S0160289614000051) examined four item types in online and offline samples. The online study involved approximately 97,000 participants. The article reports encouraging associations with other cognitive measures and argues for public-domain assessment resources. Its reported corrected correlations must not be relabeled as raw correlations or proof of individual clinical interchangeability.

The [legacy ICAR site](https://www.icar-project.org/) describes public-domain resources and researcher access. However, the current `icar-project.com` destination at [TU Dortmund](https://sms.statistik.tu-dortmund.de/en/research/projects/completed-research-projects/international-cognitive-ability-resource-icar/) says the resource is intended exclusively for academic use.

**Decision.** Treat this as a provenance question, not a reason to assume either that all historical public-domain material became restricted or that every currently distributed asset is unrestricted. Record the exact asset, original dedication or license, source, and version before including it. Seek clarification if these conflict. No ICAR download or permission request has been made as part of this plan.

**Scientific consequence.** Exact reuse of a suitably licensed, unchanged published measure could provide a narrower evidence base than brand-new items. It would still not supply norms for our new international, multidomain battery. Rewriting its items or replacing its visuals requires new evidence for the adaptation.

## 4. MaRs-IB: valuable methods; do not assume unrestricted assets

[Chierchia et al. (2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6837216/) introduced 80 matrix items, with variants, and data from 659 participants aged 11–33. The paper is CC BY, but its text describes the item resource as free for **noncommercial** purposes. The article license and the downloadable item license are not interchangeable.

[Zorowitz et al. (2023)](https://www.princeton.edu/~ndaw/zcbd2023.pdf) calibrated items in 1,501 adults and assessed assembled forms in a separate sample of 600. Crucially, visually related clones were not consistently interchangeable psychometrically.

**Decision.** Use these studies to guide calibration and item review. Prefer original, clearly licensed source graphics for our unrestricted project. Do not assign a difficulty parameter to an entire generator family simply because its outputs share a rule. The exact deployed variant is the measurement unit unless evidence supports a more general model.

## 5. A battery needs a construct argument

[McGrew's 2023 structural study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9959556/) examines Carroll/CHC models using a broad cognitive test battery. [Johnson and Bouchard (2005)](https://www.sciencedirect.com/science/article/pii/S0160289605000139) directly compared competing structures in 436 adults completing 42 ability tests. These are reminders that the organization of cognitive abilities is an empirical modeling question, not a list of labels a website can prove by displaying five charts.

**Decision.** Use five proposed areas to ensure content coverage. Compare plausible factor models later. Distinguish overall common variance, task-specific variance, and broad scores. Do not force a general score or a five-factor interpretation if the actual response structure does not support it.

Two subtests per area are a feasible product blueprint, not a guarantee that a five-factor model will be identified or stable. Item-level models may need testlet/family effects. Independent evidence may require additional indicators or a revised blueprint.

## 6. Working memory tasks are not interchangeable

[Unsworth et al. (2005)](https://pubmed.ncbi.nlm.nih.gov/16405146/) describes an automated operation-span task. [Kane et al. (2007)](https://libres.uncg.edu/ir/uncg/f/M_Kane_WorkingMemory_2007.pdf) raises construct-validity concerns about treating n-back performance as equivalent to span-based working memory capacity. Later work, including [Schmiedek et al. (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4274887/), further examines these relationships at the task and latent levels.

**Decision.** Use two memory paradigms with specified demands, rather than adding n-back because it resembles a polished game. Our proposed reordering and spatial complex-span tasks are original operationalizations, not replications inheriting published reliability. Watch for arithmetic, motor, reading, or strategy demands that overwhelm the intended memory requirement.

## 7. Retesting changes performance

[Scharfen, Jansen, and Holling's working-memory meta-analysis](https://pubmed.ncbi.nlm.nih.gov/29907925/) and [Scharfen and colleagues' mental-speed meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC6480749/) document retest effects. Changing item appearance cannot be assumed to remove learning of strategies or procedures.

**Decision.** Record first attempt versus retest by self-report and local history, disclose that local history is incomplete, and distinguish those sessions in any future analyses. Offer useful practice without presenting a practiced score as an unchanged estimate. Do not claim that a particular waiting period erases practice effects.

## 8. International availability is not international comparability

The [ITC adaptation guidelines (2017)](https://www.intestcom.org/files/guideline_test_adaptation_2ed.pdf) address adapting tests across cultures as well as languages. An English-only interface does not remove variation in English exposure, education, familiarity with symbols, or test-taking conventions.

**Decision.** Admit international English-speaking adults from the start, as requested. Label English verbal tasks accurately. Examine region, language background, age, input method, and accessibility conditions when evidence becomes available. Do not describe even the nonverbal portions as culture-free.

A worldwide IQ reference population would need an operational definition: which residents, ages, English-proficiency levels, access conditions, and population weights? A pool of visitors cannot answer that by itself. Keep the international product audience distinct from any future reference cohort.

## 9. Volunteer samples cannot manufacture population norms

[AAPOR's nonprobability sampling discussion](https://aapor.org/wp-content/uploads/2023/11/Nonprobability-Online-Survey-Samples-Final-AAPOR.pdf) and [guidance on intervals for opt-in samples](https://aapor.org/statements/understanding-a-credibility-interval-and-how-it-differs-from-the-margin-of-sampling-error-in-a-public-opinion-poll/) explain why selection and coverage matter. Weighting observed demographics does not necessarily remove unobserved selection bias. Its [transparency guidance](https://aapor.org/standards-and-ethics/transparency-initiative/) provides useful reporting principles for the recruitment process and exclusions.

**Decision.** If optional volunteer data become available, publish exactly who contributed and how. Treat percentiles as relative to that cohort. Separate sampling uncertainty, model uncertainty, and selection bias; a small confidence interval is not a cure for a biased reference sample.

Published public datasets can help reproduce an analysis method. They cannot be pooled indiscriminately across tests or used as answer data for new items.

## 10. Standards that guide the evidence work

The [2014 AERA/APA/NCME Testing Standards](https://www.testingstandards.net/open-access-files.html) cover validity, reliability/precision, fairness, and responsible score use. The [2025 ITC/ATP technology-based assessment guidelines](https://www.intestcom.org/upload/media-library/tba-guidelines-ver-11-july-2025-1754044782Z3vV9.pdf) specifically cover digital delivery, interruptions, scoring, privacy, comparability, and accessibility.

**Decision.** Maintain an evidence dossier by test version. Claims must identify their population, administration conditions, supporting analyses, and unresolved limitations. The project-specific release thresholds in the scoring plan are proposed governance decisions, not numbers prescribed by these standards.

## 11. Browser timing needs measurement, not confidence in an API

[Bridges et al. (2020), timing study](https://pubmed.ncbi.nlm.nih.gov/33005482/) and [Anwyl-Irvine et al. (2021)](https://link.springer.com/article/10.3758/s13428-020-01501-5) examine timing across experimental systems and devices. The [jsPsych timing documentation](https://www.jspsych.org/v8/overview/timing-accuracy/) also cautions that browser and hardware changes affect applicability of prior results.

**Decision.** Use [jsPsych](https://www.jspsych.org/v8/) as an established trial runtime and measure our implementation. Avoid ultra-brief exposure tasks that require lab instrumentation. Software timestamps cannot measure the entire display-to-eye or key-to-browser latency of an unknown device.

[MDN documents differences in `performance.now()` during sleep](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now). Detect interrupted sessions and reconcile elapsed time; do not assume a timer callback ran on schedule or silently treat backgrounded trials as normal observations.

## 12. Accessibility and measurement must both be designed

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) specifies accessibility requirements, including limited exceptions for test content whose purpose would be invalidated by a text equivalent. [Timing Adjustable guidance](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) describes the essential-timing exception.

**Decision.** Make the site, instructions, navigation, result explanations, and controls accessible. Document the barriers in visual-spatial assessment rather than asserting that alt text alone solves them. Offer alternatives or supported participation where feasible, but do not give an accommodation or alternate modality the same norm interpretation without evidence. An exception is not permission to ignore accessibility throughout the product.

## 13. Technical and asset sources

These sources support implementation choices, not IQ validity.

| Source | Verified capability or relevant constraint | Planning consequence |
| --- | --- | --- |
| [Vite Pages deployment](https://vite.dev/guide/static-deploy) | Static build deployment and repository base paths | Deploy `dist`; test `/open-iq/` |
| [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | Static hosting with published resource limits | Monitor artifact and bandwidth size; keep participant data elsewhere |
| [React Router HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter) | Hash-based browser navigation | Refreshable assessment routes on Pages |
| [Tailwind theme variables](https://tailwindcss.com/docs/theme) | CSS-defined theme tokens | One visual vocabulary; no scattered arbitrary palettes |
| [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite) | Official build integration | Use the supported plugin for the pinned release |
| [MDN storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | Browser storage can be limited or evicted; origin-wide scope | Handle failed writes and provide export |
| [SVG specification](https://www.w3.org/TR/SVG2/) | Structured vector graphics | Use geometric source assets rather than bitmaps |
| [Inkscape SVG](https://inkscape.org/en/develop/about-svg/) | Native editable SVG format | Contributors can edit graphics with a free tool |
| [SVGO `removeTitle`](https://svgo.dev/docs/plugins/removeTitle/) | Optimization may affect accessibility | Review optimizer settings and output |
| [IBM Plex](https://github.com/IBM/plex) | Open Font License, source files and formats | Self-host the chosen UI fonts and include notices |
| [Source Serif](https://github.com/adobe-fonts/source-serif) | Editable/open font project | Editorial typeface candidate; preserve its license |
| [mirt](https://cran.r-project.org/web/packages/mirt/index.html), [method paper](https://www.jstatsoft.org/article/view/v048i06) | IRT and item/testlet/multiple-group modeling | Optional offline analysis, not a homegrown fitting engine |
| [lavaan](https://lavaan.ugent.be/) | Structural equation modeling | Optional factor-structure analysis |
| [cNORM](https://www.psychometrica.de/cNorm.html) | Continuous norming methods | Only after obtaining suitable reference data |
| [Supabase pricing](https://supabase.com/pricing), [pausing](https://supabase.com/docs/guides/platform/free-project-pausing) | A limited free service can pause | Optional collector must tolerate unavailability; never promise unlimited free research hosting |
| [European Commission GDPR principles](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en) | Purpose limitation, minimization, transparency, privacy by design | Local-first launch and separately specified optional collection |
| [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) | Hosting has its own data processing | Avoid claiming that no server ever receives connection data |
| [Apache 2.0](https://opensource.org/license/apache-2.0) | Permissive software license including patent terms | Proposed license for original code; third-party notices remain separate |

## 14. Resource options and recommendation

| Approach | Advantage | Main limitation | Recommendation |
| --- | --- | --- | --- |
| Publish a WAIS copy | Familiar name | Proprietary content and incompatible administration | Reject |
| Rebrand OpenPsychometrics | Existing experience | License conditions; inherited limitations; no new validation | Study, do not clone |
| Use an unchanged, explicitly reusable research instrument | Existing evidence for that instrument | Narrow coverage and population/administration limits | Evaluate only with exact provenance |
| Build original items using established paradigms | Full design and licensing control | No empirical calibration at the outset | Main product route; descriptive launch scores |
| Generate unlimited new puzzles | Large supply | Unknown difficulty and equivalence | Authoring aid only; freeze and review deployed instances |
| Build a statistically calibrated international IQ battery | Stronger possible interpretation | Requires real evidence, sampling resources, and competence | Conditional long-term program, not a funded commitment |

The no-budget route is not to invent a cheaper norming formula. It is to deliver excellent software and content while limiting score interpretation to what the available evidence supports.

## 15. Open questions to revisit with evidence

- Which proposed tasks provide useful independent information in this implementation?
- Does English verbal performance belong in a common score across the intended language backgrounds?
- Are touch and keyboard results comparable for each particular task?
- What is the actual distribution of completion time, fatigue, errors, and abandonment?
- Which item families show local dependence, ambiguous solutions, or exposure effects?
- What score range has enough precision to report meaningfully?
- Can a reference cohort be defined and supported at all under the actual resources?

These are research questions, not configuration values that can be settled through aesthetics or code review.
