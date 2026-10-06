import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import { AxiosResponse } from 'axios';
import { CategoryItem } from '../domain/types';

export const getListCategoriesAPI = (): Promise<
  AxiosResponse<CategoryItem[]>
> => api.get(API_ROUTES.HOME.categories);
