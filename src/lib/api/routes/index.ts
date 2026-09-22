export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/sign-in',
    REGISTER: '/auth/sign-up',
    VERIFY_OTP: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/users/me',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  COURSE: {
    GET_COURSES: '/courses',
    GET_COURSE_DETAIL: (id: string) => `/courses/${id}`,
    GET_LESSON_DETAIL: (id: string) => `/courses/lesson/${id}`,
    SUBMIT_REVIEW: (productId: string) => `/reviews/${productId}`,
    SUBMIT_QUIZ: (lessonId: string) => `/courses/lesson/${lessonId}/quiz`,
    SUBMIT_LESSON: (lessonId: string) => `/courses/lesson/${lessonId}/progress`,
  },
  HOME: {
    categories: '/categories',
    reviewHome: '/reviews/five-star-latest',
  },
  CHALLENGE: {
    CHALLENGE: '/challenge',
    CHALLENGE_DETAIL: (id: string) => `/challenge/${id}`,
    SUBMIT_CHALLENGE: (id: string) => `/challenge/${id}/submit`,
  },
  USER: {
    SCORE: '/users/total-score',
    STATISTICS: '/users/lesson-stats',
    LIST_LESSON_REGISTER: '/enrollments/my',
    REGISTER_LESSON: (id: string) => `/enrollments/${id}`,
    UPLOAD_AVATAR: '/users/upload-avatar',
    UPDATE_USER: '/users',
    LIST_REVIEW_BY_USER: '/reviews/my-reviews',
  },
  SCORES: {
    MY_SCORE: '/scores/my-score',
    LEADERBOARD: '/scores/leaderboard',
  },
  CHAT: {
    SEND: '/chat',
    CONVERSATIONS: '/chat/conversations',
    CONVERSATION_DETAIL: (id: string) => `/chat/conversations/${id}`,
    RENAME: (id: string) => `/chat/conversations/${id}/rename`,
  },
};

export const API_ROUTES_ADMIN = {
  USER: {
    GET_ALL: '/admin/users',
    CREATE: '/admin/users',
    GET_BY_ID: (id: string) => `/admin/users/${id}`,
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`,
  },
  CHALLENGE: {
    GET_ALL: '/admin/challenge/index',
    CREATE: '/admin/challenge',
    GET_BY_ID: (id: string) => `/admin/challenge/${id}`,
    UPDATE: (id: string) => `/admin/challenge/${id}`,
    DELETE: (id: string) => `/admin/challenge/${id}`,
  },
  CATEGORIES: {
    GET_ALL: '/admin/categories',
    GET_BY_ID: (id: string) => `/admin/categories/${id}`,
    CREATE: '/admin/categories',
    UPDATE: (id: string) => `/admin/categories/${id}`,
    DELETE: (id: string) => `/admin/categories/${id}`,
  },
  REVIEWS: {
    GET_ALL: '/admin/reviews',
  },
  CHALLENGE_SCORES: {
    GET_ALL: '/admin/challenge/user-scores',
  },
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
  },
  PRODUCTS: {
    GET_ALL: '/admin/products',
    CREATE: '/admin/products',
    GET_BY_ID: (id: string) => `/admin/products/${id}`,
    UPDATE: (id: string) => `/admin/products/${id}`,
    DELETE: (id: string) => `/admin/products/${id}`,
    UPDATE_STATUS: (id: string) => `/admin/products/${id}/status`,
    DUPLICATE: (id: string) => `/admin/products/${id}/duplicate`,
  },
};
