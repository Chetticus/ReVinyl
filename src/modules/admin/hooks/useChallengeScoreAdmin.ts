import { useQuery } from '@tanstack/react-query';
import { getChallengeScoreListAPI } from '../infrastructure/challengeScoreAdmin.api';
import { GetChallengeScoreListQuery } from '../domain/challengeScoreSchema';

export const adminChallengeScoreKeys = {
  all: ['admin-challenge-scores'] as const,
  lists: () => [...adminChallengeScoreKeys.all, 'list'] as const,
  list: (params: GetChallengeScoreListQuery) =>
    [...adminChallengeScoreKeys.lists(), params] as const,
};

export function useGetChallengeScoreList(params: GetChallengeScoreListQuery) {
  return useQuery({
    queryKey: adminChallengeScoreKeys.list(params),
    queryFn: () => getChallengeScoreListAPI(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
