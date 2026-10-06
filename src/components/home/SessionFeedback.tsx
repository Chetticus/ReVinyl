'use client';

import React from 'react';
import Image from 'next/image';
import { BannerCenter, BannerLeft } from '@/constants/images';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import { EmptyWallet, Game, MoneySend, PresentionChart, Star1, Video } from 'iconsax-react';

const SessionFeedback = () => {
  const router = useRouter();

  return (
    <div className='bg-white h-max pt-[60px] md:pt-[140px]'>
      <div className='w-full mx-auto px-4 md:px-8 max-w-[1200px]'>
        <div className='flex justify-between flex-col items-center gap-20 lg:flex-row'>
          <div className='max-w-[600px]'>
            <div className='text-primary-main mb-4 w-max flex items-center font-semibold bg-[#2F57EF14] rounded-full h-12 px-4'>
              Hoạt động
            </div>
            <div className='font-extrabold text-[32px] lg:text-[48px]'>
              Học Tài Chính Thật Vui!
            </div>
            <div className='text-lg text-[#212B36]'>
              Khám phá cách tiền bạc hoạt động qua những trò chơi và câu chuyện đầy màu sắc.
            </div>
            <div
              onClick={() => router.push(ERouteTable.COURSE)}
              role='presentation'
              className='text-white cursor-pointer mt-10 w-max flex items-center font-semibold bg-primary-main rounded-full h-12 px-4'
            >
              Khám phá ngay
            </div>
            <div className='flex flex-col mt-10 p-6 border rounded-xl border-[#919EAB3D]'>
              <div className='flex gap-2 items-center pb-6 border-b border-b-[#919EAB3D]'>
                <div className='h-10 w-10 flex-shrink-0 rounded-full bg-[#FF980014] flex items-center justify-center'>
                  <Game size='24' color='#FF9800' variant='Outline' />
                </div>
                <div>
                  <div className="text-[#FF9800] font-semibold">Học qua trò chơi</div>
                  <div>Các Chuyên đề được thiết kế như những trò chơi tương tác.</div>
                </div>
              </div>
              <div className='flex gap-2 mt-6 items-center pb-6 border-b border-b-[#919EAB3D]'>
                <div className='h-10 w-10 flex-shrink-0 rounded-full bg-[#03A9F414] flex items-center justify-center'>
                  <PresentionChart size='24' color='#03A9F4' variant='Outline' />
                </div>
                <div>
                  <div className="text-[#03A9F4] font-semibold">Thử thách thực tế</div>
                  <div>Áp dụng kiến thức vào các tình huống hàng ngày.</div>
                </div>
              </div>
              <div className='flex gap-2 mt-6 items-center'>
                <div className='h-10 w-10 flex-shrink-0 rounded-full bg-[#4CAF5014] flex items-center justify-center'>
                  <Video size='24' color='#4CAF50' variant='Outline' />
                </div>
                <div>
                  <div className="text-[#4CAF50] font-semibold">Học mọi lúc, mọi nơi</div>
                  <div>Truy cập Chuyên đề dễ dàng trên điện thoại, máy tính bảng.</div>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={BannerCenter}
            alt='logo app'
            className='max-w-[580px] w-[375px] md:w-[580px] max-h-max'
          />
        </div>
      </div>
    </div>
  );
};

export default SessionFeedback;
