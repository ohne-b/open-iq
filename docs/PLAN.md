# Open IQ: master plan

Research date: 20 September 2026. Status: proposed implementation plan, incorporating the owner's audience and resource decisions.

## 1. The product

Build **one carefully administered cognitive assessment**, with ten subtests across five proposed areas, a coherent beginning-to-end experience, and a substantial explanation of the results and methods. The quality should come from the items, administration, accessibility, transparency, and engineering—not from the number of widgets on the website.

The initial experience should take roughly **50–65 minutes of active work**, plus instructions and optional breaks. This is a design estimate to investigate, not an empirically established completion time. Power tasks will not force users to finish in that window. A complete visit may take 65–85 minutes or longer.

The interface should feel like a contemporary publication about measurement: strong typography, orderly diagrams, restrained color, and direct language. The assessment itself should be even quieter than the public pages.

## 2. The central constraint

The owner wants an international English-language test and cannot assume paid recruitment or a professional research team. Treat those as actual constraints, not costs hidden in a later milestone.

This permits a polished, openly specified assessment. It does **not** establish a representative international reference population or prove that an invented score estimates clinical IQ. The [Testing Standards](https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf) connect score interpretation to evidence for the particular intended use. The project therefore has two independent release tracks:

1. **Product track, fully buildable now:** original tasks, consistent administration, local recovery, clear task results, editable assets, reproducible scoring, public documentation.
2. **Evidence track, conditional on real data and appropriate expertise becoming available:** item analysis, score precision, comparison studies, cross-group comparability, and defensible norms.

Finishing the product track does not automatically complete the evidence track. If no response collection or external collaboration ever becomes possible, the project remains a useful, complete experimental assessment with descriptive results. It does not need to pretend to be a validated IQ instrument to be worth building.

## 3. Decisions

| Topic | Decision |
| --- | --- |
| Product identity | One test, called Open IQ; launch subtitle: “An open cognitive assessment” |
| Launch claim | Experimental; results describe performance on the included tasks |
| Audience | Adults 18+, comfortable reading English, internationally accessible |
| Main instrument | Ten candidate subtests; the five areas are a content blueprint, not a confirmed factor structure |
| Launch form | One immutable, fixed form with fixed order and specified administration |
| Launch results | Subtest accuracy/counts, recall measures, speed-task performance, completion conditions, and downloadable report |
| IQ score at launch | None without applicable evidence and norms; no arbitrary conversion into 100/15 units |
| Comparison percentiles | Disabled initially; later possible only against an explicitly named, frozen volunteer cohort |
| Adaptive testing | A later research-dependent option, not an initial feature |
| Devices | Responsive public site; desktop/laptop is the initial reference administration; touch is separately identified |
| Data | Local by default; no required account and no automatic response uploads |
| Graphics | Original SVG primitives, original diagram sources, deterministic generation, versioned stimulus manifests |
| Hosting | GitHub Pages; all ordinary testing and scoring run in the browser |
| Architecture | One modular application, not a collection of services or packages |
| Research collection | Optional later capability; does not hold the free assessment or results hostage |

“One test” allows alternate forms and item revisions in future releases, but these remain versions of the same assessment. Practice examples are part of onboarding, not a separate catalogue of games.

## 4. What “better than OpenPsychometrics” means

