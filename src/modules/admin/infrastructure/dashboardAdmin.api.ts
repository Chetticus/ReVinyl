import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetReviewListQuery,
  GetReviewListResponse,
} from '../domain/reviewSchema';
import { AxiosResponse } from 'axios';

export const getDashboardAPI = (): Promise<AxiosResponse<any>> =>
  api.get(API_ROUTES_ADMIN.DASHBOARD.STATS);
