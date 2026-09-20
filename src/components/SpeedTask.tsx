import { useEffect, useRef, useState } from 'react';
import { speedDuration, speedTrial } from '../content';
import type { SpeedBlock } from '../domain';
import { GlyphDrawing } from './Stimulus';

export function SpeedTask({
  section,
  block,
  practice = false,
  onStart,
  onComplete,
  onPracticed,
}: {
  section: 'comparison' | 'search';
  block: number;
  practice?: boolean;
  onStart?: () => Promise<void>;
  onComplete?: (block: SpeedBlock) => void;
  onPracticed?: () => void;
}) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>(practice ? 'running' : 'ready');
  const [trialIndex, setTrialIndex] = useState(0);
  const [remaining, setRemaining] = useState(speedDuration(section));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const active = useRef(practice);
  const accepting = useRef(true);
  const started = useRef(0);
  const answers = useRef<SpeedBlock['responses']>([]);
  const currentTrial = useRef(0);
  const lastFrame = useRef(0);
  const wallStart = useRef(0);
  const trial = speedTrial(section, block, trialIndex, practice);
  const finishRef = useRef<(interrupted?: boolean) => void>(() => {});
  const finish = (interrupted = false) => {
    if (!active.current) return;
    active.current = false;
    setPhase('done');
    if (practice) {
      setFeedback('Practice was interrupted. Try again when you’re ready.');
      return;
    }
    const durationMs = interrupted
      ? Math.min(speedDuration(section), Math.max(0, performance.now() - started.current))
      : speedDuration(section);
    onComplete?.({
      section,
      block,
      durationMs,
      interrupted,
      responses: answers.current.filter((r) => r.elapsedMs < durationMs),
    });
  };
  useEffect(() => {
    finishRef.current = finish;
  });
  const start = async () => {
    if (active.current || starting) return;
    setStarting(true);
    await onStart?.();
    started.current = lastFrame.current = performance.now();
    wallStart.current = Date.now();
    active.current = true;
    accepting.current = true;
    setPhase('running');
    setStarting(false);
  };

  useEffect(() => {
    if (phase !== 'running' || practice) return;
    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - started.current;
      if (
        document.hidden ||
        now - lastFrame.current > 1500 ||
        Math.abs(Date.now() - wallStart.current - elapsed) > 1500
      ) {
        finishRef.current(true);
        return;
      }
      lastFrame.current = now;
      setRemaining(Math.max(0, speedDuration(section) - elapsed));
      if (elapsed >= speedDuration(section)) finishRef.current();
    }, 100);
    return () => clearInterval(interval);
  }, [phase, practice, section]);

  useEffect(() => {
    const hidden = () => {
      if (document.hidden) finishRef.current(true);
    };
    document.addEventListener('visibilitychange', hidden);
    return () => document.removeEventListener('visibilitychange', hidden);
  }, []);

  const respond = (answer: boolean) => {
    if (!active.current || !accepting.current || feedback) return;
    const elapsed = performance.now() - started.current;
    if (!practice && elapsed >= speedDuration(section)) {
      finishRef.current();
      return;
    }
    accepting.current = false;
    if (practice) {
      setFeedback(
        answer === trial.answer
          ? 'Correct.'
          : `The correct answer is ${section === 'comparison' ? (trial.answer ? 'same' : 'different') : trial.answer ? 'present' : 'absent'}.`,
      );
    } else {
      if (currentTrial.current >= 1000) {
        finishRef.current(true);
        return;
      }
      answers.current.push({ trial: currentTrial.current, answer, elapsedMs: elapsed });
      currentTrial.current++;
      setTrialIndex(currentTrial.current);
      requestAnimationFrame(() => {
        accepting.current = true;
      });
    }
  };
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        phase !== 'running' ||
        !['f', 'j'].includes(event.key.toLowerCase())
      )
        return;
      event.preventDefault();
      respond(event.key.toLowerCase() === 'j');
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  });

  if (phase === 'ready')
    return (
      <div className="task-ready">
        <h2>Round {block + 1} of 2</h2>
        <p>{section === 'comparison' ? '90 seconds' : '60 seconds'}. Work quickly and carefully.</p>
        <button className="button primary" onClick={start} disabled={starting}>
          {starting ? 'Getting ready…' : 'Start round'}
        </button>
        <p className="small muted">Keep this tab open for the whole round.</p>
      </div>
    );
  return (
    <div className="speed-task">
      <div className="speed-top">
        <h2 className="question-prompt">
          {section === 'comparison' ? 'Are the two groups the same?' : 'Is the target in the grid?'}
        </h2>
        {!practice && (
          <span className="timer" role="timer" aria-label="Seconds remaining">
            {Math.ceil(remaining / 1000)}
            <span>s</span>
          </span>
        )}
      </div>
      {section === 'comparison' ? (
        <div className="comparison-groups" aria-label="Two symbol groups">
          <div>
            {trial.left.map((glyph, i) => (
              <GlyphDrawing key={i} glyph={glyph} />
            ))}
          </div>
          <div>
            {trial.right.map((glyph, i) => (
              <GlyphDrawing key={i} glyph={glyph} />
            ))}
          </div>
        </div>
      ) : (
        <div className="search-stimulus">
          <div className="search-target">
            <span className="small muted">Target</span>
            <GlyphDrawing glyph={trial.target} />
          </div>
          <div className="search-grid" aria-label="Search grid">
            {trial.grid.map((glyph, i) => (
              <GlyphDrawing key={i} glyph={glyph} />
            ))}
          </div>
        </div>
      )}
      <div className="binary-actions">
        <button
          className="button secondary"
          onClick={() => respond(false)}
          disabled={!!feedback || phase === 'done'}
        >
          {section === 'comparison' ? 'Different' : 'Absent'}
          <kbd>F</kbd>
        </button>
        <button
          className="button secondary"
          onClick={() => respond(true)}
          disabled={!!feedback || phase === 'done'}
        >
          {section === 'comparison' ? 'Same' : 'Present'}
          <kbd>J</kbd>
        </button>
      </div>
      {practice && feedback && (
        <div className="practice-feedback" role="status">
          <p>{feedback}</p>
          {trialIndex < 2 && phase !== 'done' ? (
            <button
              className="button primary"
              onClick={() => {
                currentTrial.current++;
                setTrialIndex(currentTrial.current);
                setFeedback(null);
                accepting.current = true;
              }}
            >
              Next practice
            </button>
          ) : (
            <button className="button primary" onClick={onPracticed}>
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}
