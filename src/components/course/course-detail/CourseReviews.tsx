'use client';

import React, { useState } from 'react';
import { ArrowDown2, ArrowUp2, Edit2 } from 'iconsax-react';
import { Button } from '@/components/ui/button';
import { ReviewDialog } from '../ReviewDialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

interface CourseReviewsProps {
  courseData: any;
  openReview: boolean;
  onOpenReviewChange: (open: boolean) => void;
  onReviewSubmit: (rating: number, comment: string) => void;
  isLoading: boolean;
  error?: string;
}

export default function CourseReviews({
  courseData,
  openReview,
  onOpenReviewChange,
  onReviewSubmit,
  isLoading,
  error,
}: CourseReviewsProps) {
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const { user } = useAuthStore();

  const renderRatingBar = (stars: number, percentage: number) => (
    <div className='flex items-center gap-2'>
      <div className='flex min-w-[90px] text-[#FF9800]'>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < stars ? 'text-[#FF9800]' : 'text-[#C4CDD5]'}
          >
            ★
          </span>
        ))}
      </div>
      <div className='h-2 flex-1 rounded-full bg-[#919EAB29]'>
        <div
          className='h-2 rounded-full bg-[#E4722C]'
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className='w-10 text-right text-sm text-[#637381]'>{percentage}%</div>
    </div>
  );

  const renderReview = (review: any) => (
    <div key={review.id} className='border-b border-dashed border-[#919EAB3D] pb-5 last:border-b-0 last:pb-0'>
      <div className='flex items-start gap-4'>
        <img
          src={review.user?.avatar || '/images/common/avatar-kid.png'}
          alt={review.user?.fullName || 'User'}
          className='size-14 shrink-0 rounded-full object-cover'
        />
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h4 className='font-semibold text-[#212B36]'>
              {review.user?.fullName || 'Anonymous'}
            </h4>
            {review.created_at ? (
              <span className='text-xs text-[#919EAB]'>
                {new Date(review.created_at).toLocaleDateString('vi-VN')}
              </span>
            ) : null}
          </div>
          <div className='mt-1 flex text-[#FF9800]'>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < review.rating ? 'text-[#FF9800]' : 'text-[#C4CDD5]'}
              >
                ★
              </span>
            ))}
          </div>
          <p className='mt-2 text-sm leading-6 text-[#637381]'>{review.comment}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className='rounded-2xl border border-[#919EAB29] bg-white p-6 shadow-[0_0_1px_rgba(145,158,171,0.2),0_12px_24px_rgba(145,158,171,0.08)]'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
          <h3 className='text-xl font-bold text-[#212B36]'>Đánh giá</h3>
          <Button
            type='button'
            onClick={() => {
              if (
                courseData?.reviews?.filter(
                  (it: any) => it?.user_id === user?.id
                )?.length > 0
              ) {
                toast.error('Bạn đã đánh giá chuyên đề này rồi');
              } else {
                onOpenReviewChange(true);
              }
            }}
            className='flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border-none bg-[#919EAB14] px-4 shadow-none hover:bg-[#919EAB29]'
            variant='outline'
          >
            <Edit2 size={18} color='#212B36' />
            <span className='text-sm font-semibold text-[#212B36]'>
              Viết đánh giá
            </span>
          </Button>
          <ReviewDialog
            open={openReview}
            onOpenChange={onOpenReviewChange}
            isLoading={isLoading}
            error={error}
            onSubmit={onReviewSubmit}
          />
        </div>

        <div className='flex flex-col gap-8 md:flex-row'>
          <div className='min-w-[180px] rounded-2xl bg-[#FFF8EE] p-6 text-center'>
            <div className='mb-2 text-5xl font-bold text-[#212B36] md:text-6xl'>
              {(courseData?.averageRating || 0).toFixed(1)}
            </div>
            <div className='text-sm text-[#637381]'>
              {(courseData?.reviewCount || 0).toLocaleString('vi-VN')}
              <br />
              lượt đánh giá
            </div>
          </div>

          <div className='flex-1 space-y-3'>
            {renderRatingBar(5, courseData?.ratingBreakdown?.[5] || 0)}
            {renderRatingBar(4, courseData?.ratingBreakdown?.[4] || 0)}
            {renderRatingBar(3, courseData?.ratingBreakdown?.[3] || 0)}
            {renderRatingBar(2, courseData?.ratingBreakdown?.[2] || 0)}
            {renderRatingBar(1, courseData?.ratingBreakdown?.[1] || 0)}
          </div>
        </div>
      </section>

      <section className='mt-6 rounded-2xl border border-[#919EAB29] bg-white p-6 shadow-[0_0_1px_rgba(145,158,171,0.2),0_12px_24px_rgba(145,158,171,0.08)]'>
        <h3 className='mb-6 text-xl font-bold text-[#212B36]'>Đánh giá</h3>
        {courseData?.reviews && courseData.reviews.length > 0 ? (
          <div className='space-y-5'>
            {courseData.reviews
              .slice(0, showMoreReviews ? undefined : 2)
              .map(renderReview)}
          </div>
        ) : (
          <div className='text-center text-[#919EAB]'>
            Hiện chưa có đánh giá nào!
          </div>
        )}

        {courseData?.reviews && courseData.reviews.length > 2 && (
          <button
            type='button'
            onClick={() => setShowMoreReviews(prev => !prev)}
            className='mt-6 flex cursor-pointer items-center gap-2 font-semibold text-[#E4722C]'
          >
            {showMoreReviews ? 'Ẩn bớt' : 'Hiển thị thêm'}
            {showMoreReviews ? (
              <ArrowUp2 size={20} color='#E4722C' />
            ) : (
              <ArrowDown2 size={20} color='#E4722C' />
            )}
          </button>
        )}
      </section>
    </>
  );
}
