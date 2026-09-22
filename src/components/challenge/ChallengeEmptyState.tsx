import React from 'react';

interface ChallengeEmptyStateProps {
  message?: string;
}

const ChallengeEmptyState: React.FC<ChallengeEmptyStateProps> = ({
  message = 'Không tìm thấy câu hỏi nào',
}) => {
  return (
    <div className='text-center py-8'>
      <p className='text-gray-500'>{message}</p>
    </div>
  );
};

export default ChallengeEmptyState;
