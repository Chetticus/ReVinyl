import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import { AxiosResponse } from 'axios';
import {
  CourseDetail,
  CourseQueryParams,
  ICourseResponse,
} from '../domain/types';

export const getListCoursesAPI = (
  params?: CourseQueryParams
): Promise<AxiosResponse<ICourseResponse>> => {
  return api.get(API_ROUTES.COURSE.GET_COURSES, { params });
};

export const getCoursesDetailAPI = (
  id: string
): Promise<AxiosResponse<CourseDetail>> =>
  api.get(API_ROUTES.COURSE.GET_COURSE_DETAIL(id));

export const getLessonDetailAPI = (id: string): Promise<AxiosResponse<any>> => {
  return api.get(API_ROUTES.COURSE.GET_LESSON_DETAIL(id));
};

export const submitQuizAPI = (
  lessonId: string,
  data: { answers: Array<{ questionId: string; answerId: string }> }
): Promise<AxiosResponse<any>> => {
  return api.post(API_ROUTES.COURSE.SUBMIT_QUIZ(lessonId), data);
};

export const submitLessonAPI = (
  lessonId: string
): Promise<AxiosResponse<any>> => {
  return api.post(API_ROUTES.COURSE.SUBMIT_LESSON(lessonId));
};
