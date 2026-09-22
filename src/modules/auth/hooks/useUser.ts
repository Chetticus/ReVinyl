import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getScoreUserAPI,
  getStatisticsUserAPI,
  registerLessonAPI,
  uploadAvatarAPI,
  updateUserAPI,
  getListLessonRegisterAPI,
  getListReviewByUserAPI,
  getMyScoreAPI,
  getLeaderboardAPI,
} from '@/modules/auth/infrastructure/user.api';
import { _queryClient } from '@/context/QueryProvider';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getUserAPI } from '@/modules/auth/infrastructure/auth.api';
import { EnrolledCoursesParams } from '@/modules/courses/domain/types';
import { LeaderboardParams } from '@/modules/challenges/domain/types';

export function useUserCourse() {
  const { token } = useAuthStore();

  const getTotalScore = useQuery({
    queryKey: ['totalScore'],
    queryFn: async () => {
      try {
        const response = await getScoreUserAPI();
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

  const getUserMe = useQuery({
    queryKey: ['getUserMe'],
    queryFn: async () => {
      try {
        const response = await getUserAPI();
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

  const getStatistics = useQuery({
    queryKey: ['getStatistics'],
    queryFn: async () => {
      try {
        const response = await getStatisticsUserAPI();
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

  const getListLessonRegister = useQuery({
    queryKey: ['getListLessonRegisterAPI'],
    queryFn: async () => {
      try {
        const response = await getListLessonRegisterAPI();
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

  const getReviewByUser = useQuery({
    queryKey: ['getReviewByUser'],
    queryFn: async () => {
      try {
        const response = await getListReviewByUserAPI();
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

  const registerLessonMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await registerLessonAPI(id);
      return response.data;
    },
    onSuccess: async (res, variables) => {
      if (res && typeof res === 'object') {
        await _queryClient.invalidateQueries({
          queryKey: ['courses detail', variables],
        });
        toast.success('Đăng ký khoá học thành công!');
      } else {
        toast.error('Có lỗi xảy ra vui lòng thử lại!');
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error('Đăng nhập thất bại:', error);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadAvatarAPI(file);
      return response.data;
    },
    onSuccess: async () => {
      toast.success('Cập nhật avatar thành công!');
      // Invalidate user data to refresh avatar
      await _queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: AxiosError<any>) => {
      console.error('Upload avatar thất bại:', error);

      let errorMessage = 'Upload avatar thất bại';
      let errorDescription = 'Vui lòng thử lại sau.';

      const status = error.response?.status;

      if (status === 400) {
        errorMessage = 'File không hợp lệ';
        errorDescription = 'Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF).';
      } else if (status === 413) {
        errorMessage = 'File quá lớn';
        errorDescription = 'Vui lòng chọn file có kích thước nhỏ hơn 5MB.';
      } else if (status === 401) {
        errorMessage = 'Phiên đăng nhập hết hạn';
        errorDescription = 'Vui lòng đăng nhập lại.';
      } else if (status && status >= 500) {
        errorMessage = 'Lỗi server';
        errorDescription = 'Vui lòng thử lại sau ít phút.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Lỗi kết nối';
        errorDescription = 'Vui lòng kiểm tra kết nối internet.';
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: {
      firstName?: string;
      lastName?: string;
      username?: string;
      phone?: string;
      skills?: string;
      bio?: string;
    }) => {
      const response = await updateUserAPI(data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success('Cập nhật thông tin thành công!');
      // Invalidate user data to refresh profile
      await _queryClient.invalidateQueries({ queryKey: ['getUserMe'] });
    },
    onError: (error: AxiosError<any>) => {
      console.error('Cập nhật thông tin thất bại:', error);

      let errorMessage = 'Cập nhật thông tin thất bại';
      let errorDescription = 'Vui lòng thử lại sau.';

      const status = error.response?.status;

      if (status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ';
        errorDescription = 'Vui lòng kiểm tra lại thông tin nhập vào.';
      } else if (status === 401) {
        errorMessage = 'Phiên đăng nhập hết hạn';
        errorDescription = 'Vui lòng đăng nhập lại.';
      } else if (status === 422) {
        errorMessage = 'Dữ liệu không hợp lệ';
        errorDescription = 'Vui lòng kiểm tra định dạng dữ liệu.';
      } else if (status && status >= 500) {
        errorMessage = 'Lỗi server';
        errorDescription = 'Vui lòng thử lại sau ít phút.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Lỗi kết nối';
        errorDescription = 'Vui lòng kiểm tra kết nối internet.';
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });
    },
  });

  return {
    getTotalScore,
    getStatistics,
    registerLessonMutation,
    uploadAvatarMutation,
    getUserMe,
    updateUserMutation,
    getListLessonRegister,
    getReviewByUser,
  };
}

// Hook with parameters support for enrolled courses
export function useEnrolledCourses(params?: EnrolledCoursesParams) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['enrolledCourses', params],
    queryFn: async () => {
      try {
        const response = await getListLessonRegisterAPI(params);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });
}

// Hook for fetching user's personal score
export function useMyScore() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['myScore'],
    queryFn: async () => {
      try {
        const response = await getMyScoreAPI();
        return response.data || null;
      } catch (error) {
        console.error('Error fetching my score:', error);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });
}

// Hook for fetching leaderboard with parameters
export function useLeaderboard(params?: LeaderboardParams) {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: async () => {
      try {
        const response = await getLeaderboardAPI(params);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });
}
