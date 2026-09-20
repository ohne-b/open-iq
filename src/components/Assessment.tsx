import { useEffect, useRef, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { Link, useNavigate } from 'react-router-dom';
import { sections, flagSession, type Response, type Session } from '../domain';
import { choiceBank, practiceBank, sequenceTrial, spanTrial } from '../content';
import { interruptSession, recordBlock, recordResponse, sectionProgress } from '../session';
import { ChoiceQuestion } from './ChoiceQuestion';
import { MemoryTask } from './MemoryTask';
import { SpeedTask } from './SpeedTask';

export type UpdateSession = (id: string, update: (session: Session) => Session) => Promise<void>;

function MemoryPractice({
  section,
  onPracticed,
}: {
  section: 'sequence' | 'span';
  onPracticed: () => void;
}) {
  const [response, setResponse] = useState<Response | null>(null);
  const [attempt, setAttempt] = useState(0);
  if (!response)
    return (
      <MemoryTask
        key={attempt}
        section={section}
        index={attempt % 2}
        practice
        onAnswer={setResponse}
      />
    );
  const expected =
    section === 'sequence'
      ? sequenceTrial(attempt % 2, true).answer
      : spanTrial(attempt % 2, true).positions;
  const answer = Array.isArray(response.answer) ? response.answer : [];
  const correct = expected.every((n, i) => answer[i] === n) && answer.length === expected.length;
  return (
    <div className="practice-feedback" role="status">
      <h2>
        {response.status === 'interrupted'
          ? 'The practice was interrupted.'
          : correct
            ? 'That’s right.'
            : 'Here’s the sequence.'}
      </h2>
      <p>
        {section === 'sequence'
          ? expected.join('  ·  ')
          : expected.map((n) => `row ${Math.floor(n / 4) + 1}, column ${(n % 4) + 1}`).join('; ')}
      </p>
      <p className="muted">
        {section === 'sequence'
          ? 'You will alternate between backwards order and smallest-to-largest order.'
          : 'Remember the positions while also answering the symmetry questions.'}
      </p>
      <div className="actions">
        <button
          className="button secondary"
          onClick={() => {
            setAttempt((n) => n + 1);
            setResponse(null);
          }}
        >
          Try again
        </button>
        <button className="button primary" onClick={onPracticed}>
          Continue
        </button>
      </div>
    </div>
  );
}

export function Assessment({
  session,
  update,
  onLeave,
  onOpen,
}: {
  session: Session;
  update: UpdateSession;
  onLeave: () => Promise<void>;
  onOpen: (id: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const [lock, setLock] = useState<'waiting' | 'held' | 'blocked'>('waiting');
  const heading = useRef<HTMLHeadingElement>(null);
  const latest = useRef(session);
  const updateRef = useRef(update);
  useEffect(() => {
    latest.current = session;
    updateRef.current = update;
  }, [session, update]);
  useEffect(() => {
    let release: (() => void) | undefined;
    let cancelled = false;
    let ownsLock = false;
    const close = () => {
      cancelled = true;
      if (ownsLock && latest.current.activeTrial) {
        void updateRef.current(latest.current.id, interruptSession).finally(() => release?.());
      } else release?.();
    };
    if (!navigator.locks) {
      ownsLock = true;
      void onOpen(session.id).then(() => {
        if (!cancelled) setLock('held');
      });
      return close;
    }
    // Defer acquisition so a cancelled React effect never competes with its replacement.
    void Promise.resolve()
      .then(async () => {
        if (cancelled) return;
        await navigator.locks.request(
          `open-iq-assessment-${session.id}`,
          { ifAvailable: true },
          async (acquired) => {
            if (cancelled) return;
            if (!acquired) {
              setLock('blocked');
              return;
            }
            ownsLock = true;
            const released = new Promise<void>((resolve) => {
              release = resolve;
            });
            await onOpen(session.id);
            if (!cancelled) setLock('held');
            await released;
          },
        );
      })
      .catch(() => {
        if (!cancelled) setLock('held');
      });
    return close;
  }, [session.id, onOpen]);

  const section = sections[session.sectionIndex];
  const progress = sectionProgress(session);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [session.sectionIndex, session.stage, progress]);
  if (session.stage === 'complete')
    return (
      <main className="page narrow">
        <h1>Assessment complete</h1>
        <Link className="button primary" to={`/results/${session.id}`}>
          View results
        </Link>
      </main>
    );
  if (lock === 'blocked')
    return (
      <main className="page narrow">
        <h1>Already open in another tab</h1>
        <p>Continue the assessment there, or close that tab and refresh this one.</p>
        <Link to="/" className="button secondary">
          Back home
        </Link>
      </main>
    );
  if (lock === 'waiting')
    return (
      <main className="page narrow" aria-busy="true">
        <p>Opening assessment…</p>
      </main>
    );
  const stage = (value: Session['stage']) => update(session.id, (s) => ({ ...s, stage: value }));
  const commit = (response: Response) => {
    void update(session.id, (s) =>
      recordResponse(
        response.status === 'interrupted' ? flagSession(s, 'interrupted') : s,
        response,
      ),
    );
  };
  const nextSection = async () => {
    await update(session.id, (s) => ({
      ...s,
      sectionIndex: s.sectionIndex + 1,
      stage: s.sectionIndex === 9 ? 'complete' : 'intro',
    }));
    if (session.sectionIndex === 9) navigate(`/results/${session.id}`);
  };
  return (
    <main className="assessment">
      <div className="assessment-meta">
        <span>Section {session.sectionIndex + 1} of 10</span>
        <button className="quiet-button" onClick={onLeave}>
          Save & leave
        </button>
      </div>
      <div
        className="progress-track"
        aria-label={`Assessment progress: section ${session.sectionIndex + 1} of 10`}
      >
        <div style={{ width: `${(session.sectionIndex + progress / section.count) * 10}%` }} />
      </div>
      <div className="section-heading">
        <h1 ref={heading} tabIndex={-1}>
          {section.name}
        </h1>
        <span className="section-counter">
          {session.stage === 'practice'
            ? 'Practice'
            : session.stage === 'running'
              ? section.kind === 'speed'
                ? `Round ${progress + 1} of 2`
                : `${progress + 1} / ${section.count}`
              : section.area}
        </span>
      </div>
      {session.stage === 'intro' && (
        <div className="section-intro">
          <p className="intro">{section.description}</p>
          <ol className="instructions">
            {section.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
          <button className="button primary" onClick={() => void stage('practice')}>
            Try a practice
          </button>
        </div>
      )}
      {session.stage === 'practice' && (
        <>
          {section.kind === 'choice' && (
            <ChoiceQuestion
              key={`practice-${section.id}`}
              section={section.id}
              item={practiceBank[section.id]!}
              practice
              onPracticed={() => void stage('ready')}
            />
          )}
          {(section.id === 'sequence' || section.id === 'span') && (
            <MemoryPractice
              key={section.id}
              section={section.id}
              onPracticed={() => void stage('ready')}
            />
          )}
          {(section.id === 'comparison' || section.id === 'search') && (
            <SpeedTask
              key={`practice-${section.id}`}
              section={section.id}
              block={0}
              practice
              onPracticed={() => void stage('ready')}
            />
          )}
        </>
      )}
      {session.stage === 'ready' && (
        <div className="task-ready">
          <h2>Ready when you are.</h2>
          <p>
            {section.kind === 'choice'
              ? 'Choose an answer, then press Next. Your answers are saved as you go.'
              : section.kind === 'speed'
                ? 'You can take a break between rounds. Each round runs once.'
                : 'Start each sequence when you’re ready. Keep this tab open while it plays.'}
          </p>
          <button className="button primary" onClick={() => void stage('running')}>
            Begin section
          </button>
          <button className="quiet-button block-link" onClick={() => void stage('intro')}>
            Read instructions again
          </button>
        </div>
      )}
      {session.stage === 'running' && (
        <>
          {session.flags.includes('interrupted') &&
            !session.activeTrial &&
            (session.responses.at(-1)?.status === 'interrupted' ||
              session.speedBlocks.at(-1)?.interrupted) && (
              <p className="notice" role="status">
                The previous task was interrupted. It is marked in your results; continue when
                you’re ready.
              </p>
            )}
          {section.kind === 'choice' && choiceBank[section.id]?.[progress] && (
            <ChoiceQuestion
              key={choiceBank[section.id]![progress].id}
              item={choiceBank[section.id]![progress]}
              section={section.id}
              onAnswer={commit}
            />
          )}
          {(section.id === 'sequence' || section.id === 'span') && (
            <MemoryTask
              key={`${section.id}-${progress}`}
              section={section.id}
              index={progress}
              onStart={() =>
                update(session.id, (s) => ({
                  ...s,
                  activeTrial:
                    section.id === 'sequence' ? sequenceTrial(progress).id : spanTrial(progress).id,
                }))
              }
              onAnswer={commit}
            />
          )}
          {(section.id === 'comparison' || section.id === 'search') && (
            <SpeedTask
              key={`${section.id}-${progress}`}
              section={section.id}
              block={progress}
              onStart={() =>
                update(session.id, (s) => ({
                  ...s,
                  activeTrial: `${section.id}-block-${progress}`,
                }))
              }
              onComplete={(block) => {
                void update(session.id, (s) =>
                  recordBlock(block.interrupted ? flagSession(s, 'interrupted') : s, block),
                );
              }}
            />
          )}
        </>
      )}
      {session.stage === 'break' && (
        <div className="task-ready">
          <span className="completion-check" aria-hidden="true">
            <Icon path={mdiCheck} size={1.4} aria-hidden="true" />
          </span>
          <h2>
            {session.sectionIndex === 9 ? 'You’ve finished the assessment.' : 'Section complete.'}
          </h2>
          <p>
            {session.sectionIndex === 9
              ? 'Your results are ready.'
              : `Take a moment. Next is ${sections[session.sectionIndex + 1].name.toLowerCase()}.`}
          </p>
          {session.sectionIndex === 9 && (
            <p className="small muted">You can save or print your report on the next screen.</p>
          )}
          <button className="button primary" onClick={nextSection}>
            {session.sectionIndex === 9 ? 'View results' : 'Continue'}
          </button>
          <button className="quiet-button block-link" onClick={onLeave}>
            Save & finish later
          </button>
        </div>
      )}
    </main>
  );
}
