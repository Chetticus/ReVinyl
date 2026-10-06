import React from 'react';
import ChallengeSearch from './ChallengeSearch';
import ChallengeQuestionCard from './ChallengeQuestionCard';
import ChallengeEmptyState from './ChallengeEmptyState';

interface ChallengeQuestion {
  id: string;
  title: string;
  description: string;
  maxScore?: number;
  status?: string;
}

interface ChallengeContentProps {
  title: string;
  questions: ChallengeQuestion[];
  onSearchChange: (query: string) => void;
  onQuestionClick: (questionId: string) => void;
  showMaxScore?: boolean;
  useStatus?: boolean;
  searchPlaceholder?: string;
}

const ChallengeContent: React.FC<ChallengeContentProps> = ({
  title,
  questions,
  onSearchChange,
  onQuestionClick,
  searchPlaceholder = 'Tìm kiếm...',
}) => {
  return (
    <>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h1>

      {/* Filters */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center'>
        {/* Search Input */}
        <ChallengeSearch
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Questions List */}
      <div className='space-y-4'>
        {questions.map(question => (
          <ChallengeQuestionCard
            key={question.id}
            question={question}
            onClick={onQuestionClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {questions.length === 0 && <ChallengeEmptyState />}
    </>
  );
};

export default ChallengeContent;
