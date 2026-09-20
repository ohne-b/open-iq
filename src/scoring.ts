import { sections, type Session } from './domain';
import { itemById, sequenceTrial, spanTrial, speedTrial } from './content';

export function scoreSession(session: Session) {
  return sections.map((section) => {
    const responses = session.responses.filter((r) => r.section === section.id);
    const blocks = session.speedBlocks.filter((b) => b.section === section.id);
    const attempted = responses.filter((r) => r.status === 'answered').length;
    const omitted = responses.filter((r) => r.status === 'omitted').length;
    const interrupted =
      responses.filter((r) => r.status === 'interrupted').length +
      blocks.filter((b) => b.interrupted).length;
    if (section.kind === 'speed') {
      // Interrupted rounds remain in the record, but are excluded from the timed score.
      const usable = blocks.filter((b) => !b.interrupted);
      const all = usable.flatMap((b) =>
        b.responses.map((r) => ({
          ...r,
          correct: r.answer === speedTrial(b.section, b.block, r.trial).answer,
        })),
      );
      return {
        section,
        completed: blocks.length === 2,
        started: blocks.length > 0,
        correct: all.filter((r) => r.correct).length,
        total: all.length,
        attempted: all.length,
        omitted,
        interrupted,
        exact: 0,
        processingCorrect: 0,
        processingTotal: 0,
        elapsed: usable.reduce((n, b) => n + b.durationMs, 0),
        usableBlocks: usable.length,
      };
    }
    let correct = 0,
      total = section.count,
      exact = 0,
      processingCorrect = 0,
      processingTotal = 0;
    if (section.kind === 'choice')
      correct = responses.filter(
        (r) => r.status === 'answered' && r.answer === itemById.get(r.itemId)?.answer,
      ).length;
    else {
      total = 0;
      for (let i = 0; i < section.count; i++) {
        const expected =
          section.id === 'sequence' ? sequenceTrial(i).answer : spanTrial(i).positions;
        const response = responses[i];
        total += expected.length;
        const answer = Array.isArray(response?.answer) ? response.answer : [];
        correct += expected.filter((n, j) => answer[j] === n).length;
        if (expected.length === answer.length && expected.every((n, j) => answer[j] === n)) exact++;
        if (section.id === 'span' && response) {
          const trial = spanTrial(i);
          processingTotal += trial.processing.length;
          processingCorrect += trial.processing.filter(
            (p, j) => response.processing?.[j] === p.symmetric,
          ).length;
        }
      }
    }
    return {
      section,
      completed: responses.length === section.count,
      started: responses.length > 0,
      correct,
      total,
      attempted,
      omitted,
      interrupted,
      exact,
      processingCorrect,
      processingTotal,
      elapsed: responses.reduce((n, r) => n + r.elapsedMs, 0),
      usableBlocks: 0,
    };
  });
}
