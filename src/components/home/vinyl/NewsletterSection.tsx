'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Sms } from 'iconsax-react';
import { toast } from 'sonner';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { SectionContainer } from './shared';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';

export default function NewsletterSection() {
  const { dictionary: d } = usePublicI18n();
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error(d.home.emailRequired);
      return;
    }
    toast.success(d.home.subscribed);
    setEmail('');
  };

  return (
    <section className='bg-[var(--wood-darkest)] py-20 md:py-32'>
      <SectionContainer>
        <div className='relative overflow-hidden rounded-[32px] px-6 py-16 md:p-20'>
          <Image
            src={VINYL_IMAGES.newsletterBg}
            alt=''
            fill
            className='object-cover'
            sizes='1280px'
          />
          <div className='absolute inset-0 bg-[var(--wood-darkest)]/70' />

          <div className='relative z-10 mx-auto flex max-w-[720px] flex-col items-center gap-10 text-center text-[var(--parchment)]'>
            <div className='space-y-4'>
              <h2 className='font-[family-name:var(--font-display)] text-3xl leading-tight md:text-[48px] md:leading-[60px]'>
                {d.home.newsletterTitle.split('\n').map(line => <span className='block' key={line}>{line}</span>)}
              </h2>
              <p className='text-lg leading-[30px] text-[var(--parchment-dim)]'>
                {d.home.newsletterDescription}
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
                  color='#c4b298'
                  className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'
                />
                <input
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder='Email'
                  className='h-[54px] w-full rounded-full border border-[var(--border-gold-strong)] bg-[var(--panel-soft)] pl-12 pr-4 text-[var(--parchment)] placeholder:text-[var(--parchment-faint)] outline-none backdrop-blur-sm transition-colors duration-300 [transition-timing-function:var(--ease-vinyl)] focus:border-[var(--gold)]'
                />
              </label>
              <button
                type='submit'
                className='h-[54px] shrink-0 cursor-pointer rounded-full bg-[linear-gradient(180deg,var(--gold-bright),var(--gold))] px-[22px] text-[15px] font-[family-name:var(--font-body)] font-medium tracking-[0.02em] text-[var(--wood-darkest)] shadow-[0_10px_30px_-8px_rgba(201,162,75,0.55)] transition-all duration-300 [transition-timing-function:var(--ease-vinyl)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px_rgba(201,162,75,0.65)]'
              >
                {d.home.subscribe}
              </button>
            </form>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
