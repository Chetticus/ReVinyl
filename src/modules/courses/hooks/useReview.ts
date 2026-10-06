import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getReviewHomeAPI,
  submitReviewAPI,
  SubmitReviewRequest,
  SubmitReviewResponse,
} from '@/modules/courses/infrastructure/review.api';

export function useReviewHome() {
  const { token } = useAuthStore();

  const getListReviewHome = useQuery({
    queryKey: ['list review home'],
    queryFn: async () => {
      try {
        const response = await getReviewHomeAPI();
        return response.data || null;
      } catch (error) {
        console.error('Error fetching list courses:', error);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });

  return { getListReviewHome };
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  const submitReviewMutation = useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: string;
      data: SubmitReviewRequest;
    }): Promise<SubmitReviewResponse> => {
      try {
        const response = await submitReviewAPI(productId, data);
        return response.data;
      } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch course detail to update review count and rating
      queryClient.invalidateQueries({ queryKey: ['course-detail'] });
      queryClient.invalidateQueries({ queryKey: ['list review home'] });
    },
  });

  return { submitReviewMutation };
}
