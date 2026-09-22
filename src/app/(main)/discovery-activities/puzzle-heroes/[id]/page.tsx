'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ResultDialog } from '@/components/challenge/ResultDialog';
import {
  useChallengeDetail,
  useSubmitChallenge,
} from '@/modules/challenges/hooks/useChallenge';
import { PuzzleSubmitDto } from '@/modules/auth/infrastructure/challenge.api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface PuzzleTile {
  id: number;
  currentPosition: number;
  correctPosition: number;
  isEmpty: boolean;
}

const PuzzleHeroDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút = 180 giây
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [tiles, setTiles] = useState<PuzzleTile[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const listParam = {
    search: '',
    type: 'puzzle',
    page: 1,
    perPage: 10,
  };

  const { getChallengeDetail } = useChallengeDetail(params.id as string);
  const { submitChallengeMutation } = useSubmitChallenge();
  const challengeData = getChallengeDetail?.data;
  const puzzleData = challengeData?.puzzle;

  // Khởi tạo puzzle
  const initializePuzzle = useCallback(() => {
    const initialTiles: PuzzleTile[] = [];

    // Tạo 8 tiles (3x3 grid với 1 ô trống)
    for (let i = 0; i < 8; i++) {
      initialTiles.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        isEmpty: false,
      });
    }

    // Ô trống (vị trí cuối cùng)
    initialTiles.push({
      id: 8,
      currentPosition: 8,
      correctPosition: 8,
      isEmpty: true,
    });

    setTiles(initialTiles);
  }, []);

  // Shuffle puzzle
  const shufflePuzzle = useCallback(() => {
    setIsShuffling(true);
    const newTiles = [...tiles];

    // Shuffle logic đảm bảo puzzle có thể giải được
    for (let i = 0; i < 100; i++) {
      const emptyIndex = newTiles.findIndex(tile => tile.isEmpty);
      const possibleMoves = getPossibleMoves(emptyIndex);
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // Hoán đổi vị trí
      const temp = newTiles[emptyIndex].currentPosition;
      newTiles[emptyIndex].currentPosition =
        newTiles[randomMove].currentPosition;
      newTiles[randomMove].currentPosition = temp;

      // Cập nhật vị trí trong array
      [newTiles[emptyIndex], newTiles[randomMove]] = [
        newTiles[randomMove],
        newTiles[emptyIndex],
      ];
    }

    setTiles(newTiles);
    setIsShuffling(false);
    setIsGameStarted(true);
  }, [tiles]);

  // Lấy các nước đi có thể
  const getPossibleMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    // Lên
    if (row > 0) moves.push(emptyIndex - 3);
    // Xuống
    if (row < 2) moves.push(emptyIndex + 3);
    // Trái
    if (col > 0) moves.push(emptyIndex - 1);
    // Phải
    if (col < 2) moves.push(emptyIndex + 1);

    return moves;
  };

  // Xử lý click vào tile
  const handleTileClick = (clickedTileIndex: number) => {
    if (!isGameStarted || isCompleted || tiles[clickedTileIndex].isEmpty)
      return;

    const emptyIndex = tiles.findIndex(tile => tile.isEmpty);
    const possibleMoves = getPossibleMoves(emptyIndex);

    if (possibleMoves.includes(clickedTileIndex)) {
      const newTiles = [...tiles];

      // Hoán đổi vị trí
      const temp = newTiles[emptyIndex].currentPosition;
      newTiles[emptyIndex].currentPosition =
        newTiles[clickedTileIndex].currentPosition;
      newTiles[clickedTileIndex].currentPosition = temp;

      // Cập nhật vị trí trong array
      [newTiles[emptyIndex], newTiles[clickedTileIndex]] = [
        newTiles[clickedTileIndex],
        newTiles[emptyIndex],
      ];

      setTiles(newTiles);
      setMoves(prev => prev + 1);

      // Kiểm tra hoàn thành
      checkCompletion(newTiles);
    }
  };

  // Kiểm tra hoàn thành
  const checkCompletion = async (currentTiles: PuzzleTile[]) => {
    const isComplete = currentTiles.every(
      tile => tile.currentPosition === tile.correctPosition
    );
    if (isComplete) {
      setIsCompleted(true);
      setIsGameStarted(false);

      // Submit to API immediately when puzzle is completed
      await handleSubmitToAPI();
    }
  };

  // Handle submit to API
  const handleSubmitToAPI = async () => {
    const submitData: PuzzleSubmitDto = {
      puzzle: {
        score: 100,
      },
    };

    try {
      const result = await submitChallengeMutation.mutateAsync({
        challengeId: params.id as string,
        data: submitData,
      });

      // Handle successful submission
      setSubmittedScore(result.score !== undefined ? result.score : 100);
      queryClient.invalidateQueries({
        queryKey: ['list challenge', listParam],
      });
    } catch (error: any) {
      console.error('Submit challenge error:', error);
      // Still set score even if API fails
      setSubmittedScore(100);
    }
  };

  // Handle view result and submit
  const handleViewResultAndSubmit = async () => {
    // Show result dialog (submission already done when puzzle completed)
    setIsCompleted(true);
  };

  // Timer
  useEffect(() => {
    if (isGameStarted && !isCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGameStarted, isCompleted, timeLeft]);

  // Khởi tạo puzzle khi component mount
  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  // Format thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    router.push('/discovery-activities/puzzle-heroes');
  };

  const handleComplete = () => {
    if (isCompleted) {
      handleViewResultAndSubmit();
    } else {
      // Nếu chưa hoàn thành, có thể hiển thị gợi ý
      toast.error(
        'Puzzle chưa hoàn thành! Hãy tiếp tục sắp xếp các mảnh ghép.'
      );
    }
  };

  // Loading state
  if (!challengeData || !puzzleData) {
    return (
      <div className='min-h-screen bg-white mt-10'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center py-8'>
              <p className='text-gray-500'>Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen mt-20'>
      {/* Header */}
      <div className='bg-white'>
        <div className='max-w-4xl mx-auto py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                {challengeData.title}
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {challengeData.description}
              </p>
            </div>
            <Button
              variant='outline'
              onClick={handleExit}
              className='bg-gray-800 text-white hover:bg-gray-700 border-gray-700'
            >
              Thoát
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8 bg-white shadow rounded-2xl mt-4'>
        {/* Progress Bar và Timer */}
        <div className='mb-8'>
          <div className='flex items-center justify-end mb-3'>
            <div className='text-lg'>{formatTime(timeLeft)}</div>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
            <div
              className='bg-orange-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${(timeLeft / 180) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Description */}
        <div className='flex justify-center gap-2 items-center mb-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              {puzzleData.instruction}
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Di chuyển các ô vuông để có được bức hình hoàn chỉnh
            </p>
          </div>
          <div className='flex-shrink-0'>
            <Image
              src={puzzleData.image || '/images/common/avatar-kid.png'}
              alt='Puzzle Image'
              width={96}
              height={96}
              className='w-full h-full object-cover rounded-xl'
            />
          </div>
        </div>

        {/* Game Area */}
        <div className='flex items-center justify-center'>
          <div className='flex-1 max-w-md mx-auto'>
            <div className='bg-white dark:bg-gray-800 shadow-xl p-1'>
              <div className='grid grid-cols-3 gap-2 aspect-square'>
                {tiles.map((tile, index) => (
                  <div
                    key={tile.id}
                    className={`
                      aspect-square rounded-lg cursor-pointer transition-all duration-300 
                      ${
                        tile.isEmpty
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                      }
                      ${!tile.isEmpty && isGameStarted ? 'hover:scale-105' : ''}
                    `}
                    onClick={() => handleTileClick(index)}
                  >
                    {!tile.isEmpty && (
                      <div className='w-full h-full flex items-center justify-center'>
                        <div
                          className='w-full h-full bg-cover bg-center rounded-lg'
                          style={{
                            backgroundImage: `url('${puzzleData.image || '/images/common/avatar-kid.png'}')`,
                            backgroundPosition: `${(tile.id % 3) * -100}% ${Math.floor(tile.id / 3) * -100}%`,
                            backgroundSize: '300% 300%',
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className='text-center mt-6'>
          <div className='flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-300'>
            <div>
              <span className='font-semibold'>Số nước đi:</span> {moves}
            </div>
            <div>
              <span className='font-semibold'>Trạng thái:</span>{' '}
              {isCompleted
                ? 'Hoàn thành'
                : isGameStarted
                  ? 'Đang chơi'
                  : 'Chưa bắt đầu'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center gap-4 mt-8'>
          {!isGameStarted && !isCompleted && (
            <Button
              onClick={shufflePuzzle}
              disabled={isShuffling}
              className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg'
            >
              {isShuffling ? 'Đang xáo trộn...' : 'Bắt đầu chơi'}
            </Button>
          )}

          {(isGameStarted || isCompleted) && (
            <Button
              onClick={handleComplete}
              className={`px-8 py-3 rounded-lg ${
                isCompleted
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {isCompleted ? 'Hoàn thành' : 'Kiểm tra'}
            </Button>
          )}
        </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className='mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center'>
            <h3 className='text-xl font-bold text-green-700 dark:text-green-400 mb-2'>
              🎉 Chúc mừng bạn đã hoàn thành!
            </h3>
            <p className='text-green-600 dark:text-green-300'>
              Bạn đã hoàn thành puzzle trong {moves} nước đi với thời gian còn
              lại {formatTime(timeLeft)}
            </p>
          </div>
        )}

        {/* Time Up Message */}
        {timeLeft === 0 && !isCompleted && (
          <div className='mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-center'>
            <h3 className='text-xl font-bold text-red-700 dark:text-red-400 mb-2'>
              ⏰ Hết thời gian!
            </h3>
            <p className='text-red-600 dark:text-red-300'>
              Thời gian đã hết. Bạn có muốn thử lại không?
            </p>
            <Button
              onClick={() => {
                setTimeLeft(180);
                setMoves(0);
                shufflePuzzle();
              }}
              className='mt-4 bg-red-500 hover:bg-red-600 text-white'
            >
              Thử lại
            </Button>
          </div>
        )}
      </div>

      <ResultDialog
        open={isCompleted}
        handleClose={() => setIsCompleted(false)}
        score={submittedScore !== null ? submittedScore : 0}
        maxScore={100}
        handleExitQuiz={handleExit}
        handleRetry={() => {
          setTimeLeft(180);
          setMoves(0);
          setSubmittedScore(null);
          setIsCompleted(false);
          shufflePuzzle();
        }}
      />
    </div>
  );
};

export default PuzzleHeroDetailPage;
