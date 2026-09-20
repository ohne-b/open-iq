import { useState } from 'react';
import type { ChoiceItem, Response, SectionId } from '../domain';
import { ItemStimulus, OptionStimulus } from './Stimulus';

export function ChoiceQuestion({
  item,
  section,
  onAnswer,
  practice = false,
  onPracticed,
}: {
  item: ChoiceItem;
  section: SectionId;
  onAnswer?: (response: Response) => void;
  practice?: boolean;
  onPracticed?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [skip, setSkip] = useState(false);
  const [started] = useState(() => performance.now());
  const visual = item.kind !== 'text';
  const submit = () => {
    if (selected === null) return;
    if (practice) setChecked(true);
    else
      onAnswer?.({
        itemId: item.id,
        section,
        answer: selected,
        elapsedMs: Math.min(86_400_000, performance.now() - started),
        status: 'answered',
      });
  };
  return (
    <div className="question">
      <h2 className="question-prompt" tabIndex={-1}>
        {visual || (item.kind === 'text' && item.sequence)
          ? item.prompt
          : section === 'words'
            ? 'Which word is closest in meaning?'
            : 'Complete the relationship.'}
      </h2>
      <ItemStimulus item={item} />
      <fieldset className={`options ${visual ? 'visual-options' : 'text-options'}`}>
        <legend className="sr-only">Choose your answer</legend>
        {item.options.map((option, i) => (
          <label className={`option ${selected === i ? 'selected' : ''}`} key={i}>
            <input
              type="radio"
              name={item.id}
              value={i}
              checked={selected === i}
              onChange={() => {
                setSelected(i);
                setChecked(false);
                setSkip(false);
              }}
              aria-label={visual ? `Option ${option}` : option}
            />
            <span className="option-letter" aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            <OptionStimulus item={item} index={i} />
            <span className="option-check" aria-hidden="true">
              {selected === i ? '✓' : ''}
            </span>
          </label>
        ))}
      </fieldset>
      {checked && (
        <div className="practice-feedback" role="status">
          <strong>
            {selected === item.answer
              ? 'That’s right.'
              : `The answer is ${visual ? item.options[item.answer] : `“${item.options[item.answer]}”`}.`}
          </strong>
          <p>{item.explanation}</p>
        </div>
      )}
      {skip ? (
        <div className="skip-confirm" role="group" aria-label="Confirm skip">
          <p>Leave this answer blank? You won’t be able to return.</p>
          <div className="actions">
            <button className="button secondary" onClick={() => setSkip(false)}>
              Keep thinking
            </button>
            <button
              className="button primary"
              onClick={() =>
                onAnswer?.({
                  itemId: item.id,
                  section,
                  answer: null,
                  elapsedMs: Math.min(86_400_000, performance.now() - started),
                  status: 'omitted',
                })
              }
            >
              Skip question
            </button>
          </div>
        </div>
      ) : (
        <div className="question-actions">
          {!practice && (
            <button className="quiet-button" onClick={() => setSkip(true)}>
              Skip
            </button>
          )}
          {practice && checked ? (
            <button className="button primary" onClick={onPracticed}>
              Continue
            </button>
          ) : (
            <button className="button primary" onClick={submit} disabled={selected === null}>
              {practice ? 'Check answer' : 'Next'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
