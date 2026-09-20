import { z } from 'zod';

export const FORM_VERSION = 'open-iq-1.0';
export const APP_VERSION = '1.0.0';
export type SectionId =
  | 'matrix'
  | 'words'
  | 'sequence'
  | 'rotation'
  | 'comparison'
  | 'numbers'
  | 'analogies'
  | 'span'
  | 'folding'
  | 'search';
export type Shape = 'circle' | 'square' | 'triangle' | 'diamond' | 'cross';
export type Glyph = {
  shape: Shape;
  count: number;
  fill: boolean;
  turn: number;
  mark?: boolean;
  mask?: number;
};
export type Point3 = [number, number, number];
export type Point2 = [number, number];
export type ChoiceItem = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
} & (
  | { kind: 'text'; sequence?: number[] }
  | { kind: 'matrix'; cells: Glyph[]; choices: Glyph[] }
  | { kind: 'rotation'; object: Point3[]; choices: Point3[][] }
  | { kind: 'folding'; folds: ('left' | 'up')[]; holes: Point2[]; choices: Point2[][] }
);

export type Section = {
  id: SectionId;
  name: string;
  area: string;
  count: number;
  minutes: string;
  description: string;
  instructions: string[];
  kind: 'choice' | 'sequence' | 'span' | 'speed';
};

export const responseSchema = z.object({
  itemId: z.string().max(80),
  section: z.enum([
    'matrix',
    'words',
    'sequence',
    'rotation',
    'comparison',
    'numbers',
    'analogies',
    'span',
    'folding',
    'search',
  ]),
  answer: z.union([
    z.number().int().min(0).max(99),
    z.array(z.number().int().min(0).max(99)).max(24),
    z.null(),
  ]),
  elapsedMs: z.number().finite().min(0).max(86400000),
  status: z.enum(['answered', 'omitted', 'interrupted']),
  processing: z.array(z.boolean()).max(24).optional(),
});
export type Response = z.infer<typeof responseSchema>;

const speedBlockSchema = z.object({
  section: z.enum(['comparison', 'search']),
  block: z.number().int().min(0).max(1),
  durationMs: z.number().min(0).max(180000),
  interrupted: z.boolean(),
  responses: z
    .array(
      z.object({
        trial: z.number().int().min(0).max(999),
        answer: z.boolean(),
        elapsedMs: z.number().finite().min(0).max(180000),
      }),
    )
    .max(1000),
});
export type SpeedBlock = z.infer<typeof speedBlockSchema>;

export const sessionSchema = z.object({
  version: z.literal(FORM_VERSION),
  id: z.string().uuid(),
  startedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sectionIndex: z.number().int().min(0).max(10),
  stage: z.enum(['intro', 'practice', 'ready', 'running', 'break', 'complete']),
  responses: z.array(responseSchema).max(160),
  speedBlocks: z.array(speedBlockSchema).max(4),
  inputMode: z.enum(['keyboard', 'touch']),
  activeTrial: z.string().max(80).nullable(),
  flags: z.array(z.enum(['interrupted', 'resumed', 'retest', 'storage-unavailable'])).max(4),
});
export type Session = z.infer<typeof sessionSchema>;

export function createSession(inputMode: Session['inputMode'], retest = false): Session {
  const now = new Date().toISOString();
  return {
    version: FORM_VERSION,
    id: crypto.randomUUID(),
    startedAt: now,
    updatedAt: now,
    sectionIndex: 0,
    stage: 'intro',
    responses: [],
    speedBlocks: [],
    inputMode,
    activeTrial: null,
    flags: retest ? ['retest'] : [],
  };
}

