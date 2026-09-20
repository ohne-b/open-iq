<p align="center">
  <img src="public/brand/open-iq.svg" width="128" alt="Open IQ logo">
</p>

<h1 align="center">Open IQ</h1>

<p align="center">An open-source cognitive assessment.</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache_2.0-345a48" alt="License: Apache 2.0"></a>
</p>

<p align="center">
  <a href="https://ohne-b.github.io/open-iq/">Take the assessment</a>
</p>

**Current form: ICAR-16, with four sections and study-reference results.** The site uses published public-domain questions, redrawn SVG diagrams, local progress, section and overall estimates, JSON export and print reports. Scores use a documented cohort of 3,480 adult volunteers; they are not age-adjusted population IQ scores. This adapted presentation has not been independently validated. See [the method and sources](docs/ICAR.md).

## Develop

Use Node 24 and npm (the lockfile is committed).

```sh
npm ci
npm run dev
```

Open the printed URL, including `/open-iq/`. Production is a static build:

```sh
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

`npm run format` formats application code, tests and configuration. `npm run format:check` runs in CI. Browser regression checks cover desktop Chromium and mobile Chromium emulation. Real-device timing equivalence and psychometric validity are not established by software tests.

## What ships

- The public ICAR Sample Test: four questions each in verbal reasoning, letter series, matrix reasoning and three-dimensional rotation.
- Overall and section scores on a 100/15 study-reference scale, empirical study percentiles and raw totals. Partial attempts receive estimates only for finished sections.
- Fixed form and order, untimed questions, forward-only responses and no answer feedback during scored tasks.
- Existing ten-section attempts retain their original questions, memory/speed procedures and raw reports; they are never given ICAR-based scores.
- Local IndexedDB storage; resume, partial reports, downloadable records and explicit deletion. A browser lock prevents simultaneous administration of one attempt in two tabs.
- Responsive, keyboard-operable controls; editable SVG diagrams generated from typed geometry. The supplied Open IQ logo and Material Design Icons are self-hosted.
- A single static site with no accounts, answer submission, tracking, runtime API or external fonts.

## Repository map

```text
src/
  App.tsx                 Routes, local records, preparation and home
  domain.ts               Form metadata and validated record schemas
  session.ts              State transitions, recovery and record validation
  scoring.ts              Pure task scoring; no population conversions
  icar-scoring.ts         Study-reference standard scores and percentiles
  storage.ts              IndexedDB persistence and JSON downloads
  report-tool.ts          Optional, read-only WebMCP report access
  content/
    icar.ts               Public-domain items, keys and typed SVG parameters
    icar-reference.json   Aggregate human reference distributions and provenance
    verbal.ts             Original-form verbal and numerical items
    visual.ts             Original-form matrix, cube and folding geometry
    index.ts              Versioned banks and original memory/speed stimuli
  components/
    Assessment.tsx        Instructions, practice, sections and breaks
    ChoiceQuestion.tsx    Choice and skip controls
    MemoryTask.tsx         Digit recall and spatial complex span
    SpeedTask.tsx          Deadline-based speed rounds
    Stimulus.tsx           SVG and geometry renderers
    IcarStimulus.tsx       ICAR matrix and marked-cube SVGs
    Results.tsx            Versioned task report, export and print
    IcarResults.tsx        Overall and section study-reference report
    InfoPages.tsx          Methods, privacy and accessibility
  styles.css              Shared interface and print styles
  *.test.ts               Content, transitions, scoring and record checks
tests/                    Browser regression flows
scripts/                  Reproducible reference-data calculation
public/brand/             Supplied logo, also used as the favicon
public/licenses/          Font and icon license notices
.github/workflows/        Checks and GitHub Pages deployment
docs/                     Research, original plan and release decisions
```

Keep scoring and content independent of React. Update `FORM_VERSION` when changing scored items, answer keys, instructions that alter the task, timing, or scoring. Old response files must not silently acquire a new interpretation. See [contribution notes](CONTRIBUTING.md) and [implementation decisions](docs/IMPLEMENTATION.md).

`npm run reference:check` downloads the pinned CC0 source file into an ignored cache, verifies its checksum, recomputes the adult cohort aggregates and compares them with the committed reference. No participant rows are shipped. Builds use the committed aggregate JSON and need no research-data download.

## GitHub Pages

The workflow checks the code and browser flows, builds `dist`, and deploys `main`. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Pull requests run checks without publishing. The workflow derives the base path from the repository name; `BASE_PATH=/` supports a root/custom-domain build.

Hash routes work on Pages without a custom 404 redirect. Every runtime asset uses the Vite base path. No secrets or backend are required.

## Start here

Start with [ICAR content and scoring](docs/ICAR.md) and [implementation decisions](docs/IMPLEMENTATION.md) for the shipped site. The documents below preserve the original, broader plan and its research; their ten-section proposals do not describe the current ICAR form.

| Document | What it settles |
| --- | --- |
| [Master plan](docs/PLAN.md) | Scope, priorities, decisions, and what can actually ship |
| [Research and sources](docs/RESEARCH.md) | Evidence, competing approaches, licensing findings, and source limitations |
| [Assessment specification](docs/TEST-SPEC.md) | Ten proposed subtests, item authoring, administration, and international use |
| [Scoring and evidence](docs/SCORING-AND-EVIDENCE.md) | Launch scoring, calibration, uncertainty, validation, and release gates |
| [Repository and architecture](docs/ARCHITECTURE.md) | Directory structure, module boundaries, contracts, persistence, deployment, and testing |
| [Design and graphics](docs/DESIGN.md) | Visual identity, page layouts, accessibility, and editable SVG production |
| [Delivery and operations](docs/DELIVERY.md) | Work packages, acceptance criteria, maintenance, privacy, and optional research collection |

## Fixed constraints

- One test with multiple sections; not a directory of unrelated quizzes.
- React, TypeScript, Vite, Tailwind CSS, React Router, npm, GitHub Actions, and GitHub Pages.
- Vitest, React Testing Library, Playwright, ESLint, and Prettier.
- International English-speaking adults from the beginning.
- No assumed budget for participant recruitment or professional psychometric collaborators.
- Editable vector graphics and a deliberately designed interface; no generated bitmap puzzle art.

The project distinguishes **correctly scoring a task** from **validly interpreting that score as IQ**. The current reference permits a descriptive comparison with a specific research cohort; it does not establish population IQ accuracy or international norms.

## License and limits

Application code is licensed under [Apache-2.0](LICENSE). ICAR source items are public domain and the reference dataset is CC0. Original Open IQ content and documentation are [CC BY 4.0](CONTENT-LICENSE); see [NOTICE](NOTICE) for scope and attribution. DM Sans retains its SIL Open Font License. The supplied logo remains unchanged.

This adaptation was implemented with AI assistance and has not received independent psychometric validation. Automated checks establish software properties, not equivalent difficulty or fairness. It is not WAIS and includes no commercial test content or norm tables. Do not use these scores for diagnosis, selection, credentials, or high-stakes decisions.
