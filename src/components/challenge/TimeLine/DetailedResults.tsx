import React from 'react';
import { Menu } from 'iconsax-react';

interface DetailedResultsProps {
  challengeData: any;
  userItems: any[];
  submittedScore: number | null;
  onBack: () => void;
  onExit: () => void;
  onRetry: () => void;
}

const DetailedResults: React.FC<DetailedResultsProps> = ({
  challengeData,
  userItems,
  onBack,
  onExit,
  onRetry,
}) => {
  // Get correct order items with explanations
  const correctOrderItems =
    challengeData?.ordering?.items?.sort(
      (a: any, b: any) => a.correct_order - b.correct_order
    ) || [];

  // Check if user's answer was correct
  const userOrder = userItems.map(item => item.id);
  const correctOrder = correctOrderItems.map((item: any) => item.id);
  const isCorrect = correctOrder.every(
    (id: string, index: number) => id === userOrder[index]
  );

  return (
    <div className='min-h-screen bg-white mt-20'>
      <div className='max-w-4xl mx-auto p-4'>
        <div className='flex justify-between'>
          <div>
            <div className='text-xl font-bold'>
              {challengeData?.title || 'Timeline Challenge'}
            </div>
            <div>{challengeData?.description || 'Sắp xếp thời gian'}</div>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={onBack}
              className='cursor-pointer flex items-center justify-between text-gray-600 font-semibold py-[6px] px-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors'
            >
              Quay lại
            </button>
            <div
              onClick={onExit}
              className='cursor-pointer flex items-center justify-between text-white font-semibold py-[6px] px-4 bg-[#212B36] rounded-xl hover:bg-gray-700 transition-colors'
            >
              Thoát
            </div>
          </div>
        </div>

        <div className='mt-8 bg-white rounded-3xl shadow p-12'>
          {/* Progress Bar */}
          <div className='flex gap-2 w-full items-center mb-8'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                style={{ width: '100%' }}
              />
            </div>
            <span className='text-lg'>03:00</span>
          </div>

          {/* Instruction */}
          <div className='text-center font-semibold mt-4 mb-8'>
            {challengeData?.ordering?.instruction ||
              'Sắp xếp lại các sự kiện sao cho phù hợp với dòng thời gian'}
          </div>

          {/* User's Answer */}
          <div className='mb-8'>
            {userItems.map((item: any, index: number) => (
              <div key={`${item.id}-${index}`} className='mb-4'>
                <div className='flex gap-4 h-12 bg-[#919EAB14] w-full items-center px-4 rounded-xl'>
                  <Menu size='20' color='#919EAB' />
                  <div>{item.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Result Section */}
          <div className='border-t pt-8'>
            <div
              className={`font-semibold text-lg mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
            >
              {isCorrect ? 'Câu trả lời đúng!' : 'Câu trả lời sai.'}
            </div>

            <div className='mb-4'>
              <div className='font-semibold mb-3'>Đáp án đúng là:</div>
              <ul className='space-y-2'>
                {correctOrderItems.map((item: any, index: number) => (
                  <li key={`${item.id}-${index}`} className='flex items-start'>
                    <span className='mr-2 text-gray-500'>•</span>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-800'>
                        {item.content}
                      </span>
                      {item.explanation && (
                        <span className='text-sm text-gray-600 ml-4'>
                          {item.explanation}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-8 text-center'>
            <button
              onClick={onRetry}
              className='bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors hover:bg-blue-600 mr-4'
            >
              Thử lại
            </button>
            <button
              onClick={onExit}
              className='bg-[#212B36] text-white px-6 py-2 rounded-lg transition-colors hover:bg-gray-700'
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResults;
