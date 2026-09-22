'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import schema
import {
  courseFormSchema,
  type CourseFormData,
} from '@/modules/auth/domain/schema';

// Import components
import CourseDetailsSection from '@/components/admin/create-course/CourseDetailsSection';
import AdditionalInfoSection from '@/components/admin/create-course/AdditionalInfoSection';
import MediaIntroSection from '@/components/admin/create-course/MediaIntroSection';
import CourseBuilderSection from '@/components/admin/create-course/CourseBuilderSection';

// Import hooks
import { useCategoryHome } from '@/modules/courses/hooks/useCategory';
import { createProductAPI } from '@/modules/admin/infrastructure/productAdmin.api';

// Field label mapping
const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    title: 'Tiêu đề',
    slug: 'Liên kết cố định',
    category_id: 'Danh mục',
    short_description: 'Giới thiệu ngắn',
    thumbnail: 'Hình thu nhỏ',
    description: 'Mô tả Chuyên đề',
    requirements: 'Yêu cầu',
    learning_outcomes: 'Kết quả đạt được',
    videoUrl: 'Video giới thiệu',
    modules: 'Nội dung Chuyên đề',
    status: 'Trạng thái',
  };
  return labels[field] || field;
};

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const { getListCategory: categoriesData } = useCategoryHome();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: '',
      category_id: '',
      short_description: '',
      thumbnail: '',

      description: '',
      requirements: '',
      learning_outcomes: '',

      videoUrl: '',

      status: 'draft',
    },
  });

  const categoryOptions = React.useMemo(() => {
    if (categoriesData.data && Array.isArray(categoriesData.data)) {
      return categoriesData.data.map((category: any) => ({
        value: String(category.id),
        label: category.title,
      }));
    }
    return [];
  }, [categoriesData.data]);

  const saveCourse = async () => {
    setIsLoading(true);

    const isValid = await form.trigger();

    if (!isValid) {
      const errors = form.formState.errors;
      const errorMessages: string[] = [];

      // Collect all error messages
      Object.entries(errors).forEach(([field, error]) => {
        if (error?.message) {
          const fieldLabel = getFieldLabel(field);
          errorMessages.push(`${fieldLabel}: ${error.message}`);
        }
      });

      if (errorMessages.length > 0) {
        toast.error(
          <div className='space-y-1'>
            <p className='font-semibold'>Vui lòng kiểm tra các trường sau:</p>
            <ul className='list-decimal list-inside space-y-1'>
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        toast.error('Vui lòng kiểm tra và sửa các trường bị lỗi');
      }

      setIsLoading(false);
      return;
    }

    try {
      const formValues = form.getValues();
      const courseData = {
        title: formValues.title,
        short_description: formValues.short_description,
        description: formValues.description,
        category_id: formValues.category_id,
        slug: formValues.slug,
        thumbnail: formValues.thumbnail,
        requirements: formValues.requirements,
        learning_outcomes: formValues.learning_outcomes,
        preview_video: formValues.videoUrl,
        modules: formValues.modules || [],
        status: formValues.status,
      };

      await createProductAPI(courseData);

      toast.success('Chuyên đề đã được tạo thành công!');

      setTimeout(() => {
        router.push('/admin/topics');
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Có lỗi xảy ra khi lưu Chuyên đề'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Thêm Chuyên đề</h1>
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Chuyên đề</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Tạo Chuyên đề</span>
          </div>
        </div>
      </div>

      <div className='p-6'>
        <Form {...form}>
          <div className='max-w-4xl mx-auto space-y-6'>
            <CourseDetailsSection
              control={form.control}
              categoryOptions={categoryOptions}
              setValue={form.setValue}
            />

            <AdditionalInfoSection control={form.control} />

            <MediaIntroSection control={form.control} />

            <CourseBuilderSection control={form.control} />

            <div className='flex justify-end space-x-4 pt-6'>
              <Button
                variant='outline'
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                onClick={saveCourse}
                disabled={isLoading}
                className='bg-gray-900 hover:bg-gray-800'
              >
                {isLoading ? 'Đang tạo...' : 'Tạo Chuyên đề'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
