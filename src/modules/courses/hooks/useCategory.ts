import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { getListCategoriesAPI } from '@/modules/courses/infrastructure/categories.api';

export function useCategoryHome() {
  const { token } = useAuthStore();

  const getListCategory = useQuery({
    queryKey: ['list category home'],
    queryFn: async () => {
      try {
        const response = await getListCategoriesAPI();
        return response.data || null;
      } catch (error) {
        console.error('Error fetching list courses:', error);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });

  return { getListCategory };
}
