'use client';

import React from 'react';
import Image from 'next/image';
import { BannerLeft } from '@/constants/images';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import { EmptyWallet, MoneySend, Star1 } from 'iconsax-react';

const SessionDescription = () => {
  const router = useRouter();

  return (
    <div className='bg-white h-max pt-[60px] md:pt-[140px]'>
      <div className='w-full mx-auto px-4 md:px-8 max-w-[1200px]'>
        <div className='flex justify-between flex-col items-center gap-20 md:flex-row'>
          <Image
            src={BannerLeft}
            alt='logo app'
            width={480}
            className='max-w-[480x] max-h-max'
          />
          <div className='max-w-[600px]'>
            <div
              role='presentation'
              className='text-primary-main mb-4 w-max flex items-center font-semibold bg-[#2F57EF14] rounded-full h-12 px-4'
            >
              Bạn sẽ học được gì?
            </div>
            <div className='font-extrabold text-[32px] lg:text-[48px]'>
              Khám Phá Những Bí Mật Về Tiền
            </div>
            <div className='text-lg text-[#212B36]'>
              Học cách làm chủ tiền tiêu vặt của bạn ngay hôm nay! Chúng tôi sẽ
              chỉ cho bạn những cách đơn giản và hiệu quả để tiết kiệm thông
              minh, chi tiêu hợp lý và thậm chí là kiếm thêm tiền để biến những
              ước mơ lớn của bạn thành hiện thực.
            </div>
            <div
              onClick={() => router.push(ERouteTable.COURSE)}
              role='button'
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  router.push(ERouteTable.COURSE);
                }
              }}
              className='mt-10 flex h-12 w-max cursor-pointer items-center rounded-full bg-primary-main px-4 font-semibold text-white'
            >
              Tham gia miễn phí
            </div>
            <div className='flex gap-6'>
              <div className='flex gap-2 items-center mt-10'>
                <div className='h-10 w-10 flex-shrink-0 rounded-full bg-[#2F57EF14] flex items-center justify-center'>
                  <EmptyWallet size='24' color='#2F57EF' variant='Outline' />
                </div>
                <div>Theo dõi và chi tiêu tiền một cách có kế hoạch.</div>
              </div>
              <div className='flex gap-2 items-center mt-10'>
                <div className='h-10 w-10 flex-shrink-0 rounded-full bg-[#2F57EF14] flex items-center justify-center'>
                  <MoneySend size='24' color='#2F57EF' variant='Outline' />
                </div>
                <div>Phân biệt giữa cần & muốn để mua sắm hợp lý.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDescription;
