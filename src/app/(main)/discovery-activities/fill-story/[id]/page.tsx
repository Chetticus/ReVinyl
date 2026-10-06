'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ResultDialog } from '@/components/challenge/ResultDialog';
import {
  useChallengeDetail,
  useSubmitChallenge,
} from '@/modules/challenges/hooks/useChallenge';
import { SubmitFillBlankChallengeDto } from '@/modules/auth/infrastructure/challenge.api';
import { useQueryClient } from '@tanstack/react-query';
import DetailedResults from '@/components/challenge/FillStory/DetailedResults';

const StoryDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút = 180 giây
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [showModalResult, setShowModalResult] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [score, setScore] = useState(0);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const listParam = {
    search: '',
    type: 'fillBlank',
    page: 1,
    perPage: 10,
  };

  const { getChallengeDetail } = useChallengeDetail(params.id as string);
  const { submitChallengeMutation } = useSubmitChallenge();
  const challengeData = getChallengeDetail?.data;
  const fillBlankData = challengeData?.fillBlank;
  const questions = fillBlankData?.questions || [];

  // Initialize user answers array when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setUserAnswers(new Array(questions.length).fill(''));
    }
  }, [questions.length]);

  // Timer
  useEffect(() => {
    if (isGameStarted && !showResult && timeLeft > 0 && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameStarted(false);
            handleFinishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGameStarted, showResult, timeLeft, questions.length, userAnswers]);

  // Khởi tạo current answer từ user answers
  useEffect(() => {
    setCurrentAnswer(userAnswers[currentQuestion] || '');
  }, [currentQuestion, userAnswers]);

  // Format thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Xử lý thay đổi câu trả lời
  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = value;
    setUserAnswers(newAnswers);
  };

  // Chuyển câu trước
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Chuyển câu tiếp theo
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Nếu là câu cuối cùng, kết thúc game và submit
      handleFinishGame();
    }
  };

  // Kết thúc game
  const handleFinishGame = async () => {
    if (showResult) return; // Prevent double finish
    setIsGameStarted(false);
    setShowResult(true);
    calculateScore();

    // Submit to API immediately when game finishes
    await handleSubmitToAPI();

    // Show modal result after submission
    setShowModalResult(true);
  };

  // Tính điểm
  const calculateScore = () => {
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      const question = questions[index];
      if (question && answer && question.correct_word) {
        if (
          answer.toLowerCase().trim() ===
          question.correct_word.toLowerCase().trim()
        ) {
          correctCount++;
        }
      }
    });
    setScore(correctCount);
  };

  // Handle submit to API
  const handleSubmitToAPI = async () => {
    // Prepare answers data for API
    const answers = questions
      .map((question: { id: string }, index: number) => {
        const userAnswer = userAnswers[index] || '';
        return {
          questionId: question.id,
          answer: userAnswer,
        };
      })
      .filter((answer: { answer: string }) => answer.answer !== ''); // Filter out unanswered questions

    const submitData: SubmitFillBlankChallengeDto = {
      fillBlank: {
        answers,
      },
    };

    try {
      const result = await submitChallengeMutation.mutateAsync({
        challengeId: params.id as string,
        data: submitData,
      });

      // Handle successful submission
      setSubmittedScore(result.score !== undefined ? result.score : score);
    } catch (error: any) {
      console.error('Submit challenge error:', error);
      // Still set score even if API fails
      setSubmittedScore(score);
    }
  };

  // Handle view result and submit
  const handleViewResultAndSubmit = async () => {
    // Invalidate queries to refresh the list
    queryClient.invalidateQueries({ queryKey: ['list challenge', listParam] });
    // Show detailed results (submission already done when modal opened)
    setShowModalResult(false);
    setShowDetailedResults(true);
  };

  // Thoát game
  const handleExit = () => {
    router.push('/discovery-activities/fill-story');
  };

  // Chơi lại
  const handleRestart = () => {
    setCurrentQuestion(0);
    setTimeLeft(180);
    setUserAnswers(new Array(questions.length).fill(''));
    setCurrentAnswer('');
    setIsGameStarted(true);
    setShowResult(false);
    setShowModalResult(false);
    setShowDetailedResults(false);
    setScore(0);
    setSubmittedScore(null);
  };

  // Loading state
  if (!challengeData || questions.length === 0) {
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

  // Render detailed results view
  if (showDetailedResults) {
    return (
      <DetailedResults
        challengeData={challengeData}
        userAnswers={userAnswers}
        submittedScore={submittedScore}
        onBack={() => setShowDetailedResults(false)}
        onExit={handleExit}
        onRetry={handleRestart}
      />
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <div className='bg-white mt-20'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
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

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <>
          {/* Progress Bar và Timer */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-3'>
              <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                Câu {currentQuestion + 1}/{questions.length}
              </div>
              <span className='text-lg'>{formatTime(timeLeft)}</span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                style={{ width: `${(timeLeft / 180) * 100}%` }}
              />
            </div>
          </div>

          {/* Game Content */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Điền từ vào chỗ trống
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                Hoàn thành câu chuyện bằng cách điền từ thích hợp vào chỗ trống
              </p>
            </div>

            {/* Question */}
            <div className='mb-8'>
              <div className='text-lg text-gray-800 dark:text-gray-200 leading-relaxed text-center'>
                <p className='mb-6'>
                  {currentQ?.sentence
                    ?.split('____')
                    .map((part: string, index: number) => (
                      <span key={index}>
                        {part}
                        {index <
                          currentQ?.sentence?.split('____').length - 1 && (
                          <span className='inline-block w-10 h-8 mx-2 border-b-2 border-dashed'></span>
                        )}
                      </span>
                    ))}
                </p>
              </div>

              {/* Answer Input */}
              <div className='text-center'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Nhập câu trả lời
                </label>
                <input
                  type='text'
                  value={currentAnswer}
                  onChange={e => handleAnswerChange(e.target.value)}
                  placeholder='Nhập câu trả lời'
                  className='w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-lg'
                  disabled={!isGameStarted}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className='flex justify-between items-center'>
              <Button
                variant='outline'
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className='flex items-center gap-2'
              >
                <ArrowLeft size={16} />
                Câu trước
              </Button>

              <div className='flex gap-2'>
                {questions.map((_: any, index: number) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentQuestion
                        ? 'bg-orange-500'
                        : userAnswers[index]
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNextQuestion}
                className='bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2'
              >
                {currentQuestion === questions.length - 1
                  ? 'Hoàn thành'
                  : 'Câu tiếp theo'}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </>
      </div>
      <ResultDialog
        open={showModalResult}
        score={submittedScore !== null ? submittedScore : score}
        handleRetry={handleRestart}
        handleViewAnswer={handleViewResultAndSubmit}
        maxScore={questions.length}
        handleExitQuiz={handleExit}
        handleClose={() => setShowModalResult(false)}
      />
    </div>
  );
};

export default StoryDetailPage;
