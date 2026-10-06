import { useQuery } from '@tanstack/react-query';
import { getReviewListAPI } from '../infrastructure/reviewAdmin.api';
import { GetReviewListQuery } from '../domain/reviewSchema';

export const adminReviewKeys = {
  all: ['admin-reviews'] as const,
  lists: () => [...adminReviewKeys.all, 'list'] as const,
  list: (params: GetReviewListQuery) =>
    [...adminReviewKeys.lists(), params] as const,
};

export function useGetReviewList(params: GetReviewListQuery) {
  return useQuery({
    queryKey: adminReviewKeys.list(params),
    queryFn: () => getReviewListAPI(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
