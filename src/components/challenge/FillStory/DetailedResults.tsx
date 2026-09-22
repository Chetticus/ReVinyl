import React from 'react';
import { Button } from '@/components/ui/button';

interface DetailedResultsProps {
  challengeData: any;
  userAnswers: string[];
  submittedScore: number | null;
  onBack: () => void;
  onExit: () => void;
  onRetry: () => void;
}

const DetailedResults: React.FC<DetailedResultsProps> = ({
  challengeData,
  userAnswers,
  submittedScore,
  onBack,
  onExit,
  onRetry,
}) => {
  const questions = challengeData?.fillBlank?.questions || [];

  // Check if user's answer was correct
  const isCorrect = (userAnswer: string, correctWord: string) => {
    return (
      userAnswer?.toLowerCase()?.trim() === correctWord?.toLowerCase()?.trim()
    );
  };

  return (
    <div className='min-h-screen bg-white mt-20'>
      <div className='max-w-4xl mx-auto p-4'>
        <div className='flex justify-between'>
          <div>
            <div className='text-xl font-bold'>
              {challengeData?.title || 'Fill Story Challenge'}
            </div>
            <div>{challengeData?.description || 'Điền từ vào chỗ trống'}</div>
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

          {/* Score Display */}
          <div className='text-center mb-8'>
            <div className='text-2xl font-bold text-gray-900 mb-2'>
              Kết quả chi tiết
            </div>
            <div className='text-xl text-green-600'>
              Điểm số: {submittedScore !== null ? submittedScore : 0}/
              {questions.length}
            </div>
          </div>

          {/* Questions and Answers */}
          <div className='space-y-6'>
            {questions.map((question: any, index: number) => {
              const userAnswer = userAnswers[index] || '';
              const correct = isCorrect(userAnswer, question.correct_word);

              return (
                <div key={question.id} className='border rounded-lg p-6'>
                  <div className='mb-4'>
                    <div className='text-sm text-gray-500 mb-2'>
                      Câu {index + 1}
                    </div>
                    <div className='text-lg text-gray-800 leading-relaxed'>
                      {question.sentence
                        ?.split('____')
                        .map((part: string, partIndex: number) => (
                          <span key={partIndex}>
                            {part}
                            {partIndex <
                              question.sentence?.split('____').length - 1 && (
                              <span className='inline-block w-10 h-8 mx-2 border-b-2 border-dashed'></span>
                            )}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <div className='text-sm font-medium text-gray-700 mb-2'>
                        Câu trả lời của bạn:
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${
                          correct
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        {userAnswer || 'Chưa trả lời'}
                      </div>
                    </div>

                    <div>
                      <div className='text-sm font-medium text-gray-700 mb-2'>
                        Đáp án đúng:
                      </div>
                      <div className='p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800'>
                        {question.correct_word}
                      </div>
                    </div>
                  </div>

                  {!correct && (
                    <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                      <div className='text-sm font-medium text-yellow-800 mb-1'>
                        Giải thích:
                      </div>
                      <div className='text-sm text-yellow-700'>
                        Đáp án đúng là &#34;{question.correct_word}&#34;. Hãy
                        chú ý đến ngữ cảnh và ý nghĩa của câu.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className='mt-8 text-center'>
            <Button
              onClick={onRetry}
              className='bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors hover:bg-blue-600 mr-4'
            >
              Thử lại
            </Button>
            <Button
              onClick={onExit}
              className='bg-[#212B36] text-white px-6 py-2 rounded-lg transition-colors hover:bg-gray-700'
            >
              Hoàn thành
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResults;
