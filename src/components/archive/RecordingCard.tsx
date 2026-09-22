import { ArrowUpRight, Disc3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ArchiveRecording, Locale } from '@/modules/archive/types';

export function RecordingCard({
  item,
  locale,
  dark = false,
}: {
  item: ArchiveRecording;
  locale: Locale;
  dark?: boolean;
}) {
  const title = item.translation?.title ?? item.slug;

  const metadata = [item.artist?.name, item.year].filter(Boolean).join(' · ');

  return (
    <Link href={`/${locale}/recordings/${item.slug}`} className='group block'>
      {/* VINYL / SLEEVE */}
      <div className='relative aspect-[1.08/1] overflow-hidden rounded-[24px] border border-[var(--border-gold)] bg-[var(--panel)] shadow-[var(--shadow-soft)] transition-shadow duration-300 [transition-timing-function:var(--ease-vinyl)] group-hover:shadow-[var(--shadow-deep)]'>
        {/* Vinyl disc */}
        <div className='absolute right-[3%] top-1/2 aspect-square w-[76%] -translate-y-1/2 translate-x-1 rounded-full bg-[var(--wood-darkest)] shadow-xl transition duration-500 ease-out group-hover:translate-x-8'>
          <div className='absolute inset-[7%] rounded-full border border-[var(--gold)]/10' />
          <div className='absolute inset-[16%] rounded-full border border-[var(--gold)]/10' />
          <div className='absolute inset-[25%] rounded-full border border-[var(--gold)]/10' />

          <div className='absolute left-1/2 top-1/2 grid h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--gold)]'>
            <div className='h-2 w-2 rounded-full bg-[var(--wood-darkest)]' />
          </div>
        </div>

        {/* Sleeve */}
        <div className='absolute inset-y-0 left-0 z-10 w-[88%] overflow-hidden rounded-[22px] bg-[var(--parchment-dim)] shadow-[8px_6px_30px_rgba(22,14,8,0.25)] transition duration-500 ease-out group-hover:-translate-x-1'>
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={title}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-cover transition duration-700 group-hover:scale-[1.03]'
            />
          ) : (
            <div className='relative grid h-full place-items-center bg-[linear-gradient(145deg,var(--parchment-dim),var(--panel))]'>
              <Disc3
                size={58}
                strokeWidth={1}
                className='text-[var(--wood-dark)]'
              />

              <span className='absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--wood-dark)]'>
                Vinyl Heritage
              </span>
            </div>
          )}

          {/* subtle gradient */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60' />

          {/* explore indicator */}
          <div className='absolute bottom-4 right-4 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-[var(--parchment)]/90 text-[var(--wood-darkest)] opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            <ArrowUpRight size={17} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className='pt-4'>
        <div className='mb-2 flex flex-wrap gap-2'>
          {item.era?.name && (
            <span
              className={`rounded-full bg-[var(--gold)]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${dark ? 'text-[var(--gold-bright)]' : 'text-[var(--lacquer)]'}`}
            >
              {item.era.name}
            </span>
          )}

          {item.genre?.name && (
            <span className='rounded-full border border-[var(--gold)]/30 px-2.5 py-1 text-[10px] font-medium text-[var(--parchment-faint)]'>
              {item.genre.name}
            </span>
          )}
        </div>

        <h2
          className={`line-clamp-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug tracking-[-0.02em] transition ${
            dark
              ? 'text-[var(--parchment)] group-hover:text-[var(--gold-bright)]'
              : 'text-[var(--wood-darkest)] group-hover:text-[var(--lacquer)]'
          }`}
        >
          {title}
        </h2>

        {metadata && (
          <p className='mt-1.5 line-clamp-1 text-sm text-[var(--parchment-faint)]'>
            {metadata}
          </p>
        )}

        {item.album?.title && (
          <p className='mt-1 line-clamp-1 text-xs italic text-[var(--parchment-faint)]'>
            {item.album.title}
          </p>
        )}
      </div>
    </Link>
  );
}
