import { FORM_VERSION, type Session, type ChoiceItem, type Glyph, type SectionId } from '../domain';
import { icarBank } from './icar';
import {
  wordItems,
  analogyItems,
  numberItems,
  wordPractice,
  analogyPractice,
  numberPractice,
} from './verbal';
import {
  matrixItems,
  rotationItems,
  foldingItems,
  matrixPractice,
  rotationPractice,
  foldingPractice,
  random,
  glyphKey,
} from './visual';

export const choiceBank: Partial<Record<SectionId, ChoiceItem[]>> = {
  matrix: matrixItems,
  words: wordItems,
  rotation: rotationItems,
  numbers: numberItems,
  analogies: analogyItems,
  folding: foldingItems,
};
export const practiceBank: Partial<Record<SectionId, ChoiceItem>> = {
  matrix: matrixPractice,
  words: wordPractice,
  rotation: rotationPractice,
  numbers: numberPractice,
  analogies: analogyPractice,
  folding: foldingPractice,
};
export const itemById = new Map(
  [...Object.values(choiceBank), ...Object.values(icarBank)].flat().map((item) => [item.id, item]),
);

export const choiceBankFor = (version: Session['version']) =>
  version === FORM_VERSION ? icarBank : choiceBank;

export function sequenceTrial(index: number, practice = false) {
  const length = practice ? 3 : 3 + Math.floor(index / 2);
  const rng = random((practice ? 1231 : 929) + index * 317);
  const digits = Array.from({ length }, () => 1 + Math.floor(rng() * 9));
  const mode = index % 2 === 0 ? 'reverse' : 'ascending';
  return {
    id: practice ? 'practice-sequence' : `sequence-${index + 1}`,
    digits,
    mode,
    answer: mode === 'reverse' ? [...digits].reverse() : [...digits].sort((a, b) => a - b),
  };
}

export function spanTrial(index: number, practice = false) {
  const length = practice ? 2 : 2 + Math.floor(index / 2);
  const rng = random((practice ? 1501 : 2107) + index * 419);
  const positions: number[] = [];
  while (positions.length < length) {
    const p = Math.floor(rng() * 16);
    if (!positions.includes(p)) positions.push(p);
  }
  const processing = positions.map(() => {
    const symmetric = rng() < 0.5;
    const cells = Array.from({ length: 16 }, () => false);
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 2; col++)
        cells[row * 4 + col] = cells[row * 4 + 3 - col] = rng() < 0.5;
    if (!symmetric) {
      const pos = Math.floor(rng() * 16);
      cells[pos] = !cells[pos];
    }
    return { cells, symmetric };
  });
  return { id: practice ? 'practice-span' : `span-${index + 1}`, positions, processing };
}

const glyphs: Glyph[] = ['circle', 'square', 'triangle', 'diamond', 'cross'].flatMap((shape) =>
  [false, true].map((fill) => ({ shape: shape as Glyph['shape'], count: 1, fill, turn: 0 })),
);
export function speedTrial(
  section: 'comparison' | 'search',
  block: number,
  trial: number,
  practice = false,
) {
  const rng = random(
    (section === 'search' ? 91807 : 421) + block * 17417 + trial * 811 + (practice ? 811811 : 0),
  );
  const answer = rng() < 0.5;
  if (section === 'comparison') {
    const left = Array.from({ length: 5 }, () => glyphs[Math.floor(rng() * glyphs.length)]);
    const right = left.map((g) => ({ ...g }));
    if (!answer) {
      const pos = Math.floor(rng() * 5);
      right[pos] = { ...right[pos], fill: !right[pos].fill };
    }
    return { answer, left, right, target: left[0], grid: [] as Glyph[] };
  }
  const target = glyphs[Math.floor(rng() * glyphs.length)];
  const others = glyphs.filter((g) => glyphKey(g) !== glyphKey(target));
  const grid = Array.from({ length: 24 }, () => others[Math.floor(rng() * others.length)]);
  if (answer) grid[Math.floor(rng() * grid.length)] = target;
  return { answer, target, grid, left: [] as Glyph[], right: [] as Glyph[] };
}

export const speedDuration = (section: SectionId) => (section === 'comparison' ? 90_000 : 60_000);
