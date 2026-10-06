'use client';

import React from 'react';
import { ERouteTable } from '@/constants/route';
import { useChallengePage } from '@/hooks/useChallengePage';
import ChallengeLayout from '@/components/challenge/ChallengeLayout';
import ChallengeContent from '@/components/challenge/ChallengeContent';

const QuizzPage = () => {
  const {
    activeCategory,
    getListChallenge,
    handleCategoryChange,
    handleSearchChange,
    handleQuestionClick,
  } = useChallengePage({
    type: 'quiz',
    defaultCategory: 'cau-hoi-vui',
    routePrefix: ERouteTable.CHALLENGE_QUIZ,
  });

  return (
    <ChallengeLayout
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
    >
      <ChallengeContent
        title='Câu hỏi vui'
        questions={getListChallenge?.data?.data || []}
        onSearchChange={handleSearchChange}
        onQuestionClick={handleQuestionClick}
      />
    </ChallengeLayout>
  );
};

export default QuizzPage;
