import type { ChoiceItem, SectionId } from '../domain';

// Public-domain ICAR Sample Test, Condon & Revelle (2014), Appendix A.
// Preserve item IDs, wording, option order and keys. See docs/ICAR.md.
const visual = (
  id: string,
  kind: 'icar-matrix' | 'icar-cube',
  answer: number,
  explanation: string,
): ChoiceItem => ({
  id,
  kind,
  answer,
  explanation,
  prompt:
    kind === 'icar-matrix'
      ? 'Please indicate which is the best answer to complete the figure below.'
      : 'All the cubes below have a different image on each side. Select the choice that could represent a rotation of the cube labeled X.',
  options:
    kind === 'icar-matrix'
      ? ['A', 'B', 'C', 'D', 'E', 'F']
      : [
          'A',
          'B',
          'C',
          'None of the cubes could be a rotation.',
          'E',
          'F',
          'G',
          'I do not know the solution.',
        ],
});

export const icarBank: Partial<Record<SectionId, ChoiceItem[]>> = {
  verbal: [
    {
      id: 'VR.04',
      kind: 'text',
      prompt: 'What number is one fifth of one fourth of one ninth of 900?',
      options: ['2', '3', '4', '5', '6', '7'],
      answer: 3,
      explanation: '900 ÷ 9 ÷ 4 ÷ 5 = 5.',
    },
    {
      id: 'VR.16',
      kind: 'text',
      prompt:
        'Zach is taller than Matt and Richard is shorter than Zach. Which of the following statements would be most accurate?',
      options: [
        'Richard is taller than Matt',
        'Richard is shorter than Matt',
        'Richard is as tall as Matt',
        "It's impossible to tell",
      ],
      answer: 3,
      explanation:
        'Both Matt and Richard are shorter than Zach; their heights relative to one another are unknown.',
    },
    {
      id: 'VR.17',
      kind: 'text',
      prompt:
        'Joshua is 12 years old and his sister is three times as old as he. When Joshua is 23 years old, how old will his sister be?',
      options: ['35', '39', '44', '47', '53', '57'],
      answer: 3,
      explanation: 'His sister is 36 now. In 11 years she will be 47.',
    },
    {
      id: 'VR.19',
      kind: 'text',
      prompt: 'If the day after tomorrow is two days before Thursday then what day is it today?',
      options: ['Friday', 'Monday', 'Wednesday', 'Saturday', 'Tuesday', 'Sunday'],
      answer: 5,
      explanation: 'Two days before Thursday is Tuesday. Two days before Tuesday is Sunday.',
    },
  ],
  series: [
    {
      id: 'LN.07',
      kind: 'text',
      prompt: 'In the following alphanumeric series, what letter comes next? K N P S U',
      options: ['S', 'T', 'U', 'V', 'W', 'X'],
      answer: 5,
      explanation:
        'Move forward three letters, then two, alternately. After U, move forward three to X.',
    },
    {
      id: 'LN.33',
      kind: 'text',
      prompt: 'In the following alphanumeric series, what letter comes next? V Q M J H',
      options: ['E', 'F', 'G', 'H', 'I', 'J'],
      answer: 2,
      explanation: 'Move back five, four, three, then two letters. Moving back one from H gives G.',
    },
    {
      id: 'LN.34',
      kind: 'text',
      prompt: 'In the following alphanumeric series, what letter comes next? I J L O S',
      options: ['T', 'U', 'V', 'X', 'Y', 'Z'],
      answer: 3,
      explanation: 'The steps increase: one, two, three, four, then five. S plus five gives X.',
    },
    {
      id: 'LN.58',
      kind: 'text',
      prompt: 'In the following alphanumeric series, what letter comes next? Q S N P L',
      options: ['J', 'H', 'I', 'N', 'M', 'L'],
      answer: 3,
      explanation: 'The steps alternate: +2, −5, +2, −4, +2. L plus two gives N.',
    },
  ],
  matrix: [
    visual(
      'MR.45',
      'icar-matrix',
      4,
      'Across each row the divided main shape turns a quarter-turn. Each row and column contains one star, circle and square marker. The missing diamond has its dark half above and a star to the right.',
    ),
    visual(
      'MR.46',
      'icar-matrix',
      1,
      'Down each column the divided main shape turns a quarter-turn. The small markers cycle through star, square and circle, and their positions cycle top, left, bottom and right. The missing diamond is dark on the left with a square above.',
    ),
    visual(
      'MR.47',
      'icar-matrix',
      1,
      'The large shapes cycle circle, cross and square; the small shapes cycle square, diamond and star. Background colors alternate. The missing cell is a dark cross with a light square on a light background.',
    ),
    visual(
      'MR.55',
      'icar-matrix',
      3,
      'The large circles cycle solid, half-filled and empty. Marker shapes and fills also cycle. Arrows turn 45 degrees clockwise across rows. The missing circle is dark above, with a dark triangle on the right and an arrow pointing left.',
    ),
  ],
  rotation: [
    visual(
      'R3D.03',
      'icar-cube',
      2,
      'C can be a rotation of X. Adjacent known faces must retain their relative order and the orientations of their markings.',
    ),
    visual(
      'R3D.04',
      'icar-cube',
      1,
      'B can be a rotation of X. The orientation of a marking matters as well as which face it appears on.',
    ),
    visual(
      'R3D.06',
      'icar-cube',
      5,
      'F can be a rotation of X. Rotating the cube turns the markings together; individual faces cannot turn independently.',
    ),
    visual(
      'R3D.08',
      'icar-cube',
      6,
      'G can be a rotation of X. Its visible known faces and their markings are consistent with the reference cube.',
    ),
  ],
};

