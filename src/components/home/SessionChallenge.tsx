'use client';

import CardChallenge from '@/components/home/component-home/CardChallenge';
import {
  CardChallenge1,
  CardChallenge2,
  CardChallenge3,
  CardChallenge4,
} from '@/constants/images';
import './index.css';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import { CourseTab } from '@/components/course/course-tab';
import React from 'react';

const listChallenge = [
  {
    image: CardChallenge1,
    description: 'Thử thách trí tuệ, khám phá những kiến thức bất ngờ.',
    tag: 'Câu hỏi vui',
    route: ERouteTable.CHALLENGE_QUIZ,
    backgroundColor: '#4CAF5014',
  },
  {
    image: CardChallenge2,
    description: 'Rèn luyện tư duy logic và khả năng tổ chức.',
    tag: 'Sắp xếp',
    route: ERouteTable.CHALLENGE_TIMELINE,
    backgroundColor: '#F4433614',
  },
  {
    image: CardChallenge3,
    description: 'Phát triển tư duy không gian và khả năng quan sát.',
    tag: 'Ghép hình',
    route: ERouteTable.CHALLENGE_PUZZLE,
    backgroundColor: '#FF980014',
  },
  {
    image: CardChallenge4,
    description: 'Kiểm tra và củng cố kiến thức một cách thú vị.',
    tag: 'Điền từ',
    route: ERouteTable.CHALLENGE_FILL_STORY,
    backgroundColor: '#03A9F414',
  },
];

export default function SessionChallenge() {
  const router = useRouter();

  return (
    <div className='bg-white w-full px-4 md:px-20 md:py-20 py-14'>
      <div className='flex flex-col gap-4 justify-center items-center max-w-[1200px] mx-auto'>
        <div className='text-primary-main mb-4 w-max flex items-center font-semibold bg-[#2F57EF14] rounded-full h-12 px-4'>
          Thử thách
        </div>
        <div className='text-4xl font-extrabold'>Rèn luyện kỹ năng</div>
        <div className='text-[#212B36] mt-1'>
          Kiểm tra kiến thức, rinh ngay điểm cao!
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {listChallenge.map(it => (
            <div
              key={it.tag}
              className='cursor-pointer transition-transform hover:scale-[1.02]'
              onClick={() => router.push(it.route)}
              role='button'
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  router.push(it.route);
                }
              }}
            >
              <CardChallenge
                image={it.image as unknown as string}
                description={it.description}
                tag={it.tag}
                backgroundColor={it.backgroundColor}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
