'use client';

import React, { useEffect, useState } from 'react';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import { Lock, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import IconLessonVideo from '../../../../public/icon-svg/lessson/IconLessonVideo';
import IconLessonDoc from '../../../../public/icon-svg/lessson/IconLessonDoc';
import IconLessonQuiz from '../../../../public/icon-svg/lessson/IconLessonQuiz';
import { Module } from '@/modules/courses/domain/types';
import { toast } from 'sonner';

interface CourseContentProps {
  modules: Module[];
  courseId: string;
  courseData: any;
}

const CourseContent: React.FC<CourseContentProps> = ({
  modules,
  courseId,
  courseData,
}) => {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (modules.length > 0) {
      setExpandedModules(new Set([modules[0].id]));
    }
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    const next = new Set(expandedModules);
    if (next.has(moduleId)) next.delete(moduleId);
    else next.add(moduleId);
    setExpandedModules(next);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <IconLessonVideo />;
      case 'content':
        return <IconLessonDoc />;
      case 'quiz':
        return <IconLessonQuiz />;
      default:
        return <IconLessonQuiz />;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '00:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins.toString().padStart(2, '0')} phút`;
    }
    return `${mins.toString().padStart(2, '0')}:00`;
  };

  const handleLessonClick = (lessonId: string) => {
    if (courseData?.isEnrolled) {
      router.push(`/topics/${courseId}/lessons/${lessonId}`);
    } else {
      toast.error('Vui lòng đăng ký chuyên đề để học nội dung này!');
    }
  };

  if (modules.length === 0) {
    return (
      <div className='text-center text-[#919EAB]'>Hiện chưa có nội dung nào!</div>
    );
  }

  return (
    <div className='space-y-3'>
      {modules.map(module => {
        const isExpanded = expandedModules.has(module.id);
        const totalDuration =
          module.lessons?.reduce(
            (sum, lesson) => sum + (lesson.duration || 0),
            0
          ) || 0;

        return (
          <div
            key={module.id}
            className='overflow-hidden rounded-xl border border-[#919EAB29]'
          >
            <button
              type='button'
              className='flex w-full cursor-pointer items-center justify-between gap-3 bg-[#F4F6F8] px-4 py-4 text-left transition hover:bg-[#F0F2F5]'
              onClick={() => toggleModule(module.id)}
            >
              <div className='flex min-w-0 flex-wrap items-center gap-3'>
                <h4 className='font-semibold text-[#212B36]'>{module.title}</h4>
                <span className='rounded bg-[#919EAB29] px-2 py-1 text-xs font-semibold text-[#637381]'>
                  {formatDuration(totalDuration)}
                </span>
              </div>
              {isExpanded ? (
                <ArrowUp2 size={18} color='#637381' />
              ) : (
                <ArrowDown2 size={18} color='#637381' />
              )}
            </button>

            {isExpanded && (
              <div className='divide-y divide-[#919EAB29] bg-white'>
                {module.lessons?.map(lesson => {
                  const locked = !courseData?.isEnrolled;
                  return (
                    <button
                      key={lesson.id}
                      type='button'
                      onClick={() => handleLessonClick(lesson.id)}
                      className='flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#FDF6F1]'
                    >
                      <div className='flex min-w-0 items-center gap-3'>
                        <span className='shrink-0 text-[#E4722C]'>
                          {lesson.type === 'video' ? (
                            <Play size={18} className='fill-[#E4722C]' />
                          ) : (
                            getLessonIcon(lesson.type)
                          )}
                        </span>
                        <span className='truncate text-sm font-medium text-[#212B36]'>
                          {lesson.title}
                        </span>
                        {locked && (
                          <Lock size={14} className='shrink-0 text-[#919EAB]' />
                        )}
                      </div>
                      <span className='shrink-0 text-xs text-[#637381]'>
                        {formatDuration(lesson.duration)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContent;
