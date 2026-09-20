import { Link } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiChevronDown, mdiOpenInNew } from '@mdi/js';
import { icarSections } from '../domain';

export function About() {
  return (
    <main className="page prose">
      <Link className="back-link" to="/">
        <Icon path={mdiArrowLeft} className="ui-icon" aria-hidden="true" />
        Back
      </Link>
      <h1>About the test</h1>
      <p className="intro">
        16 questions from the International Cognitive Ability Resource, in four sections.
      </p>
      <ol className="section-directory">
        {icarSections.map((section) => (
          <li key={section.id}>
            <span>{section.name}</span>
            <span className="muted small">4 questions</span>
          </li>
        ))}
      </ol>
      <h2>What your score means</h2>
      <p>
        Your overall and section estimates use a scale centered on 100, with a standard deviation of
        15, in a published research sample. They describe performance relative to that sample. They
        are not age-adjusted population IQ scores, a diagnosis, or a full assessment of
        intelligence.
      </p>
      <p>
        The reference contains 3,480 volunteers in age bands 19 and older who answered all 16
        questions in the SAPA study. It is an online volunteer sample, not a representative sample
        of international English-speaking adults. English experience, education, age and prior
        exposure can affect the comparison.
      </p>
      <details>
        <summary>
          How scoring works
          <Icon path={mdiChevronDown} className="ui-icon disclosure-icon" aria-hidden="true" />
        </summary>
        <p>
          Each correct answer earns one point. Wrong and skipped answers earn zero. For each
          section, and for the total, we subtract the reference mean from your raw score, divide by
          the reference standard deviation, multiply by 15, and add 100. Results are rounded to
          whole numbers.
        </p>
        <p>
          The overall result uses all 16 answers and the observed distribution of total scores. It
          is not an average of the section estimates. Study percentiles count the proportion below
          your raw score plus half of those tied with it; they do not assume a normal distribution.
        </p>
        <p>
          This conversion was calculated by Open IQ from the published response data. It is not an
          IQ conversion supplied by the ICAR authors. Four questions give each section only five
          raw-score levels, so one answer can move its estimate substantially. Even a perfect total
          reaches only about 131 on this reference scale; the test cannot distinguish scores above
          its ceiling.
        </p>
      </details>
      <details>
        <summary>
          Questions, graphics and evidence
          <Icon path={mdiChevronDown} className="ui-icon disclosure-icon" aria-hidden="true" />
        </summary>
        <p>
          The items come from the public-domain ICAR Sample Test published by David M. Condon and
          William Revelle in 2014. Question wording, answer order and keys are preserved. Diagrams
          have been redrawn as SVGs, preserving their shapes, fills and answer-relevant
          orientations.
        </p>
        <p>
          The original ICAR research supports studying cognitive ability with these items. This
          site's redrawn, responsive presentation and section estimates have not been independently
          validated. Published evidence for the original instrument does not establish equivalent
          difficulty, reliability or fairness for this adaptation.
        </p>
        <p>
          Sources: <a href="https://www.icar-project.org/">ICAR</a>,{' '}
          <a href="https://personality-project.org/revelle/publications/condon.icar.14.pdf">
            the research paper
          </a>
          ,{' '}
          <a href="https://ars.els-cdn.com/content/image/1-s2.0-S0160289614000051-mmc1.pdf">
            the published sample test
          </a>
          , and <a href="https://doi.org/10.7910/DVN/AD9RVY">the human-response dataset</a>. The{' '}
          <a href="https://github.com/ohne-b/open-iq/blob/main/docs/ICAR.md">
            scoring notes and reproducible reference calculation
          </a>{' '}
          document the exact subset and formula.
        </p>
      </details>
      <h2>Taking the test</h2>
      <p>
        The site is for adults aged 18 or older who understand English. The reference excludes the
        source dataset's combined “18 and under” group because adult 18-year-olds cannot be
        separated from minors.
      </p>
      <p>
        Work on your own, without notes, a calculator or outside help. There is no time limit. A
        larger screen helps with the visual questions. Choose an answer and continue; submitted
        answers cannot be changed. Progress stays in this browser.
      </p>
      <p>
        This is a fixed test with public questions and answer keys. Repeating it or studying its
        solutions can raise scores. Results should not be used for diagnosis, employment, admissions
        or other high-stakes decisions.
      </p>
      <details>
        <summary>
          Earlier saved assessments
          <Icon path={mdiChevronDown} className="ui-icon disclosure-icon" aria-hidden="true" />
        </summary>
        <p>
          Attempts from the original ten-section Open IQ form keep their original questions and raw
          task results. They can still be resumed and exported. The ICAR reference does not apply to
          those questions, so those attempts receive no IQ-scale conversion.
        </p>
      </details>
      <div className="page-bottom">
        <Link to="/">Back to assessment</Link>
        <a href="https://github.com/ohne-b/open-iq">
          View source <Icon path={mdiOpenInNew} className="ui-icon" aria-hidden="true" />
        </a>
      </div>
    </main>
  );
}

