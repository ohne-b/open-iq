import { describe, expect, test } from 'vitest';
import { createSession, FORM_VERSION, LEGACY_FORM_VERSION, icarSections } from './domain';
import {
  icarBank,
  icarCubes,
  icarMatrices,
  referenceCube,
  type CubeMark,
  type MarkedCube,
} from './content/icar';
import { icarReference, referenceScore, scoreIcar } from './icar-scoring';
import { parseSession, recordResponse } from './session';

function complete(omit = false) {
  const session = createSession('keyboard');
  session.responses = icarSections.flatMap((section) =>
    icarBank[section.id]!.map((item) => ({
      section: section.id,
      itemId: item.id,
      answer: omit ? null : item.answer,
      elapsedMs: 1000,
      status: omit ? ('omitted' as const) : ('answered' as const),
    })),
  );
  session.sectionIndex = 4;
  session.stage = 'complete';
  return session;
}

describe('ICAR adaptation and study reference', () => {
  test('preserves the published 16-item identities, option order and answer key', () => {
    const items = Object.values(icarBank).flat();
    expect(items.map((item) => item.id)).toEqual([
      'VR.04',
      'VR.16',
      'VR.17',
      'VR.19',
      'LN.07',
      'LN.33',
      'LN.34',
      'LN.58',
      'MR.45',
      'MR.46',
      'MR.47',
      'MR.55',
      'R3D.03',
      'R3D.04',
      'R3D.06',
      'R3D.08',
    ]);
    // The psych::iqitems documentation lists these 1-based keys independently of our bank.
    expect(items.map((item) => item.answer + 1)).toEqual([
      4, 4, 4, 6, 6, 3, 4, 4, 5, 2, 2, 4, 3, 2, 6, 7,
    ]);
    expect(items.map((item) => item.options.length)).toEqual([
      6, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8,
    ]);
    for (const matrix of Object.values(icarMatrices)) {
      expect(matrix.cells).toHaveLength(8);
      expect(matrix.choices).toHaveLength(6);
      expect(new Set(matrix.choices.map((choice) => JSON.stringify(choice))).size).toBe(6);
    }
  });

  test('recomputes aggregate moments, scores and tied empirical percentiles', () => {
    expect(icarReference.n).toBe(3480);
    for (const scale of Object.values(icarReference.frequencies)) {
      const expanded = scale.counts.flatMap((count, raw) => Array<number>(count).fill(raw));
      expect(expanded).toHaveLength(3480);
      const mean = expanded.reduce((a, b) => a + b) / expanded.length;
      const sd = Math.sqrt(
        expanded.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (expanded.length - 1),
      );
      expect(scale.mean).toBeCloseTo(mean, 12);
      expect(scale.sd).toBeCloseTo(sd, 10);
    }
    expect(referenceScore(4, 'rotation')).toEqual({ value: 136, percentile: 96 });
    expect(referenceScore(0, 'rotation')).toEqual({ value: 89, percentile: 27 });
    expect(() => referenceScore(17, 'overall')).toThrow();
    expect(() => referenceScore(1.5, 'verbal')).toThrow();
    const result = scoreIcar(parseSession(complete()));
    expect(result.overall).toEqual({ value: 131, percentile: 99 });
    expect(result.scores.map((s) => s.estimate?.value)).toEqual([115, 117, 122, 136]);
    expect(result.raw).toBe(16);
    expect(result.overall?.value).not.toBe(
      Math.round(result.scores.reduce((sum, s) => sum + s.estimate!.value, 0) / 4),
    );
    const skipped = scoreIcar(parseSession(complete(true)));
    expect(skipped.raw).toBe(0);
    expect(skipped.overall).toEqual({ value: 67, percentile: 0 });
    expect(skipped.scores.every((s) => s.omitted === 4)).toBe(true);
  });

  test('withholds unfinished estimates and rejects incompatible form states', () => {
    const initial = createSession('touch');
    expect(initial.version).toBe(FORM_VERSION);
    expect(scoreIcar(parseSession(initial)).overall).toBeNull();
    let session = { ...initial, stage: 'running' as const };
    for (const item of icarBank.verbal!) {
      session = recordResponse(session, {
        section: 'verbal',
        itemId: item.id,
        answer: item.answer,
        elapsedMs: 5,
        status: 'answered',
      }) as typeof session;
    }
    expect(parseSession(session).stage).toBe('break');
    const result = scoreIcar(session);
    expect(result.scores[0].estimate?.value).toBe(115);
    expect(result.scores.slice(1).every((s) => s.estimate === null)).toBe(true);
    expect(result.overall).toBeNull();
    for (const patch of [
      { stage: 'practice' },
      { stage: 'ready' },
      { activeTrial: 'VR.04' },
      { sectionIndex: 10 },
    ]) {
      expect(() => parseSession({ ...initial, ...patch })).toThrow();
    }
    expect(() =>
      parseSession({ ...initial, version: LEGACY_FORM_VERSION, responses: session.responses }),
    ).toThrow();
    expect(() => scoreIcar(createSession('keyboard', false, LEGACY_FORM_VERSION))).toThrow();
  });
});

// Independent 3D check of the SVG redraw: normals and in-plane arm directions must rotate together.
// Face order and bases correspond to the top, left and right isometric faces in IcarStimulus.
type Vector = number[];
const normals = [
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 0],
];
const u = [
  [0, -1, 0],
  [1, 0, 0],
  [0, -1, 0],
];
const v = [
  [1, 0, 0],
  [0, 0, -1],
  [0, 0, -1],
];
const near = (a: Vector, b: Vector) => a.every((x, i) => Math.abs(x - b[i]) < 1e-8);
function arms(face: number, [count, turn]: CubeMark) {
  return Array.from({ length: count }, (_, j) => {
    const angle = ((turn + (j * 360) / count) * Math.PI) / 180;
    return u[face].map((x, k) => Math.sin(angle) * x - Math.cos(angle) * v[face][k]);
  });
}
function possible(cube: MarkedCube | null) {
  if (!cube) return false;
  const axes = normals.flatMap((n) => [n, n.map((x) => -x)]);
  for (const x of axes)
    for (const y of axes) {
      if (x.reduce((sum, n, i) => sum + n * y[i], 0) !== 0) continue;
      const z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
      const rotate = (p: Vector) => x.map((n, i) => p[0] * n + p[1] * y[i] + p[2] * z[i]);
      if (
        referenceCube.every((mark, source) => {
          const destination = normals.findIndex((n) => near(n, rotate(normals[source])));
          if (destination < 0) return !cube.some(([count]) => count === mark[0]);
          return (
            cube[destination][0] === mark[0] &&
            arms(source, mark).every((a) =>
              arms(destination, cube[destination]).some((b) => near(rotate(a), b)),
            )
          );
        })
      )
        return true;
    }
  return false;
}
test('only each published cube key is possible under the 24 proper rotations', () => {
  for (const [id, answer] of [
    ['R3D.03', 2],
    ['R3D.04', 1],
    ['R3D.06', 5],
    ['R3D.08', 6],
  ] as const) {
    expect(
      icarCubes[id].map((cube, i) => (possible(cube) ? i : -1)).filter((i) => i >= 0),
      id,
    ).toEqual([answer]);
  }
});
