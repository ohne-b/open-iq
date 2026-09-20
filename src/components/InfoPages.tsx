import { Link } from 'react-router-dom';
import { sections } from '../domain';

export function About() {
  return (
    <main className="page prose">
      <Link className="back-link" to="/">
        ← Back
      </Link>
      <h1>About the test</h1>
      <p className="intro">
        One assessment, ten sections. An open look at reasoning, language, memory and visual speed.
      </p>
      <h2>What the results mean</h2>
      <p>
        You receive a record of your performance on the tasks you take: correct answers, recalled
        positions, and correct responses and mistakes in timed rounds.
      </p>
      <p>
        Open IQ does not currently produce an IQ score, percentile or diagnostic interpretation.
        There is no representative reference sample, established reliability estimate or published
        validation for this form. Converting a raw score to a mean of 100 would not make it a valid
        IQ scale.
      </p>
      <h2>What’s in the assessment</h2>
      <p>
        Allow roughly 60–75 minutes, with breaks between sections. This is an estimate, not a time
        limit. Only the two visual speed sections are timed; memory sequences also have fixed
        presentation times.
      </p>
      <ol className="section-directory">
        {sections.map((section) => (
          <li key={section.id}>
            <span>{section.name}</span>
            <span className="muted small">
              {section.kind === 'speed'
                ? '2 timed rounds'
                : `${section.count} ${section.kind === 'choice' ? 'questions' : 'sequences'}`}
            </span>
          </li>
        ))}
      </ol>
      <h2>Who it’s for</h2>
      <p>
        Adults aged 18 or older who understand the English instructions. People around the world can
        participate, but that does not establish fair or equivalent measurement across countries,
        languages or educational backgrounds. The language sections depend particularly on English
        experience.
      </p>
      <p>
        Use a quiet place and work without notes, calculators, search engines or help from others. A
        keyboard and a larger screen are preferable for the visual tasks. Touch input is available;
        scores from different input methods are not assumed to be equivalent.
      </p>
      <h2>How scores are calculated</h2>
      <details>
        <summary>Reasoning, language and spatial questions</summary>
        <p>
          One point for each correct answer. Skipped questions are listed separately. There is no
          penalty for an incorrect choice, no time bonus, and no combined score across sections.
        </p>
      </details>
      <details>
        <summary>Memory</summary>
        <p>
          Each digit or location in the correct position counts as one point. Exact sequences are
          also counted. Symmetry decisions in spatial memory are reported separately. Interrupted
          sequences are missing observations, not evidence of low ability.
        </p>
      </details>
      <details>
        <summary>Visual speed</summary>
        <p>
          Correct and incorrect responses are counted in each completed round. Symbol comparison has
          two 90-second rounds; visual search has two 60-second rounds. Responses after the deadline
          are excluded. An interrupted round is excluded entirely from speed totals.
        </p>
      </details>
      <details>
        <summary>Interruptions and repeat attempts</summary>
        <p>
          Leaving this tab or a substantial timing delay ends an active memory sequence or speed
          round. A reload cannot replay that task. Untimed questions can be resumed. Breaks are
          allowed between tasks, and progress stays in this browser.
        </p>
        <p>
          This release uses a fixed form. Practice effects, public answer keys and repeat exposure
          limit what repeat scores can tell you. It is unsuitable for selection, credentials,
          employment or other high-stakes decisions.
        </p>
      </details>
      <h2>Independent, open and still unvalidated</h2>
      <p>
        The questions are original contributions to this project. This is not WAIS, a replacement
        for a professionally administered assessment, or an adaptation licensed by a commercial test
        publisher. No commercial test items or norm tables are included.
      </p>
      <p>
        Software checks verify scoring and item structure. They cannot establish psychometric
        quality. Item wording, difficulty, ambiguity and performance across groups still require
        empirical study and independent review.
      </p>
      <p>
        The project’s{' '}
        <a href="https://github.com/ohne-b/open-iq/tree/main/docs">
          research and methodology documents
        </a>{' '}
        set out those requirements and the sources behind the design. Relevant starting points
        include the{' '}
        <a href="https://www.testingstandards.net/open-access-files.html">
          Standards for Educational and Psychological Testing
        </a>{' '}
        and the{' '}
        <a href="https://www.intestcom.org/page/16">International Test Commission guidelines</a>.
      </p>
      <div className="page-bottom">
        <Link to="/">Back to assessment</Link>
        <a href="https://github.com/ohne-b/open-iq">View source ↗</a>
      </div>
    </main>
  );
}

export function Privacy() {
  return (
    <main className="page prose">
      <Link className="back-link" to="/">
        ← Back
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
        Use “Download data” on a result to save a JSON file. You can import it from the home page in
        another browser running the same form version. Exported files contain your responses and
        timings; share them only if you intend to.
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
        ← Back
      </Link>
      <h1>Accessibility</h1>
      <p className="intro">Clear controls, keyboard navigation, and room to take your time.</p>
      <p>
        Use Tab to move between controls and the arrow keys to select an answer within a choice
        group. All actions have visible focus states. In speed tasks, F selects the left answer and
        J selects the right. The same answers are available as buttons.
      </p>
      <p>
        Most questions have no time limit. You can leave an untimed question and return later.
        Memory presentations and speed rounds cannot be paused without invalidating that task; take
        breaks before starting them.
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
