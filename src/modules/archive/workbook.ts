import source from '../../data/archive-workbook.json';
import type {
  ArchiveLookup,
  ArchiveRecording,
  ArchiveResponse,
  Locale,
  Lookups,
} from './types';

type WorkbookRecording = Omit<
  ArchiveRecording,
  'updatedAt' | 'requestedTranslationAvailable'
>;
const recordings: WorkbookRecording[] =
  source.recordings as WorkbookRecording[];
export const workbookLookups = source.lookups as Lookups;
export const usesWorkbookArchive =
  process.env.NEXT_PUBLIC_ARCHIVE_SOURCE === 'workbook';

function localize(record: WorkbookRecording, locale: Locale): ArchiveRecording {
  const requested = record.translations.find(item => item.locale === locale);
  return {
    ...record,
    translation:
      requested ?? record.translations.find(item => item.locale === 'vi'),
    requestedTranslationAvailable: Boolean(requested),
    era: record.era && {
      ...record.era,
      translation: record.era.translations?.find(
        item => item.locale === locale
      ),
    },
  };
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
const positiveInteger = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export function listWorkbookRecordings(
  params: Record<string, string | number | undefined>
): ArchiveResponse {
  const locale: Locale = params.locale === 'en' ? 'en' : 'vi';
  const search = normalize(String(params.search ?? '').trim());
  const filtered = recordings.filter(record => {
    if (
      search &&
      !normalize(
        [
          record.slug,
          record.artist?.name,
          record.album?.title,
          ...record.translations.flatMap(item => [
            item.title,
            item.alternativeTitle,
          ]),
        ]
          .filter(Boolean)
          .join(' ')
      ).includes(search)
    )
      return false;
    for (const key of ['artist', 'album', 'era', 'genre', 'region'] as const) {
      if (params[key] && record[key]?.slug !== params[key]) return false;
    }
    if (
      params.instrument &&
      !record.instruments.some(
        item => item.instrument.slug === params.instrument
      )
    )
      return false;
    return !params.status || record.status === params.status;
  });
  const perPage = Math.min(positiveInteger(params.perPage, 12), 100);
  const totalPages = Math.ceil(filtered.length / perPage);
  const page = positiveInteger(params.page, 1);
  return {
    data: filtered
      .slice((page - 1) * perPage, page * perPage)
      .map(record => localize(record, locale)),
    total: filtered.length,
    page,
    perPage,
    totalPages,
  };
}

export function workbookRecordingDetail(
  slug: string,
  locale: Locale
): ArchiveRecording {
  const record = recordings.find(item => item.slug === slug);
  if (!record) throw new Error('Recording not found');
  return {
    ...localize(record, locale),
    related: recordings
      .filter(
        item =>
          item.slug !== slug &&
          (item.artist?.slug === record.artist?.slug ||
            item.genre?.slug === record.genre?.slug)
      )
      .slice(0, 4)
      .map(item => localize(item, locale)),
  };
}

export function workbookTimeline(locale: Locale) {
  const unique = (items: (ArchiveLookup | undefined)[]) => [
    ...new Map(
      items
        .filter((item): item is ArchiveLookup => Boolean(item))
        .map(item => [item.id, item])
    ).values(),
  ];
  return [...workbookLookups.eras]
    .sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0))
    .map(era => {
      const entries = recordings.filter(
        record => record.era?.slug === era.slug
      );
      return {
        ...era,
        translation: era.translations?.find(item => item.locale === locale),
        recordings: entries.map(record => localize(record, locale)),
        artists: unique(entries.map(record => record.artist)),
        albums: unique(entries.map(record => record.album)).map(album => ({
          ...album,
          title: album.title ?? album.name ?? album.slug,
        })),
      };
    });
}
