import { z } from 'zod';
import type { Session } from './domain';
import { scoreSession } from './scoring';

type ReportTool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
export type ReportContext = {
  registerTool: (tool: ReportTool, options: { signal: AbortSignal }) => void | Promise<void>;
};

// Optional browser capability. Agents may read the visible report, never answer test items.
export function registerReportTool(session: Session, context?: ReportContext) {
  const lifecycle = new AbortController();
  if (context?.registerTool) {
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'get_open_iq_results',
            description:
              'Read the task scores in the currently displayed Open IQ report. These are unvalidated raw task scores, not IQ scores or population percentiles.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute(input) {
              z.object({}).strict().parse(input);
              return {
                form: session.version,
                completed: session.stage === 'complete',
                inputMode: session.inputMode,
                flags: session.flags,
                scores: scoreSession(session).map((s) => ({
                  task: s.section.name,
                  completed: s.completed,
                  correct: s.correct,
                  total: s.total,
                  unit:
                    s.section.kind === 'speed'
                      ? 'responses in complete rounds'
                      : s.section.kind === 'choice'
                        ? 'questions'
                        : 'recall positions',
                  exactSequences: s.exact,
                  interrupted: s.interrupted,
                  timedSeconds: s.section.kind === 'speed' ? s.elapsed / 1000 : null,
                })),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* An unsupported registry must never interfere with the report. */
    }
  }
  return () => lifecycle.abort();
}
