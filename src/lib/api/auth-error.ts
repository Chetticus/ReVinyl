import { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string;
  error?: string;
  statusCode?: number;
};

const API_MESSAGE_MAP: Record<string, string> = {
  'invalid email or password': 'Email hoặc mật khẩu không đúng.',
  unauthorized: 'Email hoặc mật khẩu không đúng.',
  'email already exists': 'Email này đã được sử dụng.',
  'user already exists': 'Email này đã được sử dụng.',
  'invalid otp': 'Mã xác thực không hợp lệ.',
  'otp expired': 'Mã xác thực đã hết hạn.',
  'invalid credentials': 'Email hoặc mật khẩu không đúng.',
};

function normalizeApiMessage(message: string): string {
  const key = message.trim().toLowerCase();
  return API_MESSAGE_MAP[key] ?? message;
}

function getResponseMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const body = data as ApiErrorBody;
  if (typeof body.message === 'string' && body.message.trim()) {
    return normalizeApiMessage(body.message);
  }

  if (typeof body.error === 'string' && body.error.trim()) {
    return normalizeApiMessage(body.error);
  }

  return undefined;
}

export function getAuthApiErrorMessage(
  error: unknown,
  fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.',
): string {
  if (error instanceof AxiosError) {
    const apiMessage = getResponseMessage(error.response?.data);
    if (apiMessage) return apiMessage;

    const status = error.response?.status;

    if (status === 401) {
      return 'Email hoặc mật khẩu không đúng.';
    }
    if (status === 409) {
      return 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.';
    }
    if (status === 404) {
      return 'Không tìm thấy tài khoản với email này.';
    }
    if (status === 429) {
      return 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.';
    }
    if (status === 422 || status === 400) {
      return 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
    }
    if (status && status >= 500) {
      return 'Lỗi máy chủ. Vui lòng thử lại sau ít phút.';
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.';
    }
  }

  if (error instanceof Error && error.message && !error.message.startsWith('Request failed')) {
    return error.message;
  }

  return fallback;
}

export const PUBLIC_AUTH_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/verify-email',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

export function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some(path => url.includes(path));
}
