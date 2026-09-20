import { describe, expect, test } from 'vitest';
import {
  createSession as createCurrentSession,
  LEGACY_FORM_VERSION,
  sections,
  type Session,
} from './domain';
import { choiceBank, practiceBank, sequenceTrial, spanTrial, speedTrial } from './content';
import {
  glyphKey,
  holeKey,
  objectKey,
  rotations,
  unfold,
  visibleCubeCount,
} from './content/visual';
import { interruptSession, parseSession, recordResponse } from './session';
import { scoreSession } from './scoring';
import { registerReportTool, type ReportContext } from './report-tool';

const createSession = (mode: Session['inputMode']) =>
  createCurrentSession(mode, false, LEGACY_FORM_VERSION);

describe('fixed assessment form', () => {
  test('contains every promised item, distinct practice, and six unique visual options', () => {
    const all = Object.values(choiceBank).flat();
    expect(all).toHaveLength(106);
    expect(new Set(all.map((i) => i.id)).size).toBe(106);
    expect(
      new Set(
        choiceBank.matrix!.map((i) => i.kind === 'matrix' && JSON.stringify(i.cells.map(glyphKey))),
      ).size,
    ).toBe(18);
    expect(
      new Set(choiceBank.rotation!.map((i) => i.kind === 'rotation' && objectKey(i.object))).size,
    ).toBe(18);
    for (const section of sections.filter((s) => s.kind === 'choice')) {
      const items = choiceBank[section.id]!;
      expect(items).toHaveLength(section.count);
      const practice = practiceBank[section.id]!;
      for (const item of [...items, practice]) {
        expect(item.answer).toBeLessThan(item.options.length);
        expect(item.answer).toBeGreaterThanOrEqual(0);
        if (item.kind === 'text') expect(new Set(item.options).size).toBe(item.options.length);
        if (item.kind === 'matrix') {
          expect(item.choices).toHaveLength(6);
          expect(new Set(item.choices.map(glyphKey)).size).toBe(6);
          if (practice.kind === 'matrix' && item !== practice)
            expect(item.cells.map(glyphKey)).not.toEqual(practice.cells.map(glyphKey));
        }
        if (item.kind === 'rotation') {
          const keys = item.choices.map(objectKey);
          expect(new Set(keys).size).toBe(6);
          expect(keys[item.answer]).toBe(objectKey(item.object));
          for (const view of [item.object, ...item.choices])
            expect(visibleCubeCount(view)).toBe(view.length);
        }
        if (item.kind === 'folding') {
          expect(new Set(item.choices.map(holeKey)).size).toBe(6);
          expect(holeKey(item.choices[item.answer])).toBe(holeKey(unfold(item.holes, item.folds)));
          if (practice.kind === 'folding' && item !== practice)
            expect({ folds: item.folds, holes: item.holes }).not.toEqual({
              folds: practice.folds,
              holes: practice.holes,
            });
        }
      }
    }
  });

  test('spatial transformations preserve handedness and reverse paper folds correctly', () => {
    const asymmetric: [number, number, number][] = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3],
    ];
    expect(new Set(rotations(asymmetric).map((p) => JSON.stringify(p))).size).toBe(24);
    expect(objectKey(asymmetric)).not.toBe(objectKey(asymmetric.map(([x, y, z]) => [-x, y, z])));
    expect(unfold([[1, 2]], ['left', 'up'])).toEqual([
      [1, 2],
      [1, 6],
      [7, 2],
      [7, 6],
    ]);
  });

  test('memory rules and speed answer keys describe the actual stimuli', () => {
    for (let i = 0; i < 12; i++) {
      const t = sequenceTrial(i);
      expect(t.answer).toEqual(
        i % 2 === 0 ? [...t.digits].reverse() : [...t.digits].sort((a, b) => a - b),
      );
      expect(t.digits).toHaveLength(3 + Math.floor(i / 2));
    }
    for (let i = 0; i < 10; i++)
      for (const p of spanTrial(i).processing) {
        const symmetric = p.cells.every(
          (cell, j) => cell === p.cells[Math.floor(j / 4) * 4 + 3 - (j % 4)],
        );
        expect(p.symmetric).toBe(symmetric);
      }
    for (const section of ['comparison', 'search'] as const)
      for (let b = 0; b < 2; b++)
        for (let i = 0; i < 250; i++) {
          const t = speedTrial(section, b, i);
          expect(t.answer).toBe(
            section === 'comparison'
              ? t.left.every((g, j) => glyphKey(g) === glyphKey(t.right[j]))
              : t.grid.some((g) => glyphKey(g) === glyphKey(t.target)),
          );
        }
  });
});

