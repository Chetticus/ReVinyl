import ItemQuiz from '@/components/lesson/ComponentQuiz/ItemQuiz';
import ItemResult from '@/components/lesson/ComponentQuiz/ItemResult';
import { useQuizStore } from '@/stores/lesson.slice';
import { useEffect } from 'react';

export interface IQuizStepProps {
  changeTab: (tab: string) => void;
  dataCourse: any;
  dataLesson: any;
  dataTracking: any;
  tab: any;
  onQuizComplete?: (score: number, passed: boolean) => void;
  dataForLesson: any;
}

export default function QuizStep1({
  changeTab,
  dataCourse,
  dataLesson,
  dataTracking,
  tab,
  onQuizComplete,
  dataForLesson,
}: IQuizStepProps) {
  const setQuizStarted = useQuizStore(state => state.setQuizStarted);

  useEffect(() => {
    if (tab === 'quizStep1') {
      setQuizStarted(false);
    }
  }, [tab, setQuizStarted]);

  // Handle quiz completion callback
  const handleQuizComplete = (score: number, passed: boolean) => {
    if (onQuizComplete) {
      onQuizComplete(score, passed);
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>{dataCourse?.title}</h1>
      <ItemQuiz
        dataCourse={dataCourse}
        changeTab={changeTab}
        type={dataLesson?.type}
        data={dataLesson}
        dataTracking={dataTracking}
      />
      <ItemResult
        dataTracking={dataTracking}
        changeTab={changeTab}
        data={dataLesson}
        dataForLesson={dataForLesson}
        onQuizComplete={handleQuizComplete}
      />
    </div>
  );
}
