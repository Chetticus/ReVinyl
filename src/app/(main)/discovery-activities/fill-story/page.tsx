'use client';

import React from 'react';
import { useChallengePage } from '@/hooks/useChallengePage';
import ChallengeLayout from '@/components/challenge/ChallengeLayout';
import ChallengeContent from '@/components/challenge/ChallengeContent';

const StoryPage = () => {
  const {
    activeCategory,
    getListChallenge,
    handleCategoryChange,
    handleSearchChange,
    handleQuestionClick,
  } = useChallengePage({
    type: 'fillBlank',
    defaultCategory: 'dien-khuyet',
    routePrefix: '/discovery-activities/fill-story',
  });

  return (
    <ChallengeLayout
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
    >
      <ChallengeContent
        title='Điền từ'
        questions={getListChallenge?.data?.data || []}
        onSearchChange={handleSearchChange}
        onQuestionClick={handleQuestionClick}
      />
    </ChallengeLayout>
  );
};

export default StoryPage;
