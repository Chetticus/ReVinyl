import './index.css';
import { ArrowRight2 } from 'iconsax-react';

export default function BannerHeader() {
  return (
    <div className='bg-banner-challenges h-[240px] pt-[100px] flex flex-col items-center'>
      <div className='flex gap-3 items-center text-white'>
        Trang chủ <ArrowRight2 size='14' color='#ffffff' />{' '}
        <span>Thử thách</span>{' '}
      </div>
      <div className='font-bold my-3 text-lg text-white'>
        Thử Thách Vinyl Heritage
      </div>
      <div className='text-white text-sm'>
        Kiểm tra kiến thức, rinh ngay điểm cao!&#34; hoặc &#34;Học mà chơi, chơi
        mà giỏi!
      </div>
    </div>
  );
}
