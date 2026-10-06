'use client';

import { CourseTab } from '@/components/course/course-tab';
import React, { useEffect, useState } from 'react';
import { getListCategoriesAPI } from '@/modules/courses/infrastructure/categories.api';
import { CategoryItem } from '@/modules/courses/domain/types';
import { ERouteTable } from '@/constants/route';

export default function SessionCourse() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const defaultCategory: CategoryItem = {
    id: '',
    title: 'Tất cả',
    slug: '',
    short_description: '',
    status: 'published',
    created_at: '',
    updated_at: '',
    deleted_at: '',
  };

  useEffect(() => {
    const getCategory = async () => {
      const response = await getListCategoriesAPI(); // Replace with actual API call
      if (response.data && response.data.length > 0) {
        // Giữ lại item "Tất cả" ban đầu và thêm dữ liệu từ API
        setCategories([defaultCategory, ...response.data]);
      }
    };
    getCategory();
  }, []);

  return (
    <div className='bg-white w-full px-4 md:px-20 md:py-20 py-14'>
      <div className='flex flex-col gap-4 justify-center items-center max-w-[1200px] mx-auto'>
        <div
          className='text-primary-main mb-4 w-max flex items-center font-semibold bg-[#2F57EF14] rounded-full h-12 px-4'
        >
          Chuyên đề
        </div>
        <div className='text-4xl font-extrabold'>
          Các Chuyên đề nổi bật
        </div>
        <div className='text-[#212B36] mt-1'>
          Học nhanh - Hiểu sâu - Ứng dụng ngay.
        </div>
        {categories && categories.length > 0 && (
          <CourseTab category={categories} />
        )}
      </div>
    </div>
  );
}