describe('session integrity and score boundaries', () => {
  test('the optional report tool reads scores, validates input and unregisters', () => {
    let registered: Parameters<ReportContext['registerTool']>[0] | undefined;
    let signal: AbortSignal | undefined;
    const close = registerReportTool(createSession('keyboard'), {
      registerTool(tool, options) {
        registered = tool;
        signal = options.signal;
      },
    });
    expect(registered?.name).toBe('get_open_iq_results');
    expect(registered?.annotations.readOnlyHint).toBe(true);
    expect(registered?.execute({})).toMatchObject({ completed: false, form: 'open-iq-1.0' });
    expect(() => registered?.execute({ answers: [] })).toThrow();
    close();
    expect(signal?.aborted).toBe(true);
  });
  test('round-trips exports and rejects fabricated progress or duplicate answers', () => {
    const original = createSession('keyboard');
    expect(parseSession(JSON.parse(JSON.stringify(original)))).toEqual(original);
    const next = recordResponse(
      { ...original, stage: 'running' },
      { section: 'matrix', itemId: 'matrix-1', answer: 2, elapsedMs: 1000, status: 'answered' },
    );
    expect(parseSession(next)).toEqual(next);
    expect(() =>
      parseSession({ ...next, responses: [...next.responses, ...next.responses] }),
    ).toThrow();
    expect(() => parseSession({ ...next, sectionIndex: 10, stage: 'complete' })).toThrow();
    expect(() =>
      parseSession({ ...next, responses: [{ ...next.responses[0], answer: 99 }] }),
    ).toThrow();
    expect(() => parseSession({ ...next, activeTrial: 'made-up-task' })).toThrow();
    expect(recordResponse(next, next.responses[0]).responses).toHaveLength(1);
  });

  test('an interrupted memory trial advances exactly once and remains missing', () => {
    const session: Session = {
      ...createSession('keyboard'),
      sectionIndex: 2,
      stage: 'running',
      activeTrial: 'sequence-1',
    };
    const recovered = interruptSession(session);
    expect(recovered.responses[0]).toMatchObject({
      itemId: 'sequence-1',
      status: 'interrupted',
      answer: null,
    });
    expect(recovered.activeTrial).toBeNull();
    expect(interruptSession(recovered)).toBe(recovered);
    expect(scoreSession(recovered)[2]).toMatchObject({ correct: 0, exact: 0, interrupted: 1 });
  });

  test('scores positional recall and excludes every response in interrupted speed rounds', () => {
    const session = createSession('touch');
    const expected = sequenceTrial(0).answer;
    session.responses = [
      {
        section: 'matrix',
        itemId: 'matrix-1',
        answer: choiceBank.matrix![0].answer,
        elapsedMs: 100,
        status: 'answered',
      },
      {
        section: 'sequence',
        itemId: 'sequence-1',
        answer: [expected[0], 0, 0],
        elapsedMs: 1000,
        status: 'answered',
      },
    ];
    session.speedBlocks = [
      {
        section: 'search',
        block: 0,
        durationMs: 60_000,
        interrupted: false,
        responses: [
          { trial: 0, answer: speedTrial('search', 0, 0).answer, elapsedMs: 1000 },
          { trial: 1, answer: !speedTrial('search', 0, 1).answer, elapsedMs: 2000 },
        ],
      },
      {
        section: 'search',
        block: 1,
        durationMs: 5000,
        interrupted: true,
        responses: [{ trial: 0, answer: speedTrial('search', 1, 0).answer, elapsedMs: 1000 }],
      },
    ];
    const scores = scoreSession(session);
    expect(scores[0]).toMatchObject({ correct: 1, total: 18 });
    expect(scores[2]).toMatchObject({ correct: 1, exact: 0 });
    expect(scores[9]).toMatchObject({ correct: 1, total: 2, elapsed: 60_000, interrupted: 1 });
  });
});
