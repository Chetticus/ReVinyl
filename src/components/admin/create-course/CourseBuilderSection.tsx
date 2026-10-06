'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Edit3, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import CreateLessonModal from './CreateLessonModal';
import CreateQuizModal from './CreateQuizModal';
import ModuleModal from './ModuleModal';
import { Control, useController } from 'react-hook-form';
import { type CourseFormData } from '@/modules/auth/domain/schema';

interface CourseBuilderSectionProps {
  control: Control<CourseFormData>;
}

// Sortable Item Component for Lessons
function SortableItem({
  lesson,
  moduleId,
  onEdit,
  onDelete,
}: {
  lesson: any;
  moduleId: string;
  onEdit: (moduleId: string, lesson: any) => void;
  onDelete: (moduleId: string, lessonId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center justify-between bg-white border rounded p-2'
    >
      <div className='flex items-center gap-2'>
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing'
        >
          <GripVertical className='w-4 h-4 text-gray-400' />
        </div>
        <span className='text-sm text-gray-700'>{lesson.title}</span>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onEdit(moduleId, lesson)}
        >
          <Edit3 className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='text-red-500'
          onClick={() => onDelete(moduleId, lesson.id)}
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}

export default function CourseBuilderSection({
  control,
}: CourseBuilderSectionProps) {
  const {
    field: { onChange, value: formModules },
  } = useController({
    name: 'modules',
    control,
    defaultValue: [],
  });
  const [isOpen, setIsOpen] = useState(true);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleModalMode, setModuleModalMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [editingModule, setEditingModule] = useState<{
    id: string;
    title: string;
    description?: string;
  } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    lessonId: string;
    form: any;
  } | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{
    lessonId: string;
    form: any;
    questions: any[];
  } | null>(null);

  const skipOnChange = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [modules, setModules] = useState(() => {
    if (Array.isArray(formModules)) {
      if (formModules.length === 0) {
        return [];
      }
      return formModules.map((module: any, index: number) => ({
        id: module.id,
        title: module.title,
        description: module.short_description || '',
        isOpen: index === 0,
        status: 'published',
        lessons:
          module.lessons
            ?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) // Sort by order ascending
            ?.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              type:
                lesson.type ||
                (lesson.question && lesson.question.length > 0
                  ? 'quiz'
                  : 'video'),
              description: lesson.description || '',
              attachment: lesson.attachment || '',
              lessonType: lesson.lessonType || 'video',
              status: lesson.status || 'draft',
              order: lesson.order || 0,
              questions:
                lesson.question?.map((q: any) => {
                  // Sort answers by created_at
                  const sortedAnswers = q.answers
                    ? [...q.answers].sort(
                      (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                    )
                    : [];

                  return {
                    id: q.id,
                    question: q.question,
                    answers: sortedAnswers.map(
                      (answer: any) => answer.answer || ''
                    ),
                    correct_answer:
                      sortedAnswers.find((answer: any) => answer.is_correct)
                        ?.answer || '',
                    explanation: q.explanation || '',
                  };
                }) || [],
            })) || [],
      }));
    }
    return [
      {
        id: '1',
        title: 'Chủ đề 1',
        description: 'Mô tả chủ đề 1',
        isOpen: true,
        status: 'published',
        lessons: [
          {
            id: '1',
            title: 'Chuyên đề 1',
            type: 'video',
            description: '',
            attachment: '',
            lessonType: 'video',
            status: 'draft',
          },
          {
            id: '2',
            title: 'Bài kiểm tra 1',
            type: 'quiz',
            description: '',
            questions: [],
          },
        ],
      },
      {
        id: '2',
        title: 'Chủ đề 2',
        description: 'Mô tả chủ đề 2',
        isOpen: false,
        lessons: [],
      },
    ];
  });

  // Update modules when form data changes (for edit mode)
  useEffect(() => {
    if (
      Array.isArray(formModules) &&
      modules.length <= 2 &&
      modules[0]?.id === '1'
    ) {
      if (formModules.length === 0) {
        skipOnChange.current = true;
        setModules([]);
        return;
      }

      const updatedModules = formModules.map((module: any, index: number) => ({
        id: module.id,
        title: module.title,
        description: module.short_description || '',
        isOpen: index === 0,
        status: 'published',
        lessons:
          module.lessons
            ?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            ?.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              type:
                lesson.type ||
                (lesson.question && lesson.question.length > 0
                  ? 'quiz'
                  : 'video'),
              description: lesson.description || '',
              attachment: lesson.attachment || '',
              lessonType: lesson.lessonType || 'video',
              status: lesson.status || 'draft',
              order: lesson.order || 0,
              questions:
                lesson.question?.map((q: any) => {
                  // Sort answers by created_at
                  const sortedAnswers = q.answers
                    ? [...q.answers].sort(
                      (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                    )
                    : [];

                  return {
                    id: q.id,
                    question: q.question,
                    answers: sortedAnswers.map(
                      (answer: any) => answer.answer || ''
                    ),
                    correct_answer:
                      sortedAnswers.find((answer: any) => answer.is_correct)
                        ?.answer || '',
                    explanation: q.explanation || '',
                  };
                }) || [],
            })) || [],
      }));
      skipOnChange.current = true;
      setModules(updatedModules);
    }
  }, [formModules]);

  useEffect(() => {
    // Skip onChange if this update is from external form data
    if (skipOnChange.current) {
      skipOnChange.current = false;
      return;
    }

    const formattedModules = modules.map((module, index) => ({
      id: module.id,
      title: module.title,
      short_description: module.description || '',
      order: index + 1,
      status: 'published',
      lessons: module.lessons.map((lesson: any, lessonIndex: number) => {
        const baseLesson = {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type as 'video' | 'content' | 'quiz',
          description: lesson.description,
          status: lesson.status,
          order: lessonIndex + 1,
        };

        if (lesson.type === 'quiz') {
          return {
            ...baseLesson,
            quiz_questions: (lesson.questions || []).map(
              (q: any, index: number) => ({
                id: index + 1,
                question: q.question || '',
                answers: Array.isArray(q.answers)
                  ? q.answers.map((answer: any) =>
                    typeof answer === 'string'
                      ? answer
                      : answer.value || answer.answer_text || ''
                  )
                  : [],
                correct_answer: q.correct_answer || '',
                explanation: q.explanation || '',
              })
            ),
          };
        } else {
          return {
            ...baseLesson,
            attachment: lesson.attachment || '',
          };
        }
      }),
    }));

    onChange(formattedModules);
  }, [modules]);

  const handleModuleSubmit = (data: {
    title: string;
    description?: string;
  }) => {
    if (moduleModalMode === 'create') {
      const newModule = {
        id: `module_${Date.now()}`,
        title: data.title,
        description: data.description || '',
        isOpen: true,
        status: 'published',
        lessons: [],
      };
      setModules([...modules, newModule]);
    } else if (moduleModalMode === 'edit' && editingModule) {
      setModules(
        modules.map(module =>
          module.id === editingModule.id
            ? {
              ...module,
              title: data.title,
              description: data.description || '',
            }
            : module
        )
      );
    }
    setModuleModalOpen(false);
    setEditingModule(null);
  };

  const toggleModule = (moduleId: string) => {
    // Skip onChange for UI-only toggle
    skipOnChange.current = true;
    setModules(
      modules.map(module =>
        module.id === moduleId ? { ...module, isOpen: !module.isOpen } : module
      )
    );
  };

  const openEditModuleModal = (moduleId: string) => {
    const moduleData = modules.find(m => m.id === moduleId);
    if (!moduleData) return;

    setEditingModule({
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
    });
    setModuleModalMode('edit');
    setModuleModalOpen(true);
  };

  const openCreateModuleModal = () => {
    setModuleModalMode('create');
    setEditingModule(null);
    setModuleModalOpen(true);
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map(module =>
        module.id === moduleId
          ? {
            ...module,
            lessons: module.lessons.filter(
              (lesson: any) => lesson.id !== lessonId
            ),
          }
          : module
      )
    );
  };

  const openAddLessonModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setLessonModalOpen(true);
  };

  const openAddQuizModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setQuizModalOpen(true);
  };

  const openEditQuizModal = (moduleId: string, lesson: any) => {
    setSelectedModuleId(moduleId);
    setEditingQuiz({
      lessonId: lesson.id,
      form: {
        title: lesson.title ?? '',
        description: lesson.description ?? '',
        status: lesson.status ?? 'draft',
      },
      questions: lesson.questions ?? [],
    });
    setQuizModalOpen(true);
  };

  const openEditLessonModal = (moduleId: string, lesson: any) => {
    setSelectedModuleId(moduleId);
    setEditingLesson({
      lessonId: lesson.id,
      form: {
        title: lesson.title ?? '',
        description: lesson.description ?? '',
        videoUrl: lesson.type === 'video' ? (lesson.attachment ?? '') : '',
        content: lesson.type === 'content' ? (lesson.attachment ?? '') : '',
        lessonType: lesson.type === 'video' ? 'video' : 'document',
        status: lesson.status ?? 'draft',
      },
    });
    setLessonModalOpen(true);
  };

  const handleLessonSubmit = (data: any) => {
    if (!selectedModuleId) return;

    if (editingLesson && editingLesson.lessonId) {
      setModules(
        modules.map(module =>
          module.id === selectedModuleId
            ? {
              ...module,
              status: 'published',
              lessons: module.lessons.map((lesson: any) =>
                lesson.id === editingLesson.lessonId
                  ? lesson.type === 'quiz'
                    ? {
                      ...lesson,
                      title: data.title,
                      description: data.description,
                    }
                    : {
                      id: lesson.id,
                      title: data.title,
                      type: data.type,
                      description: data.description,
                      attachment: data.attachment,
                      status: data.status,
                      lessonType:
                        data.type === 'video' ? 'video' : 'document',
                    }
                  : lesson
              ),
            }
            : module
        )
      );
    } else {
      const newLesson = {
        id: `lesson_${Date.now()}`,
        title: data.title,
        type: data.type,
        description: data.description,
        attachment: data.attachment,
        status: data.status,
        lessonType: data.type === 'video' ? 'video' : 'document',
      };

      setModules(
        modules.map(module =>
          module.id === selectedModuleId
            ? {
              ...module,
              status: 'published',
              lessons: [...module.lessons, newLesson],
            }
            : module
        )
      );
    }

    setLessonModalOpen(false);
    setSelectedModuleId(null);
    setEditingLesson(null);
  };

  const handleQuizSubmit = (data: any) => {
    if (!selectedModuleId) return;

    if (editingQuiz && editingQuiz.lessonId) {
      // Update existing quiz
      setModules(
        modules.map(module =>
          module.id === selectedModuleId
            ? {
              ...module,
              lessons: module.lessons.map((lesson: any) =>
                lesson.id === editingQuiz.lessonId
                  ? { ...lesson, ...data, title: data.title, type: 'quiz' }
                  : lesson
              ),
            }
            : module
        )
      );
    } else {
      // Create new quiz
      const newQuiz = {
        id: `lesson_${Date.now()}`,
        title: data.title,
        type: 'quiz',
        ...data,
      };

      setModules(
        modules.map(module =>
          module.id === selectedModuleId
            ? {
              ...module,
              status: 'published',
              lessons: [...module.lessons, newQuiz],
            }
            : module
        )
      );
    }

    setQuizModalOpen(false);
    setSelectedModuleId(null);
    setEditingQuiz(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeModuleIndex = modules.findIndex(module =>
      module.lessons.some((lesson: any) => lesson.id === activeId)
    );

    if (activeModuleIndex === -1) return;

    const activeModule = modules[activeModuleIndex];
    const oldIndex = activeModule.lessons.findIndex(
      (lesson: any) => lesson.id === activeId
    );
    const newIndex = activeModule.lessons.findIndex(
      (lesson: any) => lesson.id === overId
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedLessons = arrayMove(
      activeModule.lessons,
      oldIndex,
      newIndex
    );

    setModules(
      modules.map((module, index) =>
        index === activeModuleIndex
          ? {
            ...module,
            status: 'published',
            lessons: reorderedLessons,
          }
          : module
      )
    );
  };

  return (
    <>
      <CreateLessonModal
        isOpen={lessonModalOpen}
        onClose={() => {
          setLessonModalOpen(false);
          setSelectedModuleId(null);
          setEditingLesson(null);
        }}
        moduleId={selectedModuleId || ''}
        onSubmit={handleLessonSubmit}
        editLesson={editingLesson}
      />

      <CreateQuizModal
        isOpen={quizModalOpen}
        onClose={() => {
          setQuizModalOpen(false);
          setSelectedModuleId(null);
          setEditingQuiz(null);
        }}
        moduleId={selectedModuleId || ''}
        onSubmit={handleQuizSubmit}
        editQuiz={
          editingQuiz
            ? { form: editingQuiz.form, questions: editingQuiz.questions }
            : null
        }
      />

      <ModuleModal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        onSubmit={handleModuleSubmit}
        mode={moduleModalMode}
        initialData={
          editingModule
            ? {
              title: editingModule.title,
              description: editingModule.description,
            }
            : undefined
        }
      />

      <div className='bg-white rounded-xl shadow p-6'>
        {/* Header */}
        <div
          className='flex items-center justify-between cursor-pointer pb-6 border-b border-[#919EAB3D]'
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className='text-lg font-semibold text-gray-900 flex items-center'>
            Xây dựng Chuyên đề
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </div>

        {/* Body */}
        {isOpen && (
          <div className='mt-6 space-y-4'>
            {modules.map(module => (
              <div
                key={module.id}
                className='bg-gray-50 rounded-lg p-4 border border-gray-200'
              >
                {/* Module header */}
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2 flex-1'>
                    <h3 className='font-medium text-gray-800'>
                      {module.title}
                    </h3>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openEditModuleModal(module.id)}
                    >
                      <Edit3 className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-500'
                      onClick={() => deleteModule(module.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => toggleModule(module.id)}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${module.isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Lessons */}
                {module.isOpen && (
                  <>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={module.lessons.map((lesson: any) => lesson.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className='space-y-2 mb-3'>
                          {module.lessons.map((lesson: any) => (
                            <SortableItem
                              key={lesson.id}
                              lesson={lesson}
                              moduleId={module.id}
                              onEdit={(moduleId, lesson) => {
                                if (lesson.type === 'quiz') {
                                  openEditQuizModal(moduleId, lesson);
                                } else {
                                  openEditLessonModal(moduleId, lesson);
                                }
                              }}
                              onDelete={deleteLesson}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {/* Add buttons */}
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className=' text-primary-main border-[#BF2F1F7A] hover:bg-[#BF2F1F0D] hover:text-primary-main hover:border-[#BF2F1F]'
                        onClick={() => openAddLessonModal(module.id)}
                      >
                        + Chuyên đề
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className=' text-primary-main border-[#BF2F1F7A] hover:bg-[#BF2F1F0D] hover:text-primary-main hover:border-[#BF2F1F]'
                        onClick={() => openAddQuizModal(module.id)}
                      >
                        + Bài kiểm tra
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add new module */}
            <Button
              variant='ghost'
              size='sm'
              className='border border-gray-200 text-red-500 rounded-lg bg-[#919EAB14] w-full p-7'
              onClick={openCreateModuleModal}
            >
              + Thêm chủ đề mới
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
