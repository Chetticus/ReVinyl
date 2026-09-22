import { z } from 'zod';
import {
  createUserSchema,
  updateUserSchema,
  getUserListQuerySchema,
} from './schema';

// Query parameters for getting user list
export type GetUserListQuery = z.infer<typeof getUserListQuerySchema>;

// Request types
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

// User type
export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  role: string;
  age?: number | null;
  grade?: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    enrollments: number;
    reviews: number;
    challengeScore: number;
  };
};

// Response types
export type GetUserListResponse = {
  data: AdminUser[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type GetUserByIdResponse = AdminUser;

export type CreateUserResponse = AdminUser;

export type UpdateUserResponse = AdminUser;

export type DeleteUserResponse = {
  message: string;
};

// ===== ADMIN PRODUCTS (COURSES) TYPES =====

// Query parameters for getting products list
export type GetProductListQuery = {
  category_id?: string;
  status?: 'published' | 'draft' | 'archived';
  search?: string;
  page?: number;
  limit?: number;
};

// Product (Course) type for admin
export type AdminProduct = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  thumbnail: string;
  label: 'hot' | 'featured' | 'new' | 'normal';
  status: 'published' | 'draft' | 'archived';
  requirements: string;
  learning_outcomes: string;
  preview_video?: string;
  price?: number;
  duration?: string;
  maxStudents?: number;
  modules?: CourseModule[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  created_by?: string;
  last_modified_by?: string;
  _count: {
    modules: number;
    lessons: number;
    enrollments: number;
    reviews: number;
  };
  reviewCount: number;
  averageRating: number;
  enrollmentCount: number;
  lessonCount: number;
  stats?: {
    totalModules: number;
    totalEnrollments: number;
    totalReviews: number;
    totalLessons: number;
    lessonsByType: {
      video: number;
      quiz: number;
      content: number;
    };
  };
};

// Module type for courses
export type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  short_description: string;
  order: number;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  _count?: {
    lessons: number;
  };
  lessons: Array<{
    id: string;
    module_id: string;
    title: string;
    type: 'lesson' | 'quiz';
    description?: string;
    videoUrl?: string;
    content?: string;
    lessonType?: 'video' | 'document';
    previewEnabled?: boolean;
    status: 'published' | 'draft' | 'archived';
    order: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    quiz_questions?: Array<{
      id: string;
      question: string;
      answers: string[];
      correct_answer: string;
      explanation?: string;
    }>;
  }>;
};

// Request types for products
export type CreateProductRequest = {
  title: string;
  slug?: string;
  short_description: string;
  description: string;
  category_id: string;
  thumbnail?: string | File | null;
  label?: 'hot' | 'featured' | 'new' | 'normal';
  status: 'published' | 'draft' | 'archived';
  requirements: string;
  learning_outcomes: string;
  preview_video?: string;
  modules?: CourseModule[];
  price?: number;
  duration?: string;
  maxStudents?: number;
};

export type UpdateProductRequest = Partial<CreateProductRequest> & {
  last_modified_by?: string;
};

export type UpdateProductStatusRequest = {
  status: 'published' | 'draft' | 'archived';
};

// Response types for products
export type GetProductListResponse = {
  data: AdminProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type GetProductByIdResponse = AdminProduct;

export type CreateProductResponse = AdminProduct;

export type UpdateProductResponse = AdminProduct;

export type DeleteProductResponse = {
  message: string;
};

export type DuplicateProductResponse = AdminProduct;

// ===== QUIZ QUESTION TYPES =====

// Question type for quiz components
export interface Question {
  id: number;
  question: string;
  answers: string[];
  correct_answer: string;
  explanation?: string;
}
