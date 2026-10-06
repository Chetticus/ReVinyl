'use client';

import React, { useState, useEffect } from 'react';
import VideoPlayer from '@/components/ui/video-player';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import DocumentLesson from '@/components/lesson/DocumentLesson';
import QuizLesson from '@/components/lesson/QuizLesson';
import ContentTab from '@/components/lesson/ContentTab';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuizStore } from '@/stores/lesson.slice';
import LessonSidebar from '@/components/lesson/lesson-sidebar';
import IconToggleSidebar from '../../../../../../../public/icon-svg/lessson/IconToggleSidebar';
import IconToggleSidebarActive from '../../../../../../../public/icon-svg/lessson/IconToggleSidebarActive';
import { useCourseDetail } from '@/modules/courses/hooks/useCourse';

// Use API data directly without formatting
interface SidebarSection {
  id: string;
  title: string;
  expanded: boolean;
  lessons: any[]; // Use API lesson data directly
  progress?: string;
}

function LessonPage() {
  const isQuizStarted = useQuizStore(state => state.isQuizStarted);
  const params = useParams();

  const slug = params?.id;

  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson');
  const { getCourseDetail } = useCourseDetail(slug as string);

  const [sections, setSections] = useState<SidebarSection[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null); // Use API data directly

  // Helper functions
  const mapLessonType = (type: string) => {
    const typeMap = {
      video: 'video',
      content: 'doc',
      quiz: 'quiz',
      document: 'doc',
    };
    return typeMap[type as keyof typeof typeMap] || 'video';
  };

  const updateLessonActive = (
    sections: SidebarSection[],
    activeLessonId: string
  ) =>
    sections.map(section => ({
      ...section,
      lessons: section.lessons.map(l => ({
        ...l,
        active: l.id === activeLessonId,
      })),
    }));

  const updateURLParams = (lessonId: string, moduleId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('lesson', lessonId);
    newSearchParams.set('module', moduleId);
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${newSearchParams}`
    );
  };

  // Initialize data - use API data directly
  useEffect(() => {
    if (!getCourseDetail.data) return;

    // Use API data directly without formatting
    const sectionData = getCourseDetail.data.modules.map(module => ({
      id: module.id,
      title: module.title,
      expanded: true,
      lessons: module.lessons.map(lesson => ({ ...lesson, active: false })),
      progress: `${module.lessons.filter(it => it.isLearned).length}/${module.lessons.length}`,
    }));

    setSections(sectionData);

    // Find target lesson directly from API data
    const allLessons = getCourseDetail.data.modules.flatMap(
      module => module.lessons
    );
    const targetLesson = lessonId
      ? allLessons.find(l => l.id === lessonId)
      : allLessons[0];

    if (targetLesson) {
      setCurrentLesson(targetLesson);
      setSections(prev => updateLessonActive(prev, targetLesson.id));

      if (!lessonId) {
        updateURLParams(targetLesson.id, targetLesson.module_id);
      }
    }
  }, [getCourseDetail.data, lessonId, searchParams]);

  // Handle responsive sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      setIsSidebarVisible(!mobile);
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const selectLesson = (lesson: any) => {
    setSections(prev => updateLessonActive(prev, lesson.id));
    setCurrentLesson(lesson);

    if (isMobileView) setIsSidebarVisible(false);
    updateURLParams(lesson.id, lesson.module_id);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  console.log(currentLesson, '---currentLesson');

  const renderLessonBody = () => {
    if (!currentLesson) return null;

    const lessonType = mapLessonType(currentLesson.type);
    const components = {
      video: () => (
        <VideoPlayer
          src={
            currentLesson.attachment ||
            'https://www.youtube.com/watch?v=FJmQEW5Ncpk&list=RD3JLDUJJuVGk&index=11'
          }
          poster={
            currentLesson.thumbnail ||
            'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
          }
          slug={slug as string}
          data={currentLesson}
        />
      ),
      doc: () => <DocumentLesson slug={slug as string} data={currentLesson} />,
      quiz: () => (
        <QuizLesson
          dataLesson={currentLesson}
          dataCourse={getCourseDetail.data}
        />
      ),
    };

    return components[lessonType as keyof typeof components]?.() || null;
  };

  // Show loading state while fetching data
  if (getCourseDetail.isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading course data...</div>
      </div>
    );
  }

  // Show error state
  if (getCourseDetail.error || !getCourseDetail.data) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg text-red-500'>Error loading course data</div>
      </div>
    );
  }

  const courseDetail = getCourseDetail.data;

  return (
    <div className='flex relative mt-12'>
      {/* Left Sidebar - luôn hiện ở desktop, toggle ở mobile */}
      {isSidebarVisible && (
        <div
          className={`
          ${isMobileView ? 'fixed z-20 top-0 left-0 h-full transition-transform duration-300 ease-in-out' : 'relative z-10'}
          ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isMobileView ? 'w-max sm:w-[350px] bg-white shadow-xl' : 'w-0 lg:w-[350px] bg-white'}
        `}
          style={{ minHeight: '100vh' }}
        >
          <LessonSidebar
            sections={sections}
            onToggleSection={toggleSection}
            onSelectLesson={selectLesson}
          />
        </div>
      )}
      {/* Overlay cho mobile khi sidebar mở */}
      {isMobileView && isSidebarVisible && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto bg-white min-w-0'>
        {/* Header with back button */}
        <div className='items-center justify-between md:flex p-4 bg-white text-primary'>
          <div className='flex items-center gap-3'>
            <button
              className='mr-3 bg-[#919EAB14] h-[36px] w-[36px] flex items-center justify-center rounded'
              onClick={toggleSidebar}
            >
              {isSidebarVisible ? (
                <IconToggleSidebar />
              ) : (
                <IconToggleSidebarActive />
              )}
            </button>
            <h1 className='text-lg font-medium truncate'>
              {courseDetail?.title}
            </h1>
          </div>
        </div>

        {currentLesson && (
          <>
            {renderLessonBody()}

            {!isQuizStarted && (
              <ContentTab
                courseTitle={courseDetail?.title}
                currentLesson={currentLesson}
                courseData={courseDetail}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LessonPage;
