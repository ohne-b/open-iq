import type { ChoiceItem, Glyph, Point2, Point3, Shape } from '../domain';

export function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const shapes: Shape[] = ['circle', 'triangle', 'square', 'diamond', 'cross'];
const glyph = (
  count = 1,
  shape: Shape = 'circle',
  fill = false,
  turn = 0,
  mark = false,
): Glyph => ({ count, shape, fill, turn, mark });
export const glyphKey = (g: Glyph) =>
  g.mask !== undefined
    ? `mask:${g.mask}`
    : `${g.shape}:${g.count}:${g.fill}:${g.mark ? g.turn : 0}:${!!g.mark}`;

function matrix(index: number, practice = false): ChoiceItem {
  let cells: Glyph[];
  let explanation: string;
  const family = practice ? 0 : Math.floor(index / 3);
  const variant = index % 3;
  if (family === 0) {
    cells = Array.from({ length: 9 }, (_, k) =>
      glyph(
        1 + (k % 3) + (variant === 2 ? Math.floor(k / 3) : 0),
        shapes[variant === 0 ? Math.floor(k / 3) : variant],
      ),
    );
    explanation =
      variant === 2
        ? 'The number of shapes increases by one from left to right and from top to bottom.'
        : 'Each row contains one, two, then three shapes. The shape stays the same within a row.';
  } else if (family === 1) {
    cells = Array.from({ length: 9 }, (_, k) =>
      glyph(
        variant === 2 ? 1 + Math.floor(k / 3) : 1,
        shapes[((k % 3) + Math.floor(k / 3)) % 3],
        variant === 1 && ((k % 3) + Math.floor(k / 3)) % 2 === 0,
      ),
    );
    explanation =
      'The shapes cycle circle, triangle, square. Each new row shifts the cycle one place.' +
      (variant === 1
        ? ' Filled and outline shapes alternate across each row and column.'
        : variant === 2
          ? ' The number of shapes also increases by row.'
          : '');
  } else if (family === 2) {
    cells = Array.from({ length: 9 }, (_, k) =>
      glyph(
        variant === 2 ? 1 + Math.floor(k / 3) : 1,
        shapes[variant],
        variant === 1 && Math.floor(k / 3) % 2 === 1,
        ((k % 3) * 90 + Math.floor(k / 3) * (variant ? 90 : 45)) % 360,
        true,
      ),
    );
    explanation =
      'The small marker rotates a quarter-turn clockwise across each row. The starting position shifts consistently down the rows.' +
      (variant === 2 ? ' The number of shapes increases by row.' : '');
  } else if (family === 3) {
    const values =
      variant === 0
        ? [
            [1, 2, 3],
            [2, 2, 4],
            [3, 2, 5],
          ]
        : variant === 1
          ? [
              [1, 1, 2],
              [1, 2, 3],
              [2, 3, 5],
            ]
          : [
              [2, 3, 5],
              [1, 3, 4],
              [2, 2, 4],
            ];
    cells = values.flatMap((row, r) =>
      row.map((n) => glyph(n, shapes[r + variant > 4 ? 0 : r + variant], variant === 2)),
    );
    explanation =
      'In each row, the last cell contains as many shapes as the first two cells combined.';
  } else {
    const pairs =
      family === 4
        ? [
            [0b100010001, 0b001010100],
            [0b111000000, 0b001001001],
            [0b000111000, 0b010010010],
          ]
        : variant === 1
          ? [
              [0b101010000, 0b100011000],
              [0b100100100, 0b110000100],
              [0b001101011, 0b010101010],
            ]
          : [
              [0b110110000, 0b011011000],
              [0b111100000, 0b010111000],
              [0b100110011, 0b001110100],
            ];
    const combine = (a: number, b: number) =>
      family === 4 ? (variant === 1 ? a & b : a | b) : a ^ b;
    cells = pairs.flatMap(([a, b]) => [a, b, combine(a, b)].map((mask) => ({ ...glyph(), mask })));
    if (variant === 2) cells = cells.map((g) => ({ ...g, mask: reverseBits(g.mask!) }));
    explanation =
      family === 4
        ? variant === 1
          ? 'The last cell in each row keeps only dots present in both preceding cells.'
          : 'The last cell in each row combines all dots from the first two cells.'
        : 'The last cell keeps dots present in either preceding cell, but removes dots shared by both.';
  }
  if (practice) cells = cells.map((g) => ({ ...g, shape: 'cross', fill: true }));
  const correct = cells[8];
  const candidates =
    correct.mask !== undefined
      ? Array.from({ length: 9 }, (_, j) => ({
          ...correct,
          mask: correct.mask! ^ (1 << j),
        })).concat([{ ...correct, mask: 511 ^ correct.mask }])
      : [
          { ...correct, count: correct.count === 5 ? 4 : correct.count + 1 },
          { ...correct, count: correct.count === 1 ? 3 : correct.count - 1 },
          { ...correct, fill: !correct.fill },
          { ...correct, shape: shapes[(shapes.indexOf(correct.shape) + 1) % 5] },
          correct.mark
            ? { ...correct, turn: (correct.turn + 90) % 360 }
            : { ...correct, shape: shapes[(shapes.indexOf(correct.shape) + 2) % 5] },
          { ...correct, count: correct.count === 2 ? 4 : 2, fill: !correct.fill },
        ];
  const unique = [
    ...new Map(
      candidates.filter((g) => glyphKey(g) !== glyphKey(correct)).map((g) => [glyphKey(g), g]),
    ).values(),
  ].slice(0, 5);
  const answer = (index * 5 + 2) % 6;
  unique.splice(answer, 0, correct);
  return {
    id: practice ? 'practice-matrix' : `matrix-${index + 1}`,
    kind: 'matrix',
    prompt: 'Which piece completes the pattern?',
    cells: cells.slice(0, 8),
    choices: unique,
    options: unique.map((_, i) => String.fromCharCode(65 + i)),
    answer,
    explanation,
  };
}
function reverseBits(n: number) {
  return Number.parseInt(n.toString(2).padStart(9, '0').split('').reverse().join(''), 2);
}
export const matrixItems = Array.from({ length: 18 }, (_, i) => matrix(i));
export const matrixPractice = matrix(0, true);

