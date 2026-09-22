import { z } from 'zod';

// Hàm tạo schema linh hoạt (TypeScript version)
export const createSchema = <T extends z.ZodRawShape>(fields: T) =>
  z.object(fields);

// Các schema được định nghĩa trước
export const schemas = {
  signup: createSchema({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  login: createSchema({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

// ✅ Tự động tạo TypeScript Type từ Zod Schema
export type SignupSchema = z.infer<typeof schemas.signup>;
export type LoginSchema = z.infer<typeof schemas.login>;
