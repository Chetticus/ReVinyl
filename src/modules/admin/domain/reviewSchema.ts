import { z } from 'zod';

export const getReviewListQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.boolean().optional(),
  rating: z.number().min(1).max(5).optional(),
  product_id: z.string().optional(),
  user_id: z.string().optional(),
  sort_by: z.string().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const reviewSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  product_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
  }),
  product: z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    slug: z.string(),
  }),
});

export type Review = z.infer<typeof reviewSchema>;
export type GetReviewListQuery = z.infer<typeof getReviewListQuerySchema>;

export const getReviewListResponseSchema = z.object({
  data: z.array(reviewSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

export type GetReviewListResponse = z.infer<typeof getReviewListResponseSchema>;
