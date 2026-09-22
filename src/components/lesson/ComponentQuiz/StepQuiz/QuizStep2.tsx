import { TickCircle, CloseCircle, ArrowRotateLeft } from 'iconsax-react';
import { useState, useMemo, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useQuizStore } from '@/stores/lesson.slice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitQuizAPI } from '@/modules/courses/infrastructure/course.api';
import { toast } from 'sonner';

interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'SHORT_ANSWER';
  options?: QuizOption[];
  points: number;
  explanation?: string;
  correctAnswer?: number | number[]; // For fake data compatibility
}

interface LessonData {
  id: string;
  title: string;
  questions?: any[]; // From fake data
  duration?: number;
  maxAttempts?: number;
  passingScore?: number;
}

type QuizState = 'init' | 'submitting' | 'submitted' | 'review';
type AnswerState = {
  selected: string[] | null;
  text: string;
  isCorrect: boolean | null;
  score: number;
};

export interface IQuizStepProps {
  changeTab: (tab: string) => void;
  dataCourse: any;
  dataLesson: LessonData;
  dataTracking: {
    maxScore: number;
    maxScoreAttempt: number;
    totalAttempt: number;
  };
  onQuizComplete?: (score: number, passed: boolean) => void;
  dataForLesson: any;
}

// Convert API data to component format
const convertAPIDataToQuestions = (apiQuestions: any[]): QuizQuestion[] => {
  return apiQuestions.map(q => ({
    id: q.id,
    question: q.question,
    type: q.type || 'SINGLE_CHOICE',
    options: q.options || [],
    points: q.points || 10,
    explanation: q.explanation,
  }));
};

