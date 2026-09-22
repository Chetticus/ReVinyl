import HeroAboutExperience from '@/components/home/vinyl/HeroAboutExperience';
import CollectionSection from '@/components/home/vinyl/CollectionSection';
import NewsletterSection from '@/components/home/vinyl/NewsletterSection';
import ReviewerSection from '@/components/home/vinyl/ReviewerSection';
import StorySection from '@/components/home/vinyl/StorySection';
import ValueSection from '@/components/home/vinyl/ValueSection';

function HomePage() {
  return (
    <div className='vinyl-striped-bg'>
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
