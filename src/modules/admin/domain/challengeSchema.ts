import { z } from 'zod';

// Schema for getting challenge list query parameters
export const getChallengeListQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(10),
});

// Challenge types
export const challengeTypeSchema = z.enum([
  'quiz',
  'ordering',
  'fillBlank',
  'puzzle',
]);
export const challengeStatusSchema = z.enum(['draft', 'published']);

// Question schema
export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  _count: z.object({
    answers: z.number(),
  }),
});

// Challenge summary schema
export const challengeSummarySchema = z.object({
  questionsCount: z.number().optional(),
  itemsCount: z.number().optional(),
  hasQuestions: z.boolean().optional(),
  hasData: z.boolean().optional(),
  preview: z.string().nullable(),
});

// Challenge stats schema
export const challengeStatsSchema = z.object({
  totalCompletions: z.number(),
});

// Challenge schema
export const challengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  type: challengeTypeSchema,
  order: z.number(),
  status: challengeStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
  questions: z.array(questionSchema),
  puzzleChallenge: z
    .object({
      id: z.string(),
      challenge_id: z.string(),
      instruction: z.string(),
      image: z.string(),
    })
    .nullable(),
  orderingChallenge: z
    .object({
      id: z.string(),
      challenge_id: z.string(),
      instruction: z.string(),
      items: z.array(
        z.object({
          id: z.string(),
          ordering_id: z.string(),
          content: z.string(),
          correct_order: z.number(),
          explanation: z.string().optional(),
        })
      ),
    })
    .nullable(),
  fillBlankChallenge: z
    .object({
      id: z.string(),
      challenge_id: z.string(),
      questions: z.array(
        z.object({
          id: z.string(),
          challenge_id: z.string(),
          sentence: z.string(),
          correct_word: z.string(),
        })
      ),
    })
    .nullable(),
  _count: z.object({
    challengeScore: z.number(),
  }),
  data: z
    .object({
      questions: z
        .array(
          z.object({
            id: z.string(),
            question: z.string(),
            explanation: z.string().optional(),
            answers: z.array(
              z.object({
                id: z.string(),
                answer: z.string(),
                is_correct: z.boolean(),
              })
            ),
          })
        )
        .optional(),
      instruction: z.string().optional(),
      image: z.string().optional(),
      items: z
        .array(
          z.object({
            id: z.string(),
            content: z.string(),
            correct_order: z.number(),
            explanation: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  summary: challengeSummarySchema.optional(),
  stats: challengeStatsSchema,
});

// Create/Update request schemas
export const createQuestionSchema = z.object({
  question: z.string(),
  explanation: z.string().optional(),
  answers: z.array(
    z.object({
      answer: z.string(),
      is_correct: z.boolean(),
    })
  ),
});

export const createPuzzleSchema = z.object({
  instruction: z.string(),
  image: z.string(),
});

export const createOrderingItemSchema = z.object({
  content: z.string(),
  correct_order: z.number(),
});

export const createOrderingSchema = z.object({
  instruction: z.string(),
  items: z.array(createOrderingItemSchema),
});

export const createFillBlankQuestionSchema = z.object({
  sentence: z.string(),
  correct_word: z.string(),
});

export const createFillBlankSchema = z.object({
  questions: z.array(createFillBlankQuestionSchema),
});

export const createChallengeSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: challengeTypeSchema,
  order: z.number().default(0),
  status: challengeStatusSchema.default('draft'),
  questions: z.array(createQuestionSchema).optional(),
  puzzle: createPuzzleSchema.optional(),
  ordering: createOrderingSchema.optional(),
  fillBlank: createFillBlankSchema.optional(),
});

export const updateChallengeSchema = createChallengeSchema.partial();

// Response schemas
export const getChallengeListResponseSchema = z.object({
  data: z.array(challengeSchema),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
});

export const createChallengeResponseSchema = z.object({
  data: challengeSchema,
});

export const updateChallengeResponseSchema = z.object({
  data: challengeSchema,
});

export const getChallengeByIdResponseSchema = z.object({
  data: challengeSchema,
});

// Export types
export type GetChallengeListQuery = z.infer<typeof getChallengeListQuerySchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type ChallengeType = z.infer<typeof challengeTypeSchema>;
export type ChallengeStatus = z.infer<typeof challengeStatusSchema>;
export type ChallengeSummary = z.infer<typeof challengeSummarySchema>;
export type ChallengeStats = z.infer<typeof challengeStatsSchema>;
export type GetChallengeListResponse = z.infer<
  typeof getChallengeListResponseSchema
>;
export type CreateChallengeRequest = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeRequest = z.infer<typeof updateChallengeSchema>;
export type CreateChallengeResponse = z.infer<
  typeof createChallengeResponseSchema
>;
export type UpdateChallengeResponse = z.infer<
  typeof updateChallengeResponseSchema
>;
export type GetChallengeByIdResponse = z.infer<
  typeof getChallengeByIdResponseSchema
>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type CreatePuzzle = z.infer<typeof createPuzzleSchema>;
export type CreateOrdering = z.infer<typeof createOrderingSchema>;
export type CreateOrderingItem = z.infer<typeof createOrderingItemSchema>;
export type CreateFillBlank = z.infer<typeof createFillBlankSchema>;
export type CreateFillBlankQuestion = z.infer<
  typeof createFillBlankQuestionSchema
>;
