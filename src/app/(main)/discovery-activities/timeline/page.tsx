'use client';

import React from 'react';
import { useChallengePage } from '@/hooks/useChallengePage';
import ChallengeLayout from '@/components/challenge/ChallengeLayout';
import ChallengeContent from '@/components/challenge/ChallengeContent';

const TimelinePage = () => {
  const {
    activeCategory,
    getListChallenge,
    handleCategoryChange,
    handleSearchChange,
    handleQuestionClick,
  } = useChallengePage({
    type: 'ordering',
    defaultCategory: 'sap-xep',
    routePrefix: '/discovery-activities/timeline',
  });

  // Transform data to match the expected format
  const transformedQuestions =
    getListChallenge?.data?.data?.map(question => ({
      ...question,
    })) || [];

  return (
    <ChallengeLayout
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
    >
      <ChallengeContent
        title='Sắp xếp'
        questions={transformedQuestions}
        onSearchChange={handleSearchChange}
        onQuestionClick={handleQuestionClick}
      />
    </ChallengeLayout>
  );
};

export default TimelinePage;
