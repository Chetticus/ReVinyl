import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getUserListAPI,
  createUserAPI,
  getUserByIdAPI,
  updateUserAPI,
  deleteUserAPI,
} from '../infrastructure/userAdmin.api';
import {
  GetUserListQuery,
  CreateUserRequest,
  UpdateUserRequest,
} from '../domain/types';

// Query keys
export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (params: GetUserListQuery) =>
    [...adminUserKeys.lists(), params] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminUserKeys.details(), id] as const,
};

// Hook for getting user list
export function useGetUserList(params: GetUserListQuery) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => getUserListAPI(params),
    select: response => response.data,
  });
}

// Hook for getting user by ID
export function useGetUserById(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => getUserByIdAPI(id),
    select: response => response.data,
    enabled: enabled && !!id,
  });
}

// Hook for creating user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUserAPI(data),
    onSuccess: response => {
      toast.success('User created successfully');
      // Invalidate and refetch user list
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
}

// Hook for updating user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUserAPI(id, data),
    onSuccess: (response, variables) => {
      toast.success('User updated successfully');
      // Invalidate and refetch user list and detail
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminUserKeys.detail(variables.id),
      });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
}

// Hook for deleting user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserAPI(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      // Invalidate and refetch user list
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
}