export function normalize(points: Point3[]): Point3[] {
  const min = [0, 1, 2].map((axis) => Math.min(...points.map((p) => p[axis])));
  return points
    .map((p) => p.map((v, i) => v - min[i]) as Point3)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}
export const pointsKey = (points: Point3[]) =>
  normalize(points)
    .map((p) => p.join(','))
    .join(';');
export function rotations(points: Point3[]): Point3[][] {
  const result: Point3[][] = [];
  const permutations = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  for (const order of permutations) {
    const parity = ((order[0] - order[1]) * (order[1] - order[2]) * (order[0] - order[2])) / -2;
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1]) {
          if (parity * x * y * z === 1)
            result.push(
              normalize(points.map((p) => [p[order[0]] * x, p[order[1]] * y, p[order[2]] * z])),
            );
        }
  }
  return result;
}
export const objectKey = (points: Point3[]) => rotations(points).map(pointsKey).sort()[0];

// The camera looks along (1, 1, 1). Keep at least one face center visible per cube.
export function visibleCubeCount(points: Point3[]): number {
  return points.filter((cube, i) =>
    [0, 1, 2].some((axis) => {
      const face = cube.map((value, a) => value + (a === axis ? 1 : 0.5));
      return !points.some((other, j) => {
        if (i === j) return false;
        const near = Math.max(...other.map((value, a) => value - face[a]));
        const far = Math.min(...other.map((value, a) => value + 1 - face[a]));
        return far > Math.max(near, 0) + 0.0001;
      });
    }),
  ).length;
}
function clearViews(points: Point3[]) {
  return rotations(points).filter((view) => visibleCubeCount(view) === points.length);
}
function viewObject(points: Point3[], offset: number): Point3[] {
  const views = clearViews(points);
  if (!views.length) throw new Error('Object has hidden cubes in every view');
  return views[offset % views.length];
}

