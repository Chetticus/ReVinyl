import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetCategoryListQuery,
  GetCategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Category,
} from '../domain/categorySchema';
import { AxiosResponse } from 'axios';

export const getCategoryListAPI = (
  params: GetCategoryListQuery
): Promise<AxiosResponse<GetCategoryListResponse>> =>
  api.get(API_ROUTES_ADMIN.CATEGORIES.GET_ALL, { params });

export const getCategoryByIdAPI = (
  id: string
): Promise<AxiosResponse<Category>> =>
  api.get(API_ROUTES_ADMIN.CATEGORIES.GET_BY_ID(id));

export const createCategoryAPI = (
  data: CreateCategoryRequest
): Promise<AxiosResponse<Category>> =>
  api.post(API_ROUTES_ADMIN.CATEGORIES.CREATE, data);

export const updateCategoryAPI = (
  id: string,
  data: UpdateCategoryRequest
): Promise<AxiosResponse<Category>> =>
  api.put(API_ROUTES_ADMIN.CATEGORIES.UPDATE(id), data);

export const deleteCategoryAPI = (id: string): Promise<AxiosResponse<void>> =>
  api.delete(API_ROUTES_ADMIN.CATEGORIES.DELETE(id));
