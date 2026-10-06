import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import Header from '@/components/common/header/Header';
import Footer from '@/components/common/Footer';
import { isLocale } from '@/i18n/archive';
import { LocaleDocument } from '@/components/archive/LocaleDocument';
import { PublicI18nProvider } from '@/i18n/PublicI18nProvider';
import { getDictionary } from '@/i18n/dictionaries';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['300', '400', '500', '600'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: getDictionary(locale).metadata.homeTitle,
    description: getDictionary(locale).metadata.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { vi: '/vi', en: '/en' },
    },
    openGraph: {
      title: getDictionary(locale).metadata.homeTitle,
      description: getDictionary(locale).metadata.homeDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <PublicI18nProvider locale={locale}>
      <LocaleDocument locale={locale} />
      <div
        className={`${cormorant.variable} ${jost.variable} font-[family-name:var(--font-jost)]`}
      >
        <Header />
        <main className='vinyl-striped-bg min-h-screen'>{children}</main>
        <Footer />
      </div>
    </PublicI18nProvider>
  );
}