export type MatrixShape =
  'rectangle' | 'circle' | 'diamond' | 'square' | 'cross' | 'star' | 'triangle';
export type MatrixCell = {
  shape: MatrixShape;
  fill: 'half' | 'full' | 'empty';
  turn?: number;
  marker?: MatrixShape;
  side?: 'top' | 'right' | 'bottom' | 'left';
  markerFilled?: boolean;
  arrow?: number;
  background?: boolean;
  inner?: MatrixShape;
};
const cell = (
  shape: MatrixShape,
  turn: number,
  marker: MatrixShape,
  side: MatrixCell['side'],
): MatrixCell => ({ shape, fill: 'half', turn, marker, side });
const nested = (shape: MatrixShape, inner: MatrixShape, background: boolean): MatrixCell => ({
  shape,
  inner,
  background,
  fill: 'full',
});
const arrow = (
  fill: MatrixCell['fill'],
  marker: MatrixShape,
  side: MatrixCell['side'],
  markerFilled: boolean,
  arrow: number,
  turn = 0,
): MatrixCell => ({ shape: 'circle', fill, marker, side, markerFilled, arrow, turn });
export const icarMatrices: Record<string, { cells: MatrixCell[]; choices: MatrixCell[] }> = {
  'MR.45': {
    cells: [
      cell('rectangle', 0, 'star', 'top'),
      cell('rectangle', 90, 'circle', 'left'),
      cell('rectangle', 180, 'square', 'bottom'),
      cell('circle', 0, 'square', 'right'),
      cell('circle', 90, 'star', 'top'),
      cell('circle', 180, 'circle', 'left'),
      cell('diamond', 0, 'circle', 'left'),
      cell('diamond', 90, 'square', 'bottom'),
    ],
    choices: [
      cell('diamond', 90, 'circle', 'top'),
      cell('diamond', 0, 'star', 'right'),
      cell('diamond', 180, 'star', 'left'),
      cell('diamond', 270, 'star', 'top'),
      cell('diamond', 180, 'star', 'right'),
      cell('diamond', 180, 'square', 'right'),
    ],
  },
  'MR.46': {
    cells: [
      cell('rectangle', 0, 'star', 'top'),
      cell('circle', 0, 'square', 'left'),
      cell('diamond', 270, 'circle', 'bottom'),
      cell('rectangle', 90, 'square', 'left'),
      cell('circle', 90, 'circle', 'bottom'),
      cell('diamond', 0, 'star', 'right'),
      cell('rectangle', 180, 'circle', 'bottom'),
      cell('circle', 180, 'star', 'right'),
    ],
    choices: [
      cell('diamond', 180, 'square', 'left'),
      cell('diamond', 90, 'square', 'top'),
      cell('diamond', 180, 'square', 'right'),
      cell('diamond', 270, 'square', 'top'),
      cell('diamond', 90, 'circle', 'top'),
      cell('diamond', 90, 'star', 'top'),
    ],
  },
  'MR.47': {
    cells: [
      nested('circle', 'square', true),
      nested('cross', 'diamond', false),
      nested('square', 'star', true),
      nested('square', 'diamond', false),
      nested('circle', 'star', true),
      nested('cross', 'star', true),
      nested('square', 'square', false),
      nested('circle', 'diamond', true),
    ],
    // This source has a missing cell at row 2, column 3, rather than bottom-right.
    choices: [
      nested('cross', 'diamond', true),
      nested('cross', 'square', false),
      nested('square', 'star', false),
      nested('cross', 'square', true),
      nested('cross', 'star', true),
      nested('circle', 'square', false),
    ],
  },
  'MR.55': {
    cells: [
      arrow('full', 'triangle', 'bottom', false, 45),
      arrow('half', 'diamond', 'left', true, 90),
      arrow('empty', 'star', 'top', false, 135),
      arrow('half', 'star', 'top', true, 315),
      arrow('empty', 'triangle', 'right', false, 0),
      arrow('full', 'diamond', 'bottom', false, 45),
      arrow('empty', 'diamond', 'left', true, 180),
      arrow('full', 'star', 'top', false, 225),
    ],
    choices: [
      arrow('half', 'triangle', 'right', true, 270, 180),
      arrow('half', 'triangle', 'top', true, 270),
      arrow('half', 'triangle', 'right', true, 180),
      arrow('half', 'triangle', 'right', true, 270),
      arrow('half', 'triangle', 'right', true, 180, 180),
      arrow('half', 'triangle', 'left', true, 135),
    ],
  },
};

