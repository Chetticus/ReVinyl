'use client';

import { usePublicI18n } from '@/i18n/PublicI18nProvider';
import { usesWorkbookArchive } from '@/modules/archive/workbook';

export function WorkbookNotice() {
  const { locale } = usePublicI18n();
  if (!usesWorkbookArchive) return null;
  return (
    <p className='rounded-xl border border-[var(--gold)]/25 bg-[var(--wood-darkest)] p-4 text-sm leading-6 text-[var(--parchment-dim)]'>
      {locale === 'vi'
        ? 'Bản xem trước: 30 hồ sơ từ bộ tư liệu ReVinyl đang ở trạng thái bản nháp. Chưa có tệp âm thanh; các đường dẫn nguồn được cung cấp để đối chiếu.'
        : 'Preview: 30 records from the ReVinyl collection are drafts. Audio files are not yet available; source links are provided for reference.'}
    </p>
  );
}
