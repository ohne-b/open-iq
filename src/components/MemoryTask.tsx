import { useEffect, useRef, useState } from 'react';
import { sequenceTrial, spanTrial } from '../content';
import type { Response } from '../domain';

type Props = {
  section: 'sequence' | 'span';
  index: number;
  practice?: boolean;
  onStart?: () => Promise<void>;
  onAnswer: (response: Response) => void;
};

export function MemoryTask({ section, index, practice = false, onStart, onAnswer }: Props) {
  const sequence = sequenceTrial(index, practice);
  const spatial = spanTrial(index, practice);
  const length = section === 'sequence' ? sequence.digits.length : spatial.positions.length;
  const [phase, setPhase] = useState<'ready' | 'show' | 'gap' | 'judge' | 'recall' | 'done'>(
    'ready',
  );
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<number[]>([]);
  const [starting, setStarting] = useState(false);
  const processing = useRef<boolean[]>([]);
  const active = useRef(false);
  const started = useRef(0);
  const submitButton = useRef<HTMLButtonElement>(null);
  const instruction =
    section === 'span'
      ? 'Remember the positions in order.'
      : sequence.mode === 'reverse'
        ? 'Enter the digits backwards.'
        : 'Enter the digits from smallest to largest.';
  const finishRef = useRef<(interrupted?: boolean) => void>(() => {});
  const finish = (interrupted = false) => {
    if (!active.current) return;
    active.current = false;
    setPhase('done');
    onAnswer({
      itemId: section === 'sequence' ? sequence.id : spatial.id,
      section,
      answer: interrupted ? null : answer,
      elapsedMs: Math.min(86_400_000, performance.now() - started.current),
      status: interrupted ? 'interrupted' : 'answered',
      ...(section === 'span' ? { processing: processing.current } : {}),
    });
  };
  useEffect(() => {
    finishRef.current = finish;
  });
  const begin = async () => {
    if (starting || active.current) return;
    setStarting(true);
    active.current = true;
    started.current = performance.now();
    await onStart?.();
    if (active.current) {
      started.current = performance.now();
      setPhase('show');
    }
    setStarting(false);
  };

  useEffect(() => {
    if (phase !== 'show' && phase !== 'gap') return;
    const duration = phase === 'gap' ? 200 : section === 'sequence' ? 800 : 1000;
    const onset = performance.now();
    const timer = window.setTimeout(() => {
      if (document.hidden || performance.now() - onset > duration + 300) {
        finishRef.current(true);
        return;
      }
      if (phase === 'show') setPhase(section === 'sequence' ? 'gap' : 'judge');
      else if (position + 1 < length) {
        setPosition((p) => p + 1);
        setPhase('show');
      } else setPhase('recall');
    }, duration);
    return () => clearTimeout(timer);
  }, [phase, position, section, length]);

  useEffect(() => {
    const hidden = () => {
      if (document.hidden) finishRef.current(true);
    };
    document.addEventListener('visibilitychange', hidden);
    return () => document.removeEventListener('visibilitychange', hidden);
  }, []);

  const append = (n: number) =>
    setAnswer((current) =>
      current.length < length && (section !== 'span' || !current.includes(n))
        ? [...current, n]
        : current,
    );
  const judge = (symmetric: boolean) => {
    if (phase !== 'judge') return;
    processing.current.push(symmetric);
    if (position + 1 < length) {
      setPosition((p) => p + 1);
      setPhase('show');
    } else setPhase('recall');
  };
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target as HTMLElement)?.closest('input, textarea, dialog')
      )
        return;
      if (phase === 'recall' && section === 'sequence' && /^[1-9]$/.test(event.key)) {
        event.preventDefault();
        append(Number(event.key));
      }
      if (phase === 'recall' && event.key === 'Backspace') {
        event.preventDefault();
        setAnswer((a) => a.slice(0, -1));
      }
      if (phase === 'judge' && ['f', 'j'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        judge(event.key.toLowerCase() === 'j');
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  });

  return (
    <div className="memory-task">
      <h2 className="question-prompt">{instruction}</h2>
      {phase === 'ready' ? (
        <div className="task-ready">
          <p>
            {length}{' '}
            {section === 'sequence'
              ? 'digits, shown one at a time.'
              : 'positions, with a symmetry question after each.'}
          </p>
          <button className="button primary" onClick={begin} disabled={starting}>
            {starting ? 'Getting ready…' : 'Show sequence'}
          </button>
          <p className="small muted">The sequence plays once.</p>
        </div>
      ) : (
        <>
          <div className="memory-stage">
            {section === 'sequence' && (phase === 'show' || phase === 'gap') && (
              <div
                className="memory-digit"
                aria-label={
                  phase === 'show' ? `Digit ${position + 1}: ${sequence.digits[position]}` : 'Pause'
                }
              >
                {phase === 'show' ? sequence.digits[position] : ''}
              </div>
            )}
            {section === 'span' && phase === 'show' && (
              <div className="spatial-grid" aria-label={`Position ${position + 1}`} role="img">
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className={spatial.positions[position] === i ? 'lit' : ''} />
                ))}
              </div>
            )}
            {phase === 'judge' && (
              <>
                <p className="centered">Does this shape have left-to-right mirror symmetry?</p>
                <div className="symmetry-grid" role="img" aria-label="Shape for symmetry judgment">
                  {spatial.processing[position].cells.map((filled, i) => (
                    <div key={i} className={filled ? 'filled' : ''} />
                  ))}
                </div>
                <div className="binary-actions">
                  <button className="button secondary" onClick={() => judge(false)}>
                    No <kbd>F</kbd>
                  </button>
                  <button className="button secondary" onClick={() => judge(true)}>
                    Yes <kbd>J</kbd>
                  </button>
                </div>
              </>
            )}
            {phase === 'recall' && (
              <>
                <p className="centered muted">
                  {section === 'sequence'
                    ? 'Enter the sequence.'
                    : 'Select the positions in the order shown.'}
                </p>
                {section === 'sequence' ? (
                  <>
                    <div
                      className="recall-slots"
                      aria-live="polite"
                      aria-label={`Your answer: ${answer.join(', ') || 'empty'}`}
                    >
                      {Array.from({ length }, (_, i) => (
                        <span key={i} className={answer[i] === undefined ? 'empty' : ''}>
                          {answer[i] ?? '·'}
                        </span>
                      ))}
                    </div>
                    <div className="digit-pad">
                      {Array.from({ length: 9 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => append(i + 1)}
                          disabled={answer.length === length}
                          aria-label={`Digit ${i + 1}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="spatial-grid recall-grid">
                    {Array.from({ length: 16 }, (_, i) => (
                      <button
                        key={i}
                        className={answer.includes(i) ? 'chosen' : ''}
                        aria-label={`Row ${Math.floor(i / 4) + 1}, column ${(i % 4) + 1}${answer.includes(i) ? `, selected ${answer.indexOf(i) + 1}` : ''}`}
                        onClick={() => append(i)}
                        disabled={answer.includes(i) || answer.length === length}
                      >
                        {answer.includes(i) ? answer.indexOf(i) + 1 : ''}
                      </button>
                    ))}
                  </div>
                )}
                <div className="recall-edit">
                  <button
                    className="quiet-button"
                    onClick={() => setAnswer((a) => a.slice(0, -1))}
                    disabled={!answer.length}
                  >
                    Undo
                  </button>
                  <span className="small muted">
                    {answer.length} of {length}
                  </span>
                  <button
                    className="quiet-button"
                    onClick={() => setAnswer([])}
                    disabled={!answer.length}
                  >
                    Clear
                  </button>
                </div>
                <div className="centered">
                  <button ref={submitButton} className="button primary" onClick={() => finish()}>
                    {answer.length < length ? 'Submit what I remember' : 'Submit answer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
