import Image from 'next/image';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { SectionContainer } from './shared';

export default function HeroSection() {
  return (
    <section className='relative h-[min(900px,100svh)] w-full overflow-hidden'>
      <Image
        src={VINYL_IMAGES.hero}
        alt='Không gian đĩa nhạc vintage'
        fill
        priority
        className='object-cover'
        sizes='100vw'
      />
      <div className='absolute inset-0 bg-black/20' />

      <SectionContainer className='relative flex h-full flex-col justify-end pb-10 pt-28 md:flex-row md:items-end md:justify-between md:pb-10 md:pt-36'>
        <div className='flex max-w-xl flex-col justify-between gap-10 md:h-full md:gap-0'>
          <div className='space-y-3'>
            <p className='text-base font-semibold text-white'>
              / VINYL HERITAGE VIETNAM /
            </p>
            <h1 className='text-5xl font-semibold leading-[1.1] text-white md:text-[80px] md:leading-[88px]'>
              Mỗi Chiếc Đĩa
              <br />
              Lưu Giữ
            </h1>
          </div>
          <p className='max-w-[460px] text-lg leading-[30px] text-white md:text-xl'>
            Không gian số giới thiệu, lưu giữ và kể lại những câu chuyện xoay
            quanh đĩa nhạc, nghệ sĩ và đời sống âm nhạc Việt Nam.
          </p>
        </div>

        <p className='mt-6 text-right text-5xl font-semibold leading-[1.1] text-[#E4722C] md:mt-0 md:max-w-[500px] md:text-[80px] md:leading-[88px]'>
          Một Thời Đại.
        </p>
      </SectionContainer>
    </section>
  );
}
