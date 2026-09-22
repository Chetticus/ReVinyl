import React from 'react';

interface ChallengeQuestion {
  id: string;
  title: string;
  description: string;
  maxScore?: number;
  status?: string;
}

interface ChallengeQuestionCardProps {
  question: ChallengeQuestion;
  onClick: (questionId: string) => void;
  showMaxScore?: boolean;
}

const ChallengeQuestionCard: React.FC<ChallengeQuestionCardProps> = ({
  question,
  onClick,
  showMaxScore = true,
}) => {
  console.log(question);
  const isCompleted = question?.maxScore || 0 > 0;

  const maxScore = question.maxScore || 0;

  return (
    <div
      role='presentation'
      onClick={() => onClick(question.id)}
      className='bg-[#919EAB14] cursor-pointer rounded-lg p-4 hover:shadow-md transition-shadow'
    >
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <h3 className='font-semibold text-gray-900 mb-1'>
              {question.title}
            </h3>
            <p className='text-sm text-gray-600'>{question.description}</p>
          </div>
          {showMaxScore && (
            <div className='text-sm bg-[#919EAB29] p-1 rounded'>
              <span className='text-gray-500'>Điểm cao nhất: </span>
              <span className='font-medium text-gray-500'>{maxScore}</span>
            </div>
          )}
        </div>
        <div className='flex items-center flex-shrink-0'>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeQuestionCard;
