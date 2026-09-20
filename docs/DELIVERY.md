# Delivery, operations, and contribution plan

## 1. Resource assumptions

The owner selected international English-speaking adults and said paid recruitment/professional research resources are unavailable. The implementation therefore has a **complete no-research-dependency release**. Volunteer data collection and external scientific collaboration are optional future branches, not promises or prerequisites hidden behind the launch button.

Required resources: development time, content-writing/review time, ordinary computers for testing, a public GitHub repository, and free/open tools. A custom domain is optional. No paid fonts, asset subscriptions, AI image service, authentication provider, or hosted database is required for the core release.

The effort ranges below are planning estimates for experienced development and careful content work, not delivery commitments. They total roughly **320–580 focused hours**, or about **11–20 weeks at 30 hours/week**, excluding empirical validation and any unavailable devices/reviewers. Automation may reduce implementation time; it does not remove item review or create evidence.

## 2. Milestones and acceptance criteria

| Phase | Scope | Approximate effort | Exit condition |
| --- | --- | --- | --- |
| P0 | Freeze product/claim policy, candidate form, visual direction, and license choices | 8–16 h | A single coherent specification with no unsupported IQ promise |
| P1 | Repo foundation and complete matrix vertical slice | 40–70 h | Practice → task → raw result → reload/export/import works under `/open-iq/` |
| P2 | Memory and speed runtime prototypes | 50–90 h | Timing, interruption, input, cleanup, and recovery rules proven on documented devices |
| P3 | Remaining tasks and original content | 100–180 h | Ten subtests, separate practice, all operational items technically/content reviewed |
| P4 | Full public site, results, methods, source records, print report | 40–70 h | Complete polished experience with accurate copy and usable local data controls |
| P5 | Accessibility, content, browser, privacy, security, and release review | 60–110 h | Blocking defects fixed; known limits documented; scored flow reproducible |
| P6 | Experimental launch, contributor guide, operational handover | 20–40 h | Reproducible deployment/rollback and a clearly labeled E0 public release |

Content work can overlap technical implementation after the schemas and stimulus rules stabilize. Do not author the entire bank against an untested renderer.

## 3. First implementation work packages

These can become GitHub issues later. This planning task does not create a remote repository, send messages, or publish a site.

| ID | Work package | Depends on | Acceptance detail |
| --- | --- | --- | --- |
| OIQ-01 | Project foundation | P0 decisions | Strict TS, pinned toolchain, lint/format/test/build commands, Pages base path |
| OIQ-02 | Visual tokens and public/assessment layouts | OIQ-01 | Reviewed desktop/mobile layouts with production font notices |
| OIQ-03 | Content/form schemas and validator | OIQ-01 | Invalid answers, missing provenance, duplicates, and draft operational items rejected |
| OIQ-04 | Original SVG primitives and matrix renderer | OIQ-03 | Deterministic output, geometry checks, accessible identification |
| OIQ-05 | Session transitions and jsPsych bridge | OIQ-03 | No duplicate run under remount; proper cleanup and normalized results |
| OIQ-06 | IndexedDB and session export/import | OIQ-05 | Reload, failed writes, version mismatch, and round-trip tests |
| OIQ-07 | Matrix vertical slice | OIQ-02–06 | Real practice and reviewed example items produce correct raw results |
| OIQ-08 | Memory trial prototype | OIQ-05–07 | Exposure/recall separated; no replay as unseen; interruption preserves evidence |
| OIQ-09 | Timed response prototype | OIQ-05–07 | Deadline behavior, duplicate events, tab hiding, and input-mode handling checked |
| OIQ-10 | Contributor item preview | OIQ-03–04 | Local gallery shows prompts, rationale, solution, revisions, and source geometry |
| OIQ-11 | Complete task families and form | OIQ-08–10 | All ten task procedures implemented, reviewed, and documented |
| OIQ-12 | Evidence-gated report | OIQ-07, OIQ-11 | E0 cannot display percentile/IQ; partial sessions remain useful |
| OIQ-13 | Methods/privacy/accessibility pages | OIQ-12 | Copy matches real behavior, includes references and actual limits |
| OIQ-14 | Print/export and local deletion | OIQ-06, OIQ-12 | Accessible print, no network upload, explicit deletion scope |
| OIQ-15 | Release audit and Pages publication workflow | All preceding | Passing checks, immutable form manifest, rollback rehearsal |

The first milestone worth reviewing visually is OIQ-07. It should already look like the intended product, so the remaining tasks inherit a coherent interaction language.

## 4. Definition of a complete experimental release

### Content

- All ten proposed subtests work or the published blueprint explicitly records a justified revision.
- The operational form is frozen and references only approved items.
- Each item has an answer/rubric, rationale, provenance, review record, and exact stimulus version.
- Practice and scored items are separated, including obvious near-clones.
- Content passes ambiguity, geometry, and option-quality checks.

### Product

