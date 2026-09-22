'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { VINYL_ABOUT_IMAGES } from '@/constants/vinyl-about';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';

export default function AboutBanner() {
  const { dictionary: d } = usePublicI18n();
  const scrollToIntro = () => {
    document
      .getElementById('about-intro')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='relative flex min-h-[420px] items-center justify-center overflow-hidden py-20 md:min-h-[600px] md:py-[100px]'>
      <Image
        src={VINYL_ABOUT_IMAGES.banner}
        alt=''
        fill
        priority
        className='object-cover'
        sizes='100vw'
      />
      <div className='absolute inset-0 bg-black/50' />

      <div className='relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 px-6 text-center'>
        <div className='flex flex-col items-center gap-4'>
          <p className='text-base font-bold leading-[30px] text-[#E3C272] md:text-xl'>
            {d.about.bannerLabel}
          </p>
          <h1 className='max-w-[1152px] text-2xl font-bold leading-snug text-white md:text-[32px] md:leading-[48px]'>
            {d.about.bannerTitle}
          </h1>
        </div>

        <button
          type='button'
          onClick={scrollToIntro}
          className='inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#E4722C] px-[22px] text-[15px] font-bold text-white transition-opacity hover:opacity-90'
        >
          {d.about.bannerCta}
          <ArrowRight className='size-6' />
        </button>
      </div>
    </section>
  );
}
