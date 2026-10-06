import api from '@/lib/api/axios';
import { API_ROUTES_ADMIN } from '@/lib/api/routes';
import {
  GetChallengeListQuery,
  GetChallengeListResponse,
  CreateChallengeRequest,
  CreateChallengeResponse,
  UpdateChallengeRequest,
  UpdateChallengeResponse,
  GetChallengeByIdResponse,
} from '../domain/challengeSchema';
import { AxiosResponse } from 'axios';

// GET /admin/challenge/index - Admin get all challenges
export const getChallengeListAPI = (
  params: GetChallengeListQuery
): Promise<AxiosResponse<GetChallengeListResponse>> =>
  api.get(API_ROUTES_ADMIN.CHALLENGE.GET_ALL, { params });

// POST /admin/challenge - Admin create challenge
export const createChallengeAPI = (
  data: CreateChallengeRequest
): Promise<AxiosResponse<CreateChallengeResponse>> =>
  api.post(API_ROUTES_ADMIN.CHALLENGE.CREATE, data);

// GET /admin/challenge/{id} - Admin get challenge by ID
export const getChallengeByIdAPI = (
  id: string
): Promise<AxiosResponse<GetChallengeByIdResponse>> =>
  api.get(API_ROUTES_ADMIN.CHALLENGE.GET_BY_ID(id));

// PUT /admin/challenge/{id} - Admin update challenge
export const updateChallengeAPI = (
  id: string,
  data: UpdateChallengeRequest
): Promise<AxiosResponse<UpdateChallengeResponse>> =>
  api.put(API_ROUTES_ADMIN.CHALLENGE.UPDATE(id), data);

// DELETE /admin/challenge/{id} - Admin delete challenge
export const deleteChallengeAPI = (id: string): Promise<AxiosResponse<void>> =>
  api.delete(API_ROUTES_ADMIN.CHALLENGE.DELETE(id));
