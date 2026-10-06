'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ABOUT_CARDS, VINYL_IMAGES } from '@/constants/vinyl-home';
import { cn } from '@/lib/utils';
import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
  VinylButton,
} from './shared';

const CARD_ROTATIONS = [-4, 3, -2, 4, -3] as const;

function PolaroidCard({
  image,
  lines,
  align,
  rotate,
  index,
}: {
  image: string;
  lines: readonly [string, string];
  align: 'start' | 'center' | 'end';
  rotate: number;
  index: number;
}) {
  return (
    <motion.div
      className={cn(
        'flex min-h-[280px] w-full items-center md:min-h-[350px]',
        align === 'end' && 'justify-end',
        align === 'center' && 'justify-center md:pl-[200px]',
        align === 'start' && 'justify-start md:pl-[60px]',
      )}
      initial={{ opacity: 0, y: 80, scale: 0.88, rotate: rotate - 6 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate }}
      viewport={{ once: false, amount: 0.55, margin: '0px 0px -60px 0px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className='relative size-[220px] overflow-hidden rounded-[30px] shadow-[0_24px_60px_rgba(24,10,5,0.18)] md:size-[250px]'>
        <Image src={image} alt={lines.join(' ')} fill className='object-cover' sizes='250px' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-[#180a05]' />
        <div className='absolute inset-x-5 bottom-7 text-center text-xl leading-7 text-white'>
          <p>{lines[0]}</p>
          <p>{lines[1]}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroAboutExperience() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.35], ['0%', '22%']);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.1]);
  const heroOverlay = useTransform(scrollYProgress, [0, 0.28, 0.42], [0.15, 0.45, 0.82]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -48]);
  const introDim = useTransform(scrollYProgress, [0.38, 0.62, 0.78], [1, 0.35, 0.08]);

  return (
    <section ref={sectionRef} className='relative'>
      {/* Sticky hero — pins while the about story scrolls over it */}
      <div className='sticky top-0 z-0 h-[100svh] overflow-hidden'>
        <motion.div className='absolute inset-0' style={{ y: heroImageY, scale: heroScale }}>
          <Image
            src={VINYL_IMAGES.hero}
            alt='Không gian đĩa nhạc vintage'
            fill
            priority
            className='object-cover'
            sizes='100vw'
          />
        </motion.div>

        <motion.div className='absolute inset-0 bg-[#190A05]' style={{ opacity: heroOverlay }} />

        <motion.div
          className='relative flex h-full flex-col justify-end pb-10 pt-28 md:justify-end md:pb-10 md:pt-36'
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <SectionContainer className='flex h-full flex-col justify-end md:flex-row md:items-end md:justify-between'>
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
        </motion.div>
      </div>

      {/* About scroll story */}
      <div className='relative z-10 bg-[#FDF6F1]'>
        <div className='sticky top-0 z-20 h-[100svh]'>
          <motion.div
            className='flex h-full items-center justify-center px-4'
            style={{ opacity: introDim }}
          >
            <div className='flex max-w-[800px] flex-col items-center gap-8 text-center'>
              <SectionLabel>VỀ CHÚNG TÔI</SectionLabel>
              <SectionTitle>
                Đĩa nhạc không chỉ lưu giữ âm thanh.
                <br />
                Chúng lưu giữ ký ức.
              </SectionTitle>
              <SectionDescription className='text-center'>
                Dự án bảo tồn, hệ thống hóa và lan tỏa những giá trị lịch sử, nghệ
                thuật
                <br className='hidden md:block' />
                và ký ức được lưu giữ trên các ấn phẩm âm nhạc Việt Nam.
              </SectionDescription>
              <VinylButton href='/topics'>Khám phá ngay!</VinylButton>
            </div>
          </motion.div>
        </div>

        {/* Cards scroll through the pinned intro */}
        <div className='relative z-30 -mt-[72svh] pb-16 md:-mt-[100svh] md:pb-24'>
          <SectionContainer className='space-y-4 md:space-y-[100px]'>
            {ABOUT_CARDS.map((card, index) => (
              <PolaroidCard
                key={card.lines.join('-')}
                {...card}
                index={index}
                rotate={CARD_ROTATIONS[index] ?? 0}
              />
            ))}
          </SectionContainer>
        </div>

        <div className='h-[60svh] md:h-[100svh]' aria-hidden />
      </div>
    </section>
  );
}
