import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import {
  ChallengeQueryParams,
  IChallengeResponse,
} from '@/modules/challenges/domain/types';
import { AxiosResponse } from 'axios';

export const getListChallengeAPI = (
  params?: ChallengeQueryParams
): Promise<AxiosResponse<IChallengeResponse>> =>
  api.get(API_ROUTES.CHALLENGE.CHALLENGE, { params });
export const getChallengeDetailAPI = (
  id: string
): Promise<AxiosResponse<any>> =>
  api.get(API_ROUTES.CHALLENGE.CHALLENGE_DETAIL(id));

// Types for submit challenge
export interface SubmitQuizAnswerDto {
  questionId: string;
  answerId: string;
}

export interface SubmitQuizChallengeDto {
  quiz: {
    answers: SubmitQuizAnswerDto[];
  };
}

export interface PuzzleSubmitDto {
  puzzle: {
    score: number;
  };
}

export interface SubmitOrderingItemDto {
  itemId: string;
  position: number;
}

export interface SubmitOrderingChallengeDto {
  ordering: {
    items: SubmitOrderingItemDto[];
  };
}

export interface SubmitFillBlankAnswerDto {
  questionId: string;
  answer: string;
}

export interface SubmitFillBlankChallengeDto {
  fillBlank: {
    answers: SubmitFillBlankAnswerDto[];
  };
}

export type SubmitChallengeDto =
  | SubmitQuizChallengeDto
  | PuzzleSubmitDto
  | SubmitOrderingChallengeDto
  | SubmitFillBlankChallengeDto;

export const submitChallengeAPI = (
  id: string,
  data: SubmitChallengeDto
): Promise<AxiosResponse<any>> => {
  return api.post(API_ROUTES.CHALLENGE.SUBMIT_CHALLENGE(id), data);
};
