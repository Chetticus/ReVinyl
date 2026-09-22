import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import AboutBanner from '@/components/about/vinyl/AboutBanner';
import AboutIntroSection from '@/components/about/vinyl/AboutIntroSection';
import AboutWorkSection from '@/components/about/vinyl/AboutWorkSection';
import NewsletterSection from '@/components/home/vinyl/NewsletterSection';
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
    title: m.aboutTitle,
    description: m.aboutDescription,
    openGraph: { title: m.aboutTitle, description: m.aboutDescription },
    alternates: {
      canonical: `/${locale}/about`,
      languages: { vi: '/vi/about', en: '/en/about' },
    },
  };
}
export default function Page() {
  return (
    <div
      className={`${font.variable} vinyl-striped-bg font-[family-name:var(--font-public-sans)]`}
    >
      <AboutBanner />
      <AboutIntroSection />
      <AboutWorkSection />
      <NewsletterSection />
    </div>
  );
}
