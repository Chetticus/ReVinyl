import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChallengeListAPI,
  createChallengeAPI,
  getChallengeByIdAPI,
  updateChallengeAPI,
  deleteChallengeAPI,
} from '../infrastructure/challengeAdmin.api';
import {
  GetChallengeListQuery,
  CreateChallengeRequest,
  UpdateChallengeRequest,
} from '../domain/challengeSchema';
import { toast } from 'sonner';

// Query keys
export const adminChallengeKeys = {
  all: ['admin-challenges'] as const,
  lists: () => [...adminChallengeKeys.all, 'list'] as const,
  list: (params: GetChallengeListQuery) =>
    [...adminChallengeKeys.lists(), params] as const,
  details: () => [...adminChallengeKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminChallengeKeys.details(), id] as const,
};

// Hook for getting challenge list
export function useGetChallengeList(params: GetChallengeListQuery) {
  return useQuery({
    queryKey: adminChallengeKeys.list(params),
    queryFn: () => getChallengeListAPI(params),
    select: response => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting challenge by ID
export function useGetChallengeById(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: adminChallengeKeys.detail(id),
    queryFn: () => getChallengeByIdAPI(id),
    select: response => {
      // The API returns { data: { actual challenge data } }
      return response.data;
    },
    enabled: enabled && !!id,
  });
}

// Hook for creating challenge
export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChallengeRequest) => createChallengeAPI(data),
    onSuccess: response => {
      toast.success('Tạo thử thách thành công!');
      // Invalidate and refetch challenge list
      queryClient.invalidateQueries({ queryKey: adminChallengeKeys.lists() });
      return response.data.data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Có lỗi xảy ra khi tạo thử thách';
      toast.error(errorMessage);
      throw error;
    },
  });
}

// Hook for updating challenge
export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChallengeRequest }) =>
      updateChallengeAPI(id, data),
    onSuccess: (response, variables) => {
      toast.success('Cập nhật thử thách thành công!');
      // Invalidate and refetch challenge list and detail
      queryClient.invalidateQueries({ queryKey: adminChallengeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminChallengeKeys.detail(variables.id),
      });
      return response.data.data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi cập nhật thử thách';
      toast.error(errorMessage);
      throw error;
    },
  });
}

// Hook for deleting challenge
export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChallengeAPI(id),
    onSuccess: () => {
      toast.success('Xóa thử thách thành công!');
      // Invalidate and refetch challenge list
      queryClient.invalidateQueries({ queryKey: adminChallengeKeys.lists() });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Có lỗi xảy ra khi xóa thử thách';
      toast.error(errorMessage);
      throw error;
    },
  });
}
