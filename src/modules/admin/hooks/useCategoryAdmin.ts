import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategoryListAPI,
  getCategoryByIdAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from '../infrastructure/categoryAdmin.api';
import {
  GetCategoryListQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../domain/categorySchema';

export const adminCategoryKeys = {
  all: ['admin-categories'] as const,
  lists: () => [...adminCategoryKeys.all, 'list'] as const,
  list: (params: GetCategoryListQuery) =>
    [...adminCategoryKeys.lists(), params] as const,
  details: () => [...adminCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminCategoryKeys.details(), id] as const,
};

export function useGetCategoryList(params: GetCategoryListQuery) {
  return useQuery({
    queryKey: adminCategoryKeys.list(params),
    queryFn: () => getCategoryListAPI(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetCategoryById(id: string) {
  return useQuery({
    queryKey: adminCategoryKeys.detail(id),
    queryFn: () => getCategoryByIdAPI(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategoryAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['list category home'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      updateCategoryAPI(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.detail(id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.lists() });
    },
  });
}
