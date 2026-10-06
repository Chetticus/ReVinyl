'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Sms } from 'iconsax-react';
import { toast } from 'sonner';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { SectionContainer } from './shared';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    toast.success('Đăng ký nhận tin thành công!');
    setEmail('');
  };

  return (
    <section className='bg-[#FDF6F1] py-20 md:py-32'>
      <SectionContainer>
        <div className='relative overflow-hidden rounded-[32px] px-6 py-16 md:p-20'>
          <Image
            src={VINYL_IMAGES.newsletterBg}
            alt=''
            fill
            className='object-cover'
            sizes='1280px'
          />
          <div className='absolute inset-0 bg-black/50' />

          <div className='relative z-10 mx-auto flex max-w-[720px] flex-col items-center gap-10 text-center text-white'>
            <div className='space-y-4'>
              <h2 className='text-3xl leading-tight md:text-[48px] md:leading-[60px]'>
                Mỗi chiếc đĩa là một dấu vết.
                <br />
                Mỗi câu chuyện là một phần di sản.
              </h2>
              <p className='text-lg leading-[30px] text-white/90'>
                Cùng nhau gìn giữ, kể lại và truyền cảm hứng.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className='flex w-full max-w-[400px] flex-col gap-3 sm:flex-row'
            >
              <label className='relative flex-1'>
                <span className='sr-only'>Email</span>
                <Sms
                  size={20}
                  color='rgba(255,255,255,0.64)'
                  className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'
                />
                <input
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder='Email'
                  className='h-[54px] w-full rounded-full border border-white/30 bg-transparent pl-12 pr-4 text-white placeholder:text-white/60 outline-none focus:border-white/60'
                />
              </label>
              <button
                type='submit'
                className='h-12 shrink-0 cursor-pointer rounded-full bg-[#E4722C] px-[22px] text-[15px] font-bold text-white transition-opacity hover:opacity-90'
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
