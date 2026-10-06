import { bannerAuth } from '@/constants/images';
import Image from 'next/image';
import React, { PropsWithChildren } from 'react';

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen w-full bg-white'>
      <div className='relative hidden min-h-screen flex-1 md:block'>
        <Image
          src={bannerAuth}
          alt='Vinyl Heritage Vietnam'
          fill
          priority
          className='object-cover'
          sizes='(min-width: 768px) 66vw, 0px'
        />
      </div>
      <div className='w-full shrink-0 md:w-[480px]'>{children}</div>
    </div>
  );
}

export default AuthLayout;