export type CubeMark = readonly [arms: number, turn: number];
export type MarkedCube = readonly [top: CubeMark, left: CubeMark, right: CubeMark];
export const referenceCube: MarkedCube = [
  [4, 0],
  [3, 0],
  [2, 90],
];
// Angles are in each face's own plane, before its isometric projection.
export const icarCubes: Record<string, (MarkedCube | null)[]> = {
  'R3D.03': [
    [
      [5, 0],
      [2, 90],
      [4, 0],
    ],
    [
      [2, 90],
      [5, 0],
      [3, 0],
    ],
    [
      [6, 0],
      [3, 60],
      [5, 0],
    ],
    null,
    [
      [2, 90],
      [3, 0],
      [4, 0],
    ],
    [
      [6, 0],
      [2, 90],
      [0, 0],
    ],
    [
      [4, 0],
      [2, 90],
      [3, 0],
    ],
    null,
  ],
  'R3D.04': [
    [
      [4, 0],
      [3, 0],
      [0, 0],
    ],
    [
      [4, 0],
      [0, 0],
      [5, 0],
    ],
    [
      [2, 90],
      [5, 0],
      [3, 0],
    ],
    null,
    [
      [6, 0],
      [0, 0],
      [3, 0],
    ],
    [
      [6, 0],
      [2, 90],
      [0, 0],
    ],
    [
      [3, 0],
      [2, 90],
      [4, 0],
    ],
    null,
  ],
  'R3D.06': [
    [
      [3, 0],
      [2, 90],
      [4, 0],
    ],
    [
      [5, 0],
      [2, 90],
      [4, 0],
    ],
    [
      [5, 0],
      [3, 0],
      [0, 0],
    ],
    null,
    [
      [3, 0],
      [2, 90],
      [5, 0],
    ],
    [
      [2, 90],
      [3, 30],
      [6, 0],
    ],
    [
      [3, 0],
      [5, 0],
      [2, 90],
    ],
    null,
  ],
  'R3D.08': [
    [
      [4, 0],
      [0, 0],
      [2, 90],
    ],
    [
      [2, 90],
      [4, 0],
      [3, 0],
    ],
    [
      [3, 0],
      [5, 0],
      [2, 90],
    ],
    null,
    [
      [3, 0],
      [2, 90],
      [5, 0],
    ],
    [
      [4, 0],
      [2, 90],
      [3, 0],
    ],
    [
      [2, 90],
      [0, 0],
      [4, 0],
    ],
    null,
  ],
};
