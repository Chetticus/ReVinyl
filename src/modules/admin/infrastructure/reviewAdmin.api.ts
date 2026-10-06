import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetReviewListQuery,
  GetReviewListResponse,
} from '../domain/reviewSchema';
import { AxiosResponse } from 'axios';

export const getReviewListAPI = (
  params: GetReviewListQuery
): Promise<AxiosResponse<GetReviewListResponse>> =>
  api.get(API_ROUTES_ADMIN.REVIEWS.GET_ALL, { params });
