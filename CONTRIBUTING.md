# Contributing

Use Node 24, run `npm ci`, then `npm run dev`. Keep changes focused and run `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` before proposing changes. Format with `npm run format`.

Use Conventional Commits for every new commit: `type(scope): description`, for example `fix(ui): center the start screen` or `docs: update setup instructions`.

Commit completed, verified changes in separate logical units as work progresses. Keep reference data, application changes and documentation reviewable instead of bundling an entire task into one final commit.

## Content

The current ICAR form uses public-domain content with documented provenance in [docs/ICAR.md](docs/ICAR.md). Preserve its wording, keys and answer-relevant geometry. For other content, write original items or document permission for reuse; do not copy or paraphrase proprietary questions, diagrams, administration scripts, norms or scoring tables. Record the intended rule, correct answer and a useful explanation. Distractors must be distinct and incorrect under that rule. Have another person review ambiguity and English usage before claiming editorial review.

Puzzle graphics belong in typed geometry and SVG components, not screenshots. Preserve coordinate systems, line widths, orientation and contrast. A changed diagram can change the task even when the answer key stays the same.

The form is fixed. Every scored-content or scoring change requires a form-version decision, changelog entry and scoring/geometry checks. Do not silently rewrite the interpretation of saved data. New forms need explicit migration or separate scoring support; rejecting an unsupported version is preferable to rescoring it incorrectly.

## Interface and privacy

Keep the assessment as the primary activity. Use semantic native controls, visible focus, readable contrast, and simple words. Use the supplied SVG logo in `public/brand/open-iq.svg` and `@mdi/react` with named imports from `@mdi/js` for interface icons. Keep the home screen to its title and actions, with one About link. Do not add marketing descriptions, feature strips, decorative badges, generated imagery, tracking, user accounts or network response collection.

Never include personal response exports in public issues or test fixtures. Synthetic fixtures should identify the state or behavior they test. Local exports are editable records, not verified credentials.

## Measurement claims

Software correctness is not psychometric validation. Do not introduce an IQ conversion, percentile, age correction, reliability estimate or confidence interval without documented evidence for that interpretation and population. New validation work needs its own protocol, consent, data governance and independent review.

The ICAR conversion is descriptive standardization within a specified adult volunteer cohort. Keep that qualification alongside displayed scores; do not relabel it population IQ. Run `npm run reference:check` when changing reference data or its calculation. Never substitute synthetic observations for human evidence. Updating the cohort or conversion requires a version decision and documentation, even if the question bank is unchanged.

Contributions use the licenses described in NOTICE. Include provenance and retain upstream notices for any third-party material.
