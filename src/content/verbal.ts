import type { ChoiceItem } from '../domain';

// Original prompts, distractors, and explanations. CC BY 4.0; see CONTENT-LICENSE.
const words: [string, string, string[], string][] = [
  [
    'brief',
    'short',
    ['quiet', 'simple', 'early'],
    'Brief describes something that lasts a short time or uses few words.',
  ],
  [
    'fragile',
    'delicate',
    ['flexible', 'valuable', 'small'],
    'Fragile means easily broken or damaged.',
  ],
  [
    'reluctant',
    'unwilling',
    ['uncertain', 'unable', 'unaware'],
    'Reluctant describes an unwillingness or hesitation to do something.',
  ],
  [
    'abundant',
    'plentiful',
    ['necessary', 'scattered', 'growing'],
    'Abundant means present in large quantities.',
  ],
  [
    'impartial',
    'unbiased',
    ['uninvolved', 'undecided', 'uninterested'],
    'An impartial person does not favor one side over another.',
  ],
  [
    'concise',
    'succinct',
    ['accurate', 'informal', 'persuasive'],
    'Concise means expressing something in few words.',
  ],
  [
    'obsolete',
    'outdated',
    ['damaged', 'unpopular', 'unusual'],
    'Obsolete means no longer in use, often because something newer replaced it.',
  ],
  [
    'resilient',
    'able to recover',
    ['difficult to move', 'eager to compete', 'quick to act'],
    'Resilience is the capacity to recover after difficulty or deformation.',
  ],
  [
    'ambiguous',
    'open to multiple meanings',
    ['untrue', 'hard to pronounce', 'incomplete'],
    'Ambiguous wording permits more than one interpretation.',
  ],
  [
    'prudent',
    'cautious',
    ['generous', 'confident', 'obedient'],
    'Prudent means showing careful judgment about possible consequences.',
  ],
  [
    'coherent',
    'logically connected',
    ['widely accepted', 'entirely correct', 'highly detailed'],
    'Coherent ideas fit together in a consistent, understandable way.',
  ],
  [
    'tentative',
    'provisional',
    ['unnecessary', 'ineffective', 'unintentional'],
    'Tentative means not yet definite or final.',
  ],
  [
    'mitigate',
    'make less severe',
    ['make more visible', 'explain the cause', 'prevent entirely'],
    'To mitigate is to reduce severity, not necessarily remove the problem.',
  ],
  [
    'scrupulous',
    'careful and principled',
    ['secretive and reserved', 'clever and persuasive', 'strict and impatient'],
    'Scrupulous describes attention to what is correct or morally right.',
  ],
  [
    'ubiquitous',
    'found everywhere',
    ['lasting forever', 'known by everyone', 'suitable for everything'],
    'Ubiquitous means present or encountered everywhere.',
  ],
  [
    'equivocal',
    'inconclusive',
    ['balanced', 'equal', 'incorrect'],
    'An equivocal result or statement is uncertain or open to interpretation.',
  ],
  [
    'intransigent',
    'uncompromising',
    ['unpredictable', 'inexperienced', 'indifferent'],
    'Intransigent means refusing to change a position or compromise.',
  ],
  [
    'laconic',
    'using few words',
    ['speaking softly', 'speaking slowly', 'using formal words'],
    'Laconic describes a very brief manner of speaking or writing.',
  ],
  [
    'assiduous',
    'diligent',
    ['enthusiastic', 'imaginative', 'agreeable'],
    'Assiduous describes sustained, careful effort.',
  ],
  [
    'ephemeral',
    'short-lived',
    ['insubstantial', 'unreliable', 'uncommon'],
    'Ephemeral means lasting for a very short time.',
  ],
];

const analogies: [string, string, string, string, string[], string][] = [
  [
    'hand',
    'glove',
    'foot',
    'sock',
    ['shoe shop', 'leg', 'step'],
    'A glove covers a hand; a sock covers a foot.',
  ],
  [
    'author',
    'novel',
    'composer',
    'symphony',
    ['orchestra', 'piano', 'audience'],
    'An author creates a novel; a composer creates a symphony.',
  ],
  [
    'thermometer',
    'temperature',
    'barometer',
    'pressure',
    ['distance', 'rainfall', 'humidity'],
    'A thermometer measures temperature; a barometer measures atmospheric pressure.',
  ],
  [
    'seed',
    'plant',
    'egg',
    'bird',
    ['shell', 'nest', 'feather'],
    'A plant develops from a seed; a bird develops from an egg.',
  ],
  [
    'chapter',
    'book',
    'movement',
    'symphony',
    ['rhythm', 'instrument', 'melody'],
    'A chapter is a major division of a book; a movement is a major division of a symphony.',
  ],
  [
    'scalpel',
    'surgeon',
    'chisel',
    'sculptor',
    ['painter', 'weaver', 'musician'],
    'These are tools used by the named practitioners.',
  ],
  [
    'evaporation',
    'liquid to gas',
    'condensation',
    'gas to liquid',
    ['solid to liquid', 'liquid to solid', 'solid to gas'],
    'Evaporation and condensation are opposite changes between liquid and gas.',
  ],
  [
    'opaque',
    'light',
    'impermeable',
    'water',
    ['weight', 'heat', 'shape'],
    'An opaque material prevents light passing through; a water-impermeable material prevents water passing through.',
  ],
  [
    'map',
    'territory',
    'blueprint',
    'building',
    ['architect', 'ruler', 'brick'],
    'A map represents a territory; a blueprint represents a building design.',
  ],
  [
    'scarcity',
    'abundance',
    'conflict',
    'harmony',
    ['agreement to meet', 'conversation', 'competition'],
    'Both pairs contrast a state with its opposite.',
  ],
  [
    'premise',
    'conclusion',
    'evidence',
    'verdict',
    ['witness', 'court', 'question'],
    'A conclusion is reached from premises; a verdict is reached from evidence.',
  ],
  [
    'vaccine',
    'prevention',
    'remedy',
    'treatment',
    ['symptom', 'diagnosis', 'exposure'],
    'The primary purpose of a vaccine is prevention; a remedy is used in treatment.',
  ],
  [
    'kilogram',
    'mass',
    'ampere',
    'electric current',
    ['voltage', 'energy', 'power'],
    'The kilogram and ampere are units of the corresponding physical quantities.',
  ],
  [
    'editor',
    'manuscript',
    'curator',
    'collection',
    ['ticket', 'visitor', 'building'],
    'An editor selects or organizes manuscript content; a curator selects or organizes a collection.',
  ],
  [
    'inference',
    'reasoning',
    'recollection',
    'memory',
    ['attention', 'prediction', 'perception'],
    'An inference results from reasoning; a recollection draws on memory.',
  ],
  [
    'necessary',
    'required',
    'sufficient',
    'enough',
    ['likely', 'complete', 'essential'],
    'Each pair expresses the same meaning: required and enough, respectively.',
  ],
];

