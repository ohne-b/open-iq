# Assessment specification

Status: original candidate blueprint, not a validated instrument. Counts and timing below are **starting design hypotheses**. Freeze actual values in an administration manifest before any real comparison or data collection.

## 1. Intended use and population

Open IQ is one self-administered assessment for **international English-speaking adults aged 18 and over**, intended for personal exploration and education about cognitive measurement. It does not diagnose conditions, make employment or educational selection decisions, or certify membership eligibility.

There is no upper-age exclusion from the experimental experience. However, access is not evidence that every score interpretation applies across the adult lifespan. Do not extrapolate future norms beyond the ages actually supported.

English proficiency cannot be inferred from citizenship, IP address, or nationality. Use clear instructions and practice. If a person cannot understand a task after the supported explanation, let them stop that task and receive an honest incomplete report. Do not convert an instruction failure into a low ability score.

Five areas organize the content. They are not a claim that cognition has exactly five independent components. In particular, English word knowledge is language- and education-dependent, and visual tasks still depend on experience and access conditions. The [ITC adaptation guidance](https://www.intestcom.org/files/guideline_test_adaptation_2ed.pdf) motivates investigating those differences.

## 2. The proposed form

All counts exclude practice. Fixed-form administration is the launch default. The suggested order interleaves areas to reduce a long run of one task type; its benefits must be checked rather than assumed.

| Order | Code | Subtest | Starting content size | Active-time estimate | Scored response |
| --- | --- | --- | --- | --- | --- |
| 1 | MR | Matrix rules | 18 items | 8–10 min | One selected option |
| 2 | WM | Word meaning | 20 items | 4–5 min | One selected option |
| 3 | SR | Sequence reordering | 12 trials | 5–6 min | Ordered sequence |
| 4 | RT | Mental rotation | 18 items | 6–7 min | One selected option |
| 5 | SC | Symbol comparison | 2 × 90-second blocks | 3 min | Repeated same/different decisions |
| — | — | Optional break | No scored content | User controlled | — |
| 6 | NR | Number relations | 18 items | 7–9 min | One selected option |
| 7 | VR | Verbal relationships | 16 items | 4–5 min | One selected option |
| 8 | CS | Spatial complex span | 10 trials | 6–8 min | Processing decisions plus ordered recall |
| 9 | PF | Paper folding | 16 items | 6–7 min | One selected option |
| 10 | VS | Visual search | 2 × 60-second blocks | 2 min | Repeated target-present/absent decisions |

This gives **106 reasoning/verbal/spatial items, 22 memory trials, and four timed speed blocks**. The active estimates total 51–62 minutes. Instructions, practice, accessibility needs, and breaks add time. These numbers are not a recommendation to pad the test to a predetermined length.

The initial authoring target is approximately **two candidate items for each fixed reasoning/verbal/spatial slot**, plus separate practice material. That yields around 212 draft items for review, not 212 calibrated items. Memory sequences and speed rows are separately controlled stimulus sets. Grow this bank when review exposes gaps; do not generate thousands of unreviewed items to make the project look large.

### Common administration rules

- One practice sequence per subtest, normally 2–4 examples covering the interaction and basic rule types. Give explanations only in practice.
- Practice may repeat once with a second example set. A failed comprehension check leads to help or an incomplete task, not a forced progression.
- Reasoning, verbal, and spatial sections are accuracy tasks. No speed bonus, no per-item countdown, and no hard time cap in the launch form.
- Move forward after submission. Before submitting, selections can change. A visible “Skip” creates an explicit omitted response; it does not silently disappear.
- No correctness feedback during scored sections. No hints, confetti, “you are above average,” or difficulty labels.
- A scored memory trial cannot be replayed. Practice trials can.
- Speed blocks have fixed durations specified in the form manifest. The block clock is neutral; it does not flash or change color near the end.
- Breaks are possible at section boundaries. A completed section is locked for that attempt.
- Stopping is always possible. Partial results remain available without pretending the entire assessment was completed.
- No external references, AI assistance, calculators, or notes for the intended standard administration. These are instructions, not remotely enforceable guarantees.
- Store the precise task order, option order, and actual stimulus instance. The launch form does not shuffle item order randomly for each visitor.

## 3. Subtest designs

### MR: matrix rules

Purpose: sample rule induction and relational reasoning with original geometric matrices.

Use a small grammar: count changes, rotation, position shifts, fill changes, set union/intersection, and combinations of independently specified rules. Start with 2 × 2 training examples and use 3 × 3 scored items where justified. Four to six response options are allowed by the schema; use one consistent choice count within the initial form unless an item requires a documented exception.

Each item needs a written rule, a canonical answer, and an explanation of each distractor. Reject an item if another option satisfies an equally simple plausible interpretation. A generator can verify a declared grammar, but it cannot prove that a human will not see another valid pattern.

Keep cell geometry, stroke weight, whitespace, and rendering quality equal across options. Avoid a correct option with more detail, sharper export, unique color, or different alignment. Do not copy Raven's or WAIS item layouts beyond generic task conventions.

Launch score: correct / valid scored items, with omissions visible. The rule count is an authoring descriptor, not an empirically measured difficulty.

### WM: word meaning

Purpose: sample English lexical knowledge, explicitly labeled as such.

Write original prompts with an unambiguous intended sense and plausible distractors. Avoid region-specific slang, spelling traps, archaic trivia, literary quotations, specialist knowledge, and dependence on one country's school curriculum. Do not scrape copyrighted dictionaries or use a language model as the answer authority.

Record the word sense, rationale, dialect review, and source of any factual definition used to check correctness. Original wording and human editorial review are required. “International English” is an editorial goal, not a scientifically established invariant dialect.

Launch score: accuracy and omissions. No claim that this is a complete verbal IQ or a fair cross-language measure.

### SR: sequence reordering

Purpose: remember a short sequence and apply a specified manipulation.

Use visually presented digits with unambiguous glyphs; avoid relying on alphabet ordering across writing systems. Candidate trials include reverse recall and sorting digits into ascending order. Present symbols individually and remove them before recall. Separate the instruction for each manipulation clearly.

Starting presentation proposal: **800 ms visible + 200 ms gap** per digit, with lengths distributed across a fixed schedule. This is an implementation hypothesis, not a borrowed normed procedure. The form records exact duration, symbol set, duplicate policy, sequence order, and recall method. Reordering and reverse recall may have different demands; preserve the trial subtype in the data.

Use an on-screen keypad with keyboard equivalents, explicit delete/clear controls, and a submit action. Do not impose a fast typing requirement. Record element-level correctness in position and whole-sequence correctness. Display both descriptions; do not count a long sequence as one independent observation for every digit in later reliability analysis.

### RT: mental rotation

Purpose: recognize a rigid object under rotation, with reflection as a possible distractor.

Represent each object as an integer-coordinate arrangement of cubes or simple connected solids. A deterministic projection renders the question and candidate orientations to SVG. Restrict rotations to physically valid transformations; mirrors must be deliberate distractors, not accidentally rotated duplicates.

Build a canonical representation to detect equivalent objects, symmetries, duplicate options, and viewpoints that obscure the intended distinction. Every item is visually reviewed for occlusion, ambiguous depth, and unintended alignment cues. Keep lighting/shading conventions fixed and sparse.

Do not permit interactive rotation in the scored form, because that changes the task. The examples may demonstrate how a rigid rotation works using clearly separate practice objects.

### SC: symbol comparison

Purpose: rapid and accurate comparison of simple symbols, with unavoidable perceptual and motor contributions made explicit.

Display one pair at a time. The visitor presses either of two comfortably placed response keys, or uses two large on-screen controls in the separately recorded touch mode. Do not mix response modes within a scored block without recording a deviation.

Use a fixed reviewed stream with balanced same/different cases and visually comparable pairs. The finite item stream must be long enough that normal performance does not exhaust it; if it does, mark a ceiling condition and report what happened rather than inventing additional equivalent trials.

Report correct count, incorrect count, omitted/unfinished stimulus, response accuracy, and block duration. Do not apply `correct − errors` or inverse-efficiency scoring without a stated measurement rationale and evidence. The launch report can provide speed and accuracy separately.

### NR: number relations

Purpose: sample quantitative relations without turning the task into a school mathematics examination.

Use integer sequences and simple relations requiring addition, multiplication, alternating rules, or differences. Avoid obscure named sequences, lengthy arithmetic, culturally specific notation, and “guess the author's pattern” items. Prefer distractors that reflect specific plausible operations.

Check exact arithmetic and every distractor automatically. Test alternative low-complexity rules over the presented prefix. If multiple simple rules yield different answers, add discriminating information or replace the item. No finite sequence has a uniquely determined continuation in a purely mathematical sense; the task must establish a clear intended relation in its context.

Do not score fast arithmetic as reasoning speed. Log response time for later diagnostics only, subject to the local-data policy.

### VR: verbal relationships

Purpose: sample conceptual relationships expressed in accessible English.

Use original analogies or category relationships where the relation itself matters more than rare vocabulary. Keep grammatical structure balanced across options. Avoid humor, idioms, culturally specific institutions, and disputed value judgments.

An item record names the relation and explains why the distractors do not match it. Reviewers should be able to solve it without seeing the key. Do not treat agreement by an AI model as evidence of validity or international fairness.

The two English subtests are reported separately at launch. High internal agreement between them could reflect shared language exposure rather than justification for a universal ability interpretation.

### CS: spatial complex span

Purpose: retain spatial information while performing an intervening task.

Show a simple spatial location to remember, interleave an easy symmetry decision, then request ordered recall of the locations. Use a stable grid and simple shapes with no color-only distinction. The interference task must be understandable and easy enough not to dominate the result.

Separate practice for the processing task, the memory task, and their combination. Record processing accuracy, any processing deadlines, recall positions, and trial length. A person who skips processing decisions is not performing the same task; flag the procedure rather than awarding an artificially high memory score.

Exact exposure durations and any processing deadline must be fixed before a form is released. A basic initial prototype can use long, comfortable exposure windows while observing usability, without declaring those windows optimal. Avoid participant-specific deadlines derived from a tiny practice sample until their consequences have been investigated.

This is an original task design informed by span paradigms, not an authorized or validated port of a laboratory's operation-span software. See the [memory evidence discussion](RESEARCH.md#6-working-memory-tasks-are-not-interchangeable).

### PF: paper folding

Purpose: reason about spatial transformations and the result of unfolding a punched sheet.

Represent the square sheet, fold lines, fold direction, and punched coordinates mathematically. Generate the unfolded pattern using reflection transforms. Validate coordinates, duplicates, edge cases, and option equivalence. Avoid punches exactly on folds in the first form, unless their treatment is explicitly defined and reviewed.

Show clean, sequential diagrams with identical dimensions, restrained dashed fold lines, and unambiguous arrows. Do not use photorealistic paper, textures, lighting, or decorative shadows.

Keep a static view during the scored item. An animation that shows the unfolding would change the reasoning demand. Practice may demonstrate the operation using material not present in the scored bank.

### VS: visual search

Purpose: locate a target among distractors under a fixed time limit.

Use a target key and a regular array of simple symbols. Balance target-present and target-absent trials; specify distractor similarity, array size, density, and target positions. Maintain constant spatial scale within a validated mode.

Use two response controls, not tiny direct clicks on the target, to reduce unnecessary pointing demand. Still describe motor and display contributions accurately. A static search task is not equivalent to a simple reaction-time assay.

Report speed and accuracy separately. Predefine how the current trial is handled when a block expires; no after-deadline answer may slip into the count because a callback was delayed.

## 4. Item authoring record

Every deployable item has:

| Field | Purpose |
| --- | --- |
| Immutable `itemId` and `revision` | Identify exactly what was administered |
| `familyId`, `kind`, intended area | Track task lineage and possible dependence |
| Prompt and instruction revision | Prevent silent changes in wording |
| Stimulus spec and renderer version | Reproduce the exact image |
| Options with stable IDs | Score independently of displayed position |
| Answer/rubric | Deterministic scoring, not runtime interpretation |
| Solution and distractor rationales | Human review and later educational material |
| Intended complexity | Author hypothesis only |
| License, author, origin, attribution | Establish redistribution rights |
| Review state and review record | Separate drafts from approved content |
| Exposure status | Separate practice, operational, and retired examples |
| Evidence status and calibration reference | Never confuse review with calibration |

The build rejects duplicate IDs, nonexistent correct options, duplicate rendered answers, illegal coordinates, missing provenance, unsupported markup, and operational use of a draft item. Rendering differences that could alter perception create a new revision.

An honest solo-project review record says one person reviewed an item. It does not fabricate an independent panel. Content can remain experimental until additional review is available.

## 5. Device and environment policy

The public pages, instructions, and results support small screens. The **reference administration** initially targets a laptop or desktop with a keyboard and sufficient room for the full stimulus. Choose the minimum usable viewport from actual layout tests, not user-agent branding.

On touch devices, offer the experimental experience with its input mode recorded and an explanation of affected timed tasks. Do not pool its speed scores with keyboard sessions in a later reference release without comparability evidence. If a stimulus cannot be presented legibly, show a clear device-size message before the section starts. Never silently shrink a matrix until its distinctions disappear.

Before timed trials: load fonts and assets, verify required input, show practice, and verify that the task area fits at the user's chosen zoom. Do not block browser zoom. Disable task transitions while unresolved loading would change presentation.

No audio is required in the launch form. This avoids adding hearing, headphones, synthesized speech, and accent variability to the first implementation. An auditory task would be a separately designed and investigated change.

## 6. Interruptions and recovery

| Situation | Required behavior |
| --- | --- |
| Normal boundary break | Persist checkpoint and resume before the next section |
| Tab hidden during a power item | Record interruption; retain response; describe the session condition |
| Tab hidden during memory exposure | Stop accepting a nominally standard trial; mark interrupted; never replay it as first exposure |
| Tab hidden during speed block | End/flag block according to the manifest; do not silently pause and grant extra time |
| Browser sleep or freeze | Detect elapsed-time inconsistency; preserve data and mark affected block |
| Reload during active timed task | Preserve completed work; mark active task interrupted; do not fabricate missing trial records |
| Storage failure | Tell the visitor recovery is unavailable; allow explicit continuation in memory or local export |
| Network loss after task assets load | Continue local assessment where possible; no score submission dependency |
| Second tab starts the same attempt | Prevent competing writers or open as a read-only view |

A future calibrated score can have stricter eligibility than a descriptive report. The user should still see valid completed work even if an interruption makes a population comparison unavailable.

## 7. Accessibility requirements

Use native radio groups, buttons, labels, headings, visible focus, and logical tab order. Every pointer action has a keyboard alternative; no task requires dragging alone. Instructions use text plus diagrams, not color, location, or animation alone.

Spatial puzzles may not admit a text equivalent preserving the same construct. Provide descriptive identification and accessible surrounding controls, document the limitation, and make alternative participation possible where feasible. Do not falsely label the full battery universally accessible or treat a text-translated spatial puzzle as psychometrically equivalent. The relevant distinction is explained in [WCAG's test-content provisions](https://www.w3.org/TR/WCAG22/).

Essential timing in speed and memory tasks must be justified individually. Untimed instructions, user-controlled starts, and boundary breaks remain accessible. An extended-time or alternative-input administration remains valuable, but its result must name the procedure used.

## 8. Content approval and versioning

The item lifecycle is `draft → content-reviewed → usable-in-experimental-form → empirically-reviewed → calibrated`, with `retired` possible at any stage. “Calibrated” requires actual linked evidence, not a boolean somebody can toggle after a visual review.

The first release requires all operational items to pass content and technical checks. Calibration is not falsely presented as complete. Publish the exact bank and answer rules as part of the open project, while keeping spoiler explanations out of the normal first-attempt flow.

Freeze the launched form. Correcting a substantive prompt, answer, timing value, distractor, or geometry creates a new item or form revision. Reassess old scores transparently if a scoring bug is discovered; never silently rewrite a downloaded report's meaning.
