import React from 'react';

interface CourseHeaderProps {
  courseData: any;
}

export default function CourseHeader({ courseData }: CourseHeaderProps) {
  const rating = Math.round(courseData?.averageRating || 0);
  const categoryLabel =
    courseData?.category?.title ||
    courseData?.category_title ||
    courseData?.label ||
    'Chuyên đề';

  return (
    <section className='relative mt-[72px] flex min-h-[320px] w-full items-center md:min-h-[400px]'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${courseData?.thumbnail || '/images/vinyl-home/hero.png'})`,
        }}
      />
      <div className='absolute inset-0 bg-black/50' />

      <div className='relative z-10 mx-auto w-full max-w-[1200px] px-4 py-12 md:px-6 md:py-16'>
        <div className='flex max-w-[746px] flex-col gap-4'>
          <span className='inline-flex w-max items-center rounded-full bg-[#E4722C] px-3 py-2 text-sm font-semibold text-white'>
            {categoryLabel}
          </span>

          <h1 className='text-[28px] font-bold leading-tight text-white md:text-[32px] md:leading-[48px]'>
            {courseData?.title}
          </h1>

          {courseData?.short_description ? (
            <p className='max-w-[500px] text-base leading-6 text-white'>
              {courseData.short_description}
            </p>
          ) : null}

          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-lg font-semibold text-[#FF9800]'>
              {(courseData?.averageRating || 0).toFixed(1)}
            </span>
            <div className='flex items-center'>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-xl leading-none ${star <= rating ? 'text-[#FF9800]' : 'text-white/35'
                    }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className='rounded-md bg-white/16 px-1.5 py-0.5 text-xs font-bold text-white/80'>
              {(courseData?.reviewCount || 0).toLocaleString('vi-VN')} Đánh giá
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
