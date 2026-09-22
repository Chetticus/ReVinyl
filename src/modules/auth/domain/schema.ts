import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự')
    .refine(email => {
      // Kiểm tra định dạng email cơ bản
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'Email không đúng định dạng'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
    .refine(password => {
      // Kiểm tra mật khẩu có chứa ít nhất một chữ cái
      return /[a-zA-Z]/.test(password);
    }, 'Mật khẩu phải chứa ít nhất một chữ cái'),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Không được bỏ trống'),
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự')
    .refine(email => {
      // Kiểm tra định dạng email cơ bản
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'Email không đúng định dạng'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
    .refine(password => {
      // Kiểm tra mật khẩu có chứa ít nhất một chữ cái
      return /[a-zA-Z]/.test(password);
    }, 'Mật khẩu phải chứa ít nhất một chữ cái'),
});

export const verifySchema = z.object({
  userId: z
    .string()
    .min(1, 'userId không được để trống')
    .uuid('userId không hợp lệ'),
  otpCode: z
    .string()
    .min(1, 'Mã OTP không được để trống')
    .refine(code => /^\d{6}$/.test(code), 'Mã OTP phải gồm 6 chữ số'),
});

export const resendSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự')
    .refine(email => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'Email không đúng định dạng'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự')
    .refine(email => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'Email không đúng định dạng'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Mật khẩu không được để trống')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
      .refine(password => {
        // Kiểm tra mật khẩu có chứa ít nhất một chữ cái
        return /[a-zA-Z]/.test(password);
      }, 'Mật khẩu phải chứa ít nhất một chữ cái'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được để trống'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// Course Module Schema for CourseBuilderSection
export const courseModuleSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Tiêu đề chủ đề là bắt buộc'),
  short_description: z.string().optional().default(''),
  order: z.number().min(1, 'Thứ tự phải lớn hơn 0'),
  questions: z
    .array(
      z.object({
        id: z.number(),
        title: z.string().min(1, 'Tiêu đề Chuyên đề là bắt buộc'),
        type: z.enum(['lesson', 'quiz']),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        content: z.string().optional(),
        lessonType: z.enum(['video', 'document']).optional(),
        previewEnabled: z.boolean().optional(),
        questions: z
          .array(
            z.object({
              question: z.string(),
              answers: z.array(z.object({ value: z.string() })),
              correct_answer: z.string(),
              explanation: z.string().optional(),
            })
          )
          .optional()
          .default([]),
      })
    )
    .default([]),
});

// Course Form Schema
export const courseFormSchema = z.object({
  // CourseDetailsSection fields
  title: z
    .string()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(30, 'Tiêu đề tối đa 30 ký tự'),
  slug: z.string().optional().default(''),
  category_id: z.string().min(1, 'Danh mục là bắt buộc'),
  short_description: z
    .string()
    .min(1, 'Giới thiệu là bắt buộc')
    .min(10, 'Giới thiệu phải có ít nhất 10 ký tự'),
  thumbnail: z.any().refine(
    value => {
      // Accept File object or non-empty string (binary string)
      return (
        value instanceof File || (typeof value === 'string' && value.length > 0)
      );
    },
    {
      message: 'Hình thu nhỏ là bắt buộc',
    }
  ),

  // AdditionalInfoSection fields
  description: z
    .string()
    .min(1, 'Mô tả Chuyên đề là bắt buộc')
    .min(10, 'Mô tả Chuyên đề phải có ít nhất 10 ký tự'),
  requirements: z
    .string()
    .min(1, 'Yêu cầu là bắt buộc')
    .min(10, 'Yêu cầu phải có ít nhất 10 ký tự'),
  learning_outcomes: z
    .string()
    .min(1, 'Kết quả đạt được là bắt buộc')
    .min(10, 'Kết quả đạt được phải có ít nhất 10 ký tự'),

  // MediaIntroSection fields
  videoUrl: z
    .string()
    .optional()
    .refine(val => !val || val === '' || /^https?:\/\/.+/.test(val), {
      message: 'URL video phải là đường dẫn hợp lệ',
    }),

  // CourseBuilderSection fields
  modules: z.array(z.any()).default([]),

  // General fields
  status: z.enum(['draft', 'published', 'archived']),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;

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

// Quiz Form Schema
export const quizFormSchema = z.object({
  // QuizStep1
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề bài kiểm tra là bắt buộc')
    .max(100, 'Tiêu đề tối đa 100 ký tự'),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type QuizFormData = z.infer<typeof quizFormSchema>;

// Question Form Schema (for QuizStep2)
export const questionFormSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(1, 'Câu hỏi là bắt buộc')
      .max(500, 'Câu hỏi tối đa 500 ký tự'),
    answers: z
      .array(
        z.object({
          value: z.string().trim().min(1, 'Đáp án không được để trống'),
        })
      )
      .min(2, 'Phải có ít nhất 2 đáp án')
      .max(10, 'Tối đa 10 đáp án'),
    correct_answer: z.string().min(1, 'Phải chọn 1 đáp án đúng'),
    explanation: z.string().optional(),
  })
  .refine(
    data => {
      // Kiểm tra correct_answer phải nằm trong danh sách answers
      const answerValues = data.answers.map(opt => opt.value);
      return answerValues.includes(data.correct_answer);
    },
    {
      message: 'Đáp án đúng phải nằm trong danh sách đáp án',
      path: ['correct_answer'],
    }
  )
  .refine(
    data => {
      // Kiểm tra các đáp án không được giống nhau
      const answerValues = data.answers
        .map(opt => opt.value.trim().toLowerCase())
        .filter(val => val !== '');
      const uniqueAnswers = new Set(answerValues);
      return uniqueAnswers.size === answerValues.length;
    },
    {
      message: 'Các đáp án không được giống nhau',
      path: ['answers'],
    }
  );

export type QuestionFormData = z.infer<typeof questionFormSchema>;

// Lesson Form Schema (for CreateLessonModal)
export const lessonFormSchema = z
  .object({
    title: z.string().min(1, 'Tiêu đề là bắt buộc'),
    lessonType: z.enum(['video', 'document']).default('video'),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
    content: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
  })
  .superRefine((data, ctx) => {
    if (data.lessonType === 'video') {
      const url = data.videoUrl?.trim() ?? '';
      const isValid = /^https?:\/\/.+/.test(url);
      if (!url || !isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'URL video phải là đường dẫn hợp lệ',
          path: ['videoUrl'],
        });
      }
    }
  });

export type LessonFormData = z.infer<typeof lessonFormSchema>;
