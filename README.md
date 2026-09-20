# Open IQ

One substantial, open cognitive assessment for international English-speaking adults.

**Status: working assessment, form 1.0. Unvalidated and unnormed.** The site includes ten sections, practice, local progress, task-level results, JSON import/export and print reports. It does not produce IQ scores, percentiles or clinical interpretations.

[Take the assessment](https://ohne-b.github.io/open-iq/)

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

- Six choice sections: 106 original items covering matrices, words, rotation, number sequences, analogies and folding.
- Two memory sections: 12 sequence-reordering trials and 10 spatial complex-span trials.
- Two speed sections: two 90-second comparison rounds and two 60-second search rounds.
- Separate practice before each section. Fixed form and order, forward-only responses, no answer feedback during scored tasks.
- Local IndexedDB storage; resume, partial reports, downloadable records, validated imports, and explicit deletion. A browser lock prevents simultaneous administration of one attempt in two tabs.
- Responsive, keyboard-operable controls; editable SVG diagrams generated from typed geometry. No generated branding or bitmap test art.
- A single static site with no accounts, answer submission, tracking, runtime API or external fonts.

## Repository map

```text
src/
  App.tsx                 Routes, local records, preparation and home
  domain.ts               Form metadata and validated record schemas
  session.ts              State transitions, recovery and import validation
  scoring.ts              Pure task scoring; no population conversions
  storage.ts              IndexedDB persistence and JSON downloads
  report-tool.ts          Optional, read-only WebMCP report access
  content/
    verbal.ts             Original verbal and numerical items
    visual.ts             Matrix, cube and folding geometry and keys
    index.ts              Fixed memory and speed stimuli
  components/
    Assessment.tsx        Instructions, practice, sections and breaks
    ChoiceQuestion.tsx    Choice and skip controls
    MemoryTask.tsx         Digit recall and spatial complex span
    SpeedTask.tsx          Deadline-based speed rounds
    Stimulus.tsx           SVG and geometry renderers
    Results.tsx            Task report, export and print
    InfoPages.tsx          Methods, privacy and accessibility
  styles.css              Shared interface and print styles
  *.test.ts               Content, transitions, scoring and import checks
tests/                    Browser regression flows
public/licenses/          Self-hosted font license
.github/workflows/        Checks and GitHub Pages deployment
docs/                     Research, original plan and release decisions
```

Keep scoring and content independent of React. Update `FORM_VERSION` when changing scored items, answer keys, instructions that alter the task, timing, or scoring. Old response files must not silently acquire a new interpretation. See [contribution notes](CONTRIBUTING.md) and [implementation decisions](docs/IMPLEMENTATION.md).

## GitHub Pages

The workflow checks the code and browser flows, builds `dist`, and deploys `main`. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Pull requests run checks without publishing. The workflow derives the base path from the repository name; `BASE_PATH=/` supports a root/custom-domain build.

Hash routes work on Pages without a custom 404 redirect. Every runtime asset uses the Vite base path. No secrets or backend are required.

## Start here

The research below informed the implementation. These documents preserve the original, broader plan; [implementation decisions](docs/IMPLEMENTATION.md) describe what the shipped code actually does.

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

The plan distinguishes **correctly scoring a task** from **validly interpreting that score as IQ**. Under the present resource constraints, the first complete release reports task performance. It must not claim population IQ accuracy that has not been established.

## License and limits

Application code is licensed under [Apache-2.0](LICENSE). Original item content and documentation are [CC BY 4.0](CONTENT-LICENSE); see [NOTICE](NOTICE) for scope and attribution. DM Sans retains its SIL Open Font License. The earlier proposed mark and editorial art direction are not used by the site.

This form was authored with AI assistance and has not received an independent psychometric or editorial review. Automated checks establish software properties, not item validity or fairness. It is not WAIS and includes no commercial test content or norm tables. Do not use these scores for diagnosis, selection, credentials, or high-stakes decisions.
