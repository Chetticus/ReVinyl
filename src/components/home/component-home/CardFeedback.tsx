import Image from 'next/image';
import { AvatarKid, FeedbackTag } from '@/constants/images';
import React from 'react';
import { Review } from '@/modules/courses/domain/types';

interface ICardFeedbackProps {
  feedback: Review;
}

export default function CardFeedback({ feedback }: ICardFeedbackProps) {
  return (
    <div>
      <div className='bg-white shadow rounded-3xl w-[362px] relative'>
        <div className='p-8'>
          <div className='flex items-center gap-3'>
            <Image
              alt='Student Avatar'
              src={feedback?.user?.avatar ? feedback.user.avatar : AvatarKid}
              width={40}
              height={40}
              className='rounded-full !h-[40px] !w-[40px] border-2 border-[#DCB484]'
            />
            <div>
              <div className='text-[#212B36] font-semibold'>
                {feedback.user.fullName}
              </div>
              <div className='text-[#637381] text-sm'>Học viên</div>
            </div>
          </div>
          <div className='mt-3 text-[#637381]'>{feedback.comment}</div>
          <div className='flex text-[#FFB145] mt-3'>
            ★<span className='text-[#FFB145]'>★</span>
            <span className='text-[#FFB145]'>★</span>
            <span className='text-[#FFB145]'>★</span>
            <span className='text-[#FFB145]'>★</span>
          </div>
        </div>
        <Image
          alt='Challenge Image'
          src={FeedbackTag}
          className='w-14 absolute top-4 right-4'
        />
      </div>
    </div>
  );
}
