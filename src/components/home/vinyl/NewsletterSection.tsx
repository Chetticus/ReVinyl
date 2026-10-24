'use client';

import Image from 'next/image';
import Link from 'next/link';
import { buildLocalePath } from '@/i18n/config';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { SectionContainer } from './shared';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';

export default function NewsletterSection() {
  const { locale, dictionary: d } = usePublicI18n();

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
                {d.home.newsletterTitle.split('\n').map(line => (
                  <span className='block' key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className='text-lg leading-[30px] text-[var(--parchment-dim)]'>
                {d.home.newsletterDescription}
              </p>
            </div>

            <Link
              href={buildLocalePath(locale, '/contact')}
              className='inline-flex h-[54px] items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--gold-bright),var(--gold))] px-7 font-medium text-[var(--wood-darkest)]'
            >
              {d.contact.formLabel}
            </Link>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
