import React from 'react';
import { useRouter } from 'next/navigation';
import CourseCard from '../course-card';
import { ERouteTable } from '@/constants/route';

interface RelatedCoursesProps {
  relatedCourses: any[];
  currentCourseId: string;
}

export default function RelatedCourses({
  relatedCourses,
  currentCourseId,
}: RelatedCoursesProps) {
  const router = useRouter();
  const items =
    relatedCourses
      ?.filter(course => course.id !== currentCourseId)
      ?.slice(0, 4) || [];

  if (items.length === 0) return null;

  return (
    <section className='w-full border-t border-[#D8C8B3] bg-[#E5D7C1] px-4 py-14 md:px-10 md:py-20'>
      <div className='mx-auto max-w-[1200px]'>
        <h2 className='text-2xl font-bold text-[#212B36] md:text-3xl'>
          Các chuyên đề liên quan
        </h2>
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {items.map(course => (
            <CourseCard
              key={course.id}
              data={course}
              onClick={() => router.push(`${ERouteTable.COURSE}/${course.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
