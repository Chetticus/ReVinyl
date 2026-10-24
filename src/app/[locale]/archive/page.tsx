'use client';

import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { RecordingCard } from '@/components/archive/RecordingCard';
import { isLocale, copy } from '@/i18n/archive';
import { archiveApi } from '@/modules/archive/api';

type LookupKey = 'eras' | 'genres' | 'regions' | 'instruments';

const FILTER_CONFIG: Array<{
  key: LookupKey;
  param: string;
}> = [
  { key: 'eras', param: 'era' },
  { key: 'genres', param: 'genre' },
  { key: 'regions', param: 'region' },
  { key: 'instruments', param: 'instrument' },
];

export default function ArchivePage() {
  const raw = String(useParams().locale);
  const locale = isLocale(raw) ? raw : 'vi';
  const t = copy[locale];

  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(params.search ?? '');

  useEffect(() => {
    setSearch(params.search ?? '');
  }, [params.search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['archive', params, locale],
    queryFn: () =>
      archiveApi.list({
        ...params,
        locale,
      }),
  });

  const { data: lookups } = useQuery({
    queryKey: ['archive-lookups'],
    queryFn: archiveApi.lookups,
  });

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    if (key !== 'page') {
      next.delete('page');
    }

    const query = next.toString();

    router.push(query ? `/${locale}/archive?${query}` : `/${locale}/archive`);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();

    if (params.search) {
      next.set('search', params.search);
    }

    router.push(
      next.toString()
        ? `/${locale}/archive?${next.toString()}`
        : `/${locale}/archive`
    );
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    update('search', search.trim());
  };

  const activeFilters = FILTER_CONFIG.filter(({ param }) => params[param]);

  const getFilterLabel = (key: LookupKey) => {
    const labels = {
      eras: t.era,
      genres: t.genre,
      regions: t.region,
      instruments: t.instrument,
    };

    return labels[key];
  };

  const getSelectedName = (key: LookupKey, slug: string) =>
    lookups?.[key]?.find(item => item.slug === slug)?.name ?? slug;

  return (
    <main className='vinyl-striped-bg min-h-screen pb-20 pt-16 text-[#EFE3CD]'>
      {/* HERO */}
      <section className='border-b border-[#4A341F]'>
        <div className='mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:py-20'>
          <div className='max-w-4xl'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='h-px w-9 bg-[#E4722C]' />

              <span className='text-xs font-semibold uppercase tracking-[0.24em] text-[#E9A074]'>
                Vinyl Heritage Archive
              </span>
            </div>

            <h1 className='max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl lg:text-7xl'>
              {t.archive}
            </h1>

            <p className='mt-5 max-w-2xl text-base leading-7 text-[#C4B298] md:text-lg'>
              {t.archiveIntro}
            </p>

            <div className='mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#C4B298]'>
              <span>{t.listen}</span>
              <span className='h-1 w-1 rounded-full bg-[#E4722C]' />
              <span>{t.understand}</span>
              <span className='h-1 w-1 rounded-full bg-[#E4722C]' />
              <span>{t.explore}</span>
            </div>
          </div>
        </div>
      </section>

      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        {/* SEARCH / FILTER */}
        <section className='relative z-10 -mt-1 py-8'>
          <div className='rounded-[24px] border border-[#D8C8B3] bg-[#EDE2D0] p-3 text-[#302A26] shadow-[0_12px_40px_rgba(0,0,0,0.14)] md:p-4'>
            <div className='flex flex-col gap-3 md:flex-row'>
              <form
                onSubmit={handleSearch}
                className='relative flex min-w-0 flex-1'
              >
                <Search
                  size={19}
                  className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#968D85]'
                />

                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder={t.search}
                  className='h-13 w-full rounded-2xl border border-transparent bg-[#F6EFE4] py-3 pl-12 pr-24 text-sm outline-none transition placeholder:text-[#786B5F] focus:border-[#C9AC8E] focus:bg-white'
                />

                <button
                  type='submit'
                  className='absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#2C2825] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#E4722C]'
                >
                  {t.searchAction}
                </button>
              </form>

              <button
                type='button'
                onClick={() => setFiltersOpen(current => !current)}
                className={[
                  'flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-medium transition',
                  filtersOpen || activeFilters.length > 0
                    ? 'border-[#E4722C]/30 bg-[#FFF3EA] text-[#C95F20]'
                    : 'border-[#E9E1DA] bg-white text-[#514A45] hover:border-[#D8C7BA]',
                ].join(' ')}
              >
                <SlidersHorizontal size={17} />

                {t.filters}

                {activeFilters.length > 0 && (
                  <span className='grid h-5 min-w-5 place-items-center rounded-full bg-[#E4722C] px-1 text-[11px] font-bold text-white'>
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {/* FILTER PANEL */}
            {filtersOpen && (
              <div className='mt-4 border-t border-[#EEE7E1] pt-4'>
                <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                  {FILTER_CONFIG.map(({ key, param }) => (
                    <label key={key} className='space-y-2'>
                      <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8D837B]'>
                        {getFilterLabel(key)}
                      </span>

                      <select
                        value={params[param] ?? ''}
                        onChange={event => update(param, event.target.value)}
                        className='h-11 w-full rounded-xl border border-[#E4DBD3] bg-white px-3 text-sm text-[#403A36] outline-none transition focus:border-[#CDAA91]'
                      >
                        <option value=''>
                          {t.all} {getFilterLabel(key)}
                        </option>

                        {lookups?.[key]?.map(item => (
                          <option key={item.id} value={item.slug}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACTIVE FILTERS */}
          {activeFilters.length > 0 && (
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              {activeFilters.map(({ key, param }) => (
                <button
                  key={param}
                  onClick={() => update(param, '')}
                  className='flex items-center gap-2 rounded-full border border-[#D8C8B3] bg-[#EDE2D0] px-3 py-1.5 text-xs text-[#655D57] transition hover:border-[#E4722C]/40 hover:text-[#C95F20]'
                >
                  <span className='text-[#958A82]'>{getFilterLabel(key)}:</span>

                  {getSelectedName(key, params[param])}

                  <X size={13} />
                </button>
              ))}

              <button
                onClick={clearFilters}
                className='ml-1 text-xs font-medium text-[#A05A32] hover:text-[#E4722C]'
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </section>

        {/* SECTION TITLE */}
        <div className='mb-6 flex items-end justify-between border-b border-[#4A341F] pb-4'>
          <div>
            <p className='mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C4B298]'>
              Vinyl Heritage Vietnam
            </p>

            <h2 className='text-2xl font-semibold tracking-[-0.02em] md:text-3xl'>
              {t.collection}
            </h2>
          </div>

          <Filter size={18} className='text-[#C4B298] md:hidden' />
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <RecordingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className='rounded-[28px] border border-[#D8C8B3] bg-[#EDE2D0] px-6 py-16 text-center text-[#302A26]'>
            <p className='text-lg font-semibold'>{t.errorTitle}</p>
            <p className='mt-2 text-sm text-[#81776F]'>{t.errorDescription}</p>
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && data?.data.length === 0 && (
          <div className='rounded-[28px] border border-dashed border-[#D8C8B3] bg-[#EDE2D0] px-6 py-20 text-center text-[#302A26]'>
            <div className='mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#F2E8DF] text-2xl'>
              ◉
            </div>

            <h3 className='text-xl font-semibold'>{t.emptyTitle}</h3>

            <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-[#81776F]'>
              {t.emptyDescription}
            </p>

            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className='mt-5 rounded-xl bg-[#2C2825] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#E4722C]'
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        )}

        {/* RECORDINGS */}
        {!isLoading && !isError && Boolean(data?.data.length) && (
          <div className='grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {data?.data.map(item => (
              <RecordingCard key={item.id} item={item} locale={locale} dark />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {data && data.totalPages > 1 && (
          <div className='mt-16 flex items-center justify-center gap-4 border-t border-[#4A341F] pt-8'>
            <button
              disabled={data.page <= 1}
              onClick={() => update('page', String(data.page - 1))}
              className='grid h-10 w-10 place-items-center rounded-full border border-[#6B4A2A] bg-[#2A1C12] transition hover:border-[#C9A24B] disabled:cursor-not-allowed disabled:opacity-30'
              aria-label='Previous page'
            >
              <ArrowLeft size={17} />
            </button>

            <div className='text-sm text-[#C4B298]'>
              <span className='font-semibold text-[#EFE3CD]'>{data.page}</span>

              <span className='mx-2 text-[#8C7A61]'>/</span>

              {data.totalPages}
            </div>

            <button
              disabled={data.page >= data.totalPages}
              onClick={() => update('page', String(data.page + 1))}
              className='grid h-10 w-10 place-items-center rounded-full border border-[#6B4A2A] bg-[#2A1C12] transition hover:border-[#C9A24B] disabled:cursor-not-allowed disabled:opacity-30'
              aria-label='Next page'
            >
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function RecordingSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='aspect-square rounded-[22px] bg-[#4A341F]' />

      <div className='mt-4 h-4 w-2/3 rounded bg-[#4A341F]' />

      <div className='mt-3 h-3 w-1/2 rounded bg-[#4A341F]' />
    </div>
  );
}
