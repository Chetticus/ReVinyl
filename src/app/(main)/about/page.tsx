import { Public_Sans } from 'next/font/google';
import AboutBanner from '@/components/about/vinyl/AboutBanner';
import AboutIntroSection from '@/components/about/vinyl/AboutIntroSection';
import AboutWorkSection from '@/components/about/vinyl/AboutWorkSection';
import NewsletterSection from '@/components/home/vinyl/NewsletterSection';

const publicSans = Public_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-public-sans',
});

function AboutPage() {
  return (
    <div
      className={`${publicSans.variable} bg-[#FDF6F1] font-[family-name:var(--font-public-sans)]`}
    >
      <AboutBanner />
      <AboutIntroSection />
      <AboutWorkSection />
      <NewsletterSection />
    </div>
  );
}

export default AboutPage;
