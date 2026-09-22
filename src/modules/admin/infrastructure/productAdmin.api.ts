import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetProductListQuery,
  GetProductListResponse,
  GetProductByIdResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  UpdateProductStatusRequest,
  DeleteProductResponse,
  DuplicateProductResponse,
} from '../domain/types';
import { AxiosResponse } from 'axios';

// GET /admin/products - Admin get all products/courses
export const getProductListAPI = (
  params?: GetProductListQuery
): Promise<AxiosResponse<GetProductListResponse>> =>
  api.get(API_ROUTES_ADMIN.PRODUCTS.GET_ALL, { params });

// POST /admin/products - Admin create product/course
export const createProductAPI = async (
  data: CreateProductRequest
): Promise<AxiosResponse<CreateProductResponse>> => {
  if (data.thumbnail && data.thumbnail instanceof File) {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('short_description', data.short_description);
    formData.append('description', data.description);
    formData.append('category_id', data.category_id);
    formData.append('slug', data.slug || '');
    formData.append('thumbnail', data.thumbnail);
    formData.append('requirements', data.requirements);
    formData.append('learning_outcomes', data.learning_outcomes);
    formData.append('preview_video', data.preview_video || '');
    formData.append('modules', JSON.stringify(data.modules || []));
    formData.append('status', data.status);

    return api.post(API_ROUTES_ADMIN.PRODUCTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // If no file, send as regular JSON
  return api.post(API_ROUTES_ADMIN.PRODUCTS.CREATE, data);
};

// GET /admin/products/{id} - Admin get product by ID
export const getProductByIdAPI = (
  id: string
): Promise<AxiosResponse<GetProductByIdResponse>> =>
  api.get(API_ROUTES_ADMIN.PRODUCTS.GET_BY_ID(id));

// PUT /admin/products/{id} - Admin edit product
export const updateProductAPI = async (
  id: string,
  data: UpdateProductRequest
): Promise<AxiosResponse<UpdateProductResponse>> => {
  if (data.thumbnail && data.thumbnail instanceof File) {
    const formData = new FormData();

    formData.append('title', data.title || '');
    formData.append('short_description', data.short_description || '');
    formData.append('description', data.description || '');
    formData.append('category_id', data.category_id || '');
    formData.append('slug', data.slug || '');
    formData.append('thumbnail', data.thumbnail);
    formData.append('requirements', data.requirements || '');
    formData.append('learning_outcomes', data.learning_outcomes || '');
    formData.append('preview_video', data.preview_video || '');
    formData.append('modules', JSON.stringify(data.modules || []));
    formData.append('status', data.status || 'draft');

    return api.put(API_ROUTES_ADMIN.PRODUCTS.UPDATE(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // If no file, send as regular JSON
  return api.put(API_ROUTES_ADMIN.PRODUCTS.UPDATE(id), data);
};

// DELETE /admin/products/{id} - Admin delete product
export const deleteProductAPI = (
  id: string
): Promise<AxiosResponse<DeleteProductResponse>> =>
  api.delete(API_ROUTES_ADMIN.PRODUCTS.DELETE(id));

// PATCH /admin/products/{id}/status - Update product status
export const updateProductStatusAPI = (
  id: string,
  data: UpdateProductStatusRequest
): Promise<AxiosResponse<UpdateProductResponse>> =>
  api.patch(API_ROUTES_ADMIN.PRODUCTS.UPDATE_STATUS(id), data);

// POST /admin/products/{id}/duplicate - Duplicate product
export const duplicateProductAPI = (
  id: string
): Promise<AxiosResponse<DuplicateProductResponse>> =>
  api.post(API_ROUTES_ADMIN.PRODUCTS.DUPLICATE(id));
