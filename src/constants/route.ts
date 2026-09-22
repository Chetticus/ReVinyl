export enum ERouteTable {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  VERIFY_OTP = '/verify-otp',
  RESET_PASSWORD = '/reset-password',
  FORGOT_PASSWORD = '/forgot-password',
  UPDATE_PASSWORD = '/update-password',

  ABOUT = '/about',
  CONTACT = '/contact',
  FAQ_PAGE = '/faq',

  CHALLENGE_QUIZ = '/discovery-activities/quizz',
  CHALLENGE_FILL_STORY = '/discovery-activities/fill-story',
  CHALLENGE_PUZZLE = '/discovery-activities/puzzle-heroes',
  CHALLENGE_TIMELINE = '/discovery-activities/timeline',

  COURSE = '/topics',
  COURSE_DETAIL = '/topics/:id',
  COURSE_REGISTER = '/dashboard/topics',
  COURSE_FAVORITE = '/topics/favorite',
  PROFILE = '/profile',
  DASHBOARD = '/dashboard',

  ADMIN = '/admin',
  ASK_AI = '/heritage-guide',
}
