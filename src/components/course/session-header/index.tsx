'use client';

import IconGrid from '../../../../public/icon-svg/IconGrid';
import React, { useEffect, useRef, useState } from 'react';
import IconList from '../../../../public/icon-svg/IconList';
import { Loader2, Search } from 'lucide-react';
import { CategoryItem, Course } from '@/modules/courses/domain/types';

interface ISessionHeaderProps {
  setActiveTab: (id: string) => void;
  categories: CategoryItem[];
  dataCourse: Course[];
  activeTab: string;
  setSearch: (search: string) => void;
  setActiveLayout: (search: string) => void;
  search: string;
  activeLayout: string;
}

export default function SessionHeader({
  setActiveTab,
  categories,
  dataCourse,
  activeTab,
  setSearch,
  search,
  setActiveLayout,
  activeLayout,
}: ISessionHeaderProps) {
  const [searchInput, setSearchInput] = useState(search); // Local state for input
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [, setIsFilterOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState('Đánh giá cao nhất');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search effect
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Show loading if there's a difference between input and actual search
    if (searchInput !== search) {
      setIsSearchPending(true);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      setSearch(searchInput);
      setIsSearchPending(false);
    }, 500); // 500ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchInput, setSearch, search]);

  // Sync external search changes with local input
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setIsSearchPending(false);
  };

  const handleSortSelect = (sort: string) => {
    setSortOption(sort);
    setIsSortOpen(false);
  };

  return (
    <div className='vinyl-striped-bg px-4 pb-60 pt-32 text-[#EFE3CD] md:px-32'>
      <p className='mt-2 flex gap-4 text-[#C4B298]'>
        Trang chủ
        <span>{'>'}</span>
        <span className='text-[#E3C272]'>Nhạc vàng</span>
      </p>
      <div className='flex flex-col md:flex-row md:items-center  md:gap-8 mt-4'>
        <div className='text-2xl font-bold text-[#EFE3CD]'>Nhạc vàng</div>
        <div className='mt-2 w-max rounded-full border border-[#6B4A2A] bg-[#2A1C12] px-4 py-2 font-light text-[#E3C272] md:mt-0'>
          🎉 {dataCourse?.length} Chuyên đề
        </div>
      </div>
      <div className='mt-4 text-[#C4B298]'>
        Khám phá lịch sử, nghệ sĩ, tác phẩm và những bản phát hành vinyl tiêu
        biểu của nhạc vàng Việt Nam trong thế kỷ XX.
      </div>
      <div className='flex justify-between mt-4 flex-col md:flex-row'>
        <div className='flex gap-4 md:items-center flex-col md:flex-row'>
          <div className='flex w-max rounded-full bg-[#2A1C12] p-2'>
            <div
              className={`flex cursor-pointer items-center ${activeLayout === 'grid' && 'bg-[#EDE2D0]'} px-4 py-2 rounded-full gap-2`}
              onClick={() => setActiveLayout('grid')}
            >
              <IconGrid
                color={activeLayout === 'grid' ? '#212B36' : '#637381'}
              />
              <div
                className={
                  activeLayout === 'grid' ? 'text-[#302A26]' : 'text-[#C4B298]'
                }
              >
                Lưới
              </div>
            </div>
            <div
              className={`flex cursor-pointer items-center ${activeLayout === 'list' && 'bg-[#EDE2D0]'} px-4 py-2 rounded-full gap-2`}
              onClick={() => setActiveLayout('list')}
            >
              <IconList
                color={activeLayout === 'list' ? '#212B36' : '#637381'}
              />
              <div
                className={
                  activeLayout === 'list' ? 'text-[#302A26]' : 'text-[#C4B298]'
                }
              >
                Danh sách
              </div>
            </div>
          </div>
          <div className='text-[#C4B298]'>Hiển thị 1-9 của 12 kết quả</div>
        </div>
        <div className='flex gap-3 flex-col md:flex-row md:mt-0 mt-4'>
          <div className='relative w-full sm:max-w-[320px]'>
            <input
              type='text'
              placeholder='Tìm kiếm...'
              value={searchInput}
              onChange={handleSearchInputChange}
              className='w-full rounded-full border border-[#D8C8B3] bg-[#EDE2D0] py-2.5 pl-10 pr-10 text-[#302A26] placeholder:text-[#786B5F] focus:border-[#C9A24B] focus:outline-none focus:ring-1 focus:ring-[#C9A24B]'
            />
            <Search
              className='absolute left-3 top-6 transform -translate-y-1/2 text-[#786B5F]'
              size={18}
            />
            {/* Search pending indicator */}
            {isSearchPending && (
              <Loader2
                className='absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 animate-spin'
                size={16}
              />
            )}
            {/* Clear search button */}
            {searchInput && !isSearchPending && (
              <button
                onClick={handleClearSearch}
                className='absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path
                    d='M12 4L4 12M4 4l8 8'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            )}
          </div>
          <div className='relative w-1/2 sm:w-auto' ref={sortRef}>
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className='flex items-center justify-between gap-2  px-4 py-2.5 text-sm font-semibold text-[#EFE3CD] w-full whitespace-nowrap'
            >
              <span className='truncate'>Sắp xếp: {sortOption}</span>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
              >
                <path d='M8 10.6667L4 6.66675H12L8 10.6667Z' fill='#637381' />
              </svg>
            </button>
            {isSortOpen && (
              <div className='absolute top-full left-0 sm:left-auto sm:right-0 mt-1 bg-[#EDE2D0] shadow-lg rounded-lg py-2 w-full sm:w-52 z-20'>
                <div
                  className='px-3 py-2 text-[#212B36] hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleSortSelect('Đánh giá cao nhất')}
                >
                  Đánh giá cao nhất
                </div>
                <div
                  className='px-3 py-2 text-[#212B36] hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleSortSelect('Mới nhất')}
                >
                  Mới nhất
                </div>
                <div
                  className='px-3 py-2 text-[#212B36] hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleSortSelect('Phổ biến nhất')}
                >
                  Phổ biến nhất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-3 mt-5'>
        {categories.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer relative shadow flex flex-col items-center justify-center min-w-[120px] px-8 py-4 rounded-full transition-all ${
              activeTab === tab.id
                ? 'bg-[#C9A24B] text-[#160E08]'
                : 'bg-[#EDE2D0] text-[#302A26]'
            }`}
          >
            <span
              className={`text-sm font-medium ${activeTab === tab.id ? 'text-[#160E08]' : 'text-[#302A26]'}`}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
