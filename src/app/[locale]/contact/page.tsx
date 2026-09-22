import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import ContactContent from '@/components/contact/vinyl/ContactContent';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
const font = Public_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-public-sans',
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getDictionary(locale).metadata;
  return {
    title: m.contactTitle,
    description: m.contactDescription,
    openGraph: { title: m.contactTitle, description: m.contactDescription },
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { vi: '/vi/contact', en: '/en/contact' },
    },
  };
}
export default function Page() {
  return (
    <div
      className={`${font.variable} vinyl-striped-bg font-[family-name:var(--font-public-sans)]`}
    >
      <ContactContent />
    </div>
  );
}
