import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetUserListQuery,
  GetUserListResponse,
  GetUserByIdResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from '../domain/types';
import { AxiosResponse } from 'axios';

// GET /admin - Admin get all users
export const getUserListAPI = (
  params: GetUserListQuery
): Promise<AxiosResponse<GetUserListResponse>> =>
  api.get(API_ROUTES_ADMIN.USER.GET_ALL, { params });

// POST /admin - Admin create user
export const createUserAPI = (
  data: CreateUserRequest
): Promise<AxiosResponse<CreateUserResponse>> =>
  api.post(API_ROUTES_ADMIN.USER.CREATE, data);

// GET /admin/{id} - Admin get user by ID
export const getUserByIdAPI = (
  id: string
): Promise<AxiosResponse<GetUserByIdResponse>> =>
  api.get(API_ROUTES_ADMIN.USER.GET_BY_ID(id));

// PATCH /admin/{id} - Admin edit user
export const updateUserAPI = (
  id: string,
  data: UpdateUserRequest
): Promise<AxiosResponse<UpdateUserResponse>> =>
  api.patch(API_ROUTES_ADMIN.USER.UPDATE(id), data);

// DELETE /admin/{id} - Admin delete user
export const deleteUserAPI = (
  id: string
): Promise<AxiosResponse<DeleteUserResponse>> =>
  api.delete(API_ROUTES_ADMIN.USER.DELETE(id));
