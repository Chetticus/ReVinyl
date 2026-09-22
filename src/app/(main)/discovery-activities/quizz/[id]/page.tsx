'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResultDialog } from '@/components/challenge/ResultDialog';
import {
  useChallengeDetail,
  useSubmitChallenge,
} from '@/modules/challenges/hooks/useChallenge';
import { SubmitQuizChallengeDto } from '@/modules/auth/infrastructure/challenge.api';

const QuizzDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [timeLeft, setTimeLeft] = useState(180); // Default 3 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  const { getChallengeDetail } = useChallengeDetail(params.id as string);
  const { submitChallengeMutation } = useSubmitChallenge();

  const challengeData = getChallengeDetail?.data;
  const questions = challengeData?.questions || [];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted && questions.length > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleCompleteQuiz();
    }
  }, [timeLeft, isCompleted, questions.length]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId,
    }));
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle quiz completion
  const handleCompleteQuiz = async () => {
    let correctCount = 0;
    questions.forEach((question: any, index: number) => {
      const selectedAnswer = selectedAnswers[index];
      const correctAnswer = question.answers.find(
        (answer: any) => answer.is_correct
      )?.id;
      if (selectedAnswer === correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);

    // Prepare answers data for API
    const answers = questions
      .map((question: any, index: number) => {
        const selectedAnswer = selectedAnswers[index];
        return {
          questionId: question.id,
          answerId: selectedAnswer || '', // Send empty string if no answer selected
        };
      })
      .filter((answer: any) => answer.answerId !== ''); // Filter out unanswered questions

    const submitData: SubmitQuizChallengeDto = {
      quiz: {
        answers,
      },
    };

    try {
      const result = await submitChallengeMutation.mutateAsync({
        challengeId: params.id as string,
        data: submitData,
      });

      setSubmittedScore(
        result.score !== undefined ? result.score : correctCount
      );
      setIsCompleted(true);
    } catch (error) {
      console.error('Submit challenge error:', error);
      // Still set as completed even if API fails
      setIsCompleted(true);
    }
  };

  // Handle view answer and submit
  const handleViewAnswerAndSubmit = async () => {
    // Show detailed results (submission already done when modal opened)
    setShowDetailedResults(true);
  };

  // Handle exit quiz
  const handleExitQuiz = () => {
    router.push('/discovery-activities/quizz');
  };

  const currentQ = questions[currentQuestion];

  // Render detailed results screen (quiz-like format)
  if (isCompleted && showDetailedResults && currentQ) {
    const userAnswer = selectedAnswers[currentQuestion];

    return (
      <div className='min-h-screen bg-white mt-10'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {challengeData?.title}
                </h1>
                <p className='text-gray-600 mt-1'>
                  {challengeData?.description}
                </p>
              </div>
              <div className='flex gap-3'>
                <Button
                  onClick={() => setShowDetailedResults(false)}
                  variant='outline'
                  className='px-6'
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleExitQuiz}
                  className='bg-black text-white hover:bg-gray-800 border-black px-6'
                >
                  Thoát
                </Button>
              </div>
            </div>

            {/* Progress and Score */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-4'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Câu {currentQuestion + 1}/{questions.length}
                  </span>
                  <div className='w-64 bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                      style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className='text-lg font-semibold text-gray-900'>
                  Điểm: {submittedScore !== null ? submittedScore : score}/
                  {questions.length}
                </div>
              </div>

              {/* Question */}
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                  {currentQ.question}
                </h2>

                {/* Answer Options */}
                <div className='space-y-3'>
                  {currentQ.answers.map((answer: any, index: number) => {
                    const isUserAnswer = userAnswer === answer.id;
                    const isCorrectAnswer = answer.is_correct;

                    let optionClassName =
                      'w-full text-left p-4 rounded-lg border-2 transition-all cursor-not-allowed';

                    if (isCorrectAnswer) {
                      optionClassName +=
                        ' border-green-500 bg-green-50 text-green-700';
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      optionClassName +=
                        ' border-red-500 bg-red-50 text-red-700';
                    } else {
                      optionClassName +=
                        ' border-gray-200 bg-gray-50 text-gray-500';
                    }

                    return (
                      <div key={answer.id} className={optionClassName}>
                        <div className='flex items-center gap-3'>
                          <span className='font-semibold text-gray-700'>
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className='text-gray-900'>{answer.answer}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='mt-4 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border border-orange-300 rounded-xl p-4 text-orange-700 shadow-md transition-all duration-300 hover:shadow-lg'>
                  <p className='text-sm md:text-base leading-relaxed'>
                    <span className='font-semibold text-orange-600'>
                      Giải thích:
                    </span>{' '}
                    {currentQ?.explanation}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className='flex justify-between items-center'>
                <Button
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                  variant='outline'
                  className='flex items-center gap-2 px-6'
                >
                  <ChevronLeft className='w-4 h-4' />
                  Câu trước
                </Button>

                <div className='flex gap-3'>
                  <Button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setSelectedAnswers({});
                      setTimeLeft(180);
                      setIsCompleted(false);
                      setScore(0);
                      setSubmittedScore(null);
                      setShowDetailedResults(false);
                    }}
                    variant='outline'
                    className='px-6'
                  >
                    Làm lại
                  </Button>

                  {currentQuestion < questions.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(questions.length - 1, currentQuestion + 1)
                        )
                      }
                      className='flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-6'
                    >
                      Câu tiếp theo
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleExitQuiz}
                      className='bg-primary-main hover:bg-primary-main/90 text-white px-6'
                    >
                      Hoàn thành
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className='min-h-screen bg-white mt-10'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                {challengeData.title}
              </h1>
              <p className='text-gray-600 mt-1'>{challengeData.description}</p>
            </div>
            <Button
              onClick={handleExitQuiz}
              variant='outline'
              className='bg-black text-white hover:bg-gray-800 border-black px-6'
            >
              Thoát
            </Button>
          </div>

          {/* Progress and Timer */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-4 w-full'>
                <span className='text-lg font-semibold text-gray-900'>
                  Câu {currentQuestion + 1}/{questions.length}
                </span>
                <div className='w-[88%] bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${(timeLeft / 180) * 100}%` }}
                  />
                </div>
              </div>
              <div className='text-lg font-semibold text-gray-900'>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Question */}
            <div className='mb-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                {currentQ.question}
              </h2>

              {/* Answer Options */}
              <div className='space-y-3'>
                {currentQ.answers.map((answer: any, index: number) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswers[currentQuestion] === answer.id
                        ? 'border-[#03A9F4] bg-[#03A9F414] text-[#03A9F4]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <span
                        className={`font-semibold ${
                          selectedAnswers[currentQuestion] === answer.id
                            ? 'text-[#03A9F4]'
                            : 'text-gray-700'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span
                        className={`${
                          selectedAnswers[currentQuestion] === answer.id
                            ? 'text-[#03A9F4]'
                            : 'text-gray-900'
                        }`}
                      >
                        {answer.answer}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className='flex justify-between items-center'>
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                variant='outline'
                className='flex items-center gap-2 px-6'
              >
                <ChevronLeft className='w-4 h-4' />
                Câu trước
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestion]}
                className='flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-6'
              >
                {currentQuestion === questions.length - 1
                  ? 'Hoàn thành'
                  : 'Câu tiếp theo'}
                {currentQuestion !== questions.length - 1 && (
                  <ChevronRight className='w-4 h-4' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ResultDialog
        open={isCompleted}
        handleClose={() => setIsCompleted(false)}
        score={submittedScore !== null ? submittedScore : score}
        maxScore={questions.length}
        handleExitQuiz={handleExitQuiz}
        handleRetry={() => {
          setCurrentQuestion(0);
          setSelectedAnswers({});
          setTimeLeft(180);
          setIsCompleted(false);
          setScore(0);
          setSubmittedScore(null);
        }}
        handleViewAnswer={handleViewAnswerAndSubmit}
      />
    </div>
  );
};

export default QuizzDetailPage;
