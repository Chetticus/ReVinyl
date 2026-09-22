'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft2 } from 'iconsax-react';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { ERouteTable } from '@/constants/route';

export const authInputClass =
  'h-[54px] rounded-[10px] border border-[rgba(145,158,171,0.32)] px-[14px] text-base text-[#212B36] placeholder:text-[#919EAB] shadow-none focus-visible:border-[#E4722C] focus-visible:ring-0';

export const authPrimaryButtonClass =
  'h-12 w-full cursor-pointer rounded-[10px] bg-[#E4722C] text-[15px] font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#919EAB] disabled:opacity-70';

export const authGoogleButtonClass =
  'h-12 w-full cursor-pointer rounded-[10px] bg-[rgba(145,158,171,0.08)] text-[15px] font-normal text-[#212B36] hover:bg-[rgba(145,158,171,0.14)] disabled:cursor-not-allowed disabled:opacity-70';

type AuthHeaderProps = {
  title: string;
  description?: React.ReactNode;
  linkRow?: React.ReactNode;
};

export function AuthHeader({ title, description, linkRow }: AuthHeaderProps) {
  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <div className='flex justify-center pb-4'>
        <Image
          src={VINYL_IMAGES.logoPrimary}
          alt='Vinyl Heritage Vietnam'
          width={240}
          height={40}
          className='h-10 w-[240px] object-contain'
          priority
        />
      </div>
      <h1 className='text-[32px] font-bold leading-[48px] text-[#212B36]'>
        {title}
      </h1>
      {description && (
        <p className='px-2.5 text-sm leading-[22px] text-[#212B36]'>{description}</p>
      )}
      {linkRow}
    </div>
  );
}

export function AuthLinkRow({
  text,
  linkText,
  onLinkClick,
}: {
  text: string;
  linkText: string;
  onLinkClick: () => void;
}) {
  return (
    <div className='flex items-center justify-center gap-1 text-sm'>
      <span className='text-[#212B36]'>{text}</span>
      <button
        type='button'
        onClick={onLinkClick}
        className='cursor-pointer font-semibold text-[#E4722C] hover:underline'
      >
        {linkText}
      </button>
    </div>
  );
}

export function AuthDivider() {
  return (
    <p className='text-center text-xs leading-[18px] text-[#637381]'>Hoặc</p>
  );
}

export function AuthBackLink() {
  return (
    <Link
      href={ERouteTable.LOGIN}
      className='inline-flex items-center gap-1 text-sm font-semibold text-[#212B36] hover:text-[#E4722C]'
    >
      <ArrowLeft2 size={16} color='currentColor' />
      Quay lại đăng nhập
    </Link>
  );
}

export function AuthPageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-white px-6 py-8 md:px-16'>
      <div className='flex w-full max-w-[420px] flex-col gap-10'>{children}</div>
    </div>
  );
}