export const sections: Section[] = [
  {
    id: 'matrix',
    name: 'Matrix reasoning',
    area: 'Reasoning',
    count: 18,
    minutes: '8–10',
    kind: 'choice',
    description: 'Find the rules in a pattern.',
    instructions: [
      'Find the option that completes the bottom-right cell.',
      'Look across the rows and down the columns. More than one property may change.',
      'There is no time limit. You can skip a question, but you cannot return to it.',
    ],
  },
  {
    id: 'words',
    name: 'Word meaning',
    area: 'Language',
    count: 20,
    minutes: '4–5',
    kind: 'choice',
    description: 'Recognize the meaning of words.',
    instructions: [
      'Choose the word closest in meaning to the word shown.',
      'Use the most common meaning. Do not use a dictionary or translator.',
      'This section reflects your experience with the English language.',
    ],
  },
  {
    id: 'sequence',
    name: 'Sequence memory',
    area: 'Memory',
    count: 12,
    minutes: '5–6',
    kind: 'sequence',
    description: 'Remember and rearrange a sequence.',
    instructions: [
      'Watch the digits appear one at a time. Do not write them down.',
      'Enter them in the order requested: backwards, or from smallest to largest.',
      'Each sequence plays once. Take as much time as you need to enter your answer.',
    ],
  },
  {
    id: 'rotation',
    name: 'Mental rotation',
    area: 'Spatial thinking',
    count: 18,
    minutes: '6–7',
    kind: 'choice',
    description: 'Recognize an object from another angle.',
    instructions: [
      'Choose the same block object viewed from a different angle.',
      'The object may turn in any direction, but its blocks do not move relative to one another.',
      'A mirror image is not the same object. There is no time limit.',
    ],
  },
  {
    id: 'comparison',
    name: 'Symbol comparison',
    area: 'Visual speed',
    count: 2,
    minutes: '3',
    kind: 'speed',
    description: 'Compare pairs of symbols quickly.',
    instructions: [
      'Decide whether the two groups of symbols are exactly the same.',
      'Work quickly without sacrificing accuracy. Use the on-screen buttons or F for different and J for same.',
      'There are two 90-second rounds. You can rest between them.',
    ],
  },
  {
    id: 'numbers',
    name: 'Number relations',
    area: 'Reasoning',
    count: 18,
    minutes: '7–9',
    kind: 'choice',
    description: 'Find the next number in a sequence.',
    instructions: [
      'Choose the number that follows the pattern.',
      'A pattern may involve alternating sequences or changing differences.',
      'No calculator or notes. There is no time limit.',
    ],
  },
  {
    id: 'analogies',
    name: 'Verbal relationships',
    area: 'Language',
    count: 16,
    minutes: '4–5',
    kind: 'choice',
    description: 'Identify relationships between ideas.',
    instructions: [
      'The first pair of words has a relationship.',
      'Choose the word that gives the second pair the same relationship.',
      'For example, bird is to nest as bee is to hive.',
    ],
  },
  {
    id: 'span',
    name: 'Spatial memory',
    area: 'Memory',
    count: 10,
    minutes: '6–8',
    kind: 'span',
    description: 'Hold locations in mind while making decisions.',
    instructions: [
      'Remember each highlighted position in the grid, in order.',
      'Between positions, decide whether a shape has left-to-right mirror symmetry.',
      'At the end, select the remembered positions in the order they appeared.',
    ],
  },
  {
    id: 'folding',
    name: 'Paper folding',
    area: 'Spatial thinking',
    count: 16,
    minutes: '6–7',
    kind: 'choice',
    description: 'Imagine a folded sheet opening out.',
    instructions: [
      'A square sheet is folded as shown, then holes are punched through every layer.',
      'Choose the pattern of holes after the sheet is completely unfolded.',
      'Dashed lines show the folds. Arrows show which half moves.',
    ],
  },
  {
    id: 'search',
    name: 'Visual search',
    area: 'Visual speed',
    count: 2,
    minutes: '2',
    kind: 'speed',
    description: 'Find a target among similar symbols.',
    instructions: [
      'Look for the target symbol in the grid.',
      'Use F for absent and J for present, or the two on-screen buttons.',
      'There are two 60-second rounds. Accuracy and speed are recorded separately.',
    ],
  },
];

export function flagSession(session: Session, flag: Session['flags'][number]): Session {
  return { ...session, flags: [...new Set([...session.flags, flag])] };
}
