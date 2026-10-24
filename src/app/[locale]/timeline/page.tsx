'use client';

import {
  ArrowRight,
  CalendarDays,
  Disc3,
  History,
  Music2,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { archiveApi } from '@/modules/archive/api';
import { copy, isLocale } from '@/i18n/archive';

interface TimelineEra {
  id: string;
  slug: string;
  name: string;
  startYear?: number;
  endYear?: number;

  translation?: {
    title: string;
    summary?: string;
    musicalContext?: string;
  };

  recordings: Array<{
    id: string;
    slug: string;
    translations: Array<{
      locale: string;
      title: string;
    }>;
  }>;

  artists: Array<{
    id: string;
    name: string;
  }>;

  albums: Array<{
    id: string;
    title: string;
  }>;
}

export default function TimelinePage() {
  const rawLocale = String(useParams().locale);

  const locale = isLocale(rawLocale) ? rawLocale : 'vi';
  const t = copy[locale];

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<TimelineEra[]>({
    queryKey: ['timeline', locale],
    queryFn: () => archiveApi.timeline(locale),
  });

  const getRecordingTitle = (
    translations: TimelineEra['recordings'][number]['translations'],
    fallback: string
  ) =>
    translations.find(item => item.locale === locale)?.title ??
    translations.find(item => item.locale === 'vi')?.title ??
    fallback;

  return (
    <main className='vinyl-striped-bg min-h-screen pb-24 pt-[72px] text-[#EFE3CD]'>
      {/* HERO */}
      <section className='border-b border-[#4A341F]'>
        <div className='mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20'>
          <div className='max-w-4xl'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='h-px w-9 bg-[#E4722C]' />

              <span className='text-xs font-semibold uppercase tracking-[0.22em] text-[#D46B34]'>
                {t.timelineEyebrow}
              </span>
            </div>

            <h1 className='max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl'>
              {t.timeline}
            </h1>

            <p className='mt-6 max-w-2xl text-base leading-7 text-[#C4B298] md:text-lg'>
              {t.timelineIntro}
            </p>

            {/* JOURNEY */}
            <div className='mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#C4B298]'>
              <span>{t.timelineStepEra}</span>
              <ArrowRight size={14} className='text-[#D67A46]' />

              <span>{t.timelineStepContext}</span>
              <ArrowRight size={14} className='text-[#D67A46]' />

              <span>{t.timelineStepMusic}</span>
              <ArrowRight size={14} className='text-[#D67A46]' />

              <span>{t.timelineStepExplore}</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className='mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20'>
        {isLoading && <TimelineSkeleton />}

        {isError && (
          <div className='rounded-[28px] border border-[#D8C8B3] bg-[#EDE2D0] px-6 py-16 text-center text-[#302A26]'>
            <History
              size={42}
              strokeWidth={1.25}
              className='mx-auto text-[#9D8E83]'
            />

            <h2 className='mt-5 text-xl font-semibold'>
              {t.timelineErrorTitle}
            </h2>

            <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-[#81766E]'>
              {t.timelineErrorDescription}
            </p>
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className='rounded-[28px] border border-dashed border-[#D8C8B3] bg-[#EDE2D0] px-6 py-20 text-center text-[#302A26]'>
            <Disc3
              size={46}
              strokeWidth={1.1}
              className='mx-auto text-[#9F8D81]'
            />

            <h2 className='mt-5 text-xl font-semibold'>
              {t.timelineEmptyTitle}
            </h2>

            <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-[#81766E]'>
              {t.timelineEmptyDescription}
            </p>
          </div>
        )}

        {!isLoading && !isError && data.length > 0 && (
          <div className='relative'>
            {/* vertical rail */}
            <div className='absolute bottom-0 left-[18px] top-2 hidden w-px bg-gradient-to-b from-[#D87540] via-[#D8C6B9] to-transparent md:block' />

            <div className='space-y-10 md:space-y-14'>
              {data.map((era, index) => {
                const eraTitle = era.translation?.title ?? era.name;

                const yearRange = [
                  era.startYear,
                  era.endYear && era.endYear !== era.startYear
                    ? era.endYear
                    : null,
                ]
                  .filter(Boolean)
                  .join('–');

                return (
                  <article key={era.id} className='relative md:pl-16'>
                    {/* TIMELINE MARKER */}
                    <div className='absolute left-0 top-7 hidden md:block'>
                      <div className='relative grid h-9 w-9 place-items-center rounded-full border-4 border-[#160E08] bg-[#D96F35] shadow-sm'>
                        <span className='text-[10px] font-bold text-white'>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* ERA CARD */}
                    <div className='overflow-hidden rounded-[30px] border border-[#D8C8B3] bg-[#EDE2D0] text-[#302A26] shadow-[0_16px_50px_rgba(0,0,0,0.16)]'>
                      <div className='grid lg:grid-cols-[240px_1fr]'>
                        {/* ERA SIDEBAR */}
                        <div className='relative overflow-hidden border-b border-[#E8DED6] bg-[#2B231F] px-6 py-7 text-white lg:border-b-0 lg:border-r lg:border-white/10 lg:px-7 lg:py-8'>
                          <div className='pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E4722C]/20 blur-3xl' />

                          <div className='relative'>
                            <div className='flex items-center gap-2 text-[#E89669]'>
                              <CalendarDays size={15} />

                              <span className='text-xs font-semibold uppercase tracking-[0.16em]'>
                                {t.period}
                              </span>
                            </div>

                            {yearRange && (
                              <p className='mt-5 text-3xl font-semibold tracking-[-0.03em] md:text-4xl'>
                                {yearRange}
                              </p>
                            )}

                            <div className='mt-6 h-px w-12 bg-[#E4722C]' />

                            <p className='mt-5 text-xs leading-6 text-white/45'>
                              {t.timelinePeriodHint}
                            </p>
                          </div>
                        </div>

                        {/* ERA CONTENT */}
                        <div className='px-5 py-7 md:px-8 md:py-9'>
                          <div className='max-w-3xl'>
                            <span className='text-[11px] font-semibold uppercase tracking-[0.17em] text-[#B0704D]'>
                              {t.musicalEra}
                            </span>

                            <h2 className='mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl'>
                              {eraTitle}
                            </h2>

                            {era.translation?.summary && (
                              <p className='mt-5 text-base leading-8 text-[#6E655E]'>
                                {era.translation.summary}
                              </p>
                            )}
                          </div>

                          {/* MUSICAL CONTEXT */}
                          {era.translation?.musicalContext && (
                            <div className='mt-7 rounded-[22px] border border-[#E8D9CE] bg-[#F8EFE8] p-5 md:p-6'>
                              <div className='mb-3 flex items-center gap-2 text-[#C66634]'>
                                <Sparkles size={17} />

                                <span className='text-xs font-semibold uppercase tracking-[0.13em]'>
                                  {t.musicalContext}
                                </span>
                              </div>

                              <p className='whitespace-pre-line text-sm leading-7 text-[#675E58] md:text-base'>
                                {era.translation.musicalContext}
                              </p>
                            </div>
                          )}

                          {/* RECORDINGS */}
                          {era.recordings.length > 0 && (
                            <div className='mt-9'>
                              <div className='mb-4 flex items-center justify-between gap-4'>
                                <div className='flex items-center gap-2'>
                                  <Disc3 size={17} className='text-[#D56C35]' />

                                  <h3 className='text-sm font-semibold uppercase tracking-[0.11em] text-[#655C55]'>
                                    {t.featuredRecordings}
                                  </h3>
                                </div>

                                <span className='text-xs text-[#A3978F]'>
                                  {era.recordings.length} {t.recordingsCount}
                                </span>
                              </div>

                              <div className='grid gap-3 sm:grid-cols-2'>
                                {era.recordings.map(
                                  (recording, recordingIndex) => (
                                    <Link
                                      key={recording.id}
                                      href={`/${locale}/recordings/${recording.slug}`}
                                      className='group flex items-center gap-4 rounded-2xl border border-[#D8C8B3] bg-[#F6EFE4] p-4 transition hover:-translate-y-0.5 hover:border-[#C9AC8E] hover:shadow-[0_10px_24px_rgba(63,44,31,0.08)]'
                                    >
                                      <div className='grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F0E6DF] text-[#C86230]'>
                                        <span className='text-xs font-semibold tabular-nums'>
                                          {String(recordingIndex + 1).padStart(
                                            2,
                                            '0'
                                          )}
                                        </span>
                                      </div>

                                      <div className='min-w-0 flex-1'>
                                        <p className='truncate font-semibold text-[#38322E] transition group-hover:text-[#D56B32]'>
                                          {getRecordingTitle(
                                            recording.translations,
                                            recording.slug
                                          )}
                                        </p>

                                        <p className='mt-1 text-xs text-[#9A8F87]'>
                                          {t.openRecording}
                                        </p>
                                      </div>

                                      <ArrowRight
                                        size={16}
                                        className='shrink-0 text-[#B3A79F] transition group-hover:translate-x-1 group-hover:text-[#D56B32]'
                                      />
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* ARTISTS / ALBUMS */}
                          {(era.artists.length > 0 ||
                            era.albums.length > 0) && (
                            <div className='mt-9 grid gap-5 border-t border-[#E9E1DA] pt-7 md:grid-cols-2'>
                              {era.artists.length > 0 && (
                                <div>
                                  <div className='mb-3 flex items-center gap-2 text-[#857970]'>
                                    <Users size={15} />

                                    <h3 className='text-xs font-semibold uppercase tracking-[0.12em]'>
                                      {t.notableArtists}
                                    </h3>
                                  </div>

                                  <div className='flex flex-wrap gap-2'>
                                    {era.artists.map(artist => (
                                      <span
                                        key={artist.id}
                                        className='rounded-full bg-[#F3ECE6] px-3 py-1.5 text-xs font-medium text-[#655B54]'
                                      >
                                        {artist.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {era.albums.length > 0 && (
                                <div>
                                  <div className='mb-3 flex items-center gap-2 text-[#857970]'>
                                    <Music2 size={15} />

                                    <h3 className='text-xs font-semibold uppercase tracking-[0.12em]'>
                                      {t.notableAlbums}
                                    </h3>
                                  </div>

                                  <div className='flex flex-wrap gap-2'>
                                    {era.albums.map(album => (
                                      <span
                                        key={album.id}
                                        className='rounded-full border border-[#E3D8D0] bg-white px-3 py-1.5 text-xs text-[#655B54]'
                                      >
                                        {album.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function TimelineSkeleton() {
  return (
    <div className='space-y-10'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='animate-pulse overflow-hidden rounded-[30px] border border-[#D8C8B3] bg-[#EDE2D0]'
        >
          <div className='grid lg:grid-cols-[240px_1fr]'>
            <div className='h-44 bg-[#DDD2CA] lg:h-auto' />

            <div className='p-7 md:p-9'>
              <div className='h-3 w-24 rounded bg-[#EAE2DC]' />
              <div className='mt-4 h-9 w-1/2 rounded bg-[#E7DED7]' />

              <div className='mt-7 h-4 w-full rounded bg-[#EEE7E1]' />
              <div className='mt-3 h-4 w-5/6 rounded bg-[#EEE7E1]' />

              <div className='mt-8 h-28 rounded-[20px] bg-[#EEE6DF]' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
