import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getCoursesDetailAPI,
  getLessonDetailAPI,
  getListCoursesAPI,
} from '@/modules/courses/infrastructure/course.api';
import { CourseQueryParams } from '../domain/types';

export function useListCourse(params?: CourseQueryParams) {
  const { token } = useAuthStore();

  const getListCourse = useQuery({
    queryKey: ['list courses', params],
    queryFn: async () => {
      try {
        const response = await getListCoursesAPI(params);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching list courses:', error);
        return null;
      }
    },
    enabled: !!true,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });

  return { getListCourse };
}

export function useCourseDetail(id: string) {
  const { token } = useAuthStore();

  const getCourseDetail = useQuery({
    queryKey: ['courses detail', id],
    queryFn: async () => {
      try {
        const response = await getCoursesDetailAPI(id);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching list courses:', error);
        return null;
      }
    },
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { getCourseDetail };
}

export function useLessonDetail(id: string) {
  const { token } = useAuthStore();

  const getLessonDetail = useQuery({
    queryKey: ['lesson detail', id],
    queryFn: async () => {
      try {
        const response = await getLessonDetailAPI(id);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching lesson detail', error);
        return null;
      }
    },
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { getLessonDetail };
}
