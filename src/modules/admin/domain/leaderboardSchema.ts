import { z } from 'zod';

export const getLeaderboardQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(5),
});

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
});

export const leaderboardEntrySchema = z.object({
  rank: z.number(),
  user: userSchema,
  totalScore: z.number(),
  formattedScore: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type GetLeaderboardQuery = z.infer<typeof getLeaderboardQuerySchema>;

export const getLeaderboardResponseSchema = z.array(leaderboardEntrySchema);

export type GetLeaderboardResponse = z.infer<
  typeof getLeaderboardResponseSchema
>;
