'use client';

import CourseCard from '@/components/course/course-card';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import CourseCardList from '@/components/course/course-card-list';
import { Course } from '@/modules/courses/domain/types';

interface ISessionContentProps {
  data: Course[];
  activeLayout: string;
}

export default function SessionContent({
  data,
  activeLayout,
}: ISessionContentProps) {
  const router = useRouter();

  return (
    <div className='md:px-32 px-4 pb-60 -mt-[100px]'>
      {activeLayout === 'grid' ? (
        <div className='md:grid md:grid-cols-3 gap-10 flex flex-col'>
          {data.map(item => (
            <CourseCard
              key={item.id}
              data={item}
              onClick={() => router.push(`${ERouteTable.COURSE}/${item.id}`)}
              gridNumber={3}
            />
          ))}
        </div>
      ) : (
        <div className='gap-4 flex flex-col'>
          {data.map(item => (
            <CourseCardList
              key={item.id}
              data={item}
              onClick={() => router.push(`${ERouteTable.COURSE}/${item.id}`)}
              gridNumber={3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
