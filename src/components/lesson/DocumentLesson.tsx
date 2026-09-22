import { useEffect } from 'react';
import { useQuizStore } from '@/stores/lesson.slice';
import { useQueryClient } from '@tanstack/react-query';
import { submitLessonAPI } from '@/modules/courses/infrastructure/course.api';

interface IDocumentLessonProps {
  data: any;
  slug?: string;
}

export default function DocumentLesson({ data, slug }: IDocumentLessonProps) {
  const setQuizStarted = useQuizStore(state => state.setQuizStarted);

  const queryClient = useQueryClient();

  useEffect(() => {
    setQuizStarted(false);
  }, [setQuizStarted]);

  const handleDoneCourse = () => {
    submitLessonAPI(data.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['courses detail', slug] });
    });
  };

  return (
    <div className='md:mx-20 mx-4 h-[60vh] overflow-auto'>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold mb-4'>{data?.title}</h1>
        <div
          role='presentation'
          onClick={handleDoneCourse}
          className='p-2 text-sm rounded-xl flex items-center h-10 text-white bg-[#212b36] flex-shrink-0 cursor-pointer'
        >
          Hoàn thành Chuyên đề
        </div>
      </div>
      <div className='text-gray-700'>
        {/* Use description from API directly */}
        {data?.description && (
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        )}
        {/* Fallback to htmlContent if exists */}
        {!data?.description && data?.htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
        )}
        {/* Simple text fallback */}
        {!data?.description && !data?.htmlContent && (
          <p>{data?.description || 'Nội dung Chuyên đề đang được cập nhật...'}</p>
        )}
      </div>
    </div>
  );
}
