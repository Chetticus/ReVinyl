'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMyScore, useLeaderboard } from '@/modules/auth/hooks/useUser';
import IconScoreStudy from '../../../../../public/icon-svg/dashboard/IconScoreStudy';
import IconScoreChallenge from '../../../../../public/icon-svg/dashboard/IconScoreChallenge';
import IconScoreQuiz from '../../../../../public/icon-svg/dashboard/IconScoreQuiz';
import IconScoreTimeLine from '../../../../../public/icon-svg/dashboard/IconScoreTimeLine';
import IconScorePuzze from '../../../../../public/icon-svg/dashboard/IconScorePuzze';
import IconScoreFillData from '../../../../../public/icon-svg/dashboard/IconScoreFillData';

function PersonaAchievementPage() {
  const {
    data: myScoreData,
    isLoading: isLoadingScore,
    error: scoreError,
  } = useMyScore();
  const {
    data: leaderboardData,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = useLeaderboard({
    limit: 50,
  });

  const stats = useMemo(() => {
    if (!myScoreData) {
      return {
        studyPoints: 0,
        challengePoints: 0,
        questions: 0,
        timeline: 0,
        puzzle: 0,
        fillInBlank: 0,
      };
    }

    return {
      studyPoints: myScoreData.lessonScore,
      challengePoints: myScoreData.challengeScore.total,
      questions: myScoreData.challengeScore.quiz,
      timeline: myScoreData.challengeScore.ordering,
      puzzle: myScoreData.challengeScore.puzzle,
      fillInBlank: myScoreData.challengeScore.fillBlank,
    };
  }, [myScoreData]);

  const leaderboard = useMemo(() => {
    if (!leaderboardData) return [];

    return leaderboardData.map(user => ({
      id: user.id,
      name: user.fullName,
      rank: user.rank,
      score: user.total_score,
      avatar: user.avatar || '/images/common/avatar-kid.png',
    }));
  }, [leaderboardData]);

  if (isLoadingScore || isLoadingLeaderboard) {
    return (
      <div className='bg-white shadow h-max p-6 rounded-2xl'>
        <h2 className='text-2xl font-semibold mb-6'>Thành tích cá nhân</h2>
        <div className='flex justify-center items-center py-12'>
          <div className='text-gray-500'>Đang tải...</div>
        </div>
      </div>
    );
  }

  if (scoreError || leaderboardError) {
    return (
      <div className='bg-white shadow h-max p-6 rounded-2xl'>
        <h2 className='text-2xl font-semibold mb-6'>Thành tích cá nhân</h2>
        <div className='text-center py-12'>
          <p className='text-red-500'>
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white shadow h-max p-6 rounded-2xl'>
      <h2 className='text-2xl font-semibold mb-6'>Thành tích cá nhân</h2>

      {/* Main Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Study Points Card */}
        <Card className='bg-gray-50'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>
                Điểm khám phá hiện tại
              </h3>
              <IconScoreStudy />
            </div>
            <div className='text-4xl font-bold text-primary-main mb-2'>
              {stats.studyPoints.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Challenge Points Card */}
        {/* <Card className='bg-gray-50'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>
                Điểm trò chơi thử thách
              </h3>
              <IconScoreChallenge />
            </div>
            <div className='text-4xl font-bold text-[#4CAF50] mb-2'>
              {stats.challengePoints.toLocaleString()}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Leaderboard Section */}
      <div>
        <h3 className='text-xl font-semibold mb-4'>Bảng xếp hạng</h3>

        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
          {/* Table Header */}
          <div className='bg-gray-50 px-6 py-3 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-500'>Tên</span>
              <div className='flex items-center gap-8'>
                <span className='text-sm font-medium text-gray-500'>Hạng</span>
                <span className='text-sm font-medium text-gray-500'>Điểm</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-200'>
            {leaderboard.map(user => (
              <div key={user.id} className='px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <span className='font-medium text-gray-900'>
                      {user.name}
                    </span>
                  </div>
                  <div className='flex items-center gap-8'>
                    <span className='text-gray-600 text-center'>
                      {user.rank}
                    </span>
                    <span className='font-semibold text-gray-900 w-16 text-right'>
                      {user.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonaAchievementPage;
