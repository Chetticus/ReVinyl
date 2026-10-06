import { ArrowRight } from 'lucide-react';
import { ArrowRotateLeft } from 'iconsax-react';
import { useQuizStore } from '@/stores/lesson.slice';

interface ItemQuizProps {
  changeTab: (tab: string) => void;
  type?: 'quiz' | 'practice';
  data?: any; // Quiz data from API
  dataTracking?: any;
  dataCourse?: any;
  setAttemptId?: any;
}

export default function ItemQuiz({
  changeTab,
  data,
  dataTracking,
}: ItemQuizProps) {
  const setQuizStarted = useQuizStore(state => state.setQuizStarted);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    changeTab('quizStep2');
  };

  // Calculate quiz statistics
  const getQuizStats = () => {
    if (!data)
      return {
        maxScore: 100,
        passingScore: 80,
        duration: 30,
        questionCount: 0,
      };

    return {
      maxScore: data.maxScore || 100,
      passingScore: data.passingScore || 80,
      duration: data.duration || 30,
      questionCount: data.questions?.length || 0,
    };
  };

  const stats = getQuizStats();
  const hasAttempts = dataTracking?.totalAttempt > 0;
  const canRetry =
    hasAttempts && dataTracking?.totalAttempt < (data?.maxAttempts || 3);

  return (
    <div className='w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex-shrink-0'>
      <div className='flex justify-between flex-shrink-0'>
        <div>
          <div className='text-lg font-semibold'>
            {data?.title || 'Bài kiểm tra'}
          </div>
          <div className='text-sm font-normal text-secondary'>
            Bạn cần ít nhất {stats.passingScore}% điểm để vượt qua.
          </div>

          {/* Quiz description */}
          {data?.description && (
            <div className='text-sm text-gray-600 mt-2'>{data.description}</div>
          )}

          <div className='flex items-center gap-8 mt-4'>
            <div>
              <div className='text-sm font-semibold text-gray-700'>
                Số câu hỏi
              </div>
              <div className='text-sm font-normal text-gray-500'>
                {stats.questionCount} câu
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          {/* Start/Retry button */}
          <div
            onClick={handleStartQuiz}
            role='presentation'
            className={`cursor-pointer px-4 py-2 h-max gap-1 flex-shrink-0 flex rounded-xl text-white text-sm font-semibold ${
              canRetry || !hasAttempts
                ? 'bg-[#2F57EF] hover:bg-[#1e3a8a]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {hasAttempts ? 'Thử lại' : 'Bắt đầu'}
            {hasAttempts ? (
              <ArrowRotateLeft size='20' color='#fff' />
            ) : (
              <ArrowRight size='20' color='#fff' />
            )}
          </div>

          {/* Attempt limit warning */}
          {hasAttempts && !canRetry && (
            <div className='text-xs text-red-500 text-center'>
              Đã hết lượt thử
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
