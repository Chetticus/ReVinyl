'use client';

import React, { useState } from 'react';
import { ArrowDown2, ArrowUp2, TickCircle } from 'iconsax-react';
import he from 'he';

interface CourseOverviewProps {
  courseData: any;
}

export default function CourseOverview({ courseData }: CourseOverviewProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const learningOutcomes =
    courseData?.learning_outcomes
      ?.split(',')
      .map((item: string) => item.trim())
      .filter(Boolean) || [];

  return (
    <div className='space-y-6'>
      {/* Mô tả */}
      <section className='rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)]'>
        <h3 className='mb-4 text-xl font-bold text-[#212B36]'>Mô tả</h3>
        <div className={`space-y-4 ${!showFullDesc ? 'line-clamp-4' : ''}`}>
          {courseData?.description ? (
            <div
              className='prose prose-sm max-w-none text-[#637381] [&_p]:leading-6'
              dangerouslySetInnerHTML={{
                __html: he.decode(courseData.description),
              }}
            />
          ) : (
            <p className='text-[#637381]'>Chưa có mô tả cho chuyên đề này.</p>
          )}
        </div>
        {courseData?.description && courseData.description.length > 200 && (
          <button
            type='button'
            onClick={() => setShowFullDesc(prev => !prev)}
            className='mt-4 flex cursor-pointer items-center gap-2 font-semibold text-[#E4722C]'
          >
            {showFullDesc ? 'Ẩn bớt' : 'Hiển thị thêm'}
            {showFullDesc ? (
              <ArrowUp2 size={20} color='#E4722C' />
            ) : (
              <ArrowDown2 size={20} color='#E4722C' />
            )}
          </button>
        )}
      </section>

      {/* Phạm vi tư liệu */}
      <section className='rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)]'>
        <h3 className='mb-4 text-xl font-bold text-[#212B36]'>
          Phạm vi tư liệu
        </h3>
        {courseData?.requirements ? (
          <div
            className='prose prose-sm max-w-none text-[#637381] [&_li]:mb-2 [&_p]:leading-6 [&_ul]:list-disc [&_ul]:pl-5'
            dangerouslySetInnerHTML={{
              __html: he.decode(courseData.requirements),
            }}
          />
        ) : (
          <p className='text-[#637381]'>Chưa cập nhật phạm vi tư liệu.</p>
        )}
      </section>

      {/* Giá trị khám phá */}
      <section className='rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)]'>
        <h3 className='mb-4 text-xl font-bold text-[#212B36]'>
          Giá trị khám phá
        </h3>
        {learningOutcomes.length > 0 ? (
          <div className='grid gap-4 md:grid-cols-2'>
            {learningOutcomes.map((objective: string) => (
              <div key={objective} className='flex items-start gap-2'>
                <TickCircle
                  size={20}
                  color='#22C55E'
                  variant='Bold'
                  className='mt-0.5 shrink-0'
                />
                <p className='text-sm leading-6 text-[#637381]'>{objective}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-[#637381]'>Chưa cập nhật giá trị khám phá.</p>
        )}
      </section>
    </div>
  );
}
