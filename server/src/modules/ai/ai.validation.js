import { z } from 'zod';

export const analyzeResumeSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1, 'Resume ID is required')
  })
});

export const startInterviewSchema = z.object({
  body: z.object({
    type: z.enum(['technical', 'behavioral', 'mixed']).default('mixed'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    position: z.string().optional()
  })
});

export const submitAnswerSchema = z.object({
  params: z.object({
    interviewId: z.string().min(1, 'Interview ID is required')
  }),
  body: z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required')
  })
});

export const submitVoiceAnswerSchema = z.object({
  params: z.object({
    interviewId: z.string().min(1, 'Interview ID is required')
  }),
  body: z.object({
    question: z.string().min(1, 'Question text is required for context')
  })
});

export const generateFeedbackSchema = z.object({
  params: z.object({
    interviewId: z.string().min(1, 'Interview ID is required')
  })
});
