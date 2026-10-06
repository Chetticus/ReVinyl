import IconWarning from '../../../public/icon-svg/IconWarning';
import IconStar from '../../../public/icon-svg/IconStar';
import React from 'react';
import he from 'he';

export interface ContentTabProps {
  courseTitle: string;
  currentLesson: any;
  courseData?: any; // Add courseData prop to receive the full course data
}

export default function ContentTab(props: ContentTabProps) {
  const { courseTitle, currentLesson, courseData } = props;
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Chưa cập nhật';
    }
  };

  // Get course statistics from API data
  const getCourseStats = () => {
    if (!courseData)
      return {
        rating: 0,
        reviewCount: 0,
        enrollmentCount: 0,
        lessonCount: 0,
        difficulty: 'Tất cả',
      };

    return {
      rating: courseData.averageRating || 0,
      reviewCount: courseData.reviewCount || 0,
      enrollmentCount: courseData.enrollmentCount || 0,
      lessonCount: courseData.lessonCount || 0,
      difficulty: 'Tất cả', // This could be mapped from courseData.difficulty if available
    };
  };

  const courseStats = getCourseStats();

  const renderContentTab = (value: string) => {
    switch (value) {
      case 'overview':
        return (
          <>
            <p className='text-secondary mb-3'>
              {courseData?.short_description || currentLesson?.description}
            </p>
            <div className='flex gap-2 items-center mb-3'>
              <IconWarning />
              <div className='text-secondary'>
                Cập nhật lần cuối: {formatDate(courseData?.updated_at)}
              </div>
            </div>
            <div className='flex gap-8 pb-6 border-b border-dashed border-b-gray-200 mb-4'>
              <div>
                <div className='font-semibold flex items-center gap-1 text-[#FF9800]'>
                  {courseStats.rating}
                  <IconStar />
                </div>
                <div className='text-secondary text-xs'>
                  {courseStats.reviewCount} Đánh giá
                </div>
              </div>
              <div>
                <div className='text-primary font-semibold'>
                  {courseStats.enrollmentCount.toLocaleString()}
                </div>
                <div className='text-secondary text-xs'>Học sinh</div>
              </div>
              <div>
                <div className='text-primary font-semibold'>
                  {courseStats.lessonCount}
                </div>
                <div className='text-secondary text-xs'>Bài giảng</div>
              </div>
            </div>
            <div className='text-primary font-semibold mb-4'>Mô tả</div>
            <div className='mb-4'>
              {courseData?.description && (
                <div
                  className='mb-4 text-secondary'
                  dangerouslySetInnerHTML={{
                    __html: he.decode(courseData?.description),
                  }}
                />
              )}
            </div>

            {/* Requirements section */}
            {courseData?.requirements && (
              <>
                <div className='text-primary font-semibold mb-4'>Yêu cầu</div>
                {courseData?.requirements && (
                  <div
                    className='mb-4 text-secondary'
                    dangerouslySetInnerHTML={{
                      __html: he.decode(courseData?.requirements),
                    }}
                  />
                )}
              </>
            )}

            {/* Learning outcomes section */}
            {courseData?.learning_outcomes && (
              <>
                <div className='text-primary font-semibold mb-4'>
                  Kết quả học tập
                </div>
                <p className='mb-4 text-secondary'>
                  {courseData.learning_outcomes}
                </p>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='p-4 md:p-6 bg-white border rounded-xl shadow m-4'>
      <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>
        Chuyên đề: {courseTitle}
      </h2>
      {renderContentTab('overview')}
    </div>
  );
}
