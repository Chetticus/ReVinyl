'use client';

import React from 'react';
import { ERouteTable } from '@/constants/route';
import { useChallengePage } from '@/hooks/useChallengePage';
import ChallengeLayout from '@/components/challenge/ChallengeLayout';
import ChallengeContent from '@/components/challenge/ChallengeContent';

const PuzzleHeroPage = () => {
  const {
    activeCategory,
    getListChallenge,
    handleCategoryChange,
    handleSearchChange,
    handleQuestionClick,
  } = useChallengePage({
    type: 'puzzle',
    defaultCategory: 'ghep-hinh',
    routePrefix: ERouteTable.CHALLENGE_PUZZLE,
  });

  return (
    <ChallengeLayout
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
    >
      <ChallengeContent
        title='Ghép hình'
        questions={getListChallenge?.data?.data || []}
        onSearchChange={handleSearchChange}
        onQuestionClick={handleQuestionClick}
      />
    </ChallengeLayout>
  );
};

export default PuzzleHeroPage;
