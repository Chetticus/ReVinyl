import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';
import { isPublicAuthRequest } from './auth-error';
import { API_ROUTES } from './routes';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': process.env.NEXT_PUBLIC_X_TENANT_ID,
  },
});

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': process.env.NEXT_PUBLIC_X_TENANT_ID,
  },
});

// Gắn token vào request
api.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Biến để tránh multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Login/register failures return 401 — do not refresh or redirect
      if (isPublicAuthRequest(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh, đợi kết quả
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const response = await refreshApi.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://your-api.com'}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
            { refreshToken }
          );

          const { access_token, refresh_token } = response.data;

          // Cập nhật tokens trong store
          useAuthStore.getState().setTokens(access_token, refresh_token);

          // Cập nhật header cho request gốc
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          processQueue(null, access_token);

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh token thất bại, đăng xuất user
          useAuthStore.getState().signOut();

          // Redirect đến trang login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        useAuthStore.getState().signOut();
        isRefreshing = false;

        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/login')
        ) {
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
