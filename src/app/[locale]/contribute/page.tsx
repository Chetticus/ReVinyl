'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, UserRound } from 'lucide-react';
import { archiveApi } from '@/modules/archive/api';
import { ContributionType, Locale } from '@/modules/archive/types';
import { copy, isLocale } from '@/i18n/archive';
import { LocaleSwitch } from '@/components/archive/LocaleSwitch';
import { ContributionTypeSelector } from '@/components/archive/contribution/ContributionTypeSelector';
import {
  ContributionResourceFields,
  ResourceDraft,
} from '@/components/archive/contribution/ContributionResourceFields';
import { useAuthStore } from '@/stores/useAuthStore';

const fieldClass =
  'mt-2 h-12 w-full rounded-sm border border-[#c9bda9] bg-white px-4 font-normal outline-none focus:border-[#a34924]';

export default function ContributePage() {
  const raw = String(useParams().locale);
  const routeLocale: Locale = isLocale(raw) ? raw : 'vi';
  const t = copy[routeLocale].contribution;
  const user = useAuthStore(state => state.user);
  const [state, setState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [type, setType] = useState<ContributionType>('NEW_RECORDING');
  const [contributionLocale, setContributionLocale] =
    useState<Locale>(routeLocale);
  const [resources, setResources] = useState<ResourceDraft[]>([]);
  const [validationError, setValidationError] = useState('');
  const recordings = useQuery({
    queryKey: ['contribution-recordings', routeLocale],
    queryFn: () =>
      archiveApi.list({ locale: routeLocale, page: 1, perPage: 100 }),
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'submitting') return;
    const form = new FormData(event.currentTarget);
    const recordingId = String(form.get('recordingId') ?? '');
    if (type !== 'NEW_RECORDING' && !recordingId) {
      setValidationError(t.requiredRecording);
      return;
    }
    setValidationError('');
    setState('submitting');
    try {
      await archiveApi.createContribution({
        type,
        locale: contributionLocale,
        title: String(form.get('title') ?? '').trim(),
        content: String(form.get('content') ?? '').trim(),
        recordingId: type === 'NEW_RECORDING' ? undefined : recordingId,
        proposedRecordingTitle:
          type === 'NEW_RECORDING'
            ? String(form.get('proposedRecordingTitle') ?? '').trim()
            : undefined,
        proposedArtistName:
          String(form.get('proposedArtistName') ?? '').trim() || undefined,
        proposedYear: form.get('proposedYear')
          ? Number(form.get('proposedYear'))
          : undefined,
        resources: resources.map(({ key: _key, ...resource }) => ({
          ...resource,
          url: resource.url.trim(),
          title: resource.title?.trim() || undefined,
          note: resource.note?.trim() || undefined,
          rightsNote: resource.rightsNote?.trim() || undefined,
        })),
        creditConsent: form.get('creditConsent') === 'on',
      });
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success')
    return (
      <main className='vinyl-striped-bg min-h-screen px-4 py-20 text-[#29231d]'>
        <section className='mx-auto max-w-2xl rounded-2xl border border-[#d1c4ae] bg-[#EDE2D0] p-8 text-center shadow-lg'>
          <div className='mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#dfe8d6] text-2xl text-[#41623c]'>
            ✓
          </div>
          <h1 className='font-serif text-3xl'>{t.successTitle}</h1>
          <p className='mx-auto mt-3 max-w-lg leading-7 text-[#685f54]'>
            {t.successDescription}
          </p>
          <div className='mt-7 flex justify-center gap-3'>
            <button
              onClick={() => setState('idle')}
              className='rounded-full border border-[#a34924] px-5 py-2.5 font-semibold text-[#a34924]'
            >
              {t.again}
            </button>
            <Link
              href={`/${routeLocale}/archive`}
              className='rounded-full bg-[#a34924] px-5 py-2.5 font-semibold text-white'
            >
              {t.explore}
            </Link>
          </div>
        </section>
      </main>
    );

  return (
    <main className='vinyl-striped-bg min-h-screen px-4 py-12 text-[#EFE3CD] sm:py-20'>
      <div className='mx-auto max-w-4xl'>
        <header className='flex items-start justify-between gap-6 border-b border-[#6B4A2A] pb-8'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[.28em] text-[#E9A074]'>
              {t.eyebrow}
            </p>
            <h1 className='mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl'>
              {t.title}
            </h1>
            <p className='mt-4 max-w-xl leading-7 text-[#C4B298]'>
              {t.description}
            </p>
          </div>
          <LocaleSwitch locale={routeLocale} />
        </header>
        <form
          onSubmit={submit}
          className='mt-10 rounded-2xl border border-[#d1c4ae] bg-[#EDE2D0] p-6 text-[#29231d] shadow-[0_16px_40px_rgba(0,0,0,.16)] sm:p-9'
        >
          <div className='flex items-center gap-4 border-b border-[#ded3c1] pb-7'>
            <div className='grid h-11 w-11 place-items-center rounded-full bg-[#e8dac2] text-[#7b452e]'>
              <UserRound size={20} />
            </div>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[.16em] text-[#817465]'>
                {t.identity}
              </p>
              <p className='mt-1 font-semibold'>
                {user?.fullName || user?.email}
              </p>
              {user?.fullName && (
                <p className='text-sm text-[#74695c]'>{user.email}</p>
              )}
            </div>
          </div>
          <section className='mt-8'>
            <h2 className='mb-4 font-serif text-xl'>{t.typeStep}</h2>
            <ContributionTypeSelector
              value={type}
              onChange={setType}
              labels={t.types}
            />
          </section>
          <section className='mt-8'>
            <h2 className='mb-4 font-serif text-xl'>{t.languageStep}</h2>
            <div className='flex gap-3'>
              {(['vi', 'en'] as Locale[]).map(value => (
                <button
                  key={value}
                  type='button'
                  onClick={() => setContributionLocale(value)}
                  aria-pressed={contributionLocale === value}
                  className={`rounded-full border px-5 py-2 font-semibold ${contributionLocale === value ? 'border-[#a34924] bg-[#a34924] text-white' : 'border-[#c9bda9] bg-white'}`}
                >
                  {value === 'vi' ? t.vietnamese : t.english}
                </button>
              ))}
            </div>
          </section>
          <section className='mt-8'>
            <h2 className='mb-4 font-serif text-xl'>{t.targetStep}</h2>
            {type === 'NEW_RECORDING' ? (
              <div className='grid gap-5 sm:grid-cols-2'>
                <label className='font-semibold sm:col-span-2'>
                  {t.proposedTitle} *
                  <input
                    name='proposedRecordingTitle'
                    required
                    maxLength={255}
                    placeholder={t.proposedTitlePlaceholder}
                    className={fieldClass}
                  />
                </label>
                <label className='font-semibold'>
                  {t.proposedArtist}
                  <input
                    name='proposedArtistName'
                    maxLength={255}
                    className={fieldClass}
                  />
                </label>
                <label className='font-semibold'>
                  {t.proposedYear}
                  <input
                    name='proposedYear'
                    type='number'
                    min={1800}
                    max={2100}
                    className={fieldClass}
                  />
                </label>
              </div>
            ) : (
              <label className='block font-semibold'>
                {t.recording} *
                <select name='recordingId' required className={fieldClass}>
                  <option value=''>
                    {recordings.isLoading ? '…' : t.recordingPlaceholder}
                  </option>
                  {recordings.data?.data.map(recording => (
                    <option key={recording.id} value={recording.id}>
                      {recording.translation?.title || recording.slug}
                    </option>
                  ))}
                </select>
                {recordings.isError && (
                  <span className='mt-1 block text-sm text-red-700'>
                    {t.recordingsError}
                  </span>
                )}
              </label>
            )}
          </section>
          <section className='mt-8 space-y-5'>
            <h2 className='font-serif text-xl'>{t.contributionStep}</h2>
            <label className='block font-semibold'>
              {t.subject} *
              <input
                name='title'
                required
                maxLength={200}
                placeholder={t.subjectPlaceholder}
                className={fieldClass}
              />
            </label>
            <label className='block font-semibold'>
              {t.content} *
              <textarea
                name='content'
                required
                maxLength={10000}
                rows={8}
                placeholder={t.contentPlaceholder}
                className='mt-2 w-full rounded-sm border border-[#c9bda9] bg-white p-4 font-normal outline-none focus:border-[#a34924]'
              />
            </label>
          </section>
          <section className='mt-8'>
            <h2 className='mb-4 font-serif text-xl'>{t.resourcesStep}</h2>
            <ContributionResourceFields
              resources={resources}
              onChange={setResources}
              labels={{
                add: t.addResource,
                remove: t.removeResource,
                type: t.resourceType,
                url: t.resourceUrl,
                title: t.resourceTitle,
                note: t.resourceNote,
                rights: t.rightsNote,
                types: t.resourceTypes,
              }}
            />
          </section>
          <section className='mt-8'>
            <h2 className='mb-4 font-serif text-xl'>{t.creditStep}</h2>
            <label className='flex items-start gap-3 rounded-sm border border-[#ded3c1] bg-white p-4 leading-6'>
              <input
                name='creditConsent'
                type='checkbox'
                className='mt-1 h-4 w-4 accent-[#a34924]'
              />
              <span>{t.creditConsent}</span>
            </label>
          </section>
          <div className='mt-8 flex flex-col items-start justify-between gap-5 border-t border-[#ded3c1] pt-6 sm:flex-row sm:items-center'>
            <p className='max-w-md text-sm leading-6 text-[#74695c]'>
              {t.disclaimer}
            </p>
            <button
              disabled={state === 'submitting'}
              className='flex shrink-0 items-center gap-2 rounded-full bg-[#a34924] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              {state === 'submitting' && (
                <LoaderCircle className='animate-spin' size={18} />
              )}{' '}
              {state === 'submitting' ? t.submitting : t.submit}
            </button>
          </div>
          {(validationError || state === 'error') && (
            <p
              role='alert'
              className='mt-4 rounded-sm bg-red-50 p-3 text-sm text-red-800'
            >
              {validationError || t.error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
