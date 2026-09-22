// src/app/not-found.tsx
'use client';

import { ErrorImg } from '@/constants/images';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-8'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>Oops!</h1>
      <p className='text-gray-600 mb-6'>
        Xin lỗi, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
      </p>
      <Image src={ErrorImg} alt='404 Error ' className='w-80 mb-6' />
      <Link
        href='/'
        className='bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors'
      >
        ← Về trang chủ
      </Link>
    </div>
  );
}
