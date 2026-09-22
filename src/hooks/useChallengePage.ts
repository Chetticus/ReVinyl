import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useListChallenge } from '@/modules/challenges/hooks/useChallenge';

interface UseChallengePageProps {
  type: 'fillBlank' | 'puzzle' | 'quiz' | 'ordering';
  defaultCategory: string;
  routePrefix: string;
}

export const useChallengePage = ({
  type,
  defaultCategory,
  routePrefix,
}: UseChallengePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const router = useRouter();

  const { getListChallenge } = useListChallenge({
    search: searchQuery,
    type,
    page: 1,
    perPage: 10,
  });

  const handleCategoryChange = (category: any) => {
    setActiveCategory(category.id);
    router.push(category.route);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleQuestionClick = (questionId: string) => {
    router.push(`${routePrefix}/${questionId}`);
  };

  return {
    searchQuery,
    activeCategory,
    getListChallenge,
    handleCategoryChange,
    handleSearchChange,
    handleQuestionClick,
  };
};
