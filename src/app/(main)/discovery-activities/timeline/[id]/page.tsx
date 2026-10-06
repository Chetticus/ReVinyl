'use client';

import React, { useState, useEffect } from 'react';
import {
  useChallengeDetail,
  useSubmitChallenge,
} from '@/modules/challenges/hooks/useChallenge';
import { useParams, useRouter } from 'next/navigation';
import ItemDrag from '@/components/challenge/TimeLine/ItemDrag';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SubmitOrderingChallengeDto } from '@/modules/auth/infrastructure/challenge.api';
import { ResultDialog } from '@/components/challenge/ResultDialog';
import DetailedResults from '@/components/challenge/TimeLine/DetailedResults';
import { toast } from 'sonner';

const TimelineDetailPage = () => {
  const [timeLeft, setTimeLeft] = useState(180);
  const [items, setItems] = useState<any[]>([]);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { getChallengeDetail } = useChallengeDetail(params.id as string);
  const { submitChallengeMutation } = useSubmitChallenge();

  // Khởi tạo sensors cho drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Khởi tạo items khi data được load
  useEffect(() => {
    if (getChallengeDetail?.data?.ordering?.items) {
      setItems(getChallengeDetail.data.ordering.items);
    }
  }, [getChallengeDetail?.data?.ordering?.items]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tự động submit khi hết thời gian
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted, getChallengeDetail?.data?.ordering?.items]);

  // Handle time up
  const handleTimeUp = async () => {
    if (isCompleted || submitChallengeMutation.isPending) return; // Prevent double submission

    // Tính điểm khi hết thời gian (0 điểm nếu chưa hoàn thành đúng)
    const correctOrder =
      getChallengeDetail?.data?.ordering?.items
        ?.sort((a: any, b: any) => a.correct_order - b.correct_order)
        ?.map((item: any) => item.id) || [];

    const currentOrder = items.map(item => item.id);
    const isCorrectOrder = correctOrder.every(
      (id: string, index: number) => id === currentOrder[index]
    );

    // Tính điểm dựa trên độ chính xác
    const score = isCorrectOrder
      ? getChallengeDetail?.data?.ordering?.items?.length || 0
      : 0;

    console.log('🟢 Time up - Calling submitChallengeAPI() ...');

    // Prepare ordering data for API
    const orderingItems = items.map((item: any, index: number) => ({
      itemId: item.id,
      position: index,
    }));

    const submitData: SubmitOrderingChallengeDto = {
      ordering: {
        items: orderingItems,
      },
    };

    try {
      const result = await submitChallengeMutation.mutateAsync({
        challengeId: params.id as string,
        data: submitData,
      });

      setIsCompleted(true);
      setSubmittedScore(result.score !== undefined ? result.score : score);
    } catch (error) {
      console.error('Error in handleTimeUp:', error);
      // Still set as completed even if API fails to prevent infinite timer
      setIsCompleted(true);
      setSubmittedScore(score);
    }
  };

  // Xử lý khi drag kết thúc
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Kiểm tra kết quả và hoàn thành challenge
  const checkResult = async () => {
    if (isCompleted || submitChallengeMutation.isPending) return;

    const dataItems = getChallengeDetail?.data?.ordering?.items;
    if (!dataItems || dataItems.length === 0) {
      toast.error('Dữ liệu chưa tải xong!');
      return;
    }

    const correctOrder = [...dataItems]
      .sort((a, b) => a.correct_order - b.correct_order)
      .map(item => item.id);

    const currentOrder = items.map(item => item.id);

    const isCorrectOrder = correctOrder.every(
      (id, index) => id === currentOrder[index]
    );

    const score = isCorrectOrder ? dataItems.length : 0;

    console.log('🟢 Calling submitChallengeAPI() ...');

    // Prepare ordering data for API
    const orderingItems = items.map((item: any, index: number) => ({
      itemId: item.id,
      position: index,
    }));

    const submitData: SubmitOrderingChallengeDto = {
      ordering: {
        items: orderingItems,
      },
    };

    try {
      const result = await submitChallengeMutation.mutateAsync({
        challengeId: params.id as string,
        data: submitData,
      });

      setIsCompleted(true);
      setSubmittedScore(result.score !== undefined ? result.score : score);
    } catch (error) {
      console.error('Error in checkResult:', error);
      // Don't set isCompleted if submission failed
    }
  };

  // Handle exit challenge
  const handleExitChallenge = () => {
    router.push('/discovery-activities/timeline');
  };

  // Handle retry
  const handleRetry = () => {
    if (getChallengeDetail?.data?.ordering?.items) {
      setItems(getChallengeDetail.data.ordering.items);
    }

    setIsCompleted(false);
    setSubmittedScore(null);
    setShowDetailedResults(false);
    setTimeLeft(180);
  };

  // Handle view detailed results
  const handleViewAnswer = () => {
    setShowDetailedResults(true);
    setIsCompleted(false); // Close the result dialog to show detailed view
  };

  // Format thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render detailed results view
  if (showDetailedResults) {
    return (
      <DetailedResults
        challengeData={getChallengeDetail?.data}
        userItems={items}
        submittedScore={submittedScore}
        onBack={() => setShowDetailedResults(false)}
        onExit={handleExitChallenge}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className='min-h-screen bg-white mt-20'>
      <div className='max-w-4xl mx-auto p-4'>
        <div className='flex justify-between'>
          <div>
            <div className='text-xl font-bold'>
              {getChallengeDetail?.data?.title || 'Timeline Challenge'}
            </div>
            <div>
              {getChallengeDetail?.data?.description || 'Sắp xếp thời gian'}
            </div>
          </div>
          <div
            onClick={handleExitChallenge}
            className='cursor-pointer flex items-center justify-between text-white font-semibold py-[6px] px-4 bg-[#212B36] rounded-xl hover:bg-gray-700 transition-colors'
          >
            Thoát
          </div>
        </div>
        <div className='mt-8 bg-white rounded-3xl shadow p-12'>
          <div className='flex gap-2 w-full items-center'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                style={{ width: `${(timeLeft / 180) * 100}%` }}
              />
            </div>
            <span className='text-lg'>{formatTime(timeLeft)}</span>
          </div>
          <div className='text-center font-semibold mt-4 mb-8'>
            {getChallengeDetail?.data?.ordering?.instruction ||
              'Sắp xếp lại các sự kiện sao cho phù hợp với dòng thời gian'}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((it: any) => (
                <div key={it.id} className='mb-4'>
                  <ItemDrag item={it} />
                </div>
              ))}
            </SortableContext>
          </DndContext>

          <div className='mt-8 text-center'>
            <button
              onClick={async () => await checkResult()}
              disabled={submitChallengeMutation.isPending || isCompleted}
              className='bg-[#212B36] text-white px-6 py-2 rounded-lg transition-colors hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {submitChallengeMutation.isPending
                ? 'Đang xử lý...'
                : 'Hoàn thành'}
            </button>
          </div>
        </div>
      </div>

      {/* Result Dialog */}
      <ResultDialog
        open={isCompleted}
        handleClose={() => setIsCompleted(false)}
        score={submittedScore !== null ? submittedScore : 0}
        maxScore={getChallengeDetail?.data?.ordering?.items?.length || 0}
        handleExitQuiz={handleExitChallenge}
        handleRetry={handleRetry}
        handleViewAnswer={handleViewAnswer}
      />
    </div>
  );
};

export default TimelineDetailPage;