function item(
  id: string,
  prompt: string,
  correct: string,
  distractors: string[],
  explanation: string,
  index: number,
): ChoiceItem {
  const options = [...distractors];
  const answer = (index * 3 + 1) % 4;
  options.splice(answer, 0, correct);
  return { id, kind: 'text', prompt, options, answer, explanation };
}

export const wordItems = words.map(([word, correct, distractors, explanation], i) =>
  item(`words-${i + 1}`, word, correct, distractors, explanation, i),
);
export const analogyItems = analogies.map(([a, b, c, correct, distractors, explanation], i) =>
  item(`analogies-${i + 1}`, `${a} : ${b} :: ${c} : ?`, correct, distractors, explanation, i),
);
export const wordPractice = item(
  'practice-words',
  'rapid',
  'fast',
  ['heavy', 'bright', 'distant'],
  'Rapid means fast or quick.',
  0,
);
export const analogyPractice = item(
  'practice-analogies',
  'bird : nest :: bee : ?',
  'hive',
  ['flower', 'wing', 'honey'],
  'A nest is the home of a bird; a hive is the home of a bee.',
  0,
);

const numbers: [number[], number, number[], string][] = [
  [[3, 6, 9, 12, 15], 18, [17, 19, 21], 'Add 3 each time.'],
  [[2, 4, 8, 16, 32], 64, [48, 60, 66], 'Double each number.'],
  [[31, 27, 23, 19, 15], 11, [9, 10, 12], 'Subtract 4 each time.'],
  [[1, 4, 9, 16, 25], 36, [30, 35, 49], 'These are the squares of 1, 2, 3, 4, 5, and 6.'],
  [[2, 5, 9, 14, 20], 27, [25, 26, 28], 'The increases are 3, 4, 5, 6, then 7.'],
  [[3, 7, 15, 31, 63], 127, [95, 125, 129], 'Multiply by 2 and add 1.'],
  [
    [2, 8, 3, 12, 4, 16, 5],
    20,
    [6, 19, 24],
    'Each pair is a number followed by four times that number.',
  ],
  [[1, 1, 2, 3, 5, 8], 13, [11, 12, 16], 'Each number is the sum of the previous two.'],
  [[81, 27, 9, 3], 1, [0, 2, 6], 'Divide by 3 each time.'],
  [[2, 6, 12, 20, 30], 42, [40, 44, 48], 'The increases are 4, 6, 8, 10, then 12.'],
  [[4, 9, 8, 13, 12, 17], 16, [18, 20, 22], 'Alternate adding 5 and subtracting 1.'],
  [
    [1, 3, 7, 13, 21, 31],
    43,
    [41, 42, 45],
    'The increases are consecutive even numbers: 2, 4, 6, 8, 10, then 12.',
  ],
  [[2, 6, 18, 54, 162], 486, [324, 468, 492], 'Multiply by 3 each time.'],
  [[5, 10, 8, 16, 14, 28], 26, [24, 30, 56], 'Alternate multiplying by 2 and subtracting 2.'],
  [[1, 2, 6, 24, 120], 720, [600, 620, 840], 'Multiply successively by 2, 3, 4, 5, then 6.'],
  [[3, 4, 8, 17, 33], 58, [49, 54, 65], 'Add successive squares: 1, 4, 9, 16, then 25.'],
  [[2, 3, 5, 9, 17, 33], 65, [49, 63, 67], 'The increases double: 1, 2, 4, 8, 16, then 32.'],
  [[4, 7, 13, 25, 49, 97], 193, [145, 191, 195], 'Multiply by 2 and subtract 1.'],
];
export const numberItems = numbers.map(
  ([sequence, correct, distractors, explanation], i): ChoiceItem => ({
    ...item(
      `numbers-${i + 1}`,
      'Which number comes next?',
      String(correct),
      distractors.map(String),
      explanation,
      i,
    ),
    kind: 'text',
    sequence,
  }),
);
export const numberPractice: ChoiceItem = {
  ...item(
    'practice-numbers',
    'Which number comes next?',
    '10',
    ['9', '11', '12'],
    'Add 2 to each number: 2, 4, 6, 8, 10.',
    0,
  ),
  kind: 'text',
  sequence: [2, 4, 6, 8],
};
