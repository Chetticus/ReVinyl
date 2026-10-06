import { useQuery } from '@tanstack/react-query';
import { getLeaderboardAPI } from '../infrastructure/leaderboardAdmin.api';
import { GetLeaderboardQuery } from '../domain/leaderboardSchema';

export const adminLeaderboardKeys = {
  all: ['admin-leaderboard'] as const,
  lists: () => [...adminLeaderboardKeys.all, 'list'] as const,
  list: (params: GetLeaderboardQuery) =>
    [...adminLeaderboardKeys.lists(), params] as const,
};

export function useGetLeaderboard(params: GetLeaderboardQuery = { limit: 5 }) {
  return useQuery({
    queryKey: adminLeaderboardKeys.list(params),
    queryFn: () => getLeaderboardAPI(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
