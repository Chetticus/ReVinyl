'use client';

import Link from 'next/link';
import {
  Headphones,
  BookOpen,
  MessageSquarePlus,
  ArrowUpRight,
} from 'lucide-react';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';
import { buildLocalePath } from '@/i18n/config';
import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
} from './shared';

const actions = [
  { icon: Headphones, path: '/archive' },
  { icon: BookOpen, path: '/timeline' },
  { icon: MessageSquarePlus, path: '/contribute' },
] as const;

export default function ReviewerSection() {
  const { locale, dictionary: d } = usePublicI18n();
  return (
    <section
      className='bg-[var(--wood-darkest)] py-24 md:pt-[140px]'
      aria-labelledby='explore-heritage-title'
    >
      <SectionContainer className='flex flex-col items-center gap-12'>
        <div className='flex max-w-[800px] flex-col items-center gap-8 text-center'>
          <SectionLabel dark>{d.home.communityLabel}</SectionLabel>
          <SectionTitle dark>
            <span id='explore-heritage-title'>{d.home.communityTitle}</span>
          </SectionTitle>
          <SectionDescription dark className='text-center'>
            {d.home.communityDescription}
          </SectionDescription>
        </div>
        <div className='grid w-full gap-6 md:grid-cols-3'>
          {d.home.archiveActions.map((action, index) => {
            const { icon: Icon, path } = actions[index];
            return (
              <Link
                key={path}
                href={buildLocalePath(locale, path)}
                className='group flex flex-col items-start rounded-[30px] border border-[var(--border-gold)] bg-[linear-gradient(160deg,var(--panel),var(--wood-dark))] p-8 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]'
              >
                <span className='mb-8 rounded-full border border-[var(--border-gold)] bg-[var(--gold)]/10 p-4 text-[var(--gold)]'>
                  <Icon size={28} aria-hidden='true' />
                </span>
                <h3 className='mb-4 font-[family-name:var(--font-display)] text-2xl text-[var(--parchment)]'>
                  {action.title}
                </h3>
                <p className='mb-8 flex-1 text-base leading-7 text-[var(--parchment-dim)]'>
                  {action.description}
                </p>
                <span className='inline-flex items-center gap-2 text-sm font-medium text-[var(--gold)]'>
                  {action.cta}
                  <ArrowUpRight
                    size={18}
                    aria-hidden='true'
                    className='transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}
