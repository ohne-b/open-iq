# ICAR-16 presentation and reference

Open IQ 2.0 starts new attempts on `icar16-1.0`, an adaptation of the publicly released ICAR Sample Test. It contains four items each in verbal reasoning, letter series, matrix reasoning and three-dimensional rotation. The original ten-section `open-iq-1.0` remains available only for existing saved attempts, with its original raw scoring.

## Sources and permissions

- Condon, D. M., & Revelle, W. (2014). *The International Cognitive Ability Resource: Development and initial validation of a public-domain measure*. Intelligence, 43, 52–64. [Author copy](https://personality-project.org/revelle/publications/condon.icar.14.pdf), [DOI](https://doi.org/10.1016/j.intell.2014.01.004).
- [Publisher's public supplementary material, Appendix A](https://ars.els-cdn.com/content/image/1-s2.0-S0160289614000051-mmc1.pdf): wording, options and diagrams for the 16-item Sample Test. The supplement labels matrix items `MX`; the data and code use `MR` for the same numbered items.
- [ICAR project](https://www.icar-project.org/): identifies the resource as public domain. The diagrams here are new vector redraws of those public-domain test items. The research article itself is not republished. No restricted bank or commercial instrument was used.
- [SAPA ICAR dataset](https://doi.org/10.7910/DVN/AD9RVY), Harvard Dataverse, dataset version 3.0, CC0 1.0. Response file `sapaICARData18aug2010thru20may2013.csv`, file ID `10991957`. [Direct file](https://dataverse.harvard.edu/api/access/datafile/10991957).
- [psych `iqitems` documentation](https://personality-project.org/r/html/iqitems.html): independently published answer key. Its small demonstration dataset is **not** the scoring reference used here.

No endorsement by ICAR, its authors or the dataset hosts is implied. Open IQ's explanations, presentation and conversion are separate contributions.

## Fixed items and keys

The displayed question and answer wording and answer order follow Appendix A. Layout, font, section introductions and diagrams are adapted. Items are presented in the order below; responses cannot be revised, and correctness is withheld until completion. There is no time limit or speed bonus. These presentation choices are not evidence of equivalent administration to the original research.

| Section | IDs, in order | Correct option numbers (1-based) |
| --- | --- | --- |
| Verbal reasoning | VR.04, VR.16, VR.17, VR.19 | 4, 4, 4, 6 |
| Letter series | LN.07, LN.33, LN.34, LN.58 | 6, 3, 4, 4 |
| Matrix reasoning | MR.45, MR.46, MR.47, MR.55 | 5, 2, 2, 4 |
| Three-dimensional rotation | R3D.03, R3D.04, R3D.06, R3D.08 | 3, 2, 6, 7 |

Source IDs, typed geometry and answer keys live in `src/content/icar.ts`. Renderer code is in `src/components/IcarStimulus.tsx`. Questions are public and repeat exposure can affect performance; the site records a self-reported prior-exposure flag. It does not measure memory or processing speed.

## Reference cohort

The pinned source contains 96,958 response records collected from 18 August 2010 through 20 May 2013. Much of the missingness reflects planned item sampling. Of these records, 4,574 contain observed binary correctness values for all 16 sample-test items. We retain the 3,480 complete records in these age bands: 19–24, 25–29, 30–34, 35–39, 40–49, 50–59, and 60 and over.

All 1,094 complete records labeled `18andUnder` are excluded. That band does not allow 18-year-old adults to be separated from minors. No missing answers are imputed; no simulated respondents, weighting, age adjustment or assumed population distribution are added. Completeness selection can introduce its own bias. The script does not claim to identify duplicate people or independently verify the responses.

This is a historical online volunteer cohort, **not international population norms**. It does not establish equivalent measurement across ages, countries, languages, education or devices. Eligibility to use the site at age 18 does not make the 19+ reference age matched.

| Scale | Items | Reference mean (raw) | Sample SD (raw) |
| --- | ---: | ---: | ---: |
| Verbal | 4 | 2.814655 | 1.215906 |
| Letter series | 4 | 2.405172 | 1.369053 |
| Matrix | 4 | 2.194253 | 1.245940 |
| Rotation | 4 | 0.926149 | 1.269178 |
| Overall | 16 | 8.340230 | 3.762234 |

All five distributions use the same people. Only aggregate score frequencies and provenance are shipped in `src/content/icar-reference.json`; no participant rows are committed or sent to browsers.

## Calculation and interpretation

One correct answer earns one point. Wrong and explicitly skipped answers earn zero. Unfinished sections receive no reference estimate; all four sections must finish before an overall estimate is shown. Interrupted observations do not receive an estimate.

For each completed section and the total:

```text
standard score = round(100 + 15 × (raw − reference mean) / reference sample SD)
study percentile = round(100 × (count below raw + 0.5 × count equal to raw) / 3480)
```

The overall calculation uses the observed total-score distribution, not an average of standardized section scores. The empirical percentile handles ties with midranks and does not assume normality. Consequently it need not equal a normal-distribution percentile for the displayed standard score. Means, SDs and frequencies are retained at full precision; only displayed results are rounded.

“IQ scale · study reference” means a descriptive scale using the familiar 100/15 convention. **It is not a published IQ conversion from the ICAR authors, a population IQ estimate, or an equating to WAIS or another IQ instrument.** The result page names the study reference and explicitly distinguishes it from age-adjusted population IQ. No clinical categories, invented confidence intervals or claims of extreme-range accuracy are provided.

Each section has only five possible raw scores. These four-item estimates are coarse and must not be interpreted as precise, independently validated ability indices. The 16-item total ranges from approximately 67 to 131 on this reference scale; a perfect score is a ceiling, not evidence of a person's upper ability limit. The original paper's validation does not validate this particular subset-based standardization or our modernized presentation. Independent study would be needed to establish equivalent difficulty, reliability, uncertainty, fairness and broader IQ interpretation.

## Reproduce the reference

Node 24, no R or additional runtime package required:

```sh
npm run reference:check
```

This downloads the pinned CSV once into ignored `.cache/icar/`, verifies SHA-256, checks the record/cohort sizes, recomputes all five aggregate distributions and compares them with the committed JSON. Ordinary builds and CI tests are offline with respect to the research host. To regenerate intentionally, run `node scripts/build-icar-reference.mjs` and `npm run format`, review the diff and make a form/reference-version decision.

```text
SHA-256: 27b22368434e94278d4cfee238770339f8e90da6229ef9ffd95900c4972426e5
Reference ID: icar16-sapa-adult-v1
Dataset version: 3.0
File ID: 10991957
```

## Diagram fidelity

The redraw removes raster blur and drop shadows, retaining the main shape, fill polarity, marker shape/position, arrow direction, missing-cell position and option order. MR.47's missing cell is row 2, column 3. The other matrices omit the bottom-right cell. Black/white geometry remains consistent across presented cells and options.

Cube faces use a consistent isometric projection. Symbols and their rotations are defined in each face's local plane before projection. This is essential: matching face symbols alone is insufficient. For example, the three-arm symbol on R3D.03 C is oriented differently from the three-arm symbol on R3D.06 F. The test suite checks each cube option under all 24 proper 3D rotations, preserving symbol orientations and excluding reflections; exactly the published option survives for each item. Unknown faces remain unknown, rather than being assigned invented reference markings.

Screenshots are compared with Appendix A on desktop and mobile. These checks establish implementation fidelity, not psychometric equivalence. Device size, refreshed symbol geometry, spacing, responsive option arrangement and administration can still change difficulty. Do not alter these details silently after release.

## Versioning

The current form and frozen aggregate reference belong together. Saved records include the form version and raw responses; every report recomputes scores from those records. The old ten-section form uses its old content, progress rules and raw report. It is never given ICAR-based scores. Future content, key, reference or administration changes require a separate version and explicit handling of older attempts.
