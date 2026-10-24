'use client';

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Disc3,
  ExternalLink,
  Headphones,
  MapPin,
  Music2,
  Quote,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { archiveApi } from '@/modules/archive/api';
import { copy, isLocale } from '@/i18n/archive';
import { AudioPlayer } from '@/components/archive/AudioPlayer';
import { RecordingCard } from '@/components/archive/RecordingCard';

function Rich({
  children,
  className = '',
}: {
  children?: string | null;
  className?: string;
}) {
  if (!children) return null;

  return (
    <p
      className={`whitespace-pre-line text-[15px] leading-8 text-[#625B55] md:text-base ${className}`}
    >
      {children}
    </p>
  );
}

export default function RecordingPage() {
  const params = useParams();

  const locale = isLocale(String(params.locale))
    ? (String(params.locale) as 'vi' | 'en')
    : 'vi';

  const slug = String(params.slug);
  const t = copy[locale];

  const {
    data: recording,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['recording', slug, locale],
    queryFn: () => archiveApi.detail(slug, locale),
  });

  if (isLoading) {
    return <RecordingPageSkeleton />;
  }

  if (isError || !recording) {
    return (
      <main className='vinyl-striped-bg min-h-screen px-4 pb-20 pt-[140px]'>
        <div className='mx-auto max-w-xl rounded-[28px] border border-[#D8C8B3] bg-[#EDE2D0] px-6 py-16 text-center text-[#302A26]'>
          <Disc3
            size={44}
            strokeWidth={1.25}
            className='mx-auto text-[#A9988C]'
          />

          <h1 className='mt-5 text-2xl font-semibold tracking-[-0.02em] text-[#2F2925]'>
            {t.recordingNotFound}
          </h1>

          <p className='mt-2 text-sm leading-6 text-[#817870]'>
            {t.recordingNotFoundDescription}
          </p>

          <Link
            href={`/${locale}/archive`}
            className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2E2925] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#E4722C]'
          >
            <ArrowLeft size={16} />
            {t.backToArchive}
          </Link>
        </div>
      </main>
    );
  }

  const r = recording;
  const tr = r.translation;

  const title = tr?.title ?? r.slug;

  const primaryMetadata = [r.artist?.name, r.album?.title, r.year]
    .filter(Boolean)
    .join(' · ');

  const verificationLabel = (status?: string | null) => {
    if (!status) return null;

    const labels: Record<string, string> = {
      VERIFIED: t.verified,
      PENDING: t.pendingVerification,
      UNVERIFIED: t.unverified,
    };

    return labels[status] ?? status.replaceAll('_', ' ');
  };

  return (
    <main className='vinyl-striped-bg min-h-screen pt-[72px] text-[#302A26]'>
      {/* HERO / LISTEN */}
      <section className='vinyl-striped-bg relative overflow-hidden text-white'>
        {/* subtle decorative light */}
        <div className='pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#E4722C]/10 blur-3xl' />

        <div className='relative mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[440px_1fr] lg:gap-16 lg:py-20'>
          {/* RECORD SLEEVE */}
          <div className='mx-auto w-full max-w-[440px] lg:mx-0'>
            <div className='relative aspect-square'>
              {/* Vinyl disc */}
              <div className='absolute right-0 top-1/2 aspect-square w-[82%] -translate-y-1/2 translate-x-[8%] rounded-full bg-[#12100F] shadow-[0_30px_60px_rgba(0,0,0,0.35)]'>
                <div className='absolute inset-[6%] rounded-full border border-white/[0.04]' />
                <div className='absolute inset-[14%] rounded-full border border-white/[0.04]' />
                <div className='absolute inset-[22%] rounded-full border border-white/[0.04]' />
                <div className='absolute inset-[30%] rounded-full border border-white/[0.04]' />

                <div className='absolute left-1/2 top-1/2 grid h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#D7682A]'>
                  <div className='h-2.5 w-2.5 rounded-full bg-[#171311]' />
                </div>
              </div>

              {/* Sleeve */}
              <div className='absolute inset-y-0 left-0 z-10 aspect-square w-[88%] overflow-hidden rounded-[26px] bg-[#D9CCC2] shadow-[14px_20px_50px_rgba(0,0,0,0.28)]'>
                {r.coverImage ? (
                  <Image
                    src={r.coverImage}
                    alt={title}
                    fill
                    priority
                    sizes='(max-width: 768px) 90vw, 440px'
                    className='object-cover'
                  />
                ) : (
                  <div className='relative grid h-full place-items-center bg-[linear-gradient(145deg,#E8D9CD,#BFA99A)]'>
                    <Disc3
                      size={72}
                      strokeWidth={1}
                      className='text-[#756155]'
                    />

                    <span className='absolute bottom-6 left-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#725E52]'>
                      Vinyl Heritage Vietnam
                    </span>
                  </div>
                )}

                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent' />
              </div>
            </div>
          </div>

          {/* RECORD INFORMATION */}
          <div className='flex flex-col justify-center'>
            <Link
              href={`/${locale}/archive`}
              className='mb-7 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E9A074] transition hover:text-white'
            >
              <ArrowLeft size={14} />
              {t.backToArchive}
            </Link>

            <div className='mb-5 flex items-center gap-3'>
              <div className='h-px w-8 bg-[#E4722C]' />

              <span className='text-xs font-semibold uppercase tracking-[0.22em] text-[#E98A55]'>
                {t.listen}
              </span>
            </div>

            <h1 className='max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl lg:text-6xl'>
              {title}
            </h1>

            {tr?.alternativeTitle && (
              <p className='mt-3 text-base italic text-white/55'>
                {tr.alternativeTitle}
              </p>
            )}

            {primaryMetadata && (
              <p className='mt-5 text-base text-white/75 md:text-lg'>
                {primaryMetadata}
              </p>
            )}

            {/* TAXONOMY */}
            <div className='mt-5 flex flex-wrap gap-2'>
              {(r.era?.translation?.title ?? r.era?.name) && (
                <MetadataBadge
                  icon={<CalendarDays size={13} />}
                  value={r.era?.translation?.title ?? r.era?.name}
                />
              )}

              {r.genre?.name && (
                <MetadataBadge
                  icon={<Music2 size={13} />}
                  value={r.genre.name}
                />
              )}

              {r.region?.name && (
                <MetadataBadge
                  icon={<MapPin size={13} />}
                  value={r.region.name}
                />
              )}
            </div>

            {!r.requestedTranslationAvailable && locale === 'en' && (
              <div className='mt-6 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white/70'>
                {t.unavailable}
              </div>
            )}

            {/* AUDIO */}
            <div className='mt-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm md:p-5'>
              <div className='mb-4 flex items-center gap-2 text-sm font-medium text-white/75'>
                <Headphones size={17} className='text-[#E98A55]' />
                {t.listeningExperience}
              </div>

              <AudioPlayer assets={r.audio} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* UNDERSTAND INTRO */}
      <section className='mx-auto my-8 max-w-7xl rounded-[28px] bg-[#EDE2D0] px-4 py-16 md:px-8 md:py-20'>
        <SectionLabel>{t.understand}</SectionLabel>

        <div className='mt-5 grid gap-10 lg:grid-cols-[1.4fr_.8fr] lg:gap-16'>
          {/* SUMMARY */}
          <article>
            <h2 className='max-w-2xl text-3xl font-semibold tracking-[-0.03em] md:text-4xl'>
              {t.summary}
            </h2>

            <div className='mt-6 max-w-3xl'>
              <Rich>{tr?.shortSummary}</Rich>
            </div>
          </article>

          {/* QUICK LEARNING CARDS */}
          <div className='space-y-4'>
            {tr?.preservationValue && (
              <EducationalCard
                icon={<BookOpen size={18} />}
                label={t.whyItMatters}
              >
                {tr.preservationValue}
              </EducationalCard>
            )}

            {tr?.whatToListenFor && (
              <EducationalCard
                icon={<Headphones size={18} />}
                label={t.whatToListenFor}
                accent
              >
                {tr.whatToListenFor}
              </EducationalCard>
            )}
          </div>
        </div>
      </section>

      {/* CONTEXT + LYRICS */}
      <section className='border-y border-[#D8C8B3] bg-[#E5D7C1]'>
        <div className='mx-auto max-w-5xl space-y-4 px-4 py-14 md:px-8 md:py-16'>
          <EditorialDetails title={t.context} defaultOpen>
            {tr?.historicalContext && (
              <div>
                <h3 className='mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#9A7863]'>
                  {t.historicalContext}
                </h3>

                <Rich>{tr.historicalContext}</Rich>
              </div>
            )}

            {tr?.culturalContext && (
              <div className='mt-8 border-t border-[#E6DDD5] pt-8'>
                <h3 className='mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#9A7863]'>
                  {t.culturalContext}
                </h3>

                <Rich>{tr.culturalContext}</Rich>
              </div>
            )}
          </EditorialDetails>

          <EditorialDetails title={t.lyrics}>
            {tr?.lyricsMeaning && (
              <div>
                <h3 className='mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#9A7863]'>
                  {t.lyricsMeaning}
                </h3>

                <Rich>{tr.lyricsMeaning}</Rich>
              </div>
            )}

            {tr?.lyricsNotes && (
              <div className='mt-8 rounded-2xl bg-[#F8F2ED] p-5 md:p-6'>
                <div className='mb-3 flex items-center gap-2 text-[#C96730]'>
                  <Quote size={17} />

                  <span className='text-xs font-semibold uppercase tracking-[0.14em]'>
                    {t.lyricsNotes}
                  </span>
                </div>

                <Rich>{tr.lyricsNotes}</Rich>
              </div>
            )}

            {tr?.fullLyrics && (
              <div className='mt-8 border-t border-[#E6DDD5] pt-8'>
                <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
                  <h3 className='text-lg font-semibold'>{t.fullLyrics}</h3>

                  {tr.lyricsRightsStatus && (
                    <span className='rounded-full bg-[#F1E9E2] px-3 py-1 text-[11px] font-medium text-[#7B6D64]'>
                      {t.rightsStatus}: {tr.lyricsRightsStatus}
                    </span>
                  )}
                </div>

                <Rich className='italic'>{tr.fullLyrics}</Rich>
              </div>
            )}
          </EditorialDetails>
        </div>
      </section>

      {/* INSTRUMENTS */}
      <section className='mx-auto my-8 max-w-7xl rounded-[28px] bg-[#EDE2D0] px-4 py-16 md:px-8 md:py-20'>
        <div className='max-w-2xl'>
          <SectionLabel>{t.discoverTheSound}</SectionLabel>

          <h2 className='mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-4xl'>
            {t.instruments}
          </h2>

          <p className='mt-3 text-sm leading-6 text-[#80766F] md:text-base'>
            {t.instrumentsIntro}
          </p>
        </div>

        {r.instruments.length > 0 ? (
          <div className='mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {r.instruments.map((item, index) => {
              const role =
                locale === 'en' ? (item.roleEn ?? item.roleVi) : item.roleVi;

              return (
                <article
                  key={item.instrument.id}
                  className='group rounded-[24px] border border-[#E5DCD4] bg-[#FFFCF9] p-5 transition hover:-translate-y-0.5 hover:border-[#D6C4B6] hover:shadow-[0_12px_30px_rgba(72,52,39,0.05)]'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='grid h-10 w-10 place-items-center rounded-full bg-[#F2E8E0] text-[#C9642E]'>
                      <Music2 size={18} />
                    </div>

                    <span className='text-xs tabular-nums text-[#B0A69F]'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className='mt-5 text-lg font-semibold'>
                    {item.instrument.name}
                  </h3>

                  {role && (
                    <p className='mt-2 text-sm leading-6 text-[#766E68]'>
                      {role}
                    </p>
                  )}

                  {item.confidence != null && (
                    <div className='mt-5 border-t border-[#EEE7E1] pt-4'>
                      <div className='flex items-center justify-between text-[11px]'>
                        <span className='font-medium uppercase tracking-[0.1em] text-[#A0958D]'>
                          {t.confidence}
                        </span>

                        <span className='font-semibold text-[#756A63]'>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>

                      <div className='mt-2 h-1 overflow-hidden rounded-full bg-[#EDE5DF]'>
                        <div
                          className='h-full rounded-full bg-[#D77A45]'
                          style={{
                            width: `${Math.round(item.confidence * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className='mt-8 text-sm text-[#847A73]'>
            {t.noInstrumentInformation}
          </p>
        )}
      </section>

      {/* SOURCES */}
      <section className='border-t border-[#D8C8B3] bg-[#EDE2D0]'>
        <div className='mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20'>
          <SectionLabel>{t.research}</SectionLabel>

          <h2 className='mt-4 text-3xl font-semibold tracking-[-0.03em]'>
            {t.sources}
          </h2>

          <p className='mt-3 max-w-2xl text-sm leading-6 text-[#81776F]'>
            {t.sourcesIntro}
          </p>

          {r.references.length > 0 ? (
            <ol className='mt-8 divide-y divide-[#E7DED6] border-y border-[#E7DED6]'>
              {r.references.map((item, index) => {
                const status = verificationLabel(item.verificationStatus);

                return (
                  <li
                    key={item.reference.id}
                    className='grid gap-4 py-5 md:grid-cols-[48px_1fr_auto] md:items-center'
                  >
                    <span className='font-mono text-sm text-[#AAA098]'>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div>
                      {item.reference.url ? (
                        <a
                          href={item.reference.url}
                          target='_blank'
                          rel='noreferrer'
                          className='group inline-flex items-center gap-2 font-semibold text-[#3A342F] transition hover:text-[#D7672C]'
                        >
                          {item.reference.title}

                          <ExternalLink
                            size={14}
                            className='opacity-40 transition group-hover:opacity-100'
                          />
                        </a>
                      ) : (
                        <p className='font-semibold text-[#3A342F]'>
                          {item.reference.title}
                        </p>
                      )}

                      <p className='mt-1 text-sm text-[#8A8078]'>
                        {[
                          item.reference.publisher,
                          item.reference.publishedYear,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>

                    {status && (
                      <span className='w-fit rounded-full bg-[#F2ECE6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#806F63]'>
                        {status}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className='mt-8 text-sm text-[#847A73]'>{t.noSources}</p>
          )}
        </div>
      </section>

      {/* EXPLORE */}
      <section className='vinyl-striped-bg text-white'>
        <div className='mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20'>
          <SectionLabel light>{t.explore}</SectionLabel>

          <div className='mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
            <div>
              <h2 className='text-3xl font-semibold tracking-[-0.03em] md:text-4xl'>
                {t.related}
              </h2>

              <p className='mt-3 max-w-xl text-sm leading-6 text-white/55'>
                {t.relatedIntro}
              </p>
            </div>

            <Link
              href={`/${locale}/archive`}
              className='inline-flex w-fit items-center gap-2 text-sm font-medium text-[#E99A6C] transition hover:text-white'
            >
              {t.viewArchive}
              <ArrowLeft className='rotate-180' size={15} />
            </Link>
          </div>

          {r.related?.length ? (
            <div className='mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
              {r.related.map(item => (
                <RecordingCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          ) : (
            <p className='mt-10 text-sm text-white/50'>{t.noRelated}</p>
          )}
        </div>
      </section>
    </main>
  );
}

function MetadataBadge({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70'>
      {icon}
      {value}
    </span>
  );
}

function SectionLabel({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className='flex items-center gap-3'>
      <div className='h-px w-8 bg-[#E4722C]' />

      <span
        className={[
          'text-xs font-semibold uppercase tracking-[0.2em]',
          light ? 'text-[#E98C58]' : 'text-[#CA642E]',
        ].join(' ')}
      >
        {children}
      </span>
    </div>
  );
}

function EducationalCard({
  icon,
  label,
  children,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  children: string;
  accent?: boolean;
}) {
  return (
    <article
      className={[
        'rounded-[22px] border p-5',
        accent
          ? 'border-[#E4C7B5] bg-[#FFF3EB]'
          : 'border-[#E5DDD6] bg-[#FFFCF9]',
      ].join(' ')}
    >
      <div className='mb-3 flex items-center gap-2 text-[#CB672F]'>
        {icon}

        <span className='text-xs font-semibold uppercase tracking-[0.12em]'>
          {label}
        </span>
      </div>

      <p className='whitespace-pre-line text-sm leading-7 text-[#675F59]'>
        {children}
      </p>
    </article>
  );
}

function EditorialDetails({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className='group rounded-[24px] border border-[#E3D8CF] bg-[#FFFCF9]'
    >
      <summary className='flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 md:px-7 [&::-webkit-details-marker]:hidden'>
        <h2 className='text-xl font-semibold tracking-[-0.02em] md:text-2xl'>
          {title}
        </h2>

        <div className='grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2E9E2] text-[#806D60]'>
          <ChevronDown
            size={17}
            className='transition duration-200 group-open:rotate-180'
          />
        </div>
      </summary>

      <div className='border-t border-[#EEE6DF] px-5 py-6 md:px-7 md:py-7'>
        {children}
      </div>
    </details>
  );
}

function RecordingPageSkeleton() {
  return (
    <main className='vinyl-striped-bg min-h-screen pt-[72px]'>
      <section className='vinyl-striped-bg'>
        <div className='mx-auto grid max-w-7xl animate-pulse gap-10 px-4 py-14 md:px-8 lg:grid-cols-[440px_1fr]'>
          <div className='aspect-square rounded-[26px] bg-white/10' />

          <div className='flex flex-col justify-center'>
            <div className='h-3 w-28 rounded bg-white/10' />
            <div className='mt-8 h-12 w-3/4 rounded bg-white/10' />
            <div className='mt-4 h-5 w-1/2 rounded bg-white/10' />
            <div className='mt-10 h-36 rounded-[24px] bg-white/10' />
          </div>
        </div>
      </section>

      <section className='mx-auto my-8 max-w-7xl animate-pulse rounded-[28px] bg-[#EDE2D0] px-4 py-20 md:px-8'>
        <div className='h-3 w-24 rounded bg-[#E5DDD6]' />
        <div className='mt-6 h-9 w-1/3 rounded bg-[#E5DDD6]' />
        <div className='mt-8 h-4 w-full rounded bg-[#EAE3DD]' />
        <div className='mt-3 h-4 w-5/6 rounded bg-[#EAE3DD]' />
        <div className='mt-3 h-4 w-2/3 rounded bg-[#EAE3DD]' />
      </section>
    </main>
  );
}