function growObject(seed: number, size: number): Point3[] {
  const rng = random(seed);
  const points: Point3[] = [[0, 0, 0]];
  const seen = new Set(['0,0,0']);
  while (points.length < size) {
    const next = [...points[Math.floor(rng() * points.length)]] as Point3;
    next[Math.floor(rng() * 3)] += rng() < 0.5 ? -1 : 1;
    if (!seen.has(next.join(','))) {
      points.push(next);
      seen.add(next.join(','));
    }
  }
  return normalize(points);
}
const referenceKeys = new Set<string>();
function rotationItem(index: number, practice = false): ChoiceItem {
  const size = practice ? 4 : 5 + Math.floor(index / 6);
  let seed = 812 + index * 79;
  let object = growObject(seed, size);
  while (referenceKeys.has(objectKey(object)) || clearViews(object).length < 2)
    object = growObject((seed += 97), size);
  object = viewObject(object, index * 3);
  const canonical = objectKey(object);
  referenceKeys.add(canonical);
  const choices: Point3[][] = [];
  const keys = new Set([canonical]);
  const mirror = normalize(object.map(([x, y, z]) => [-x, y, z]));
  if (objectKey(mirror) !== canonical && clearViews(mirror).length) {
    choices.push(viewObject(mirror, 7));
    keys.add(objectKey(mirror));
  }
  for (let j = 0; choices.length < 5; j++) {
    const candidate = growObject(4091 + index * 317 + j * 37, size);
    const key = objectKey(candidate);
    if (!keys.has(key) && clearViews(candidate).length) {
      keys.add(key);
      choices.push(viewObject(candidate, index + j * 7));
    }
  }
  const answer = (index * 5 + 3) % 6;
  const alternatives = clearViews(object).filter((view) => pointsKey(view) !== pointsKey(object));
  choices.splice(answer, 0, alternatives[(index * 7 + 9) % alternatives.length]);
  return {
    id: practice ? 'practice-rotation' : `rotation-${index + 1}`,
    kind: 'rotation',
    prompt: 'Which is the same object, rotated?',
    object,
    choices,
    options: choices.map((_, i) => String.fromCharCode(65 + i)),
    answer,
    explanation:
      'Only the selected answer preserves every block connection under a rigid rotation. The other objects have different connections or are mirror images.',
  };
}
export const rotationItems = Array.from({ length: 18 }, (_, i) => rotationItem(i));
export const rotationPractice = rotationItem(25, true);

export const holeKey = (points: Point2[]) =>
  points
    .map((p) => p.join(','))
    .sort()
    .join(';');
export function unfold(holes: Point2[], folds: ('left' | 'up')[]): Point2[] {
  let width = 8,
    height = 8;
  const steps = folds.map((fold) => {
    if (fold === 'left') width /= 2;
    else height /= 2;
    return { fold, width, height };
  });
  let points = holes;
  for (const step of steps.reverse())
    points = [
      ...points,
      ...points.map(([x, y]): Point2 =>
        step.fold === 'left' ? [step.width * 2 - x, y] : [x, step.height * 2 - y],
      ),
    ];
  return [...new Map(points.map((p) => [p.join(','), p])).values()];
}
function foldingItem(index: number, practice = false): ChoiceItem {
  const foldSets: ('left' | 'up')[][] = [
    ['left'],
    ['up'],
    ['left', 'up'],
    ['up', 'left'],
    ['left', 'left'],
    ['up', 'up'],
    ['left', 'up', 'left'],
    ['up', 'left', 'up'],
  ];
  const folds = foldSets[practice ? 0 : Math.min(7, Math.floor(index / 2))];
  const width = 8 / 2 ** folds.filter((f) => f === 'left').length;
  const height = 8 / 2 ** folds.filter((f) => f === 'up').length;
  const holes: Point2[] = practice
    ? [[2.5, 2.5]]
    : [[0.5 + (index % width), 0.5 + ((index * 3 + 1) % height)]];
  if (index >= 8 && !practice)
    holes.push([0.5 + ((index + 1) % width), 0.5 + ((index * 3 + 3) % height)]);
  const correct = unfold(holes, folds);
  const choices: Point2[][] = [];
  const seen = new Set([holeKey(correct)]);
  for (let j = 0; choices.length < 5 && j < width * height; j++) {
    for (let k = holes.length === 1 ? j : j + 1; choices.length < 5 && k < width * height; k++) {
      const first: Point2 = [0.5 + (j % width), 0.5 + Math.floor(j / width)];
      const second: Point2 = [0.5 + (k % width), 0.5 + Math.floor(k / width)];
      const candidate = unfold(holes.length === 1 ? [first] : [first, second], folds);
      const key = holeKey(candidate);
      if (!seen.has(key)) {
        seen.add(key);
        choices.push(candidate);
      }
      if (holes.length === 1) break;
    }
  }
  if (choices.length !== 5) throw new Error('Insufficient distinct folding options');
  const answer = (index * 5 + 1) % 6;
  choices.splice(answer, 0, correct);
  return {
    id: practice ? 'practice-folding' : `folding-${index + 1}`,
    kind: 'folding',
    prompt: 'How will the holes look when the paper is unfolded?',
    folds,
    holes,
    choices,
    options: choices.map((_, i) => String.fromCharCode(65 + i)),
    answer,
    explanation:
      'Reflect each punched hole across the last fold, then work backwards through the remaining folds. A hole passes through every folded layer.',
  };
}
export const foldingItems = Array.from({ length: 16 }, (_, i) => foldingItem(i));
export const foldingPractice = foldingItem(0, true);
