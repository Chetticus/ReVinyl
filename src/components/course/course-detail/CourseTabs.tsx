import React from 'react';

type TabType = 'overview' | 'content' | 'details' | 'instructor' | 'reviews';

interface TabConfig {
  id: TabType;
  label: string;
}

interface CourseTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_CONFIG: TabConfig[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'content', label: 'Nội dung' },
  { id: 'details', label: 'Chi tiết' },
  { id: 'reviews', label: 'Đánh giá' },
];

export default function CourseTabs({
  activeTab,
  onTabChange,
}: CourseTabsProps) {
  return (
    <div className='flex flex-wrap gap-2 mb-8 bg-white py-4'>
      {TAB_CONFIG.map(({ id, label }) => (
        <button
          key={id}
          className={`px-8 py-3 font-medium rounded-full ${
            activeTab === id
              ? 'bg-primary-main text-white'
              : 'bg-[#F4F6F8] text-gray-500 hover:bg-gray-200'
          }`}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
