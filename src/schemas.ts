import * as z from 'zod';

// Module Form Schema
export const moduleFormSchema = z.object({
  moduleTitle: z
    .string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(100, 'Tiêu đề tối đa 100 ký tự'),
  moduleDescription: z.string().optional(),
});

export type ModuleFormData = z.infer<typeof moduleFormSchema>;
