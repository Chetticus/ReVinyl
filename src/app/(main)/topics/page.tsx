'use client';

import React, { useEffect, useState } from 'react';
import SessionHeader from '@/components/course/session-header';
import SessionContent from '@/components/course/session-content';
import { getListCategoriesAPI } from '@/modules/courses/infrastructure/categories.api';
import { useListCourse } from '@/modules/courses/hooks/useCourse';
import { CategoryItem } from '@/modules/courses/domain/types';

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('');

  // Tạo constant cho item "Tất cả" để tái sử dụng
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

  const [categories, setCategories] = useState<CategoryItem[]>([
    defaultCategory,
  ]);
  const [search, setSearch] = useState('');
  const [activeLayout, setActiveLayout] = useState<string>('grid');

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

  const { getListCourse } = useListCourse({
    category_id: activeTab,
    search: search,
    page: 1,
    perPage: 10,
  });

  return (
    <div className='bg-white'>
      <SessionHeader
        search={search}
        setSearch={setSearch}
        activeTab={activeTab}
        categories={categories}
        setActiveTab={setActiveTab}
        dataCourse={getListCourse?.data?.data || []}
        setActiveLayout={setActiveLayout}
        activeLayout={activeLayout}
      />
      <SessionContent
        activeLayout={activeLayout}
        data={getListCourse?.data?.data || []}
      />
    </div>
  );
};

export default CoursesPage;
