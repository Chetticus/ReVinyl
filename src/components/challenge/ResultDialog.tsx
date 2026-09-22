import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { BannerDialogResult } from '@/constants/images';
import Image from 'next/image';
import { ArrowRotateLeft, Task } from 'iconsax-react';

interface ResultDialogProps {
  open: boolean;
  score: number;
  maxScore: number;
  handleExitQuiz: () => void;
  handleRetry?: () => void;
  handleViewAnswer?: () => void;
  handleClose: () => void;
}

export const ResultDialog: React.FC<ResultDialogProps> = ({
  open,
  score,
  maxScore,
  handleExitQuiz,
  handleRetry,
  handleViewAnswer,
  handleClose,
}) => {
  const percentScore = (score / maxScore) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='w-[95vw] max-w-[440px] sm:max-w-[600px] lg:max-w-[800px] p-4 sm:p-6'>
        <DialogTitle className='sr-only'>Kết quả bài kiểm tra</DialogTitle>
        <div className='flex flex-col lg:flex-row items-center gap-4 w-full'>
          {/* Image - Hidden on mobile, shown on tablet and desktop */}
          <Image
            src={BannerDialogResult}
            alt='Avatar'
            width={300}
            height={300}
            className='hidden sm:block w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px] object-contain'
          />

          {/* Content Section */}
          <div className='w-full lg:!w-[320px] flex flex-col items-center'>
            {/* Title */}
            <div
              className={`${percentScore > 50 ? 'text-[#4CAF50]' : 'text-red-700'} text-lg sm:text-xl font-bold text-center`}
            >
              {percentScore > 50
                ? 'Bạn thật xuất sắc!'
                : 'Bạn cần cố gắng hơn!'}
            </div>

            {/* Score Display */}
            <div className='font-semibold my-2 text-center text-sm sm:text-base'>
              Bạn đã đạt được:{' '}
              <span className='text-red-700'>
                {score}/{maxScore}
              </span>{' '}
              điểm!
            </div>

            {/* Max Score */}
            <div className='my-2 text-center text-sm sm:text-base'>
              Điểm cao nhất:{' '}
              <span className='font-semibold'>
                {' '}
                {maxScore}/{maxScore}
              </span>
            </div>

            {/* Exit Button */}
            <div
              onClick={handleExitQuiz}
              role='presentation'
              className='bg-[#212B36] cursor-pointer text-white font-semibold w-full justify-center flex py-2 sm:py-3 rounded-2xl text-sm sm:text-base'
            >
              Quay lại danh sách
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-2 mt-2 w-full justify-center'>
              <div
                role='presentation'
                onClick={handleRetry}
                className='text-[#212B36] cursor-pointer flex items-center justify-center gap-2 px-4 sm:px-6 py-2 border-2 border-[#919EAB52] rounded-lg text-sm sm:text-base'
              >
                <ArrowRotateLeft
                  size='18'
                  color='#212B36'
                  className='sm:w-5 sm:h-5'
                />
                Chơi lại
              </div>
              <div
                onClick={handleViewAnswer}
                role='presentation'
                className='text-[#212B36] cursor-pointer flex items-center justify-center gap-2 px-4 sm:px-6 py-2 border-2 border-[#919EAB52] rounded-lg text-sm sm:text-base'
              >
                <Task size='18' color='#212B36' className='sm:w-5 sm:h-5' />
                Xem đáp án
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
