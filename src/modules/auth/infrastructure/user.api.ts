import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import {
  LeaderboardParams,
  LeaderboardUser,
  MyScoreResponse,
  TotalScore,
} from '@/modules/challenges/domain/types';
import { AxiosResponse } from 'axios';
import { Statistics } from '../domain/types';
import {
  EnrolledCoursesParams,
  EnrolledCoursesResponse,
} from '@/modules/courses/domain/types';

export const getScoreUserAPI = (): Promise<AxiosResponse<TotalScore>> =>
  api.get(API_ROUTES.USER.SCORE);

export const getStatisticsUserAPI = (): Promise<AxiosResponse<Statistics>> =>
  api.get(API_ROUTES.USER.STATISTICS);

export const getListLessonRegisterAPI = (
  params?: EnrolledCoursesParams
): Promise<AxiosResponse<EnrolledCoursesResponse>> =>
  api.get(API_ROUTES.USER.LIST_LESSON_REGISTER, { params });

export const getListReviewByUserAPI = (): Promise<AxiosResponse<any>> =>
  api.get(API_ROUTES.USER.LIST_REVIEW_BY_USER);

export const registerLessonAPI = (id: string): Promise<AxiosResponse<any>> =>
  api.post(API_ROUTES.USER.REGISTER_LESSON(id));

export const uploadAvatarAPI = (file: File): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(API_ROUTES.USER.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateUserAPI = (data: {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  skills?: string;
  bio?: string;
}): Promise<AxiosResponse<any>> => {
  return api.patch(API_ROUTES.USER.UPDATE_USER, data);
};

// Personal Achievement APIs
export const getMyScoreAPI = (): Promise<AxiosResponse<MyScoreResponse>> =>
  api.get(API_ROUTES.SCORES.MY_SCORE);

export const getLeaderboardAPI = (
  params?: LeaderboardParams
): Promise<AxiosResponse<LeaderboardUser[]>> =>
  api.get(API_ROUTES.SCORES.LEADERBOARD, { params });
