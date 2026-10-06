import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getChallengeDetailAPI,
  getListChallengeAPI,
  submitChallengeAPI,
  SubmitChallengeDto,
} from '@/modules/auth/infrastructure/challenge.api';
import { ChallengeQueryParams } from '../domain/types';
import { toast } from 'sonner';

export function useListChallenge(params?: ChallengeQueryParams) {
  const { token } = useAuthStore();

  const getListChallenge = useQuery({
    queryKey: ['list challenge', params],
    queryFn: async () => {
      try {
        const response = await getListChallengeAPI(params);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching list challenge:', error);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });

  return { getListChallenge };
}

export function useChallengeDetail(id: string) {
  const { token } = useAuthStore();

  const getChallengeDetail = useQuery({
    queryKey: ['challenge detail', id],
    queryFn: async () => {
      try {
        const response = await getChallengeDetailAPI(id);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching list challenge:', error);
        return null;
      }
    },
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { getChallengeDetail };
}

// Hook for submitting challenge
export function useSubmitChallenge() {
  const queryClient = useQueryClient();

  const submitChallengeMutation = useMutation({
    mutationFn: async ({
      challengeId,
      data,
    }: {
      challengeId: string;
      data: SubmitChallengeDto;
    }) => {
      const response = await submitChallengeAPI(challengeId, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('Nộp bài thành công!');

      // // Invalidate challenge detail to refresh data if needed
      // queryClient.invalidateQueries({
      //   queryKey: ['challenge detail', variables.challengeId],
      // });

      // Invalidate user scores/leaderboard
      queryClient.invalidateQueries({ queryKey: ['user-scores'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['list challenge'] });
      queryClient.invalidateQueries({ queryKey: ['totalScore'] });

      return data;
    },
    onError: (error: any) => {
      console.error('Submit challenge error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!';

      toast.error(errorMessage);
      throw error;
    },
  });

  return { submitChallengeMutation };
}
