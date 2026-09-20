import reference from './content/icar-reference.json';
import { FORM_VERSION, type Session } from './domain';
import { scoreSession } from './scoring';

export { reference as icarReference };
type Scale = keyof typeof reference.frequencies;

// A descriptive standard score in the documented volunteer cohort, not population IQ.
export function referenceScore(raw: number, scale: Scale) {
  const { counts, mean, sd } = reference.frequencies[scale];
  if (!Number.isInteger(raw) || raw < 0 || raw >= counts.length)
    throw new Error('Invalid raw score');
  const below = counts.slice(0, raw).reduce((n, count) => n + count, 0);
  return {
    value: Math.round(100 + (15 * (raw - mean)) / sd),
    percentile: Math.round((100 * (below + counts[raw] / 2)) / reference.n),
  };
}

export function scoreIcar(session: Session) {
  if (session.version !== FORM_VERSION) throw new Error('ICAR scores require the ICAR form');
  const scores = scoreSession(session).map((score) => ({
    ...score,
    estimate:
      score.completed && !score.interrupted
        ? referenceScore(score.correct, score.section.id as Scale)
        : null,
  }));
  const raw = scores.reduce((n, score) => n + score.correct, 0);
  return {
    referenceId: reference.id,
    raw,
    scores,
    overall:
      session.stage === 'complete' && scores.every((score) => score.estimate)
        ? referenceScore(raw, 'overall')
        : null,
  };
}
