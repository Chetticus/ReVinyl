'use client';

import * as React from 'react';

import {
  Crown,
  Trophy,
} from 'lucide-react';

interface LeaderboardCardProps {
  data?: any[];
}

export const LeaderboardCard = ({
  data = [],
}: LeaderboardCardProps) => {
  const defaultAvatar =
    '/images/common/avatar-kid.png';

  const sortedData = React.useMemo(() => {
    return [...data].sort(
      (a, b) => a.rank - b.rank
    );
  }, [data]);

  const firstPlace = sortedData.find(
    item => item.rank === 1
  );

  const remainingUsers = sortedData.filter(
    item => item.rank !== 1
  );

  return (
    <div className='overflow-hidden rounded-2xl border border-[#EAE5E1] bg-white shadow-[0_1px_2px_rgba(43,36,32,0.03)]'>
      {/* Header */}
      <div className='border-b border-[#F0ECE8] px-5 py-5 md:px-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E6]'>
            <Trophy
              size={19}
              className='text-[#E4722C]'
            />
          </div>

          <div>
            <h2 className='text-base font-bold text-[#292421]'>
              Bảng xếp hạng
            </h2>

            <p className='mt-0.5 text-xs text-[#928983]'>
              Người dùng nổi bật
            </p>
          </div>
        </div>
      </div>

      {/* First place */}
      {firstPlace && (
        <div className='px-5 pt-5 md:px-6'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF5EC] via-[#FFF9F4] to-[#F7EFE9] p-5'>
            <div className='absolute right-4 top-4'>
              <Crown
                size={25}
                className='text-[#D99A34]'
              />
            </div>

            <div className='flex items-center gap-4'>
              <div className='relative'>
                <img
                  src={
                    firstPlace?.avatar ||
                    defaultAvatar
                  }
                  alt={
                    firstPlace.fullName ||
                    'Người dùng'
                  }
                  className='h-16 w-16 rounded-full border-4 border-white object-cover shadow-sm'
                  onError={e => {
                    (
                      e.target as HTMLImageElement
                    ).src = defaultAvatar;
                  }}
                />

                <span className='absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#E4722C] px-1 text-[10px] font-bold text-white'>
                  1
                </span>
              </div>

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-bold text-[#292421]'>
                  {firstPlace.fullName}
                </p>

                <p className='mt-1 text-xs text-[#8A817B]'>
                  Dẫn đầu bảng xếp hạng
                </p>

                <div className='mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#D86626] shadow-sm'>
                  {firstPlace.total_score ?? 0}{' '}
                  điểm
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranking list */}
      <div className='space-y-1 px-3 py-4 md:px-4'>
        {remainingUsers.map(entry => (
          <div
            key={entry.id}
            className='group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#FAF7F4]'
          >
            <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3EFEC] text-xs font-bold text-[#766D67]'>
              {entry.rank}
            </div>

            <img
              src={
                entry?.avatar || defaultAvatar
              }
              alt={
                entry.fullName || 'Người dùng'
              }
              className='h-10 w-10 shrink-0 rounded-full border border-[#ECE6E2] object-cover'
              onError={e => {
                (
                  e.target as HTMLImageElement
                ).src = defaultAvatar;
              }}
            />

            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-[#3A3430]'>
                {entry.fullName}
              </p>

              <p className='mt-0.5 text-xs text-[#9A908A]'>
                {entry.total_score ?? 0} điểm
              </p>
            </div>
          </div>
        ))}

        {sortedData.length === 0 && (
          <div className='py-12 text-center'>
            <p className='text-sm font-medium text-[#746B65]'>
              Chưa có dữ liệu
            </p>

            <p className='mt-1 text-xs text-[#A29892]'>
              Bảng xếp hạng sẽ được cập nhật khi
              có hoạt động.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};