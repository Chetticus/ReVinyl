'use client';

import { SmoothScrollLink } from './SmoothScroll';

const navigationItems = [
  { id: 'hero', label: 'Trang chủ' },
  { id: 'description', label: 'Giới thiệu' },
  { id: 'courses', label: 'Chuyên đề' },
  { id: 'challenges', label: 'Thử thách' },
  { id: 'feedback', label: 'Phản hồi' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'about', label: 'Về chúng tôi' },
];

export default function SectionNavigation() {
  return (
    <nav className='hidden md:flex space-x-6'>
      {navigationItems.map(item => (
        <SmoothScrollLink
          key={item.id}
          href={`#${item.id}`}
          className='text-gray-700 hover:text-primary-main transition-colors duration-300 font-medium'
        >
          {item.label}
        </SmoothScrollLink>
      ))}
    </nav>
  );
}

// Component cho mobile menu
export function MobileSectionNavigation() {
  return (
    <div className='flex flex-col space-y-4 py-4'>
      {navigationItems.map(item => (
        <SmoothScrollLink
          key={item.id}
          href={`#${item.id}`}
          className='text-gray-700 hover:text-primary-main transition-colors duration-300 font-medium py-2'
        >
          {item.label}
        </SmoothScrollLink>
      ))}
    </div>
  );
}
