'use client';

import React from 'react';
import { Eye, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CourseSidebarProps {
  courseData: any;
  onCheckout: () => void;
}

export default function CourseSidebar({
  courseData,
  onCheckout,
}: CourseSidebarProps) {
  const router = useRouter();

  const handleLessonClick = () => {
    if (courseData?.modules?.[0]?.lessons?.length === 0) {
      toast.error('Hiện chưa có Chuyên đề nào!');
      return;
    }
    router.push(
      `/topics/${courseData?.id}/lessons/${courseData?.modules?.[0]?.lessons?.[0]?.id}`
    );
  };

  const handlePreview = () => {
    if (courseData?.preview_video) {
      window.open(courseData.preview_video, '_blank', 'noopener,noreferrer');
      return;
    }
    if (courseData?.isEnrolled) {
      handleLessonClick();
      return;
    }
    toast.info('Video xem trước chưa có sẵn cho chuyên đề này.');
  };

  const handlePrimaryAction = () => {
    if (courseData?.isEnrolled) {
      handleLessonClick();
      return;
    }
    onCheckout();
  };

  return (
    <aside className='lg:sticky lg:top-28'>
      <div className='overflow-hidden rounded-2xl bg-white shadow-[0_0_1px_rgba(145,158,171,0.2),0_12px_24px_rgba(145,158,171,0.12)]'>
        <button
          type='button'
          onClick={handlePreview}
          className='relative block w-full cursor-pointer p-5 text-left'
        >
          <div className='relative aspect-[16/10] w-full overflow-hidden rounded-xl'>
            <img
              src={courseData?.thumbnail || '/images/vinyl-home/hero.png'}
              alt={courseData?.title || 'Preview'}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/75' />
            <span className='absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md'>
              <Play size={24} className='fill-[#E4722C] text-[#E4722C]' />
            </span>
            <span className='absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-white'>
              <Eye size={20} />
              Xem trước chuyên đề
            </span>
          </div>
        </button>

        <div className='px-6 pb-6'>
          <button
            type='button'
            onClick={handlePrimaryAction}
            className='flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#E4722C] text-[15px] font-bold text-white transition hover:bg-[#C45E1F]'
          >
            {courseData?.isEnrolled ? 'Tiếp tục khám phá' : 'Khám phá ngay!'}
          </button>
        </div>
      </div>
    </aside>
  );
}
