// Course query parameters
export interface CourseQueryParams {
  category_id?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface CategoryItem {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  status: 'published' | 'draft' | 'archived'; // You can extend this if there are other statuses
  created_at: string; // or Date if you parse it
  updated_at: string; // or Date
  deleted_at: string | null;
}

// Enrolled Courses API Response Types
export interface EnrolledLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  type: 'content' | 'quiz' | 'video';
  is_previewable: boolean;
  status: 'published' | 'draft' | 'archived';
  order: number;
  attachment: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface EnrolledModule {
  id: string;
  course_id: string;
  title: string;
  short_description: string;
  order: number;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  lessons: EnrolledLesson[];
}

export interface EnrolledProduct {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  thumbnail: string;
  label: 'hot' | 'featured' | 'new';
  status: 'published' | 'draft' | 'archived';
  requirements: string;
  learning_outcomes: string;
  preview_video: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  modules: EnrolledModule[];
}

export interface EnrolledCourse {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: EnrolledProduct;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  isCompleted: boolean;
  enrolledAt: string;
}

export interface EnrolledCoursesResponse {
  total: number;
  courses: EnrolledCourse[];
}

export interface EnrolledCoursesParams {
  status?: 'all' | 'learning' | 'completed';
}

export interface CategoryResponse {
  data: CategoryItem[];
}

export interface UserReview {
  id: string;
  fullName: string;
  avatar: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  status: boolean;
  created_at: string; // You can use Date if you parse it
  user: UserReview;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  thumbnail: string;
  label: string; // e.g., "featured", "hot"
  status: 'published' | 'draft' | 'archived'; // you can adjust this based on your system
  requirements: string;
  learning_outcomes: string;
  preview_video: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
  reviewCount: number;
  averageRating: number;
  enrollmentCount: number;
  lessonCount: number;
}

export interface ICourseResponse {
  data: Course[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'document' | 'quiz';
  order: number;
  status: 'published' | 'draft' | 'archived';
  duration?: number; // in minutes
  video_url?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  isLearned: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  short_description: string;
  order: number;
  status: 'published' | 'draft' | 'archived'; // Adjust based on your use
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number; // 1 to 5
  comment: string;
  status: boolean;
  created_at: string;
}

export interface RatingBreakdown {
  [key: number]: number; // e.g., { 1: 0, 2: 0, 3: 0, 4: 0, 5: 100 }
}

export interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  thumbnail: string;
  label: string; // e.g., "hot", "featured"
  status: 'published' | 'draft' | 'archived';
  requirements: string;
  learning_outcomes: string;
  preview_video: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  modules: Module[];
  reviews: Review[];
  reviewCount: number;
  averageRating: number;
  ratingBreakdown: RatingBreakdown;
  enrollmentCount: number;
  lessonCount: number;
  isEnrolled: boolean;
  isCompleted: boolean;
  completedCount: number;
  quizLessonCount: number;
  lectureLessonCount: number;
}