- The full journey works without login, payment, or research consent.
- The public site and results are responsive; task-specific device limits are stated before affected tasks.
- Keyboard interaction, focus, loading, error, partial-result, interruption, and storage-failure states are deliberate.
- Results report actual task measures and experimental status prominently.
- Local save/export/import/delete and print have been verified.
- There is no generated bitmap puzzle art or generic template content masquerading as research.

### Engineering

- Meaningful tests cover scoring, timing boundaries, geometry, state transitions, storage, and evidence gates.
- Production build and direct route refresh work under the repository base path.
- Assets/fonts needed for a block are loaded before it starts.
- Version manifests make reports reproducible.
- No participant data or secret enters the public build/repository.
- A previous tested release can be redeployed without mixing incompatible scoring/content.

### Evidence

- The evidence status reflects what actually exists: initially E0.
- The website does not claim representative norms, clinical equivalence, or independent validation without them.
- Any examples in documentation are labeled synthetic/illustrative.
- Any untested device, language subgroup, or access mode is identified accurately.

## 5. Browser and device review matrix

Automate Chromium, Firefox, and WebKit using a short synthetic form. Manually check available real devices and record their OS, browser version, input method, viewport/zoom, and date.

Priority combinations: Windows Chrome/Edge/Firefox with keyboard; macOS Safari if a device is available; Android Chrome and iOS Safari for public pages, result viewing, and separately identified touch tasks. Never pretend an unavailable real-device check was completed because a screenshot emulator ran.

Test reduced motion, keyboard-only operation, 200% zoom, long instructions, narrow viewports, large system text, slow loading, a refresh, tab hiding, sleep/resume, another tab, storage failure, and offline-after-preload behavior.

If timing cannot be physically measured with specialist equipment, document that limitation and choose forgiving tasks/exposure durations. No claim of laboratory-grade millisecond calibration follows from a successful automated timing test.

## 6. Privacy for the actual launch

The launch collects no response dataset on our own backend. The browser stores the attempt locally, and the user controls export and deletion. The privacy page still explains the hosting provider's connection-data processing; [GitHub publishes its own privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

Avoid third-party analytics, session replay, tracking pixels, remote fonts, embedded social widgets, and public result URLs. Results and answers never become query parameters, URL fragments, page titles, or referrer data. Search engines should not index private report states; no private score is included in static HTML.

Proposed local retention: keep an active attempt for up to 30 days and remove expired attempts when the application next runs; saved reports remain until the user deletes them. Explain that the site cannot erase data while the browser is never opened, and cannot retract copies the user exported. Clearing browser storage also removes local history.

No demographic profile is needed to obtain E0 results. Age eligibility can be a simple adult confirmation. Exact age or background data should only be requested when a specific supported comparison or separately consented study needs it.