export default function QuizStep2({
  dataLesson,
  dataTracking,
  changeTab,
  dataForLesson,
}: IQuizStepProps) {
  // Convert API questions to component format
  const sortedQuestions = useMemo(() => {
    if (!dataLesson?.questions) return [];
    return convertAPIDataToQuestions(dataLesson.questions);
  }, [dataLesson?.questions]);
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [quizState, setQuizState] = useState<QuizState>('init');
  const [quizResult, setQuizResult] = useState<{
    totalScore: number;
    maxPossibleScore: number;
    passed: boolean;
    answers?: any[];
  } | null>(null);
  const setQuizStarted = useQuizStore(state => state.setQuizStarted);

  // Initialize answers when questions change
  useEffect(() => {
    setAnswers(
      sortedQuestions.map(() => ({
        selected: null,
        text: '',
        isCorrect: null,
        score: 0,
      }))
    );
  }, [sortedQuestions]);

  const timeLimit = dataLesson?.duration
    ? `${dataLesson.duration} phút`
    : 'Không giới hạn';

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async () => {
      const answersData = answers
        .map((answer, idx) => {
          const question = sortedQuestions[idx];

          if (question.type === 'SHORT_ANSWER') {
            return {
              questionId: question.id,
              answerId: answer.text, // For short answer, we send the text as answerId
            };
          } else {
            // For multiple choice, we need to send each selected option
            const selectedIds = answer.selected || [];
            return selectedIds.map(optionId => ({
              questionId: question.id,
              answerId: optionId,
            }));
          }
        })
        .flat(); // Flatten the array to handle multiple choice questions

      return submitQuizAPI(dataForLesson.id, { answers: answersData });
    },
    onSuccess: (response) => {
      toast.success('Nộp bài thành công!');
      
      // Calculate result based on user answers and question data
      let totalScore = 0;
      const maxPossibleScore = sortedQuestions.reduce((sum, q) => sum + q.points, 0);
      
      // Calculate score for each question
      answers.forEach((answer, idx) => {
        const question = sortedQuestions[idx];
        
        if (question.type === 'SHORT_ANSWER') {
          // For short answer, we'll give full points for now
          // In real implementation, you might want to add text matching logic
          totalScore += question.points;
        } else {
          // For multiple choice and single choice
          const selectedOptions = answer.selected || [];
          const correctOptions = question.options?.filter(opt => opt.isCorrect) || [];
          
          if (question.type === 'SINGLE_CHOICE') {
            // For single choice, check if the selected option is correct
            const selectedOption = question.options?.find(opt => opt.id === selectedOptions[0]);
            if (selectedOption?.isCorrect) {
              totalScore += question.points;
            }
          } else if (question.type === 'MULTIPLE_CHOICE') {
            // For multiple choice, check if all correct options are selected and no incorrect ones
            const correctOptionIds = correctOptions.map(opt => opt.id);
            const hasAllCorrect = correctOptionIds.every(id => selectedOptions.includes(id));
            const hasNoIncorrect = selectedOptions.every(id => correctOptionIds.includes(id));
            
            if (hasAllCorrect && hasNoIncorrect) {
              totalScore += question.points;
            }
          }
        }
      });
      
      const passed = totalScore >= (dataLesson?.passingScore || 80) * maxPossibleScore / 100;
      
      setQuizResult({
        totalScore,
        maxPossibleScore,
        passed,
        answers: answers
      });
      
      setQuizState('review');
      queryClient.invalidateQueries({ queryKey: ['courses detail'] });
    },
    onError: (error: any) => {
      console.error('Submit quiz error:', error);
      toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
      setQuizState('init');
    },
  });

  // Handle answer selection for multiple choice and single choice
  const handleSelect = (qIdx: number, optionId: string) => {
    if (quizState === 'submitted') return;

    const question = sortedQuestions[qIdx];

    setAnswers(prev =>
      prev.map((a, idx) => {
        if (idx !== qIdx) return a;

        if (question.type === 'SINGLE_CHOICE') {
          return {
            ...a,
            selected: [optionId],
          };
        } else if (question.type === 'MULTIPLE_CHOICE') {
          const currentSelected = a.selected || [];
          const isAlreadySelected = currentSelected.includes(optionId);

          return {
            ...a,
            selected: isAlreadySelected
              ? currentSelected.filter(id => id !== optionId)
              : [...currentSelected, optionId],
          };
        }
        return a;
      })
    );
  };

  // Handle text input for short answer questions
  const handleTextChange = (qIdx: number, value: string) => {
    if (quizState === 'submitted') return;

    setAnswers(prev =>
      prev.map((a, idx) => (idx === qIdx ? { ...a, text: value } : a))
    );
  };

  // Submit quiz
  const handleSubmit = () => {
    setQuizState('submitting');
    submitQuizMutation.mutate();
  };

  // Retry quiz
  const handleRetry = () => {
    setAnswers(
      sortedQuestions.map(() => ({
        selected: null,
        text: '',
        isCorrect: null,
        score: 0,
      }))
    );
    setQuizState('init');
    setQuizResult(null);
  };

  // Continue after review
  const handleContinueFromReview = () => {
    setQuizStarted(false);
    changeTab('quizStep1');
  };

  // Calculate score for a specific question
  const calculateQuestionScore = (question: QuizQuestion, answer: AnswerState) => {
    if (question.type === 'SHORT_ANSWER') {
      // For short answer, we'll give full points for now
      // In real implementation, you might want to add text matching logic
      return answer.text.trim() !== '' ? question.points : 0;
    } else {
      // For multiple choice and single choice
      const selectedOptions = answer.selected || [];
      const correctOptions = question.options?.filter(opt => opt.isCorrect) || [];
      
      if (question.type === 'SINGLE_CHOICE') {
        // For single choice, check if the selected option is correct
        const selectedOption = question.options?.find(opt => opt.id === selectedOptions[0]);
        return selectedOption?.isCorrect ? question.points : 0;
      } else if (question.type === 'MULTIPLE_CHOICE') {
        // For multiple choice, check if all correct options are selected and no incorrect ones
        const correctOptionIds = correctOptions.map(opt => opt.id);
        const hasAllCorrect = correctOptionIds.every(id => selectedOptions.includes(id));
        const hasNoIncorrect = selectedOptions.every(id => correctOptionIds.includes(id));
        
        return (hasAllCorrect && hasNoIncorrect) ? question.points : 0;
      }
    }
    return 0;
  };

  // Check if quiz can be submitted
  const canSubmit = sortedQuestions.every((question, idx) => {
    const answer = answers[idx];
    if (!answer) return false;

    if (question.type === 'SHORT_ANSWER') {
      return answer.text.trim() !== '';
    } else {
      return answer.selected && answer.selected.length > 0;
    }
  });

  const handleContinue = () => {
    handleContinueFromReview();
  };

  // Prevent errors when answers array is not ready
  if (answers.length !== sortedQuestions.length) {
    return <div>Loading...</div>;
  }

  // Score styling
  const scoreColor =
    (quizState === 'submitted' || quizState === 'review') && quizResult
      ? quizResult.passed
        ? 'green'
        : 'red'
      : 'gray';
  const scoreBg =
    scoreColor === 'green'
      ? 'bg-green-50'
      : scoreColor === 'red'
        ? 'bg-red-50'
        : 'bg-gray-50';
  const scoreText =
    scoreColor === 'green'
      ? 'text-green-600'
      : scoreColor === 'red'
        ? 'text-red-600'
        : 'text-gray-600';
  const scoreBorder =
    scoreColor === 'green'
      ? 'border-green-200'
      : scoreColor === 'red'
        ? 'border-red-200'
        : 'border-gray-200';

  return (
    <div className='flex flex-col items-center py-10 overflow-hidden'>
      <div className='w-full max-w-2xl'>
        {/* Header info */}
        <div className='flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-200 border-dashed bg-white rounded-t-2xl'>
          <div className='flex gap-6 text-sm text-gray-700'>
            <span>
              Số câu hỏi:{' '}
              <span className='font-semibold text-black'>
                {sortedQuestions.length}
              </span>
            </span>
            <span>
              Số lần thử:{' '}
              <span className='font-semibold text-black'>
                {dataTracking?.totalAttempt || 1}/{dataLesson?.maxAttempts || 3}
              </span>
            </span>
          </div>
          <div className='text-sm text-gray-700 flex items-center gap-1'>
            Thời gian:{' '}
            <span className='bg-[#03A9F429] text-[#0288D1] px-2 py-0.5 rounded font-medium ml-1'>
              {timeLimit}
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className='bg-white rounded-b-2xl shadow-xl px-8 py-8'>
          {/* Results */}
          {(quizState === 'submitted' || quizState === 'review') && quizResult && (
            <div
              className={`flex items-center justify-between px-6 py-4 mb-8 rounded-xl border ${scoreBorder} ${scoreBg} shadow-sm`}
            >
              <div>
                <div className={`font-semibold text-lg`}>
                  Điểm của bạn:{' '}
                  <span className={`font-bold text-2xl ${scoreText}`}>
                    {quizResult.totalScore}/{quizResult.maxPossibleScore}
                  </span>
                  <span className={`text-sm ml-2 ${scoreText}`}>
                    (
                    {quizResult.maxPossibleScore > 0
                      ? (
                          (quizResult.totalScore /
                            quizResult.maxPossibleScore) *
                          100
                        ).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Bạn cần ít nhất {dataLesson?.passingScore || 80}% điểm để vượt
                  qua
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {scoreColor === 'green' ? (
                  <TickCircle
                    size={36}
                    className='text-green-500'
                    variant='Bold'
                  />
                ) : (
                  <CloseCircle
                    size={36}
                    className='text-red-500'
                    variant='Bold'
                  />
                )}
                {quizState === 'review' ? (
                  <button
                    onClick={handleContinueFromReview}
                    className='bg-[#2F57EF] cursor-pointer px-4 py-2 h-max flex-shrink-0 flex items-center gap-2 rounded-xl text-white text-sm font-semibold'
                  >
                    Tiếp theo
                    <ArrowRight size='20' color='#fff' />
                  </button>
                ) : scoreColor === 'green' ? (
                  <button
                    onClick={handleContinue}
                    className='bg-[#2F57EF] cursor-pointer px-4 py-2 h-max flex-shrink-0 flex items-center gap-2 rounded-xl text-white text-sm font-semibold'
                  >
                    Tiếp theo
                    <ArrowRight size='20' color='#fff' />
                  </button>
                ) : (
                  <button
                    onClick={handleRetry}
                    className='ml-4 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border border-gray-200 bg-gray-100 text-gray-700 font-semibold transition hover:bg-gray-200'
                  >
                    <ArrowRotateLeft size='20' color='gray' />
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Questions list */}
          <div className='space-y-8'>
            {sortedQuestions.map((question, idx) => (
              <div key={question.id} className=''>
                {/* Question */}
                <div className='flex items-start gap-2 mb-4'>
                  <span className='font-semibold text-base text-gray-900 select-none'>
                    {idx + 1}.
                  </span>
                  <span className='font-medium text-base text-gray-900 flex-1'>
                    {question.question}
                  </span>
                  <span className='text-sm text-gray-500'>
                    ({question.points} điểm)
                    {quizState === 'review' && (
                      <span className={`ml-2 text-sm font-medium ${
                        calculateQuestionScore(question, answers[idx]) === question.points 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                      </span>
                    )}
                  </span>
                </div>

                {/* Multiple choice / Single choice answers */}
                {(question.type === 'MULTIPLE_CHOICE' ||
                  question.type === 'SINGLE_CHOICE') && (
                  <div className='flex flex-col gap-3 mt-3 ml-6'>
                    {question.options?.map((option: QuizOption) => {
                      const isSelected =
                        answers[idx].selected?.includes(option.id) || false;
                      const isCorrect = option.isCorrect;

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all
                            ${isSelected && quizState === 'init' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
                            ${quizState === 'init' ? 'hover:border-blue-400' : ''}
                            ${quizState === 'submitted' || quizState === 'review' ? 'cursor-default' : ''}
                            ${quizState === 'review' && isCorrect ? 'border-green-500 bg-green-50' : ''}
                            ${quizState === 'review' && isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                          `}
                        >
                          <input
                            type={
                              question.type === 'MULTIPLE_CHOICE'
                                ? 'checkbox'
                                : 'radio'
                            }
                            name={`q${idx}`}
                            checked={isSelected}
                            disabled={quizState === 'submitted' || quizState === 'review'}
                            onChange={() => handleSelect(idx, option.id)}
                            className='form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500'
                          />
                          <span className='font-medium text-gray-900 flex-1'>
                            {option.content}
                          </span>
                          {quizState === 'review' && (
                            <div className='flex items-center gap-2'>
                              {isCorrect && (
                                <TickCircle size={20} className='text-green-500' variant='Bold' />
                              )}
                              {isSelected && !isCorrect && (
                                <CloseCircle size={20} className='text-red-500' variant='Bold' />
                              )}
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Short answer */}
                {question.type === 'SHORT_ANSWER' && (
                  <div className='mt-3 ml-6'>
                    <textarea
                      className='w-full min-h-[100px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none'
                      placeholder='Nhập câu trả lời của bạn...'
                      value={answers[idx].text}
                      disabled={quizState === 'submitted' || quizState === 'review'}
                      onChange={e => handleTextChange(idx, e.target.value)}
                      maxLength={500}
                    />
                    <div className='text-xs text-gray-500 mt-1'>
                      {answers[idx].text.length}/500 ký tự
                    </div>
                  </div>
                )}

                {/* Explanation in review mode */}
                {quizState === 'review' && question.explanation && (
                  <div className='mt-4 ml-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                    <div className='flex items-start gap-2'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                      <div>
                        <h4 className='font-semibold text-blue-800 text-sm mb-1'>Giải thích:</h4>
                        <p className='text-blue-700 text-sm'>{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex gap-3 justify-end'>
          {quizState === 'init' && (
            <div className='flex justify-end mt-6'>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitQuizMutation.isPending}
                className='flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {submitQuizMutation.isPending ? 'Đang nộp bài...' : 'Nộp bài'}
              </button>
            </div>
          )}

          {quizState !== 'review' && (
            <div className='flex justify-end mt-6'>
              <button
                onClick={() => {
                  changeTab('quizStep1');
                }}
                className='flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-600 text-white font-semibold shadow hover:bg-gray-700 transition'
              >
                Trở lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
