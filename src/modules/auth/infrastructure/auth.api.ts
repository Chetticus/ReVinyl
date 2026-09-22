import api from '@/lib/api/axios';
import {
  LoginFormData,
  RegisterFormData,
  ReSendFormData,
  User,
  VerifyFormData,
  ForgotPasswordFormData,
  ResetPasswordAPIData,
} from '../domain/types';
import { API_ROUTES } from '@/lib/api/routes';
import { AxiosResponse } from 'axios';

export const loginAPI = (data: LoginFormData) =>
  api.post(API_ROUTES.AUTH.LOGIN, data);

export const registerAPI = (data: RegisterFormData) =>
  api.post(API_ROUTES.AUTH.REGISTER, data);

export const verifyAPI = (data: VerifyFormData) =>
  api.post(API_ROUTES.AUTH.VERIFY_OTP, data);

export const resendOtpAPI = (data: ReSendFormData) =>
  api.post(API_ROUTES.AUTH.RESEND_OTP, data);

export const forgotPasswordAPI = (data: ForgotPasswordFormData) =>
  api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, data);

export const resetPasswordAPI = (data: ResetPasswordAPIData) =>
  api.post(API_ROUTES.AUTH.RESET_PASSWORD, data);

export const getUserAPI = (): Promise<AxiosResponse<User>> =>
  api.get(API_ROUTES.AUTH.ME);

export const logoutAPI = () => api.post(API_ROUTES.AUTH.LOGOUT);

export const refreshTokenAPI = (refreshToken: string) =>
  api.post(API_ROUTES.AUTH.REFRESH_TOKEN, { refreshToken });
