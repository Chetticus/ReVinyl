import { useQuery } from '@tanstack/react-query';
import { getDashboardAPI } from '@/modules/admin/infrastructure/dashboardAdmin.api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getDashboardAPI(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
