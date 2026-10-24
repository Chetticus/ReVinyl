import type { ArchiveRecording } from './types';

export const featuredSlugs = [
  'rieng-mot-goc-troi-tuan-ngoc-1996',
  'diem-xua-khanh-ly-1990',
  'tinh-ca-thai-thanh-1986',
  'canh-hong-phai-bang-kieu-2020',
];

/** Keep the curated order; fill missing releases with a different known artist. */
export function selectFeaturedRecordings(records: ArchiveRecording[]) {
  const selected: ArchiveRecording[] = [];
  const artists = new Set<string>();
  const candidates = [
    ...featuredSlugs.flatMap(slug =>
      records.filter(item => item.slug === slug)
    ),
    ...records,
  ];
  for (const item of candidates) {
    const artist = item.artist?.slug ?? item.artist?.id;
    if (!artist || artists.has(artist) || item.slug === 'trong-com') continue;
    artists.add(artist);
    selected.push(item);
    if (selected.length === 4) break;
  }
  return selected;
}