export function Privacy() {
  return (
    <main className="page prose">
      <Link className="back-link" to="/">
        <Icon path={mdiArrowLeft} className="ui-icon" aria-hidden="true" />
        Back
      </Link>
      <h1>Your data stays here.</h1>
      <p className="intro">No account. No analytics. No answers sent to a server.</p>
      <h2>Saved in your browser</h2>
      <p>
        Your answers, task times, input method, completion state and any interruption or
        repeat-attempt flags are stored in this browser using IndexedDB. Each attempt has a random
        identifier. We do not ask for your name, email, exact age or location.
      </p>
      <p>
        Saved attempts remain until you delete them or clear this site’s browser data. They do not
        sync between devices. Private browsing, browser cleanup and storage restrictions can remove
        or prevent local saving. Download a copy if you want to keep a result.
      </p>
      <h2>What the host sees</h2>
      <p>
        GitHub Pages serves the website. Requests to the host can include your IP address and
        standard browser information, subject to{' '}
        <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
          GitHub’s privacy statement
        </a>
        . Answers are processed on your device and are not included in these requests. Fonts and
        graphics are served with the site; there are no third-party embeds or tracking scripts.
      </p>
      <h2>Exporting and deleting</h2>
      <p>
        Use “Download data” on a result to save a JSON file for your own records. Exported files
        contain your responses and timings; share them only if you intend to.
      </p>
      <p>
        Each saved result has a delete option. Clearing this site’s storage in browser settings
        deletes all local attempts. If you choose “Print or save PDF,” your browser and chosen print
        destination handle the report.
      </p>
      <h2>No research collection</h2>
      <p>
        This version has no participant data collection or research submission service. Any future
        study would need a separate, explicit consent process. Taking this assessment does not
        enroll you in a study.
      </p>
      <Link to="/">Back to assessment</Link>
    </main>
  );
}

export function Accessibility() {
  return (
    <main className="page prose">
      <Link className="back-link" to="/">
        <Icon path={mdiArrowLeft} className="ui-icon" aria-hidden="true" />
        Back
      </Link>
      <h1>Accessibility</h1>
      <p className="intro">Clear controls, keyboard navigation, and room to take your time.</p>
      <p>
        Use Tab to move between controls and the arrow keys to select an answer within a choice
        group. All actions have visible focus states. Answers are also available through on-screen
        controls.
      </p>
      <p>
        The current test has no time limit. You can save, leave and return later. In earlier saved
        assessments, memory presentations and speed rounds still cannot be paused without
        interrupting that task.
      </p>
      <p>
        The site respects reduced-motion preferences and supports browser zoom. It uses shape, text
        and selection marks as well as color. A wider screen can make the spatial diagrams easier to
        inspect.
      </p>
      <h2>Limits of the visual tasks</h2>
      <p>
        Several sections require seeing and mentally manipulating patterns. Describing their
        answer-relevant geometry aloud would change what they measure. Those sections are not
        equivalent for nonvisual use, and this release has no validated accessible alternative. We
        do not claim that the assessment is suitable for everyone.
      </p>
      <p>
        If a task is inaccessible to you, its score should not be interpreted as evidence about your
        ability. You can skip untimed questions, leave the assessment, or view a partial report.
      </p>
      <p>
        Report interface accessibility problems through the{' '}
        <a href="https://github.com/ohne-b/open-iq/issues">project’s issue tracker</a>. Please avoid
        including personal response data in public issues.
      </p>
      <Link to="/">Back to assessment</Link>
    </main>
  );
}
