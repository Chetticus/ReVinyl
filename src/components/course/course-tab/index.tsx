'use client';

import React, { useState } from 'react';
import CourseCard from '../course-card';
import { ArrowRight } from 'iconsax-react';
import { useListCourse } from '@/modules/courses/hooks/useCourse';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import CourseCardList from '@/components/course/course-card-list';
import { CategoryItem } from '@/modules/courses/domain/types';

interface ICourseTabProps {
  category?: CategoryItem[];
  type?: string;
}

export function CourseTab({ category, type = 'grid' }: ICourseTabProps) {
  const [activeTab, setActiveTab] = useState(category?.[0]?.id);
  const router = useRouter();

  const { getListCourse } = useListCourse({
    category_id: activeTab,
    search: '',
    page: 1,
    perPage: 10,
  });

  return (
    <div className='flex flex-col gap-4'>
      {/*tab render*/}
      <div className='flex flex-wrap justify-center gap-3 mt-5 mb-5'>
        {category &&
          category.length > 0 &&
          category.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer rounded-full relative flex flex-col items-center justify-center min-w-[120px] px-8 py-4 transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-main text-white'
                  : 'bg-white text-[#637381]'
              }`}
            >
              <span
                className={`text-sm font-medium ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}
              >
                {tab.title}
              </span>
            </button>
          ))}
      </div>
      {type === 'grid' ? (
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {getListCourse?.data?.data.map(item => (
            <CourseCard
              key={item.id}
              data={item}
              onClick={() => router.push(`${ERouteTable.COURSE}/${item.id}`)}
              gridNumber={3}
            />
          ))}
        </div>
      ) : (
        <div>
          {getListCourse?.data?.data.map(item => (
            <div key={item.id}>
              <CourseCardList
                data={item}
                onClick={() => router.push(`${ERouteTable.COURSE}/${item.id}`)}
                gridNumber={3}
              />
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => router.push(ERouteTable.COURSE)}
        role='presentation'
        className='flex mt-6 items-center gap-3 font-semibold text-[#212B36] bg-[#919EAB14] w-max m-auto px-4 py-2 rounded-full cursor-pointer'
      >
        Xem thêm
        <ArrowRight size='20' color='#212B36' />
      </div>
    </div>
  );
}
