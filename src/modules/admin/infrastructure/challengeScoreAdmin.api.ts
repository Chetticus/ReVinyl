import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetChallengeScoreListQuery,
  GetChallengeScoreListResponse,
} from '../domain/challengeScoreSchema';
import { AxiosResponse } from 'axios';

export const getChallengeScoreListAPI = (
  params: GetChallengeScoreListQuery
): Promise<AxiosResponse<GetChallengeScoreListResponse>> =>
  api.get(API_ROUTES_ADMIN.CHALLENGE_SCORES.GET_ALL, { params });
