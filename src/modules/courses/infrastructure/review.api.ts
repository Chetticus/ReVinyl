import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import { AxiosResponse } from 'axios';
import { Review } from '../domain/types';

export const getReviewHomeAPI = (): Promise<AxiosResponse<Review[]>> =>
  api.get(API_ROUTES.HOME.reviewHome);

export interface SubmitReviewRequest {
  rating: number;
  comment: string;
}

export interface SubmitReviewResponse {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  status: boolean;
  created_at: string;
}

export const submitReviewAPI = (
  productId: string,
  data: SubmitReviewRequest
): Promise<AxiosResponse<SubmitReviewResponse>> =>
  api.post(API_ROUTES.COURSE.SUBMIT_REVIEW(productId), data);
