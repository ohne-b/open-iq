import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sections, type Session } from '../domain';
import { itemById } from '../content';
import { scoreSession } from '../scoring';
import { downloadSession } from '../storage';
import { registerReportTool, type ReportContext } from '../report-tool';

export function Results({ session, onDelete }: { session: Session; onDelete: () => void }) {
  useEffect(
    () =>
      registerReportTool(
        session,
        (document as Document & { modelContext?: ReportContext }).modelContext,
      ),
    [session],
  );
  const scores = scoreSession(session);
  const completed = scores.filter((s) => s.completed).length;
  const date = new Date(session.startedAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <main className="page results-page">
      <div className="page-kicker">
        {date} <span aria-hidden="true">/</span> {completed} of 10 sections completed
      </div>
      <h1>Your results</h1>
      <p className="intro">A record of how you performed on these tasks.</p>
      <p className="result-context">
        These are task scores, not an IQ score or a comparison with other people. This assessment
        has not yet been validated. <Link to="/about">How to read your results</Link>
      </p>
      {session.stage !== 'complete' && (
        <div className="resume-line no-print">
          <span>Your assessment is still in progress.</span>
          <Link className="button primary" to={`/test/${session.id}`}>
            Continue test
          </Link>
        </div>
      )}
      {!!session.flags.filter((f) => f !== 'resumed').length && (
        <div className="result-notes">
          {session.flags.includes('interrupted') && (
            <p>
              Some tasks were interrupted. Interrupted timed rounds are excluded from speed totals.
            </p>
          )}
          {session.flags.includes('retest') && (
            <p>This is a repeat attempt. Familiarity with the tasks can affect performance.</p>
          )}
          {session.flags.includes('storage-unavailable') && (
            <p>Automatic saving was unavailable for part of this attempt. Download a copy below.</p>
          )}
        </div>
      )}
      <div className="score-list">
        {scores.map((score) => (
          <details className="score-row" key={score.section.id}>
            <summary>
              <span className="score-title">
                <span className="small muted">{score.section.area}</span>
                <span>{score.section.name}</span>
              </span>
              <span className="score-value">
                {!score.started ? (
                  <span className="not-taken">Not taken</span>
                ) : score.section.kind === 'speed' ? (
                  <>
                    <strong>{score.correct}</strong>
                    <span>
                      {' '}
                      correct
                      {score.usableBlocks === 0
                        ? ' · no complete rounds'
                        : ` · ${score.total - score.correct} errors`}
                    </span>
                  </>
                ) : (
                  <>
                    <strong>
                      {score.correct}
                      <span className="score-denominator"> / {score.total}</span>
                    </strong>
                    <span>
                      {score.section.kind === 'choice' ? 'correct' : 'positions correct'}
                      {!score.completed ? ' · partial' : ''}
                    </span>
                  </>
                )}
              </span>
              <span className="details-mark" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="score-detail">
              {score.started ? (
                <>
                  {score.section.kind === 'choice' ? (
                    <p>
                      {score.attempted} answered, {score.omitted} skipped
                      {score.interrupted ? `, ${score.interrupted} interrupted` : ''}.{' '}
                      {score.section.count - score.attempted - score.omitted - score.interrupted > 0
                        ? `${score.section.count - score.attempted - score.omitted - score.interrupted} not yet taken.`
                        : ''}{' '}
                      Each correct answer counts as one point.
                    </p>
                  ) : score.section.kind === 'speed' ? (
                    <p>
                      {score.usableBlocks} complete {score.usableBlocks === 1 ? 'round' : 'rounds'};{' '}
                      {score.elapsed / 1000} seconds counted.{' '}
                      {score.interrupted
                        ? `${score.interrupted} interrupted ${score.interrupted === 1 ? 'round is' : 'rounds are'} excluded. `
                        : ''}
                      Speed and mistakes are reported separately.
                    </p>
                  ) : (
                    <>
                      <p>
                        {score.exact} of {score.section.count} sequences recalled exactly. A
                        position counts only if the correct{' '}
                        {score.section.id === 'sequence' ? 'digit' : 'location'} is recalled in the
                        correct order.
                      </p>
                      {score.section.id === 'span' && (
                        <p>
                          Symmetry decisions: {score.processingCorrect} of {score.processingTotal}{' '}
                          correct. Remembering positions and making symmetry decisions are separate
                          parts of this task.
                        </p>
                      )}
                      {score.interrupted > 0 && (
                        <p>{score.interrupted} interrupted sequences are marked as missing.</p>
                      )}
                    </>
                  )}
                  <p className="muted">
                    {score.section.area === 'Language'
                      ? 'English proficiency and education affect performance in this section.'
                      : score.section.area === 'Visual speed'
                        ? `Input method: ${session.inputMode === 'keyboard' ? 'keyboard / mouse' : 'touch'}. Screen size, input method and device performance can affect these results.`
                        : score.section.area === 'Memory'
                          ? 'Distractions and rehearsal strategies can affect recall.'
                          : 'These items are not calibrated for difficulty. Raw totals cannot establish a population ranking.'}
                  </p>
                </>
              ) : (
                <p>This section has not been taken.</p>
              )}
            </div>
          </details>
        ))}
      </div>
      <div className="report-actions no-print">
        <button className="button primary" onClick={() => window.print()}>
          Print or save PDF
        </button>
        <button className="button secondary" onClick={() => downloadSession(session)}>
          Download data
        </button>
      </div>
      <p className="small muted report-version">
        Form {session.version.replace('open-iq-', '')} ·{' '}
        {session.inputMode === 'keyboard' ? 'Keyboard / mouse' : 'Touch'} input
      </p>
      {session.stage === 'complete' && (
        <details className="answer-review no-print">
          <summary>Review answers</summary>
          <p className="small muted">
            Reviewing answers will make future attempts less informative. Memory and timed tasks are
            summarized above.
          </p>
          {sections
            .filter((s) => s.kind === 'choice')
            .map((section) => (
              <details key={section.id}>
                <summary>{section.name}</summary>
                <ol className="review-list">
                  {session.responses
                    .filter((r) => r.section === section.id)
                    .map((r) => {
                      const item = itemById.get(r.itemId)!;
                      return (
                        <li key={r.itemId}>
                          <span className="review-state">
                            {r.status === 'omitted'
                              ? 'Skipped'
                              : r.answer === item.answer
                                ? 'Correct'
                                : 'Incorrect'}
                          </span>
                          <p>
                            {item.kind === 'text'
                              ? item.sequence
                                ? `${item.sequence.join(', ')}, ?`
                                : item.prompt
                              : `Question ${r.itemId.split('-').at(-1)}`}
                          </p>
                          <p className="small">
                            Answer: {item.options[item.answer]}. {item.explanation}
                          </p>
                        </li>
                      );
                    })}
                </ol>
              </details>
            ))}
        </details>
      )}
      <div className="page-bottom no-print">
        <Link to="/">Back home</Link>
        <button className="quiet-button" onClick={onDelete}>
          Delete this result
        </button>
      </div>
      <p className="print-only small">
        Open IQ · https://ohne-b.github.io/open-iq/ · Personal task results. Not a clinical or
        diagnostic assessment.
      </p>
    </main>
  );
}
