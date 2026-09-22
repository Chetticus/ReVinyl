'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Locale, replacePathLocale } from '@/i18n/config';
export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const target = locale === 'vi' ? 'en' : 'vi';
  const query = searchParams.toString();
  const href = `${replacePathLocale(pathname, target)}${query ? `?${query}` : ''}`;
  return (
    <Link
      className='rounded-full border border-[var(--gold)] px-3 py-1 text-sm font-medium text-[var(--gold)]'
      href={href}
      scroll={false}
      onClick={event => {
        if (window.location.hash) {
          event.currentTarget.href = `${href}${window.location.hash}`;
        }
      }}
      aria-label={target === 'vi' ? 'Chuyển sang tiếng Việt' : 'Switch to English'}
    >
      {target.toUpperCase()}
    </Link>
  );
}
