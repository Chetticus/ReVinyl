import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import {
  GetLeaderboardQuery,
  GetLeaderboardResponse,
} from '../domain/leaderboardSchema';
import { AxiosResponse } from 'axios';

export const getLeaderboardAPI = (
  params: GetLeaderboardQuery
): Promise<AxiosResponse<GetLeaderboardResponse>> =>
  api.get(API_ROUTES.SCORES.LEADERBOARD, { params });
