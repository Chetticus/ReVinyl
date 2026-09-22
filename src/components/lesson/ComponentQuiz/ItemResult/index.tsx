import { useEffect, useState } from 'react';

interface ItemResultProps {
  status?: 'overview' | 'submit-active' | 'submit-not-active';
  dataTracking?: {
    maxScore: number;
    maxScoreAttempt: number;
    totalAttempt: number;
    status: string;
  };
  data?: any; // Quiz data from API
  changeTab: (tab: string) => void;
  onQuizComplete?: (score: number, passed: boolean) => void;
  dataForLesson?: any;
}

export default function ItemResult(props: ItemResultProps) {
  const { dataTracking, dataForLesson } = props;
  const [status, setStatus] = useState<string>('overview');

  useEffect(() => {
    if (dataTracking) {
      if (dataTracking?.status) {
        setStatus(dataTracking.status);
      }
    }
  }, [dataTracking]);

  const renderClassName = () => {
    switch (status) {
      case 'overview':
        return 'w-full p-6 bg-white rounded-2xl border border-dashed border-gray-100 mt-4 shadow';
      case 'submit-active':
        return 'w-full p-6 bg-[#4CAF5014] rounded-2xl border border-dashed border-success mt-4 shadow';
      case 'submit-not-active':
        return 'w-full p-6 bg-[#F4433614] rounded-2xl border border-dashed border-error-main mt-4 shadow';
      default:
        return '';
    }
  };

  // Calculate status based on tracking data
  const getStatusInfo = () => {
    if (!dataForLesson?.isLearned) {
      return {
        status: 'overview',
        message: 'Bạn chưa nộp bài này',
        score: '--',
      };
    }

    return {
      status: dataForLesson?.maxScore ? 'submit-active' : 'submit-not-active',
      message: dataForLesson?.maxScore
        ? 'Chúc mừng! Bạn đã hoàn thành bài kiểm tra.'
        : 'Bạn cần cải thiện để vượt qua bài kiểm tra.',
      score: `${dataForLesson?.maxScore}`,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={renderClassName()}>
      <div className='flex justify-between'>
        <div>
          <div className='text-lg font-semibold'>Điểm cao nhất của bạn</div>
          <div className='text-sm font-normal text-secondary'>
            {statusInfo.message}
          </div>
          <div className='flex items-center gap-8 mt-4'>
            <div
              className={`text-3xl font-bold ${
                statusInfo.status === 'submit-active' && 'text-success'
              } ${statusInfo.status === 'submit-not-active' && 'text-error-main'}`}
            >
              {statusInfo.score}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
