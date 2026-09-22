import { z } from 'zod';
import {
  loginSchema,
  registerSchema,
  resendSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './schema';

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type VerifyFormData = z.infer<typeof verifySchema>;
export type ReSendFormData = z.infer<typeof resendSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// API type for reset password (includes otpCode and userId)
export type ResetPasswordAPIData = {
  otpCode: string;
  userId: string;
  password: string;
  confirmPassword: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  isVerified?: boolean;
};

export interface Statistics {
  completedLessons: number;
  inProgressLessons: number;
  totalEnrolledLessons: number;
}
