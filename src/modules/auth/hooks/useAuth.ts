import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  LoginFormData,
  RegisterFormData,
  ReSendFormData,
  VerifyFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../domain/types';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  getUserAPI,
  loginAPI,
  logoutAPI,
  refreshTokenAPI,
  registerAPI,
  resendOtpAPI,
  verifyAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
} from '../infrastructure/auth.api';
import { _queryClient } from '@/context/QueryProvider';
import { ERouteTable } from '@/constants/route';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { getAuthApiErrorMessage } from '@/lib/api/auth-error';

export function useAuth() {
  const { setUser, signOut, setToken, setTokens, token, refreshToken } =
    useAuthStore();
  const router = useRouter();

  // ✅ Mutation for sign in
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await loginAPI(data);
      return response.data;
    },
    onSuccess: async (data: {
      access_token: string;
      refresh_token?: string;
    }) => {
      const { access_token, refresh_token } = data;

      if (refresh_token) {
        setTokens(access_token, refresh_token);
      } else {
        setToken(access_token);
      }

      try {
        const userRes = await getUserAPI(); // Fetch user data
        setUser(userRes.data); // Store user data in Zustand

        await _queryClient.invalidateQueries({ queryKey: ['user'] });
        // ✅ Store user in Zustand
        if (userRes.data?.role === 'admin') {
          router.push(ERouteTable.ADMIN);
        } else {
          if (userRes.data?.isVerified) {
            const callbackUrl = new URLSearchParams(window.location.search).get(
              'callbackUrl',
            );
            router.push(
              callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
                ? callbackUrl
                : ERouteTable.HOME,
            );
          } else {
            router.push(ERouteTable.VERIFY_OTP); // ✅ Redirect after login
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error('Đăng nhập thất bại:', error);

      const errorMessage = getAuthApiErrorMessage(
        error,
        'Đăng nhập thất bại. Vui lòng thử lại.',
      );

      toast.error(errorMessage, { duration: 6000 });
    },
  });

  const getUser = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await getUserAPI(); // Replace with actual API call
        setUser(response.data);
        return response.data || null;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await registerAPI(data);
      return response.data;
    },
    onSuccess: (res, variables) => {
      // Validate response data before storing
      if (res && typeof res === 'object') {
        setUser({ id: res.userId, email: variables.email }); // Lưu cả userId và email
        toast.success('Đăng ký thành công!', {
          description: 'Vui lòng kiểm tra email để xác thực tài khoản.',
          duration: 5000,
        });
        router.push(ERouteTable.VERIFY_OTP);
      } else {
        toast.error('Có lỗi xảy ra', {
          description: 'Vui lòng kiểm tra lại email và mật khẩu.',
        });
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error('Đăng ký thất bại:', error);

      toast.error(
        getAuthApiErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'),
        { duration: 6000 },
      );
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyFormData) => {
      const response = await verifyAPI(data);
      return { data: response.data, otpCode: data.otpCode };
    },
    onSuccess: res => {
      if (!res?.data) {
        toast.error('Có lỗi xảy ra', {
          description: 'Dữ liệu phản hồi không hợp lệ.',
        });
        return;
      }

      const isFromForgotPassword =
        (document.referrer && document.referrer.includes('/forgot-password')) ||
        localStorage.getItem('forgotPasswordFlow') === 'true';

      if (isFromForgotPassword) {
        localStorage.setItem('resetPasswordOtp', res.otpCode || '');
        localStorage.setItem('forgotPasswordFlow', 'true');

        toast.success('Xác thực thành công!', {
          description: 'Bây giờ bạn có thể đặt lại mật khẩu.',
          duration: 5000,
        });

        router.push(ERouteTable.UPDATE_PASSWORD);
      } else {
        toast.success('Xác thực tài khoản thành công!', {
          description: 'Bây giờ bạn có thể đăng nhập vào hệ thống.',
          duration: 5000,
        });

        router.push(ERouteTable.LOGIN);
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error('Xác thực tài khoản thất bại:', error);

      toast.error(
        getAuthApiErrorMessage(error, 'Xác thực thất bại. Vui lòng thử lại.'),
        { duration: 6000 },
      );
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (data: ReSendFormData) => {
      const response = await resendOtpAPI(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Đã gửi lại mã xác thực!', {
        description: 'Vui lòng kiểm tra email của bạn.',
        duration: 5000,
      });
    },
    onError: (error: AxiosError<any>) => {
      console.error('Gửi lại mã thất bại:', error);

      toast.error(
        getAuthApiErrorMessage(error, 'Không thể gửi lại mã. Vui lòng thử lại.'),
        { duration: 6000 },
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutAPI();
    },
    onSuccess: async () => {
      console.log('signOut');
      await _queryClient.invalidateQueries({ queryKey: ['user'] }); // ✅ Clear React Query cache
      signOut(); // ✅ Clear Zustand store
      router.push(ERouteTable.LOGIN); // ✅ Redirect to login page
    },
  });

  // ✅ Mutation for refresh token
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await refreshTokenAPI(refreshToken);
      return response.data;
    },
    onSuccess: (data: { access_token: string; refresh_token: string }) => {
      const { access_token, refresh_token } = data;
      setTokens(access_token, refresh_token);
      toast.success('Token đã được làm mới thành công!');
    },
    onError: (error: AxiosError<any>) => {
      console.error('Refresh token thất bại:', error);
      toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      signOut();
      router.push(ERouteTable.LOGIN);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await forgotPasswordAPI(data);
      return response.data;
    },
    onSuccess: (res, variables) => {
      // Store userId and email for verification flow
      if (res && res.userId) {
        setUser({ id: res.userId, email: variables.email });
        localStorage.setItem('forgotPasswordFlow', 'true'); // Set flag for forgot password flow
        toast.success('Yêu cầu đặt lại mật khẩu thành công!', {
          description: 'Vui lòng kiểm tra email để lấy mã xác thực.',
          duration: 5000,
        });
        router.push(ERouteTable.VERIFY_OTP);
      } else {
        toast.error('Có lỗi xảy ra', {
          description: 'Vui lòng thử lại.',
        });
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error('Quên mật khẩu thất bại:', error);

      toast.error(
        getAuthApiErrorMessage(error, 'Gửi yêu cầu thất bại. Vui lòng thử lại.'),
        { duration: 6000 },
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      // Get stored OTP and userId
      const storedOtp = localStorage.getItem('resetPasswordOtp');
      const user = useAuthStore.getState().user;

      if (!storedOtp || !user?.id) {
        throw new Error('Missing OTP or user information');
      }

      // Prepare data for API call
      const resetData = {
        otpCode: storedOtp,
        userId: user.id,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await resetPasswordAPI(resetData);
      return response;
    },
    onSuccess: response => {
      // Check if the response is actually successful
      if (response.status >= 200 && response.status < 300 && response.data) {
        toast.success('Đặt lại mật khẩu thành công!', {
          description: 'Bây giờ bạn có thể đăng nhập với mật khẩu mới.',
          duration: 5000,
        });
        localStorage.removeItem('forgotPasswordFlow'); // Clear the flag
        localStorage.removeItem('resetPasswordOtp'); // Clear stored OTP
        signOut(); // Clear any temporary user data
        router.push(ERouteTable.LOGIN);
      } else {
        // If response status is not success or no data, treat as error
        throw new Error(response.data?.message || 'Reset password failed');
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error('Đặt lại mật khẩu thất bại:', error);

      toast.error(
        getAuthApiErrorMessage(error, 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.'),
        { duration: 6000 },
      );
    },
  });

  return {
    loginMutation,
    getUser,
    registerMutation,
    logoutMutation,
    verifyMutation,
    resendOtpMutation,
    refreshTokenMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
}
