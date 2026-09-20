import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ChoiceQuestion } from './ChoiceQuestion';
import { MemoryTask } from './MemoryTask';
import { SpeedTask } from './SpeedTask';
import { choiceBank, sequenceTrial, speedTrial } from '../content';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('assessment interactions', () => {
  test('requires a choice and makes skipping explicit without revealing the answer', () => {
    const onAnswer = vi.fn();
    render(<ChoiceQuestion item={choiceBank.words![0]} section="words" onAnswer={onAnswer} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Skip question' }));
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'omitted', answer: null }),
    );
    expect(screen.queryByText(/The answer is/)).not.toBeInTheDocument();
  });

  test('plays one sequence and accepts keyboard recall in the requested order', async () => {
    vi.useFakeTimers();
    const onAnswer = vi.fn();
    const onStart = vi.fn().mockResolvedValue(undefined);
    render(<MemoryTask section="sequence" index={0} onStart={onStart} onAnswer={onAnswer} />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Show sequence' })));
    expect(onStart).toHaveBeenCalledTimes(1);
    const sequence = sequenceTrial(0);
    for (let i = 0; i < sequence.digits.length; i++) {
      expect(screen.getByLabelText(`Digit ${i + 1}: ${sequence.digits[i]}`)).toBeInTheDocument();
      await act(async () => vi.advanceTimersByTimeAsync(800));
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
      await act(async () => vi.advanceTimersByTimeAsync(200));
    }
    for (const digit of sequence.answer) fireEvent.keyDown(document.body, { key: String(digit) });
    fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ answer: sequence.answer, status: 'answered' }),
    );
  });

  test('marks a hidden memory sequence as interrupted and does not accept later input', async () => {
    vi.useFakeTimers();
    const onAnswer = vi.fn();
    render(<MemoryTask section="sequence" index={0} onAnswer={onAnswer} />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Show sequence' })));
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    hidden.mockRestore();
    expect(onAnswer).toHaveBeenCalledOnce();
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'interrupted', answer: null }),
    );
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    expect(onAnswer).toHaveBeenCalledOnce();
  });

  test('records speed choices, ignores held keys, and closes at the exact deadline', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<SpeedTask section="search" block={0} onComplete={onComplete} />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Start round' })));
    await act(async () => vi.advanceTimersByTimeAsync(100));
    const answer = speedTrial('search', 0, 0).answer;
    fireEvent.keyDown(document, { key: answer ? 'j' : 'f', repeat: true });
    fireEvent.keyDown(document, { key: answer ? 'j' : 'f' });
    await act(async () => vi.advanceTimersByTimeAsync(59_900));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        durationMs: 60_000,
        interrupted: false,
        responses: [{ trial: 0, answer, elapsedMs: 100 }],
      }),
    );
    fireEvent.keyDown(document, { key: 'j' });
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
