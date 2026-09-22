'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PopularCoursesCardProps {
  title: string;
  courses: any;
  viewAllText?: string;
}

const PopularCoursesCard = React.forwardRef<
  HTMLDivElement,
  PopularCoursesCardProps
>(({ title, courses, viewAllText = 'Tất cả thử thách' }, ref) => {
  const router = useRouter();

  return (
    <Card ref={ref} className='bg-white border-gray-200 shadow-sm'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg font-semibold text-gray-900'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {courses.map((course: any) => (
          <div
            key={course.id}
            className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50'
          >
            <div className='relative w-16 h-12 bg-purple-500 rounded-lg flex items-center justify-center overflow-hidden'>
              <Crown className='w-6 h-6 text-white' />
              <div className='absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-80'></div>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {course.title}
              </p>
              <p className='text-xs text-gray-500 truncate'>
                {course.description}
              </p>
            </div>
          </div>
        ))}
        <div className='pt-2'>
          <Button
            variant='outline'
            className='w-full'
            size='sm'
            onClick={() => router.push('/admin/discovery-activities')}
          >
            {viewAllText}
            <ExternalLink className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
PopularCoursesCard.displayName = 'PopularCoursesCard';

export { PopularCoursesCard };
