import { z } from 'zod';

export const getChallengeScoreListQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const challengeScoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable(),
  scores: z.object({
    quiz: z.number(),
    puzzle: z.number(),
    ordering: z.number(),
    fillBlank: z.number(),
    lesson: z.number(),
    total: z.number(),
  }),
  completedChallenges: z.number(),
  completedLessons: z.number(),
  createdAt: z.string(),
  rank: z.number(),
});

export type ChallengeScore = z.infer<typeof challengeScoreSchema>;
export type GetChallengeScoreListQuery = z.infer<
  typeof getChallengeScoreListQuerySchema
>;

export const getChallengeScoreListResponseSchema = z.object({
  data: z.array(challengeScoreSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

export type GetChallengeScoreListResponse = z.infer<
  typeof getChallengeScoreListResponseSchema
>;
