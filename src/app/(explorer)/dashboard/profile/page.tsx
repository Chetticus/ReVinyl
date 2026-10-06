'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserCourse } from '@/modules/auth/hooks/useUser';
import { formatUTCToVietnamTime } from '@/hooks/formatTime';

function ProfilePage() {
  const { getUserMe } = useUserCourse();

  return (
    <Card className='bg-white border-0 rounded-xl shadow-sm'>
      <CardContent className='p-6'>
        <h2 className='text-2xl font-semibold mb-6'>Hồ sơ</h2>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6'>
            <div className='space-y-2'>
              <label className='block text-gray-500'>Ngày đăng ký</label>
              <div className='text-gray-800 font-medium'>
                {formatUTCToVietnamTime(getUserMe.data?.createdAt)}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-gray-500'>Họ và tên</label>
              <div className='text-gray-800 font-medium'>
                {getUserMe?.data?.fullName}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-gray-500'>Email</label>
              <div className='text-gray-800 font-medium'>
                {getUserMe?.data?.email}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-gray-500'>Kỹ năng/Nghề nghiệp</label>
              <div className='text-gray-800 font-medium'>Học sinh</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePage;
