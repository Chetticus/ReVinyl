'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ERouteTable } from '@/constants/route';
import { VINYL_ABOUT_COPY, VINYL_ABOUT_IMAGES } from '@/constants/vinyl-about';
import { SectionContainer } from '@/components/home/vinyl/shared';

export default function AboutIntroSection() {
  const { intro } = VINYL_ABOUT_COPY;

  return (
    <section
      id='about-intro'
      className='bg-gradient-to-r from-white/15 via-[#FFE8D2]/15 to-[#CDDFFF]/15 py-16 md:py-[120px]'
    >
      <SectionContainer className='max-w-[1200px]'>
        <div className='flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16'>
          <div className='relative mx-auto hidden h-[640px] w-full max-w-[544px] shrink-0 overflow-visible lg:block lg:h-[803px]'>
            <div className='absolute left-[-12%] top-[-70px] h-[420px] w-[300px] overflow-hidden rounded-2xl xl:left-[-172px] xl:h-[490px] xl:w-[370px]'>
              <Image
                src={VINYL_ABOUT_IMAGES.collage[0]}
                alt='Đĩa vinyl trên mâm xoay'
                fill
                className='object-cover'
                sizes='370px'
              />
            </div>
            <div className='absolute right-0 top-0 h-[200px] w-[250px] overflow-hidden rounded-2xl xl:h-[249px] xl:w-[306px]'>
              <Image
                src={VINYL_ABOUT_IMAGES.collage[1]}
                alt='Góc nghe nhạc vintage'
                fill
                className='object-cover'
                sizes='306px'
              />
            </div>
            <div className='absolute bottom-0 left-[8%] h-[400px] w-[320px] overflow-hidden rounded-2xl xl:right-20 xl:left-auto xl:h-[490px] xl:w-[405px]'>
              <Image
                src={VINYL_ABOUT_IMAGES.collage[2]}
                alt='Không gian sống cùng vinyl'
                fill
                className='object-cover'
                sizes='405px'
              />
            </div>
          </div>

          <div className='grid grid-cols-3 gap-3 lg:hidden'>
            {VINYL_ABOUT_IMAGES.collage.map((src, index) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl ${
                  index === 2 ? 'col-span-3 aspect-[16/10]' : 'aspect-[3/4]'
                }`}
              >
                <Image
                  src={src}
                  alt=''
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 50vw, 0px'
                />
              </div>
            ))}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-8'>
            <div className='flex flex-col gap-2'>
              <p className='text-lg font-semibold leading-7 text-[#212B36]'>
                {intro.label}
              </p>
              <h2 className='text-2xl font-bold leading-tight text-[#E4722C] md:text-[32px] md:leading-[48px]'>
                {intro.title}
              </h2>
              <p className='text-base leading-6 text-[#637381]'>{intro.subtitle}</p>
            </div>

            <div className='space-y-4 text-base leading-6 text-[#212B36]'>
              {intro.paragraphs.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <Link
              href={ERouteTable.HOME}
              className='inline-flex h-12 w-fit items-center justify-center gap-2 rounded-[10px] bg-[#E4722C] px-[22px] text-[15px] font-bold text-white transition-opacity hover:opacity-90'
            >
              {intro.cta}
              <ArrowRight className='size-6' />
            </Link>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
