import { z } from 'zod';

// Schema for getting user list query parameters
export const getUserListQuerySchema = z.object({
  role: z.string().optional(),
  keyword: z.string().optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(10),
});

// Schema for creating a user
export const createUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.string().min(1, 'Role is required'),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  age: z.number().min(1).max(120).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  birthday: z.string().optional(),
});
