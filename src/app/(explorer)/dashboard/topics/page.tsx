'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import EnrolledCourseCard from '@/components/course/enrolled-course-card';
import { PlayCircle, MoreHorizontal } from 'lucide-react';
import { useEnrolledCourses } from '@/modules/auth/hooks/useUser';
import { EnrolledCourse } from '@/modules/courses/domain/types';
import { ERouteTable } from '@/constants/route';
import { useRouter } from 'next/navigation';

type TabType = 'all' | 'in-progress' | 'completed';

function EnrolledCoursesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const router = useRouter();

  // Map tab to API parameter
  const getStatusParam = (tab: TabType) => {
    switch (tab) {
      case 'all':
        return 'all';
      case 'in-progress':
        return 'learning';
      case 'completed':
        return 'completed';
      default:
        return 'all';
    }
  };

  // Fetch enrolled courses from API with status parameter
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useEnrolledCourses({
    status: getStatusParam(activeTab),
  });

  // Fetch in-progress courses for continue learning section
  const { data: inProgressResponse } = useEnrolledCourses({
    status: 'learning',
  });

  // Transform API data to match UI requirements
  const enrolledCourses = useMemo(() => {
    if (!apiResponse?.courses) return [];

    return apiResponse.courses.map((course: EnrolledCourse) => ({
      id: course.id,
      imageUrl: course.product.thumbnail || '/images/banner-sign-in.png',
      category: course.product.short_description || 'Chuyên đề',
      courseName: course.product.title,
      instructor: 'Instructor', // This might need to be added to API response
      lessonCount: course.totalLessons,
      studentCount: 0, // This might need to be added to API response
      progress: course.completionPercentage,
      status:
        course.completionPercentage >= 100
          ? ('completed' as const)
          : ('in-progress' as const),
      product: course.product,
    }));
  }, [apiResponse]);

  // Find current course for continue learning section (first in-progress course)
  const currentCourse = useMemo(() => {
    const inProgressCourse = inProgressResponse?.courses?.[0];
    if (!inProgressCourse) return null;

    // Get first lesson from first module for current lesson info
    const firstModule = inProgressCourse.product.modules[0];
    const firstLesson = firstModule?.lessons[0];

    return {
      id: inProgressCourse.id,
      imageUrl:
        inProgressCourse.product.thumbnail || '/images/banner-sign-in.png',
      category: inProgressCourse.product.short_description || 'Chuyên đề',
      courseName: inProgressCourse.product.title,
      progress: inProgressCourse.completionPercentage,
      currentLesson: firstLesson?.title || 'Chuyên đề tiếp theo',
      lessonDuration: '15 phút', // This might need to be added to API response
    };
  }, [inProgressResponse]);

  // Since API already filters by status, we don't need client-side filtering
  const filteredCourses = enrolledCourses;

  console.log('Filterd Course:', filteredCourses);
  console.log('Current Course:', currentCourse);

  const handleContinue = (courseId: string) => {
    console.log('Continue course:', courseId);
    // Navigate to course page or lesson page
    router.push(`${ERouteTable.COURSE}/${courseId}`);
  };

  const handleEdit = (courseId: string) => {
    console.log('Edit course:', courseId);
    // Navigate to course editing page
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='bg-white shadow h-max p-6 rounded-2xl'>
        <h2 className='text-2xl font-semibold mb-6'>Chuyên đề đã đăng ký</h2>
        <div className='flex justify-center items-center py-12'>
          <div className='text-gray-500'>Đang tải...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='bg-white shadow h-max p-6 rounded-2xl'>
        <h2 className='text-2xl font-semibold mb-6'>Chuyên đề đã đăng ký</h2>
        <div className='text-center py-12'>
          <p className='text-red-500'>
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white shadow h-max p-6 rounded-2xl'>
      <h2 className='text-2xl font-semibold mb-6'>Chuyên đề đã đăng ký</h2>

      {/* Tabs */}
      <div className='border-b border-gray-200 mb-6'>
        <div className='flex space-x-8'>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'in-progress'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('in-progress')}
          >
            Đang khám phá
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('completed')}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {/* Continue Learning Section */}
      {activeTab !== 'completed' && currentCourse && (
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4'>Tiếp tục khám phá</h3>
          <Card className='bg-gray-50 border-gray-200'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-4'>
                {/* Course Image */}
                <div className='relative flex-shrink-0'>
                  <img
                    src={currentCourse.imageUrl}
                    alt={currentCourse.courseName}
                    className='w-20 h-20 rounded-lg object-cover bg-gray-200'
                  />
                </div>

                {/* Course Info */}
                <div className='flex-grow'>
                  <div className='text-[#E4722C] text-sm mb-1'>
                    {currentCourse.category}
                  </div>
                  <h4 className='font-semibold text-lg mb-2'>
                    {currentCourse.courseName}
                  </h4>

                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-gray-600'>
                      Hoàn thành: {currentCourse.progress}%
                    </span>
                  </div>
                  <Progress
                    value={currentCourse.progress}
                    className='h-2 mb-3'
                  />

                  <div className='flex items-center text-sm text-gray-600'>
                    <PlayCircle className='w-4 h-4 mr-1' />
                    <span>
                      {currentCourse.currentLesson} •{' '}
                      {currentCourse.lessonDuration}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2'>
                  <Button
                    variant='default'
                    size='sm'
                    className='bg-gray-800 hover:bg-gray-700 text-white cursor-pointer'
                    onClick={() => handleContinue(currentCourse.id)}
                  >
                    Tiếp tục
                  </Button>
                  <Button variant='ghost' size='sm'>
                    <MoreHorizontal className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredCourses.map(course => (
          <EnrolledCourseCard
            key={course.id}
            imageUrl={course.imageUrl}
            category={course.category}
            courseName={course.courseName}
            instructor={course.instructor}
            lessonCount={course.lessonCount}
            studentCount={course.studentCount}
            progress={course.progress}
            status={course.status}
            onContinue={() => handleContinue(course?.product?.id)}
            onEdit={() => handleEdit(course.id)}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>Không có Chuyên đề nào trong mục này.</p>
        </div>
      )}
    </div>
  );
}

export default EnrolledCoursesPage;
