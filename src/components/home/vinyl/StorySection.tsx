'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
  VinylButton,
} from './shared';

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const leftRotate = useTransform(scrollYProgress, [0.2, 0.55, 0.85], [-10, -6, -2]);
  const rightRotate = useTransform(scrollYProgress, [0.2, 0.55, 0.85], [8, 4, 2]);
  const leftX = useTransform(scrollYProgress, [0.2, 0.75], [-40, 0]);
  const rightX = useTransform(scrollYProgress, [0.2, 0.75], [40, 0]);
  const imagesScale = useTransform(scrollYProgress, [0.25, 0.6], [0.92, 1]);

  return (
    <section ref={sectionRef} className='bg-[#190A05] py-24 md:py-[140px]'>
      <SectionContainer className='flex max-w-[880px] flex-col items-center gap-12 text-center'>
        <motion.div
          className='flex flex-col items-center gap-8'
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionLabel>TƯ LIỆU VÀ CÂU CHUYỆN</SectionLabel>
          <SectionTitle dark>Không chỉ là âm nhạc</SectionTitle>
          <SectionDescription dark className='text-center'>
            Đi sâu vào bối cảnh ra đời, con người, kỹ thuật thu âm và những câu
            chuyện
            <br className='hidden md:block' />
            ít được biết đến phía sau mỗi ấn phẩm.
          </SectionDescription>
        </motion.div>

        <motion.div
          className='relative h-[320px] w-full max-w-[800px] md:h-[500px]'
          style={{ scale: imagesScale }}
        >
          <motion.div
            className='absolute left-0 top-0 md:left-0'
            style={{ rotate: leftRotate, x: leftX }}
          >
            <div className='relative h-[280px] w-[240px] overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:h-[460px] md:w-[390px]'>
              <Image
                src={VINYL_IMAGES.story[0]}
                alt='Turntable vintage'
                fill
                className='object-cover'
                sizes='390px'
              />
            </div>
          </motion.div>

          <motion.div
            className='absolute right-0 top-4 md:right-0 md:top-[15px]'
            style={{ rotate: rightRotate, x: rightX }}
          >
            <div className='relative h-[280px] w-[240px] overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:h-[460px] md:w-[390px]'>
              <Image
                src={VINYL_IMAGES.story[1]}
                alt='Nghệ sĩ và di sản'
                fill
                className='object-cover'
                sizes='390px'
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          className='max-w-[620px] text-base leading-6 text-white'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Mỗi chiếc đĩa là kết quả của một hành trình dài — từ ý tưởng sáng tác,
          phòng thu, giọng hát, nhạc cụ cho đến thiết kế bìa và cách tác phẩm được
          đưa đến công chúng. Vinyl Heritage Vietnam tìm lại những dấu vết ấy để kể
          về con người, thời đại và những câu chuyện đã góp phần tạo nên giá trị riêng
          cho từng bản thu.
        </motion.p>

        <VinylButton href='/about'>Khám phá những câu chuyện</VinylButton>
      </SectionContainer>
    </section>
  );
}
