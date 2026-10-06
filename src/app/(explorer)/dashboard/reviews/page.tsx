'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Star } from 'lucide-react';
import { useUserCourse } from '@/modules/auth/hooks/useUser';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  status: boolean;
  created_at: string;
  product: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

function ReviewsPage() {
  const { getReviewByUser } = useUserCourse();

  console.log(getReviewByUser.data, '---getReviewByUser');

  const handleEdit = (reviewId: string) => {
    console.log('Edit review:', reviewId);
  };

  const handleDelete = (reviewId: string) => {
    console.log('Delete review:', reviewId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
            color={star <= rating ? '#fbbf24' : '#e5e7eb'}
          />
        ))}
      </div>
    );
  };

  // Map data từ BE sang format UI cũ
  const reviews =
    getReviewByUser.data?.map((review: Review) => ({
      id: review.id,
      courseName: review.product.title,
      rating: review.rating,
      reviewCount: review.rating,
      status:
        review.rating >= 4
          ? 'Excellent'
          : review.rating >= 3
            ? 'Good'
            : 'Average',
    })) || [];

  return (
    <div className='bg-white shadow h-max p-6 rounded-2xl'>
      <h2 className='text-2xl font-semibold mb-6'>Đánh giá</h2>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-4 px-2 text-gray-600 font-medium'>
                Chuyên đề
              </th>
              <th className='text-left py-4 px-2 text-gray-600 font-medium'>
                Đánh giá
              </th>
              <th className='text-right py-4 px-2'></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review: any) => (
              <tr
                key={review.id}
                className='border-b border-dashed border-gray-100'
              >
                <td className='py-6 px-2'>
                  <div className='text-gray-900 font-medium'>
                    {review.courseName}
                  </div>
                </td>
                <td className='py-6 px-2'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-3'>
                      {renderStars(review.rating)}
                      <span className='text-sm text-gray-500'>
                        ({review.reviewCount} Đánh giá)
                      </span>
                    </div>
                    <div className='text-gray-700'>{review.status}</div>
                  </div>
                </td>
                <td className='py-6 px-2'>
                  <div className='flex items-center justify-end'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(review.id)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    >
                      <Edit className='w-4 h-4' color='#155dfc' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(review.id)}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='w-4 h-4' color='red' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>Chưa có đánh giá nào.</p>
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
