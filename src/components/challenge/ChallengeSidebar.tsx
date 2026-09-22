import React from 'react';
import { useUserCourse } from '@/modules/auth/hooks/useUser';

interface ChallengeCategory {
  id: string;
  name: string;
  active: boolean;
}

interface ChallengeSidebarProps {
  categories: ChallengeCategory[];
  activeCategory: string;
  onCategoryChange: (category: any) => void;
}

const ChallengeSidebar: React.FC<ChallengeSidebarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const { getTotalScore } = useUserCourse();

  return (
    <div className='lg:col-span-1'>
      <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
        {/* Score Card */}
        <div className='mb-6'>
          <div className='flex justify-between items-center mb-4 bg-[#919EAB14] p-2 rounded-xl'>
            <span className='text-[#637381] text-sm'>Điểm của bạn</span>
            <span className='text-ld font-bold text-[#C98740] bg-[#DCB48429] p-2 rounded-xl'>
              {getTotalScore?.data?.totalScore || 0}
            </span>
          </div>
        </div>

        {/* Challenge Categories */}
        <div className='space-y-2'>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#BF2F1F14] text-primary-main'
                  : 'text-[#637381] hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSidebar;
