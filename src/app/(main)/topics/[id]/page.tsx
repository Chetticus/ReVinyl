'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import CourseContent from '@/components/course/course-content';
import CourseHeader from '@/components/course/course-detail/CourseHeader';
import CourseSidebar from '@/components/course/course-detail/CourseSidebar';
import CourseOverview from '@/components/course/course-detail/CourseOverview';
import CourseReviews from '@/components/course/course-detail/CourseReviews';
import RelatedCourses from '@/components/course/course-detail/RelatedCourses';
import {
  useCourseDetail,
  useListCourse,
} from '@/modules/courses/hooks/useCourse';
import { useUserCourse } from '@/modules/auth/hooks/useUser';
import { useSubmitReview } from '@/modules/courses/hooks/useReview';
import { useAuthStore } from '@/stores/useAuthStore';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.id;

  const { registerLessonMutation } = useUserCourse();
  const { submitReviewMutation } = useSubmitReview();
  const { isAuthenticated } = useAuthStore();
  const { getCourseDetail } = useCourseDetail(slug as string);
  const { getListCourse } = useListCourse({
    category_id: '',
    search: '',
    page: 1,
    perPage: 10,
  });

  const [openReview, setOpenReview] = useState(false);

  const courseData = getCourseDetail?.data;
  const courseId = courseData?.id;
  const { mutate: registerLesson } = registerLessonMutation;

  const handleCheckoutCourse = () => {
    if (courseId) {
      registerLesson(courseId);
    }
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (slug && courseId) {
      submitReviewMutation.mutate(
        {
          productId: courseId,
          data: { rating, comment },
        },
        {
          onSuccess: () => {
            getCourseDetail.refetch();
            setOpenReview(false);
          },
          onError: error => console.error('Error submitting review:', error),
        }
      );
    }
  };

  const handlePreviewVideo = () => {
    if (courseData?.preview_video) {
      window.open(courseData.preview_video, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className='vinyl-striped-bg min-h-screen'>
      <CourseHeader courseData={courseData} />

      <div className='mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-16'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_374px] lg:items-start'>
          <div className='space-y-6'>
            <CourseOverview courseData={courseData} />

            <section className='rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)]'>
              <h3 className='mb-6 text-xl font-bold text-[#212B36]'>
                Nội dung
              </h3>
              <CourseContent
                modules={courseData?.modules || []}
                courseId={courseId || ''}
                courseData={courseData}
              />
            </section>

            <section className='overflow-hidden rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] shadow-[0_12px_24px_rgba(0,0,0,0.12)]'>
              <div className='space-y-2 px-6 pt-6'>
                <h3 className='text-xl font-bold text-[#212B36]'>
                  Giới thiệu chuyên đề{' '}
                  {courseData?.title ? courseData.title : ''}
                </h3>
                <p className='text-sm leading-[22px] text-[#637381]'>
                  Video giới thiệu mục tiêu, phạm vi tư liệu và hành trình khám
                  phá của chuyên đề.
                </p>
              </div>
              <button
                type='button'
                onClick={handlePreviewVideo}
                className='relative m-6 block w-[calc(100%-3rem)] cursor-pointer overflow-hidden rounded-xl'
              >
                <div className='relative aspect-video w-full bg-[#E8E0D8]'>
                  <img
                    src={courseData?.thumbnail || '/images/vinyl-home/hero.png'}
                    alt={`Giới thiệu ${courseData?.title || 'chuyên đề'}`}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 bg-black/25' />
                  <span className='absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md'>
                    <Play size={24} className='fill-[#E4722C] text-[#E4722C]' />
                  </span>
                </div>
              </button>
            </section>

            <CourseReviews
              courseData={courseData}
              openReview={openReview}
              onOpenReviewChange={setOpenReview}
              onReviewSubmit={handleReviewSubmit}
              isLoading={submitReviewMutation.isPending}
              error={submitReviewMutation.error?.message}
            />
          </div>

          <CourseSidebar
            courseData={courseData}
            onCheckout={handleCheckoutCourse}
          />
        </div>
      </div>

      <RelatedCourses
        relatedCourses={getListCourse?.data?.data || []}
        currentCourseId={courseId || (slug as string)}
      />
    </div>
  );
}
