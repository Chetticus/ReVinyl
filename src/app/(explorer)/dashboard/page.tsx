'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import IconBookDashBoard from '../../../../public/icon-svg/dashboard/IconBookDashBoard';
import IconBookOrange from '../../../../public/icon-svg/dashboard/IconBookOrange';
import IconBookGreen from '../../../../public/icon-svg/dashboard/IconBookGreen';
import { useUserCourse } from '@/modules/auth/hooks/useUser';

function DashboardPage() {
  const { getStatistics } = useUserCourse();

  return (
    <>
      <div className='bg-white shadow h-max rounded-2xl'>
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold mb-6'>Tổng quan</h2>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-4 pt-6'>
          {/* Card 1 */}
          <Card className='bg-[#919EAB14] border-0'>
            <CardContent className='flex flex-col items-center pt-6'>
              <div className='w-24 h-24 flex items-center justify-center bg-[#E4722C14] rounded-xl mb-4'>
                <IconBookDashBoard />
              </div>
              <h3 className='text-5xl font-bold text-[#E4722C]'>
                {getStatistics?.data?.totalEnrolledLessons}
              </h3>
              <p className='mt-2 text-sm text-center'>Chuyên đề đã đăng ký</p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className='bg-[#919EAB14] border-0'>
            <CardContent className='flex flex-col items-center pt-6'>
              <div className='w-24 h-24 flex items-center justify-center bg-[#F4433629] rounded-xl mb-4'>
                <IconBookOrange />
              </div>
              <h3 className='text-5xl font-bold text-[#F44336]'>
                {getStatistics?.data?.inProgressLessons}
              </h3>
              <p className='mt-2 text-sm text-center'>Chuyên đề Đang khám phá</p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className='bg-[#919EAB14] border-0'>
            <CardContent className='flex flex-col items-center pt-6'>
              <div className='w-24 h-24 flex items-center justify-center bg-green-100 rounded-xl mb-4'>
                <IconBookGreen />
              </div>
              <h3 className='text-5xl font-bold text-green-500'>
                {getStatistics?.data?.completedLessons}
              </h3>
              <p className='mt-2 text-sm text-center'>Chuyên đề Hoàn thành</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
