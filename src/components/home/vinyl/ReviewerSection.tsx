'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { REVIEWERS, VINYL_IMAGES } from '@/constants/vinyl-home';
import { cn } from '@/lib/utils';
import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
} from './shared';

export default function ReviewerSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = REVIEWERS[activeIndex];

  return (
    <section className='bg-[#FDF6F1] py-24 md:pt-[140px]'>
      <SectionContainer className='flex flex-col items-center gap-12'>
        <div className='flex max-w-[800px] flex-col items-center gap-8 text-center'>
          <SectionLabel>NHỮNG KẾT NỐI TỪ ÂM NHẠC</SectionLabel>
          <SectionTitle>
            Di sản trở nên sống động
            <br />
            khi được cùng nhau sẻ chia
          </SectionTitle>
          <SectionDescription className='text-center'>
            Những chia sẻ ấy giúp di sản âm nhạc không chỉ được lưu giữ, mà còn
            tiếp tục hiện diện trong đời sống hôm nay.
          </SectionDescription>
        </div>

        <LayoutGroup>
          <div className='hidden w-full items-stretch gap-6 lg:flex'>
            {REVIEWERS.map((reviewer, index) => {
              const isActive = index === activeIndex;

              if (isActive) {
                return (
                  <motion.article
                    key={reviewer.name}
                    layout
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    className='flex min-h-[500px] flex-[2] gap-6 overflow-hidden rounded-[30px] bg-[#FAE7DB] p-5'
                  >
                    <motion.div
                      layout
                      className='relative min-h-[420px] flex-1 overflow-hidden rounded-[20px]'
                    >
                      <Image
                        src={reviewer.image}
                        alt={reviewer.name}
                        fill
                        className='object-cover'
                        sizes='340px'
                      />
                    </motion.div>
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                      className='flex flex-1 flex-col justify-between py-2'
                    >
                      <div className='space-y-3'>
                        <Image src={VINYL_IMAGES.quote} alt='' width={29} height={22} />
                        <p className='text-base leading-6 text-[#212B36]'>{reviewer.quote}</p>
                      </div>
                      <div>
                        <p className='text-2xl leading-8 text-[#212B36]'>{reviewer.name}</p>
                        <p className='text-base text-[#637381]'>{reviewer.role}</p>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              }

              return (
                <motion.button
                  key={reviewer.name}
                  type='button'
                  layout
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className='relative min-h-[500px] w-[230px] shrink-0 cursor-pointer overflow-hidden rounded-[30px] bg-[#FAE7DB]'
                >
                  <Image
                    src={reviewer.image}
                    alt={reviewer.name}
                    fill
                    className='object-cover'
                    sizes='230px'
                  />
                  <div className='absolute inset-0 bg-[#190A05]/30 transition-opacity hover:bg-[#190A05]/20' />
                  <p className='absolute inset-x-5 bottom-5 text-center text-xl text-white'>
                    {reviewer.name}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className='w-full space-y-6 lg:hidden'>
          <AnimatePresence mode='wait'>
            <motion.article
              key={active.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className='overflow-hidden rounded-[30px] bg-[#FAE7DB] p-5'
            >
              <div className='relative mb-5 h-[280px] overflow-hidden rounded-[20px]'>
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  className='object-cover'
                  sizes='100vw'
                />
              </div>
              <div className='space-y-4'>
                <Image src={VINYL_IMAGES.quote} alt='' width={29} height={22} />
                <p className='text-base leading-6 text-[#212B36]'>{active.quote}</p>
                <div>
                  <p className='text-2xl text-[#212B36]'>{active.name}</p>
                  <p className='text-[#637381]'>{active.role}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className='flex justify-center gap-3'>
            {REVIEWERS.map((reviewer, index) => (
              <button
                key={reviewer.name}
                type='button'
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'size-3 cursor-pointer rounded-full transition-colors',
                  index === activeIndex ? 'bg-[#E4722C]' : 'bg-[#DFE3E8]',
                )}
                aria-label={reviewer.name}
              />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
