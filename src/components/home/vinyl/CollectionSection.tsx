'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, ArrowRight2, Book1, People } from 'iconsax-react';
import { useListCourse } from '@/modules/courses/hooks/useCourse';
import { getListCategoriesAPI } from '@/modules/courses/infrastructure/categories.api';
import { CategoryItem, Course } from '@/modules/courses/domain/types';
import { ERouteTable } from '@/constants/route';
import { cn } from '@/lib/utils';
import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
} from './shared';

const DEFAULT_CATEGORY: CategoryItem = {
  id: '',
  title: 'Tất cả',
  slug: '',
  short_description: '',
  status: 'published',
  created_at: '',
  updated_at: '',
  deleted_at: '',
};

const FALLBACK_THUMBNAIL =
  'https://danviet.ex-cdn.com/files/f1/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg';

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center'>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'text-sm',
              index < Math.floor(rating) ? 'text-[#E4722C]' : 'text-[#C4CDD5]',
            )}
          >
            ★
          </span>
        ))}
      </div>
      <span className='text-xs text-[#637381]'>({reviewCount} Đánh giá)</span>
    </div>
  );
}

function CollectionCard({
  item,
  className,
  onClick,
}: {
  item: Course;
  className?: string;
  onClick?: () => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={cn(
        'flex w-full max-w-[300px] cursor-pointer flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 text-left shadow-[0_0_1px_rgba(145,158,171,0.2),0_12px_12px_rgba(145,158,171,0.12)] transition-shadow hover:shadow-[0_0_1px_rgba(145,158,171,0.24),0_16px_20px_rgba(145,158,171,0.16)]',
        className,
      )}
    >
      <div className='p-2'>
        <div className='relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#E8E0D8]'>
          <Image
            src={item.thumbnail || FALLBACK_THUMBNAIL}
            alt={item.title}
            fill
            className='object-cover transition-transform duration-500 hover:scale-105'
            sizes='300px'
            unoptimized={!item.thumbnail?.startsWith('/')}
          />
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-5 px-6 pb-6 pt-1'>
        <div className='flex items-start justify-between gap-3'>
          <StarRating
            rating={item.averageRating || 0}
            reviewCount={item.reviewCount || 0}
          />

          <button
            type='button'
            aria-label='Lưu chuyên đề'
            className='cursor-pointer rounded-full p-2 text-[#637381] hover:bg-[#FDF6F1]'
            onClick={event => {
              event.stopPropagation();

              // TODO: logic lưu chuyên đề
            }}
          >
            <Archive size={20} color='currentColor' />
          </button>
        </div>

        <div className='space-y-2'>
          <h3 className='line-clamp-2 min-h-12 text-base font-semibold leading-6 text-[#212B36]'>
            {item.title}
          </h3>

          {item.short_description ? (
            <p className='line-clamp-1 text-xs text-[#637381]'>
              {item.short_description}
            </p>
          ) : null}

          <div className='flex flex-wrap items-center gap-3 text-xs text-[#637381]'>
            <span className='inline-flex items-center gap-1'>
              <Book1 size={14} color='currentColor' />
              {item.lessonCount || 0} Chuyên đề
            </span>

            <span className='inline-flex items-center gap-1'>
              <People size={14} color='currentColor' />
              {item.enrollmentCount || 0} Người đọc
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CollectionSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCategory = async () => {
      const response = await getListCategoriesAPI();
      if (response.data && response.data.length > 0) {
        const nextCategories = [DEFAULT_CATEGORY, ...response.data];
        setCategories(nextCategories);
        setActiveTab(nextCategories[0]?.id ?? '');
      }
    };
    getCategory();
  }, []);

  const { getListCourse } = useListCourse({
    category_id: activeTab,
    search: '',
    page: 1,
    perPage: 10,
  });

  const courses = getListCourse?.data?.data ?? [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const slideWidth = track.firstElementChild?.clientWidth ?? 1;
      const gap = 16;
      const index = Math.round(track.scrollLeft / (slideWidth + gap));
      setActiveSlide(Math.min(Math.max(index, 0), Math.max(courses.length - 1, 0)));
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [courses.length]);

  useEffect(() => {
    setActiveSlide(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [activeTab]);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setActiveSlide(index);
  };

  const openCourse = (id: string) => {
    router.push(`${ERouteTable.COURSE}/${id}`);
  };

  return (
    <section className='bg-[#FDF6F1] py-20 md:py-[140px]'>
      <SectionContainer className='flex flex-col gap-10'>
        <div className='flex flex-col gap-8'>
          <SectionLabel>BỘ SƯU TẬP SỐ</SectionLabel>

          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div className='max-w-3xl space-y-5'>
              <SectionTitle className='text-left'>
                Khám phá di sản trên từng mặt đĩa
              </SectionTitle>
              <SectionDescription className='max-w-md'>
                Tra cứu các bản thu, nghệ sĩ, hãng đĩa và ấn phẩm tiêu biểu qua
                nhiều thể loại và giai đoạn của âm nhạc Việt Nam.
              </SectionDescription>
            </div>

            <button
              type='button'
              onClick={() => router.push(ERouteTable.COURSE)}
              className='inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-[#212B36]'
            >
              Xem thêm
              <ArrowRight2 size={20} color='#212B36' />
            </button>
          </div>

          {categories.length > 0 && (
            <div className='flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              {categories.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id || 'all'}
                    type='button'
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative shrink-0 cursor-pointer rounded-full px-8 py-3 text-base font-semibold shadow-[0_0_1px_rgba(145,158,171,0.2),0_12px_12px_rgba(145,158,171,0.12)] transition-colors',
                      isActive
                        ? 'bg-[#E4722C] text-white'
                        : 'bg-white text-[#637381]',
                    )}
                  >
                    {tab.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {getListCourse.isLoading ? (
          <div className='py-10 text-center text-sm text-[#637381]'>
            Đang tải chuyên đề...
          </div>
        ) : courses.length === 0 ? (
          <div className='py-10 text-center text-sm text-[#637381]'>
            Chưa có chuyên đề trong danh mục này.
          </div>
        ) : (
          <>
            <div className='hidden gap-4 xl:grid xl:grid-cols-4'>
              {courses.map(item => (
                <CollectionCard
                  key={item.id}
                  item={item}
                  className='max-w-none'
                  onClick={() => openCourse(item.id)}
                />
              ))}
            </div>

            <div
              ref={trackRef}
              className='flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 xl:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
              {courses.map(item => (
                <div
                  key={item.id}
                  className='w-[min(300px,calc(100vw-3rem))] shrink-0 snap-start'
                >
                  <CollectionCard
                    item={item}
                    className='max-w-none'
                    onClick={() => openCourse(item.id)}
                  />
                </div>
              ))}
            </div>

            <div className='flex justify-center gap-2 xl:hidden'>
              {courses.map((item, index) => (
                <button
                  key={item.id}
                  type='button'
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => scrollToSlide(index)}
                  className={cn(
                    'h-2 cursor-pointer rounded-full transition-all duration-300',
                    index === activeSlide
                      ? 'w-6 bg-[#E4722C]'
                      : 'w-2 bg-[#DFE3E8] hover:bg-[#C4CDD5]',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </SectionContainer>
    </section>
  );
}
