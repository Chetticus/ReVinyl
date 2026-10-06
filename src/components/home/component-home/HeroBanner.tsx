'use client';

import React from 'react';
import '../index.css';
import Image from 'next/image';
import { BannerRight } from '@/constants/images';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import { Star1 } from 'iconsax-react';

const HeroBanner = () => {
  const router = useRouter();

  return (
    <div className='bg-white h-max pt-[60px] md:pt-[140px]'>
      <div className='w-full mx-auto px-4 md:px-8 max-w-[1200px]'>
        <div className='flex justify-between flex-col items-center gap-20 md:flex-row'>
          <div className='max-w-[600px]'>
            <div className='font-extrabold text-[36px] lg:text-[72px]'>
              Nâng tầm tương lai tài chính của bạn với Vinyl Heritage
            </div>
            <div className='text-lg text-[#212B36]'>
              Biến ước mơ của bạn thành sự thật! Hãy học cách sử dụng tiền thông
              minh để mua bất cứ thứ gì bạn muốn.
            </div>
            <div
              onClick={() => router.push(ERouteTable.COURSE)}
              role='presentation'
              className='text-white cursor-pointer mt-10 w-max flex items-center font-semibold bg-primary-main rounded-full h-12 px-4'
            >
              Khám phá Chuyên đề
            </div>
            <div className='flex gap-2 items-center mt-10'>
              <div className='h-10 w-10 rounded-full bg-[#2F57EF14] flex items-center justify-center'>
                <Star1 size='24' color='#2F57EF' variant='Bold' />
              </div>
              <div>
                  <span>
                    {' '}
                    <span className='font-semibold'>4.8/5</span> từ hơn{' '}
                    <span className='font-semibold'>2000+</span> bài đánh giá
                  </span>
              </div>
            </div>
          </div>
          <Image
            src={BannerRight}
            alt='logo app'
            width={480}
            className='max-w-[480x] max-h-max'
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
