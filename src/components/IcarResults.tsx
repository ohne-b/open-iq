import { Icon } from '@mdi/react';
import { mdiPlus, mdiChevronDown } from '@mdi/js';
import { Link } from 'react-router-dom';
import type { Session } from '../domain';
import { scoreIcar, icarReference } from '../icar-scoring';
import { itemById } from '../content';
import { downloadSession } from '../storage';

export function IcarResults({ session, onDelete }: { session: Session; onDelete: () => void }) {
  const { scores, overall, raw } = scoreIcar(session);
  const completed = scores.filter((score) => score.completed).length;
  return (
    <main className="page results-page">
      <div className="page-kicker">
        {new Date(session.startedAt).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        <span aria-hidden="true">/</span> {completed} of 4 sections completed
      </div>
      <h1>Your results</h1>
      <p className="result-context">
        These IQ-scale estimates compare your answers with {icarReference.n.toLocaleString('en')}{' '}
        adult volunteers in the ICAR study. They are not age-adjusted population IQ scores.{' '}
        <Link to="/about">How scoring works</Link>
      </p>
      {overall ? (
        <section className="overall-score" aria-label="Overall estimate">
          <span>Overall estimate</span>
          <strong>{overall.value}</strong>
          <span>IQ scale · study reference</span>
          <p>
            {raw} / 16 correct · Study percentile {overall.percentile}
          </p>
        </section>
      ) : session.stage !== 'complete' ? (
        <div className="resume-line no-print">
          <span>Finish all four sections for your overall estimate.</span>
          <Link className="button primary" to={`/test/${session.id}`}>
            Continue test
          </Link>
        </div>
      ) : (
        <p className="result-context">
          An interrupted section prevents an overall estimate for this attempt.
        </p>
      )}
      {session.flags.includes('retest') && (
        <p className="result-context">
          This is a repeat attempt. Familiarity with the questions can raise scores.
        </p>
      )}
      {session.flags.includes('storage-unavailable') && (
        <p className="result-context">
          Automatic saving was unavailable. Download your answers before closing this page.
        </p>
      )}
      <div className="score-list">
        {scores.map((score) => (
          <details className="score-row" key={score.section.id}>
            <summary>
              <span className="score-title">
                <span>{score.section.name}</span>
                <span className="small muted">
                  {score.correct} / {score.total} correct
                  {!score.completed && score.started ? ' · partial' : ''}
                </span>
              </span>
              <span className="score-value">
                {score.estimate ? (
                  <>
                    <strong>{score.estimate.value}</strong>
                    <span>IQ scale · study reference</span>
                  </>
                ) : (
                  <span className="not-taken">{score.started ? 'In progress' : 'Not taken'}</span>
                )}
              </span>
              <span className="details-mark" aria-hidden="true">
                <Icon path={mdiPlus} className="ui-icon" aria-hidden="true" />
              </span>
            </summary>
            <div className="score-detail">
              <p>
                {score.attempted} answered, {score.omitted} skipped. Each correct answer counts as
                one point; skipped answers receive zero.
              </p>
              {score.estimate && (
                <p>
                  Study percentile: {score.estimate.percentile}. Tied results share a rank. With
                  only four questions, section estimates are broad indicators and can change
                  substantially with one answer.
                </p>
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
        ICAR-16 · Open IQ presentation 1.0 · <Link to="/about">Study reference</Link>
      </p>
      {session.stage === 'complete' && (
        <details className="answer-review no-print">
          <summary>
            Review answers
            <Icon path={mdiChevronDown} className="ui-icon disclosure-icon" aria-hidden="true" />
          </summary>
          <p className="small muted">Reviewing answers makes future attempts less informative.</p>
          {scores.map((score) => (
            <details key={score.section.id}>
              <summary>
                {score.section.name}
                <Icon
                  path={mdiChevronDown}
                  className="ui-icon disclosure-icon"
                  aria-hidden="true"
                />
              </summary>
              <ol className="review-list">
                {session.responses
                  .filter((r) => r.section === score.section.id)
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
                            ? item.prompt
                            : `Question ${score.section.id === 'matrix' ? 'MR' : 'R3D'}.${item.id.split('.').at(-1)}`}
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
        Open IQ · ICAR-16 adaptation · Study-reference scores, not population IQ or a clinical
        assessment. Reference: {icarReference.id}.
      </p>
    </main>
  );
}
