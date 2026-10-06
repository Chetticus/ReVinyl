'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { ERouteTable } from '@/constants/route';
import { VINYL_ABOUT_COPY, VINYL_ABOUT_IMAGES } from '@/constants/vinyl-about';
import { SectionContainer } from '@/components/home/vinyl/shared';

export default function AboutWorkSection() {
  const { work } = VINYL_ABOUT_COPY;

  return (
    <section className='bg-[#FDF6F1] pb-16 md:pb-[120px]'>
      <SectionContainer className='max-w-[1200px]'>
        <div className='flex flex-col items-center gap-10 lg:flex-row lg:gap-16'>
          <div className='flex w-full flex-1 flex-col gap-8 lg:max-w-[568px]'>
            <div className='flex flex-col gap-2'>
              <p className='text-lg font-semibold leading-7 text-[#212B36]'>
                {work.label}
              </p>
              <h2 className='text-2xl font-bold leading-tight text-[#E4722C] md:text-[32px] md:leading-[48px]'>
                {work.title}
              </h2>
              <p className='text-base leading-6 text-[#637381]'>{work.description}</p>
            </div>

            <Link
              href={ERouteTable.HOME}
              className='inline-flex h-12 w-fit items-center justify-center gap-2 rounded-[10px] bg-[#E4722C] px-[22px] text-[15px] font-bold text-white transition-opacity hover:opacity-90'
            >
              {work.cta}
              <ArrowRight className='size-6' />
            </Link>
          </div>

          <div className='relative aspect-[568/426] w-full overflow-hidden rounded-2xl lg:max-w-[568px] lg:flex-1'>
            <Image
              src={VINYL_ABOUT_IMAGES.workVideo}
              alt='Không gian làm việc Vinyl Heritage'
              fill
              className='object-cover'
              sizes='(min-width: 1024px) 568px, 100vw'
            />
            <div className='absolute inset-0 bg-black/25' />
            <button
              type='button'
              aria-label='Phát video'
              className='absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#E4722C] shadow-lg transition-transform hover:scale-105 md:size-20'
            >
              <Play className='size-7 fill-current md:size-8' />
            </button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
