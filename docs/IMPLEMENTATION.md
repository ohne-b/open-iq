# Form 1.0 implementation

The original planning documents are research and design proposals. This file records the delivered software and deliberate decisions that supersede those proposals.

## Product

One assessment, ten sections, 106 choice items, 22 memory trials and four timed rounds. Every section has separate practice. Users can save, leave, resume, inspect partial results, download their response record, delete individual records, and print a report.

The home screen is a centered title and start action, with saved attempts where relevant. It has one About link and no introductory marketing copy or feature strip. DM Sans, an off-white ground and a single dark green action color replace the larger editorial direction. The owner-supplied SVG logo is used unchanged in the header, favicon and README; interface icons use `@mdi/react` and named paths from `@mdi/js`. The earlier design proposal is historical planning material and is not the site's current visual specification.

## Architecture

React, TypeScript, Vite, Tailwind, React Router and npm. A single application with small independent modules is sufficient; there is no monorepo, plugin system, state-machine library or server. Native radios, buttons, fieldsets, details and dialogs provide the controls.

Scoring, content and state transitions have no React dependency. Zod validates saved record structure; semantic validation also checks item identity/order, progress, duplicate responses, timing and completion. Scores are recomputed from responses rather than accepted from an export.

IndexedDB stores complete response records by random attempt ID. Writes are serialized. Records persist until explicitly deleted or removed by the browser; there is no automatic expiry. Browser locks protect an active assessment across tabs. Storage failure is visible and allows an in-memory attempt with manual export. Unsupported form versions are rejected. There is no file import interface. Exports are not signed and are not tamper-proof.

## Administration

There is no overall timer. Choice sections are forward-only and use a confirmation before skipping. They reveal no scored-item feedback during the assessment. The answer review is available only after completion.

Sequence recall presents each digit for 800 ms followed by a 200 ms gap. Lengths are 3–8, with backward and ascending order alternating. Spatial memory presents each of 2–6 distinct grid locations for 1,000 ms, followed by a self-paced symmetry judgment. Final recall is self-paced. This procedure must not be described as a standardized clinical administration.

Speed rounds use `performance.now()` deadlines, a 100 ms deadline check, and response-time deadline checks. Responses are accepted only before the deadline. Held keyboard events and same-frame repeated inputs are rejected. A visibility change, large scheduler delay, clock discontinuity, explicit departure or reload marks an affected memory trial/round interrupted. Interrupted speed rounds contribute no timed totals. A recovered sequence is never replayed.

Native browser timing is used instead of adding jsPsych for a small fixed set of task procedures. These are second-scale presentations, not millisecond-equivalent laboratory timing. Browser suspension, rendering latency, hardware differences and touch-versus-keyboard differences remain limitations. Small interruptions below the detection thresholds can go undetected. Interrupted responses kept in memory are recorded when the visibility handler runs; a hard reload may preserve only the interrupted marker, not the unfinished block's individual responses.

## Graphics and items

SVG is rendered directly from typed geometry. Cube objects are checked under all 24 proper rotations; distractors are not rotational equivalents, and each displayed cube has a visible face center. Paper-hole keys are computed by reverse reflection through the actual folds. Matrix options are structurally distinct. These checks do not establish that every item is perceptually unambiguous or well calibrated.

Content was authored with AI assistance. There has been no independent editorial, cultural-fairness or psychometric review. The fixed form and public answer keys make practice effects and coaching unavoidable. Claims of high-stakes security, diagnostic validity, population accuracy or extreme-IQ measurement would be unsupported.

## Results

Raw correct totals for choice sections; positional recall and exact sequences for memory; separate symmetry totals; correct/error counts in complete timed rounds. No overall score, invented norms, percentile, confidence band, clinical labels or fabricated reliability estimate. The reference population and sampling plan in the research documents remain future work requiring actual evidence.

## Accessibility and checks

Semantic controls, focus indication, direct keyboard equivalents, reduced-motion handling, responsive layouts and print styles are implemented. Visual reasoning items are not equivalent for nonvisual use; this is explained on the accessibility page. No blanket accessibility-conformance or device-equivalence claim is made.

Vitest checks bank completeness, practice separation, geometry, answer keys, state transitions, malformed records, missingness, raw scoring, keyboard recall and timing deadlines. Playwright regression flows cover practice-to-assessment, saved progress, reload recovery, data export, deletion and cross-tab locks in desktop/mobile Chromium. These are functional software checks, not a clinical study or real-device timing calibration.

The optional WebMCP tool exposes only the currently visible results. It cannot start, answer, submit, delete or modify an assessment. Its registration/validation/cleanup contract is unit-tested with a registry stub. A live WebMCP browser integration has not been verified; unsupported browsers simply omit the tool.

## Deployment

Static GitHub Pages build with a repository-aware base path, hash routes and no 404 workaround. Runtime fonts and graphics are self-hosted. Actions are pinned to commit SHAs. Main-branch checks precede deployment; pull requests cannot publish. No participant data endpoint, telemetry, research opt-in, password system or secrets are required.
