import React from 'react';
import BannerHeader from './BannerHeader';
import ChallengeSidebar from './ChallengeSidebar';
import { challengeCategories } from '@/constants/challenges';

interface ChallengeLayoutProps {
  activeCategory: string;
  onCategoryChange: (category: any) => void;
  children: React.ReactNode;
}

const ChallengeLayout: React.FC<ChallengeLayoutProps> = ({
  activeCategory,
  onCategoryChange,
  children,
}) => {
  return (
    <div className='bg-white pb-32'>
      <BannerHeader />

      {/* Main Content */}
      <div className='container mx-auto px-4 md:px-6 lg:px-8 relative mt-16 z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Left Sidebar */}
          <ChallengeSidebar
            categories={challengeCategories}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />

          {/* Right Content */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-2xl p-6'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeLayout;