Operator disclosures, privacy wording, storage/consent obligations, and any applicable accessibility requirements need to match the actual operator and jurisdictions before publication. This plan is a design specification, not a completed legal compliance assessment. The [European Commission's principles](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en) are a primary reference for minimization and privacy by design.

## 7. Optional later research collector

Add this only if the owner later wants voluntary contributions and someone can actually operate the collection responsibly. Not funding paid recruitment does not automatically authorize collection, nor does it guarantee volunteers.

One feasible candidate is a small Supabase Postgres project with an Edge Function for ingestion, while the website remains on GitHub Pages. Its [free tier is limited](https://supabase.com/pricing) and [can pause](https://supabase.com/docs/guides/platform/free-project-pausing). Recheck availability and terms at implementation. If the service stops, the assessment and local result still work; collection reports unavailability without losing the local report. Do not silently incur paid costs or evade free-tier limits.

### Data flow

`Explicit research opt-in → local preview of contribution → validated ingestion endpoint → private response store → private analysis copy → reviewed aggregate release`

The default is no sharing. Declining has no effect on access, test content, or results. Consent for public release of granular data is separate from private research use; aggregate publication still needs disclosure-risk review.

### Minimum operational design

- Document the specific purpose, controller/operator, contact, legal basis, retention, processors, and withdrawal/deletion process.
- Determine the appropriate ethical review and legal requirements for the proposed study before starting it. Do not label the project institutionally approved without approval.
- Use a random contribution ID and a private deletion capability/token; avoid collecting contact details where unnecessary.
- Keep raw participant data outside GitHub, public Actions artifacts, public issue attachments, and public analytics dashboards.
- Validate schemas, payload size, form IDs, event sequences, and consent version on the server.
- Recompute derived raw scores from the submitted responses. This detects some inconsistencies but cannot prove an honest human took the test.
- Enforce duplicate/idempotency rules, bounded request sizes, and rate limits. CORS is not authentication and does not stop scripted abuse.
- Permit no anonymous database reads or bulk downloads. Privileged keys stay on the server.
- Separate demographics from responses with restricted joins. Store only fields justified by the research question.
- Avoid exact birth date, precise location, clinical records, free-text life history, device fingerprinting, and unnecessary IP retention.
- Use restricted credentials, documented backup/restore, and deletion handling across backups and exports.
- Set finite retention before launch of collection; a candidate is 12 months for identifiable/pseudonymous source records, subject to the actual study and obligations. Do not select a retention period solely because storage is free.
- Share aggregate or synthetic data by default. Small demographic cells and detailed response traces can identify people even when names are absent.

Pseudonymous records are not automatically anonymous. IQ-related records may raise health-data or other sensitive-data questions depending on purpose and context; assess that specifically rather than declaring that either all scores or no scores have a particular legal classification.

If these responsibilities cannot be met, keep collection off. Local-first use remains the complete product.

## 8. Open-source licensing and contributor process

Proposed policy: **Apache-2.0 for original software**, **CC BY 4.0 for original question content, graphics, and documentation**, and original licenses for third-party fonts/assets. This choice favors reuse and clear provenance. Apply actual license files only after confirming contributor ownership and the intended policy.

A free website and an open-source software license are separate choices. Noncommercial restrictions may be acceptable for a particular research asset, but they cannot be quietly absorbed into an unrestricted item bank. Exclude incompatible assets or keep their status explicit and honor their terms. Prefer original content for the main distributable form.

Contribution routes:

1. Software bug/feature: focused PR, tests for behavior, screenshots for visible changes.
2. New item: schema record, original source, solution, distractor rationale, license declaration, preview, and review status.
3. Ambiguous item: reference ID/revision and explanation; public discussion may contain spoilers, labeled accordingly.
4. Accessibility issue: reproduction without requiring a diagnosis or private score.
5. Analysis change: reproducible script, evidence scope, independent check if available, and score-impact report.

Use roles rather than fictitious committee members: application maintainer, content reviewer, design/accessibility reviewer, and evidence reviewer. A solo maintainer may hold multiple roles, but the public record must not describe their own review as independent. Codeowners can expand as real contributors join.

The versioned assessment is not changed merely because a contribution is interesting. Experimental items remain outside the operational form until reviewed. A content change and a norm change require different review paths.

## 9. Release and maintenance policy

Use separate identifiers for app, form, item, renderer, scorer, calibration, and reference release. A cosmetic landing-page fix may only change the app. A changed stimulus or timing rule changes the applicable measurement artifact too.

Routine maintenance proposals:

- Triage correctness/accessibility reports regularly; fix score-affecting bugs promptly.
- Review dependency updates in batches and run the relevant regressions.
- Inspect hosting limits and build size as traffic increases.
- Recheck external references and license records before redistributing new material.
- Revisit evidence claims at each substantive assessment release.
- Preserve supported old manifests/scorers and explain their support window.

For a scoring defect: reproduce it, determine affected versions, fix the shared scorer, add an independent regression fixture, publish an erratum, and make an explicitly revised local report available. Do not silently alter previously issued results or claim unaffected precision without checking.

For a broken item: retire or correct it in a new form revision. Decide and document whether old scores can be validly recomputed; deletion of an item can change comparability.

For a security incident in an optional collector: disable affected collection, preserve evidence securely, investigate access, and follow the actual applicable notification obligations. The public assessment can remain available if it is unaffected.

## 10. Risk register

| Risk | Consequence | Planned control | Residual limit |
| --- | --- | --- | --- |
| No participant evidence | Unsupported IQ claims | E0 launch; claims enforced in code | Cannot prove accurate IQ through engineering |
| International language variation | Misinterpreted verbal score | Plain English, explicit labels, later comparability work | Not culture/language invariant by default |
| Ambiguous/dubious original items | Scores reflect guessing the author | Written rules, independent solutions where possible, review | Human ambiguity cannot be fully proved away |
| Timing/device differences | Speed/memory results vary by setup | Preload, stable runtime, recorded mode, interruption policy | Unknown hardware latency remains |
| Public answers and coaching | Prior exposure contaminates results | Disclosure, fixed versions, separate practice, later alternate forms | Unsupervised open testing is not cheat-proof |
| Attrition/fatigue | Late tasks reflect burden | Interleaving, breaks, time studies if possible | More items can worsen rather than improve measurement |
| License ambiguity | Cannot redistribute assets | Original content and artifact-level provenance | External resources may remain unusable |
| Maintainer overload | Stale content or unsupported claims | One deployable app, staged delivery, explicit scope | Volunteer capacity is finite |
| Local storage loss | Lost progress | Checkpoints, visible status, export, failure handling | Browser storage is not permanent |
| Volunteer sample bias | False population percentiles | Cohort-specific reporting; no automatic global norms | Weighting does not guarantee representativeness |
| Optional free backend outage | Lost uploads | Local results independent, bounded retry, export | Free hosting is not an SLA |

## 11. Measures of success

With no automatic telemetry, do not invent product statistics. Measure build size, automated checks, reproducibility, content-review completion, supported-browser results, and documented accessibility findings locally. Gather user feedback only through clearly voluntary channels.

If proper optional data collection becomes available, useful outcomes include instruction comprehension, completion/abandonment patterns, interruption rates, item quality, score precision, and supported comparisons. “Average IQ rises” and “users share high scores” are not success criteria.

The end of the product plan is a coherent, polished, maintainable experimental assessment. The end of a future scientific program would require evidence that does not yet exist. Keep those two facts visible throughout development.
