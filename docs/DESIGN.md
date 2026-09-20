# Visual design and editable graphics

## 1. Art direction

Create a **modern measurement publication**: the clarity of a well-edited scientific journal, the care of an exhibition catalogue, and the usability of a focused application. It should feel authored and maintained by people who care about the subject.

The identity is built from typography, a distinct grid, fine rules, original diagrams, and good writing. It does not depend on stock illustrations or a purchased landing-page template.

This document preserves the original design proposal. The delivered site uses the quieter direction documented in [implementation decisions](IMPLEMENTATION.md): one type family, minimal branding, no generated logo, and direct entry into the assessment. The site's editable task graphics live in `src/content/visual.ts` and `src/components/Stimulus.tsx`.

## 2. What makes the site distinctive

- A compact `open iq` wordmark with a small geometric registration mark; create the final mark as original vector geometry.
- An editorial landing layout: a narrow numbered index, a strong text column, and one large meaningful diagram.
- A test overview presented as an ordered sequence of sections, with honest time information and no sales funnel.
- A reading-oriented methodology section with references, revision dates, visible evidence status, and diagrams tied to actual explanations.
- Results that resemble a well-typeset personal report rather than a game profile or analytics dashboard.
- A calm assessment surface with stable positions, legible options, and obvious controls.

The distinctive work is in proportions, wording, spacing, diagrams, and interaction. Replacing purple with beige while retaining a generic template is not sufficient.

## 3. Visual tokens

Proposed starting palette; verify contrast in implementation and in each actual component state.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F4F1E8` | Public-page background |
| `surface` | `#FFFFFF` | Assessment surface, print page |
| `ink` | `#1B1E21` | Primary text and stimulus marks |
| `muted` | `#50565B` | Secondary text that still needs to be readable |
| `rule` | `#C7C6C0` | Decorative dividers; not sufficient alone for an essential control boundary |
| `accent` | `#204ED8` | Primary actions, links, active control state |
| `annotation` | `#9B442C` | Occasional editorial notes outside scored stimuli |
| `focus` | `#204ED8` | Strong focus outline with an offset and non-color shape cue |