OpenPsychometrics is a useful benchmark for free access, public explanations, and interest in research. Its [FSIQ introduction](https://openpsychometrics.org/tests/FSIQ/) describes six sections and a short completion target. Our scope is intentionally deeper, but length is not proof of accuracy.

| Improvement | Concrete outcome |
| --- | --- |
| Administration | Documented instructions, practice, interruption handling, fixed form versions, input mode records |
| Measurement honesty | Evidence status is visible; no unsupported intelligence labels or borrowed norms |
| Content | Multiple task families; explicit rule and distractor specifications; independent review where available |
| Results | Explanations of what was measured, what influenced the session, and what cannot be inferred |
| Design | Original vector artwork, distinctive typography, polished keyboard and mobile support |
| Maintenance | A contributor can change an item without changing navigation or scoring infrastructure |
| Reproducibility | Every report identifies its form, item revisions, scoring version, and reference data if any |
| Privacy | No login barrier, no result paywall, local data controls, optional research participation |

Do not market the new site as scientifically more accurate than OpenPsychometrics until a suitable comparison actually demonstrates that. We can demonstrate better interaction, documentation, and engineering much earlier.

## 5. Proposed test at a glance

| Area | Subtests | Main interpretation at launch |
| --- | --- | --- |
| Abstract and quantitative reasoning | Matrix rules; number relations | Accuracy on these reasoning tasks |
| Spatial reasoning | Mental rotation; paper folding | Accuracy on spatial transformations |
| English verbal knowledge and reasoning | Word meaning; verbal relationships | Performance in English, influenced by language exposure |
| Working memory | Sequence reordering; spatial complex span | Recall/manipulation under the stated procedure |
| Visual processing speed | Symbol comparison; visual search | Correct responses and errors within fixed time blocks |

Detailed counts, timing proposals, scoring units, and confounds are in [TEST-SPEC.md](TEST-SPEC.md). These tasks do not cover every facet of cognition, and ten subtests do not automatically yield ten independent abilities.

## 6. The scientific strategy

Use the literature to choose constructs and task paradigms. Do not transfer the validity of a published instrument onto newly written items. Preserve that distinction in the methods pages.

Prefer broad task sampling, understandable instructions, well-constructed distractors, and reliable software to excessively difficult puzzles. Do not optimize for “IQ 180,” social-media virality, or flattering scores. A hard item can be confusing rather than informative.

Original item creation avoids proprietary test copying and supports an actually open project. It also means **we start without empirical item calibration**. Public resources such as ICAR and MaRs-IB are valuable references, but their exact assets, licenses, delivery conditions, and available evidence must be assessed individually before reuse. [RESEARCH.md](RESEARCH.md) records significant licensing caveats.

If volunteers later contribute data through an appropriate collection process, start with item diagnostics and clearly bounded cohort descriptions. Public participation is not a representative world sample. Do not use geography, sex, education, or self-reported prior IQ to silently “correct” an individual's result.

## 7. The design strategy

The visual concept is **a modern measurement publication**, not a futuristic brain dashboard. Suggested direction: warm paper background on public pages, near-black ink, a small amount of blue, generous editorial headings, sharp dividers, and original geometric diagrams.

Measurement screens use a stable white stimulus surface, consistent dimensions, and restrained controls. Page decoration must never become a cue to the correct response. Theme, animation, and layout changes count as measurement changes when they alter a stimulus.

See [DESIGN.md](DESIGN.md) for the original proposal and [IMPLEMENTATION.md](IMPLEMENTATION.md) for the delivered interface and editable task graphics.

## 8. The engineering strategy

Keep the agreed frontend stack. Add tools only for a specific requirement:

- **jsPsych:** trial scheduling and response capture, isolated from React's ownership of the page shell.
- **Zod:** validation of content, imported sessions, and exported scoring manifests.
- **IndexedDB, through `idb`:** structured session checkpoints; `localStorage` remains suitable for small preferences.
- **SVG + Inkscape + SVGO:** editable source assets and reviewed production exports.
- **R, optionally:** later analysis using established packages; never a runtime requirement for the site.

These are proposed additions, not installed packages. A small integration spike must demonstrate that the trial runtime, accessibility requirements, and recovery model work before building all ten tasks.

GitHub Pages can serve the finished frontend, but it is not a private research database. [GitHub's description](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) confirms its static hosting model. Shared data collection would be a separately operated service with its own responsibilities.

## 9. Build order

1. Freeze the intended uses, score labels, task blueprint, and original visual direction.
2. Build one complete vertical slice: instructions → practice → a short original matrix block → raw results → reload/export/import.
3. Prove memory and speed timing, interruption handling, and accessible controls.
4. Build the remaining task families and review the content.
5. Complete the report, methodology, provenance, local data controls, and contributor workflow.
6. Audit accessibility, browser behavior, content, scoring, and deployment under `/open-iq/`.
7. Publish the complete experimental assessment with its actual evidence status.
8. Pursue optional evidence improvements only as data and capability become available.

The acceptance criteria and effort estimates are in [DELIVERY.md](DELIVERY.md). No calendar deadline can promise psychological validation.

## 10. What is deliberately not promised

- A WAIS-IV clone, WAIS-equivalent results, clinical diagnosis, or eligibility for any institution.
- A universal IQ scale for all English speakers, irrespective of country, education, language history, age, or device.
- Exact intelligence estimates from an uncalibrated question bank.
- Cheat-proof unsupervised testing or hidden answer keys in a public client application.
- A generated infinite item bank whose variants all share the same difficulty.
- A representative norm sample or professional review that nobody has agreed to supply.

The plan is ambitious about the things we can build and explicit about the things that require evidence. That is the foundation for eventually making stronger claims.
