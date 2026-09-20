import {
  sections,
  sessionSchema,
  flagSession,
  type Response,
  type Session,
  type SpeedBlock,
} from './domain';
import { choiceBank, sequenceTrial, spanTrial, speedDuration } from './content';

export function sectionProgress(session: Session, section = sections[session.sectionIndex]) {
  if (!section) return 0;
  return section.kind === 'speed'
    ? session.speedBlocks.filter((b) => b.section === section.id).length
    : session.responses.filter((r) => r.section === section.id).length;
}

export function recordResponse(session: Session, response: Response): Session {
  if (session.responses.some((r) => r.itemId === response.itemId)) return session;
  const next = { ...session, responses: [...session.responses, response], activeTrial: null };
  return {
    ...next,
    stage: sectionProgress(next) >= sections[next.sectionIndex].count ? 'break' : 'running',
  };
}

export function recordBlock(session: Session, block: SpeedBlock): Session {
  if (session.speedBlocks.some((b) => b.section === block.section && b.block === block.block))
    return session;
  const next = { ...session, speedBlocks: [...session.speedBlocks, block], activeTrial: null };
  return { ...next, stage: sectionProgress(next) >= 2 ? 'break' : 'running' };
}

export function interruptSession(session: Session): Session {
  if (!session.activeTrial) return session;
  const section = sections[session.sectionIndex];
  if (!section) return { ...session, activeTrial: null };
  const index = sectionProgress(session);
  const flagged = flagSession(session, 'interrupted');
  return section.kind === 'speed'
    ? recordBlock(flagged, {
        section: section.id as 'comparison' | 'search',
        block: index,
        durationMs: 0,
        interrupted: true,
        responses: [],
      })
    : recordResponse(flagged, {
        section: section.id,
        itemId: session.activeTrial,
        answer: null,
        elapsedMs: 0,
        status: 'interrupted',
      });
}

// Imported scores are never trusted. Validate the response record, then recompute.
export function parseSession(value: unknown): Session {
  const session = sessionSchema.parse(value);
  const ids = new Set<string>();
  for (const r of session.responses) {
    const section = sections.find((s) => s.id === r.section);
    if (!section || section.kind === 'speed' || ids.has(r.itemId))
      throw new Error('Invalid or duplicate response');
    ids.add(r.itemId);
    const index = session.responses
      .filter((x) => x.section === r.section)
      .findIndex((x) => x.itemId === r.itemId);
    const choice = choiceBank[r.section]?.[index];
    const memory =
      r.section === 'sequence'
        ? sequenceTrial(index)
        : r.section === 'span'
          ? spanTrial(index)
          : null;
    if (index >= section.count || r.itemId !== (choice?.id ?? memory?.id))
      throw new Error('Responses are out of order');
    if (r.status !== 'answered' && r.answer !== null) throw new Error('Unexpected answer');
    if (r.status === 'answered') {
      if (choice && (typeof r.answer !== 'number' || r.answer >= choice.options.length))
        throw new Error('Invalid choice');
      if (
        memory &&
        (!Array.isArray(r.answer) ||
          r.answer.length >
            (r.section === 'sequence'
              ? sequenceTrial(index).digits.length
              : spanTrial(index).positions.length) ||
          r.answer.some((n) => (r.section === 'sequence' ? n < 1 || n > 9 : n > 15)))
      )
        throw new Error('Invalid recall');
    }
    if (
      r.processing &&
      (r.section !== 'span' || r.processing.length > spanTrial(index).positions.length)
    )
      throw new Error('Invalid processing responses');
  }
  const blockKeys = new Set<string>();
  for (const b of session.speedBlocks) {
    const key = `${b.section}-${b.block}`;
    if (
      blockKeys.has(key) ||
      b.block !== session.speedBlocks.filter((x) => x.section === b.section).indexOf(b) ||
      b.durationMs > speedDuration(b.section)
    )
      throw new Error('Invalid speed block');
    blockKeys.add(key);
    if (!b.interrupted && b.durationMs !== speedDuration(b.section))
      throw new Error('Incomplete speed block');
    if (
      b.responses.some(
        (r, i) =>
          r.trial !== i ||
          r.elapsedMs >= b.durationMs ||
          (i > 0 && r.elapsedMs < b.responses[i - 1].elapsedMs),
      )
    )
      throw new Error('Invalid speed response order');
  }
  for (let i = 0; i < sections.length; i++) {
    const progress = sectionProgress(session, sections[i]);
    if (i < session.sectionIndex && progress !== sections[i].count)
      throw new Error('Missing earlier section');
    if (i > session.sectionIndex && progress) throw new Error('Unexpected later section');
  }
  if (session.stage === 'complete' && session.sectionIndex !== 10)
    throw new Error('Invalid completion state');
  if (session.sectionIndex === 10 && (session.stage !== 'complete' || session.activeTrial))
    throw new Error('Invalid completion state');
  const section = sections[session.sectionIndex];
  if (section) {
    const count = sectionProgress(session);
    if (session.stage === 'break' && count !== section.count) throw new Error('Unfinished section');
    if (session.stage === 'running' && count >= section.count)
      throw new Error('Finished section still running');
    if (['intro', 'practice', 'ready'].includes(session.stage) && count)
      throw new Error('Unexpected section state');
    if (session.activeTrial) {
      const expected =
        section.kind === 'speed'
          ? `${section.id}-block-${count}`
          : section.id === 'sequence'
            ? sequenceTrial(count).id
            : section.id === 'span'
              ? spanTrial(count).id
              : null;
      if (session.stage !== 'running' || count >= section.count || session.activeTrial !== expected)
        throw new Error('Invalid active trial');
    }
  }
  return session;
}
