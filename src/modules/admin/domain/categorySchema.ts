import { z } from 'zod';

export const categoryStatusSchema = z.enum(['published', 'draft']);

export const getCategoryListQuerySchema = z.object({
  search: z.string().optional(),
  status: categoryStatusSchema.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const categorySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  short_description: z.string(),
  status: categoryStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  _count: z.object({
    products: z.number(),
  }),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryStatus = z.infer<typeof categoryStatusSchema>;
export type GetCategoryListQuery = z.infer<typeof getCategoryListQuerySchema>;

export const getCategoryListResponseSchema = z.object({
  data: z.array(categorySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export const createCategoryRequestSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  short_description: z.string().min(1, 'Mô tả ngắn là bắt buộc'),
  status: categoryStatusSchema.default('draft'),
});

export const updateCategoryRequestSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  short_description: z.string().min(1, 'Mô tả ngắn là bắt buộc'),
  status: categoryStatusSchema,
});

export type GetCategoryListResponse = z.infer<
  typeof getCategoryListResponseSchema
>;
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;
