'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';

import { archiveApi } from '@/modules/archive/api';
import { RecordingCard } from '@/components/archive/RecordingCard';
import { buildLocalePath } from '@/i18n/config';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';

import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
} from './shared';

export default function CollectionSection() {
  const { locale, dictionary: d } = usePublicI18n();

  const [activeSlide, setActiveSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['home-featured-recordings', locale],
    queryFn: () =>
      archiveApi.list({
        locale,
        page: '1',
      }),
  });

  /**
   * Hiện tại archive chưa có isFeatured / featuredOrder.
   * Tạm thời lấy 4 recording đầu tiên.
   *
   * Sau này nếu cần content team curate homepage:
   * Recording.isFeatured
   * Recording.featuredOrder
   */
  const recordings = data?.data?.slice(0, 4) ?? [];

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const handleScroll = () => {
      const firstSlide = track.firstElementChild as HTMLElement | null;

      if (!firstSlide) return;

      const slideWidth = firstSlide.clientWidth;
      const gap = 20;

      const index = Math.round(
        track.scrollLeft / (slideWidth + gap)
      );

      setActiveSlide(
        Math.min(
          Math.max(index, 0),
          Math.max(recordings.length - 1, 0)
        )
      );
    };

    track.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      track.removeEventListener('scroll', handleScroll);
    };
  }, [recordings.length]);

  useEffect(() => {
    setActiveSlide(0);

    trackRef.current?.scrollTo({
      left: 0,
      behavior: 'auto',
    });
  }, [locale]);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;

    if (!track || !slide) return;

    track.scrollTo({
      left: slide.offsetLeft,
      behavior: 'smooth',
    });

    setActiveSlide(index);
  };

  return (
    <section className='relative overflow-hidden bg-[var(--wood-darkest)] py-20 md:py-28 lg:py-32'>
      {/* decorative atmosphere */}
      <div className='pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[var(--gold)]/[0.08] blur-3xl' />

      <SectionContainer className='relative'>
        {/* HEADER */}
        <div className='mb-10 md:mb-12'>
          <div className='flex flex-col gap-7 md:flex-row md:items-end md:justify-between'>
            <div className='max-w-3xl'>
              <SectionLabel dark>
                {d.home.featuredArchiveLabel}
              </SectionLabel>

              <SectionTitle dark className='mt-5 max-w-2xl text-left'>
                {d.home.featuredArchiveTitle}
              </SectionTitle>

              <SectionDescription dark className='mt-5 max-w-xl'>
                {d.home.featuredArchiveDescription}
              </SectionDescription>
            </div>

            <Link
              href={buildLocalePath(locale, '/archive')}
              className='group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--parchment)] transition hover:text-[var(--gold-bright)]'
            >
              {d.home.viewArchive}

              <ArrowRight2
                size={19}
                color='currentColor'
                className='transition-transform duration-300 group-hover:translate-x-1'
              />
            </Link>
          </div>

          <div className='mt-9 h-px bg-[var(--gold)]/25' />
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <RecordingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!isLoading && isError && (
          <div className='rounded-[28px] border border-[var(--border-gold)] bg-[var(--panel-soft)] px-6 py-14 text-center'>
            <p className='text-lg font-semibold text-[var(--parchment)]'>
              {d.home.featuredArchiveErrorTitle}
            </p>

            <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--parchment-dim)]'>
              {d.home.featuredArchiveErrorDescription}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!isLoading &&
          !isError &&
          recordings.length === 0 && (
            <div className='rounded-[28px] border border-dashed border-[var(--border-gold-strong)] bg-[var(--panel-soft)] px-6 py-14 text-center'>
              <div className='mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--gold)]/15 text-xl text-[var(--gold)]'>
                ◉
              </div>

              <p className='mt-4 font-semibold text-[var(--parchment)]'>
                {d.home.featuredArchiveEmpty}
              </p>
            </div>
          )}

        {/* RECORDINGS */}
        {!isLoading &&
          !isError &&
          recordings.length > 0 && (
            <>
              {/* DESKTOP */}
              <div className='hidden gap-6 xl:grid xl:grid-cols-4'>
                {recordings.map(recording => (
                  <RecordingCard
                    key={recording.id}
                    item={recording}
                    locale={locale}
                    dark
                  />
                ))}
              </div>

              {/* MOBILE / TABLET */}
              <div
                ref={trackRef}
                className='-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 xl:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              >
                {recordings.map(recording => (
                  <div
                    key={recording.id}
                    className='w-[min(82vw,340px)] shrink-0 snap-start'
                  >
                    <RecordingCard
                      item={recording}
                      locale={locale}
                      dark
                    />
                  </div>
                ))}
              </div>

              {/* MOBILE PAGINATION DOTS */}
              {recordings.length > 1 && (
                <div className='mt-5 flex justify-center gap-2 xl:hidden'>
                  {recordings.map((recording, index) => (
                    <button
                      key={recording.id}
                      type='button'
                      aria-label={`${d.home.featuredSlideLabel} ${index + 1
                        }`}
                      onClick={() => scrollToSlide(index)}
                      className={[
                        'h-2 rounded-full transition-all duration-300',
                        index === activeSlide
                          ? 'w-7 bg-[var(--lacquer)]'
                          : 'w-2 bg-[var(--gold)]/30 hover:bg-[var(--gold)]/50',
                      ].join(' ')}
                    />
                  ))}
                </div>
              )}
            </>
          )}
      </SectionContainer>
    </section>
  );
}

function RecordingSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='aspect-[1.08/1] rounded-[24px] bg-[var(--gold)]/10' />

      <div className='mt-5 h-3 w-20 rounded bg-[var(--gold)]/15' />

      <div className='mt-3 h-5 w-3/4 rounded bg-[var(--parchment)]/10' />

      <div className='mt-3 h-3 w-1/2 rounded bg-[var(--parchment)]/10' />
    </div>
  );
}