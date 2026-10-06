export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const COURSE_STATUS_OPTIONS = [
  { value: COURSE_STATUS.DRAFT, label: 'Bản nháp' },
  { value: COURSE_STATUS.PUBLISHED, label: 'Đã xuất bản' },
  { value: COURSE_STATUS.ARCHIVED, label: 'Đã lưu trữ' },
];

// Course status type
export type CourseStatus = (typeof COURSE_STATUS)[keyof typeof COURSE_STATUS];

// Lesson type constants
export const LESSON_TYPE = {
  VIDEO: 'video',
  DOCUMENT: 'document',
} as const;

// Lesson type options for UI
export const LESSON_TYPE_OPTIONS = [
  { value: LESSON_TYPE.VIDEO, label: 'Video' },
  { value: LESSON_TYPE.DOCUMENT, label: 'Bài đọc' },
];

// Lesson type type
export type LessonType = (typeof LESSON_TYPE)[keyof typeof LESSON_TYPE];
