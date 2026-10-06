import { Public_Sans, League_Gothic } from 'next/font/google';
import HeroAboutExperience from '@/components/home/vinyl/HeroAboutExperience';
import CollectionSection from '@/components/home/vinyl/CollectionSection';
import NewsletterSection from '@/components/home/vinyl/NewsletterSection';
import ReviewerSection from '@/components/home/vinyl/ReviewerSection';
import StorySection from '@/components/home/vinyl/StorySection';
import ValueSection from '@/components/home/vinyl/ValueSection';

const publicSans = Public_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-public-sans',
});

const leagueGothic = League_Gothic({
  subsets: ['latin'],
  variable: '--font-league-gothic',
  weight: '400',
});

function HomePage() {
  return (
    <div
      className={`${publicSans.variable} ${leagueGothic.variable} bg-[#FDF6F1] font-[family-name:var(--font-public-sans)]`}
    >
      <HeroAboutExperience />
      <CollectionSection />
      <StorySection />
      <ValueSection />
      <ReviewerSection />
      <NewsletterSection />
    </div>
  );
}

export default HomePage;