Public headings: **Source Serif 4**. UI/body: **IBM Plex Sans**, initially regular, medium, and semibold only. Use tabular numerals where alignment matters. Monospace is optional for version IDs, not a third dominant visual voice. Self-host production font files and notices from their [original projects](https://github.com/adobe-fonts/source-serif), [IBM Plex](https://github.com/IBM/plex).

Suggested type scale: 14 px secondary labels, 17–18 px body, 22–24 px subheads, 32–40 px page headings, and 64–84 px landing title on large screens. Avoid tiny uppercase paragraphs. Use uppercase sparingly for short section indices; normal case remains the default.

Use a 4 px spacing base, but compose pages deliberately rather than assigning every section the same padding. Public content width around 1,200 px, prose around 65–72 characters per line, assessment task width determined by the stimulus specification. Controls use 4–6 px corners; no universal pill-shaped interface.

Implement these in a single Tailwind theme using [theme variables](https://tailwindcss.com/docs/theme). Stimulus tokens are separate, fixed, and versioned; changing the public brand palette must not recolor test items.

Planning contrast calculations: ink on paper approximately 14.8:1, muted text on paper 6.6:1, white on accent 6.7:1, and annotation on paper 5.7:1. These pairings pass the usual 4.5:1 normal-text threshold; they do not establish accessibility of a complete page or every hover/disabled state.

## 4. Page-by-page plan

### Landing page

Top navigation: wordmark; The assessment; Method; Project/source. A quiet footer carries privacy, accessibility, release notes, and contribution links.

Hero copy proposal:

> A closer look at how you think.
>
> One open assessment of reasoning, memory, and visual speed. Take your time with the questions. See how your results are calculated.

Primary action: **Prepare for the assessment**. Nearby practical facts: adults, English, approximately an hour of active work, free results, no account. Evidence text in plain sight: **Experimental release. Reports task performance; population IQ norms are not yet established.**

Do not advertise a finished completion-time estimate before observing actual use. Before that, label it “planned duration” in previews and “allow at least…” only once the product's procedure is sufficiently settled.

Below the hero: an ordered list of the five areas and ten subtests, the assessment process, how to interpret the results, and a small methods excerpt with sources. Use one purposeful geometric diagram rather than a row of decorative feature cards.

### Preparation

A short sequence explains the environment, input requirements, time/breaks, and actual score meaning. Use progressive disclosure for methodological detail, while keeping material limitations visible before Start.

Required fields are minimal: confirmation of adult participation, language understanding, and the chosen supported input/procedure. Avoid requiring name, email, exact birth date, nationality, or demographic research questions for access.

Show a keyboard/touch interaction practice and a device-size check. Tell the user exactly which data remain local. An optional future research invitation is separate and defaults to off.

### Instructions and practice

Put the rule explanation next to a real practice diagram. Use numbered steps and a worked example. After the visitor tries an example, show a concise explanation and let them try again where appropriate.

Practice screens explicitly say **Practice**. Scored sections explicitly say **Assessment**. Never reuse a scored item as a worked example.

### Assessment

Header: subtest title, section position, and a quiet exit control. A small progress rule reflects known section progress. Do not display a speculative live IQ or animated “brain performance” meter.

Main task: stable question region, generous separation from answer controls, uniform option layout. For a six-option item, use 3 × 2 on wide screens and 2 × 3 only where the stimulus remains legible and the layout is within the recorded administration mode.

Answer states: unselected, focused, selected, and disabled. Selection uses border, fill, and an explicit mark; color alone is insufficient. The Submit action stays in a stable place and is labeled according to the task. Keyboard behavior is taught in practice.

Nothing in the stimulus animates unless motion is part of the specified procedure. No animated route transitions, live clocks ticking across the visual field in untimed tasks, or smooth auto-scroll during exposure.

### Break and interruption

Break screens show progress, what comes next, and the approximate remaining burden without pretending a precise remaining time is known. A resumed attempt retains its versions and completed sections.

Interruption copy is factual: “This memory sequence was interrupted. It cannot be replayed as a first attempt.” Offer the applicable continuation/partial-result choices. Do not accuse the person of cheating or hide their completed work.

### Results

First: completion and the evidence status. Then the subtest results in their own units, with descriptions of what each task required. Use an aligned table or dot plot only when scores share a justified scale.

At E0, there is no giant IQ number, bell-curve marker, percentile, or “genius” badge. A local report can still be attractive: good typography, a clear record of work, a summary of conditions, and explanations of the tasks.

At a later supported evidence level, show the reference cohort, score uncertainty, applicable population, and version beside any comparison. Do not bury uncertainty below an enormous score. An interval plot is more informative than a radar chart that exaggerates small differences.

Actions: **Save report**, **Export my data**, **Understand these results**, **Delete local data**. Browser printing with a reviewed print stylesheet provides a PDF path without uploading results or adding a heavy document-generation service.

### Method and project pages

Use a table of contents, readable prose, annotated figures, linked primary references, explicit evidence status, and release history. Show contributors and credentials only when real and permissioned. “Independent review pending” is acceptable; fabricated institutional logos are not.

## 5. Graphics architecture: two distinct kinds of source

### Brand and editorial diagrams

Use hand-authored SVG or Inkscape source files with named groups and editable text. These include the wordmark, the landing diagram, method figures, and explanatory illustrations. A designer can rearrange them visually without modifying TypeScript.

Preserve the editable source. Export a clean production SVG separately; a minified export is not the source of truth. [Inkscape uses SVG natively](https://inkscape.org/en/develop/about-svg/), so no proprietary design subscription is required.

### Measurement stimuli

Use a typed, human-readable JSON specification plus deterministic geometry code. That combination is the editable source of truth. Generated SVGs are derived artifacts.

Example source concept:

```json
{
  "itemId": "mr-example-001",
  "revision": 1,
  "rendererVersion": "matrix-svg-1",
  "canvas": { "width": 360, "height": 360 },
  "cells": [
    { "row": 0, "column": 0, "shape": "circle", "count": 1, "fill": "outline" }
  ],
  "missingCell": { "row": 2, "column": 2 }
}
```

This abbreviated example is not a complete item schema or scored puzzle. The actual schema also contains options, solution, review, and provenance.

Do not allow two competing truths: if a generated SVG is opened in Inkscape to explore a change, either encode the final change back into its specification/renderer or explicitly convert it into a new hand-authored item source with a new revision. Never manually patch the build output and forget the generator.

## 6. Stimulus rendering rules

- Use `viewBox`, consistent coordinate systems, and primitive shapes where possible.
- Use a fixed neutral stimulus palette and a documented minimum mark size.
- Start with a 2 px effective stroke at the reference display size; check actual anti-aliasing and discriminability rather than treating that number as sacred.
- Align strokes and shapes consistently; fractional coordinates must be intentional.
- Keep text out of geometric puzzle art where an accessible HTML label is more stable.
- Encode shape/position/fill distinctions independently of color perception where feasible.
- Use no image-generation service, raster background, photograph, 3D render, texture, or external font dependency for geometric questions.
- Do not embed script, external URLs, `foreignObject`, or image payloads in contributed SVG.
- Every instance has unique IDs for accessible titles/descriptions and internal references.
- Use descriptive identification without revealing the solution in alt text or accessible names. Explain barriers honestly instead of hiding content from assistive technology unnecessarily.
- Geometry changes, option changes, and meaningful rendering changes create a new item revision.

For cube rotation, define the object in integer coordinates and project it deterministically to SVG. Three.js and a live WebGL scene are unnecessary for a static rotation item. Paper folding uses reflection geometry. Matrices use grid primitives. Icons use a small original set with consistent optical weight.

## 7. Deterministic generation is not empirical calibration

A seeded generator can reproduce a drawing exactly and check a declared solution. It cannot establish equal human difficulty across outputs. The [MaRs-IB calibration study](https://www.princeton.edu/~ndaw/zcbd2023.pdf) is directly relevant to that distinction.

Store generator version, input parameters, seed, instance ID, and final stimulus hash. Generate and freeze operational instances before release. Runtime random generation is restricted to explicitly experimental/practice material unless the relevant generalization has evidence.

Avoid puzzle leakage across practice and assessment by tracking item-family membership. Different colors or rotations of an example may teach the exact rule of a later item even when its file name differs.

## 8. Asset quality workflow

1. Author a geometric specification or editable SVG.
2. Check the intended solution without the answer key visible.
3. Review distractors, ambiguity, visual salience, and cultural/language dependencies.
4. Render at reference size, small supported size, and 200% zoom.
5. Inspect light/dark system preferences without changing the fixed stimulus appearance.
6. Check grayscale and common color-vision simulations where color is present.
7. Run geometry/schema checks and capture a reference image.
8. Optimize with a pinned SVGO configuration.
9. Compare before/after output and accessible names; preserve `viewBox` and needed title/description elements. [SVGO documents the accessibility implications of removing titles](https://svgo.dev/docs/plugins/removeTitle/).
10. Record review, revision, license, and hashes.

Review all final stimulus instances, not merely one attractive example from each generator. An unresolved ambiguous item is excluded from the form.

## 9. Responsive and accessible behavior

Public pages reflow naturally at 360, 768, 1024, and 1440 px as planning checkpoints. These widths are visual test cases, not claims of device equivalence. Body text never falls below the established readable size to force a layout to fit.

Aim for 44 × 44 px primary interaction targets, adequate text/UI contrast, visible keyboard focus, reduced motion, and layouts that work with zoom. Verify relevant [WCAG 2.2](https://www.w3.org/TR/WCAG22/) requirements with both automated checks and keyboard/screen-reader review.

Do not turn a narrow-screen matrix into an undisclosed different item. If the required stimulus will not fit legibly at the user's settings, explain the limitation and preserve their session. Public methods and results remain usable even when a particular visual task is not.

The assessment has a fixed tested visual theme. A future dark theme for public pages can be separate. Inverting a matrix or changing its contrast for aesthetic consistency changes the stimulus and needs investigation.

## 10. Copy and interaction rules

Write like a careful editor: direct, useful, restrained. “You correctly answered 14 of 18 questions in this section” is better than a personality story inferred from the number.

Avoid stock AI-product phrasing such as “unlock your cognitive potential,” “powered by cutting-edge intelligence,” or “discover the genius within.” Avoid fake live visitor counts, fabricated testimonials, streaks, countdown offers, email gates, paywalled results, and celebratory score animations.

Use concrete explanations of uncertainty. Do not tell people what careers suit them or what their worth is from an experimental cognitive task.

## 11. Design acceptance criteria

- The main layouts remain recognizable without their color palette: the composition itself is distinctive.
- Every diagram communicates something specific; decorative filler has been removed.
- All source graphics and typography licenses are in the repository.
- There is no uneditable bitmap used where source geometry would work.
- The task surface is stable under loading, selection, submission, and zoom.
- A complete keyboard-only attempt is possible for supported task modes.
- Results can be read and printed without a chart legend scavenger hunt.
- Example data in mockups is marked illustrative; no fabricated validity statistics appear.
- A manual review covers landing, preparation, practice, power item, memory trial, speed block, interruption, partial result, full result, and print output.

Use reference screenshots for deliberate visual regression. Do not accept any layout merely because a component library rendered without errors.
