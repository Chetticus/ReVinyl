/**
 * @description: Route configuration for the application
 * An array of routes that are publicly accessible
 * these routes are not protected by authentication
 * @type { string[] }
 */

export const publicRoutes = [
  '/',
  '/login',
  '/verify-otp',
  '/register',
  '/error',
  '/about',
  '/contact',
  '/topics',
  '/topics/[topicId]',
  '/discovery-activities',
  '/heritage-guide',
  '/forgot-password',
  '/update-password',
  '/admin/categories',
  '/admin',
  '/admin/users',
  '/admin/topics',
  '/admin/create-topic',
  '/admin/discovery-activities',
  '/admin/reviews',
  '/admin/topics/categories',
  '/admin/discovery-activities/scores',
];

/**
 * @description: Route configuration for the application
 * An array of routes that are used for authentication
 * these routes will redirect to the sign-in page if the user is not authenticated
 * @type { string[] }
 */
export const authRoutes = [
  '/login',
  '/register',
  '/verify-otp',
  '/error',
  '/forgot-password',
  '/update-password',
];

/**
 * @description: The prefix for the API authentication
 * Routes that start with this prefix are used for APi * authentication
 * @type { string[] }
 */
export const apiAuthPrefix = '/api/auth';

/**
 * @description: The default redirect URL after login
 * @type { string[] }
 */
export const DEFAULT_LOGIN_REDIRECT = '/';
