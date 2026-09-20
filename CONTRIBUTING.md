# Contributing

Use Node 24, run `npm ci`, then `npm run dev`. Keep changes focused and run `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` before proposing changes. Format with `npm run format`.

## Content

Write original items; do not copy or paraphrase proprietary assessment questions, diagrams, administration scripts, norms or scoring tables. Record the intended rule, correct answer and a useful explanation. Distractors must be distinct, plausible, and definitely incorrect under that rule. Have another person review ambiguity and English usage before claiming editorial review.

Puzzle graphics belong in typed geometry and SVG components, not screenshots. Preserve coordinate systems, line widths, orientation and contrast. A changed diagram can change the task even when the answer key stays the same.

The form is fixed. Every scored-content or scoring change requires a form-version decision, changelog entry and scoring/geometry checks. Do not silently rewrite the interpretation of saved data. New forms need explicit migration or separate scoring support; rejecting an unsupported version is preferable to rescoring it incorrectly.

## Interface and privacy

Keep the assessment as the primary activity. Use semantic native controls, visible focus, readable contrast, and simple words. Branding is intentionally limited to the project name until the owner supplies a logo. Do not add decorative badges, generated imagery, tracking, user accounts or network response collection.

Never include personal response exports in public issues or test fixtures. Synthetic fixtures should identify the state or behavior they test. Local exports are editable records, not verified credentials.

## Measurement claims

Software correctness is not psychometric validation. Do not introduce an IQ conversion, percentile, age correction, reliability estimate or confidence interval without documented evidence for that interpretation and population. New validation work needs its own protocol, consent, data governance and independent review.

Contributions use the licenses described in NOTICE. Include provenance and retain upstream notices for any third-party material.
