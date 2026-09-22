import React, { useState, useEffect } from 'react';
import QuizStep1 from '@/components/lesson/ComponentQuiz/StepQuiz/QuizStep1';
import QuizStep2 from '@/components/lesson/ComponentQuiz/StepQuiz/QuizStep2';
import { useQuizStore } from '@/stores/lesson.slice';
import { useLessonDetail } from '@/modules/courses/hooks/useCourse';

interface QuizLessonProps {
  dataCourse: any;
  dataLesson: any;
}

// Default quiz configuration
const DEFAULT_QUIZ_CONFIG = {
  passingScore: 80,
  duration: 30, // minutes
  maxAttempts: 3,
};

// Transform API question data to component format
const transformQuestionData = (apiQuestions: any[]) => {
  return apiQuestions.map(q => ({
    id: q.id,
    question: q.question,
    type:
      q.answers.length > 1
        ? q.answers.filter((a: any) => a.is_correct).length > 1
          ? 'MULTIPLE_CHOICE'
          : 'SINGLE_CHOICE'
        : 'SHORT_ANSWER',
    options: q.answers?.map((answer: any) => ({
      id: answer.id,
      content: answer.answer,
      isCorrect: answer.is_correct,
    })),
    points: q.maxScore, // Default points per question
    explanation: q.explanation,
  }));
};

export default function QuizLesson({
  dataCourse,
  dataLesson,
}: QuizLessonProps) {
  const [tab, setTab] = useState('quizStep1');
  const isQuizStarted = useQuizStore(state => state.isQuizStarted);
  const [quizData, setQuizData] = useState<any>(null);
  const [dataTracking, setDataTracking] = useState<any>(null);

  // Get lesson detail from API
  const { getLessonDetail } = useLessonDetail(dataLesson?.id);

  // Initialize quiz data when lesson detail is loaded
  useEffect(() => {
    if (getLessonDetail.data && dataLesson?.type === 'quiz') {
      const lessonDetailData = getLessonDetail.data;

      // Transform API questions to component format
      const questions = lessonDetailData.question
        ? transformQuestionData(lessonDetailData.question)
        : [];

      const quizConfig = {
        ...DEFAULT_QUIZ_CONFIG,
        title: lessonDetailData.title,
        description: lessonDetailData.description,
        duration: DEFAULT_QUIZ_CONFIG.duration,
        maxScore: questions.reduce((sum, q) => sum + q.points, 0) || 100,
        questions: questions,
        isLearned: lessonDetailData.isLearned,
      };

      setQuizData(quizConfig);

      // Initialize tracking data
      setDataTracking({
        maxScore: quizConfig.maxScore,
        maxScoreAttempt: 0,
        totalAttempt: 0,
      });
    }
  }, [getLessonDetail.data, dataLesson]);

  const tabList = {
    quizStep1: {
      component: QuizStep1,
    },
    quizStep2: {
      component: QuizStep2,
    },
  };

  // Handle quiz completion
  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      // Update tracking data
      setDataTracking((prev: any) => ({
        ...prev,
        totalAttempt: prev.totalAttempt + 1,
        maxScoreAttempt: Math.max(prev.maxScoreAttempt, score),
      }));
    } else {
      // Update attempt count
      setDataTracking((prev: any) => ({
        ...prev,
        totalAttempt: prev.totalAttempt + 1,
      }));
    }
  };

  // Show loading state while fetching lesson detail
  if (getLessonDetail.isLoading) {
    return (
      <div className='md:mx-20 mx-4 h-[60vh] flex items-center justify-center'>
        <div className='text-lg'>Đang tải dữ liệu quiz...</div>
      </div>
    );
  }

  // Show error state
  if (getLessonDetail.error) {
    return (
      <div className='md:mx-20 mx-4 h-[60vh] flex items-center justify-center'>
        <div className='text-lg text-red-500'>Lỗi khi tải dữ liệu quiz</div>
      </div>
    );
  }

  // Show no questions state
  if (quizData && (!quizData.questions || quizData.questions.length === 0)) {
    return (
      <div className='md:mx-20 mx-4 h-[60vh] flex items-center justify-center'>
        <div className='text-lg text-gray-500'>
          Quiz này chưa có câu hỏi nào
        </div>
      </div>
    );
  }

  console.log(dataLesson, 'sss');

  return (
    <div
      className={`md:mx-20 mx-4 ${isQuizStarted ? 'h-full' : 'h-[60vh] overflow-auto'}`}
    >
      <div>
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          tab: tab,
          changeTab: setTab,
          dataCourse: dataCourse,
          dataLesson: quizData || dataLesson,
          dataForLesson: dataLesson,
          dataTracking: dataTracking,
          onQuizComplete: handleQuizComplete,
        })}
      </div>
    </div>
  );
}
