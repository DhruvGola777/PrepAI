import { z } from 'zod';

const interviewerSchema = z.object({
  type: z.literal('ai'),
  provider: z.string().optional(),
  model: z.string().min(1),
  version: z.string().optional(),
  prompt: z.string().optional(),
  sessionId: z.string().optional(),
  runId: z.string().optional(),
  meta: z.record(z.any()).optional()
}).optional();

const scoreSchema = z.object({
  overall: z.number().min(0).max(100).optional(),
  categories: z.record(z.number()).optional(),
  meta: z.record(z.any()).optional()
}).optional();

export const createInterviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().optional(),
  company: z.string().optional(),
  type: z.enum(['technical', 'behavioral', 'mixed']).optional(),
  status: z.enum(['draft', 'scheduled', 'completed', 'cancelled']).optional(),
  scheduledAt: z.preprocess((value) => {
    if (typeof value === 'string' || value instanceof Date) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date().optional()),
  durationMinutes: z.number().int().positive().optional(),
  interviewer: interviewerSchema.optional(),
  questions: z.array(z.string()).optional(),
  outcome: z.string().optional(),
  score: scoreSchema,
  notes: z.string().optional(),
  resumeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  meta: z.record(z.any()).optional()
});

export const updateInterviewSchema = createInterviewSchema.partial();
