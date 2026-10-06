import React from 'react';
import IconUser from '../../../../public/icon-svg/IconUser';
import IconBook from '../../../../public/icon-svg/IconBook';
import { Star } from 'lucide-react';
import { Course } from '@/modules/courses/domain/types';

interface ICourseCardProps {
  data: Course;
  onClick?: () => void;
  gridNumber?: number;
}

function CourseCardList({ data, onClick, gridNumber }: ICourseCardProps) {
  const getBadgeColor = () => {
    switch (data.label) {
      case 'new':
        return 'bg-[#34D399]';
      case 'hot':
        return 'bg-[#F87171]';
      case 'featured':
        return 'bg-[#A78BFA]';
      case 'best_seller':
        return 'bg-[#FBBF24]';
      default:
        return 'bg-[#34D399]';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
              }`}
            color={star <= rating ? '#fbbf24' : '#e5e7eb'}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      role='presentation'
      className='p-2 cursor-pointer bg-white flex items-center rounded-2xl overflow-hidden shadow-md'
    >
      {/* Card Title with Image */}
      <div className='relative rounded-xl overflow-hidden'>
        {/* Course image */}
        <img
          src={
            data?.thumbnail ??
            'https://danviet.ex-cdn.com/files/f1/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg'
          }
          alt={data?.title}
          className={`object-cover w-full ${gridNumber === 3 ? 'h-64' : 'h-48'}`}
          style={{
            aspectRatio: '16/9',
            height: gridNumber === 3 ? '16rem' : '12rem',
            width: '100%',
          }}
        />

        {/* Badge */}
        {data?.label && (
          <div
            className={`absolute top-4 right-4 ${getBadgeColor()} text-white text-xs uppercase font-bold px-2 py-1 rounded`}
          >
            {data?.label}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className='p-4 bg-white'>
        <div className='flex items-center gap-2 mb-2'>
          {renderStars(data?.averageRating || 0)}{' '}
          <span>({data?.reviewCount} Đánh giá)</span>
        </div>
        <h4 className='font-semibold text-[#212B36] text-lg mb-2'>
          {data?.title}
        </h4>

        <div className='flex items-center gap-4 text-sm mb-3'>
          <div className='flex items-center text-gray-500'>
            <span className='mr-1'>
              <IconBook />
            </span>{' '}
            {data?.lessonCount} Chuyên đề
          </div>
          <div className='flex items-center text-gray-500'>
            <span className='mr-1'>
              <IconUser />
            </span>{' '}
            {data?.enrollmentCount} Người đọc
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCardList;
