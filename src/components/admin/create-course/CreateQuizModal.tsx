'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  quizFormSchema,
  type QuizFormData,
} from '@/modules/auth/domain/schema';
import { type Question } from '@/modules/admin/domain/types';
import QuizStep1 from './quiz-steps/QuizStep1';
import QuizStep2 from './quiz-steps/QuizStep2';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  moduleId: string;
  // Optional: pass data to edit an existing quiz
  editQuiz?: {
    form?: Partial<QuizFormData>;
    questions?: Question[];
  } | null;
}

const steps = [
  { id: 1, title: 'Bài kiểm tra' },
  { id: 2, title: 'Câu hỏi' },
];

export default function CreateQuizModal({
  isOpen,
  onClose,
  onSubmit,
  moduleId,
  editQuiz = null,
}: CreateQuizModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const isEditMode = !!editQuiz;

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: 'draft',
    },
  });

  // Prefill when editing an existing quiz
  useEffect(() => {
    if (!isOpen) return;
    if (editQuiz) {
      const preset: Partial<QuizFormData> = {
        title: editQuiz.form?.title ?? '',
        description: editQuiz.form?.description ?? '',
        status: editQuiz.form?.status ?? 'draft',
      };
      form.reset(preset as QuizFormData);
      setQuestions(editQuiz.questions ?? []);
      setCurrentStep(1);
    }
  }, [isOpen, editQuiz]);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate Step 1 fields
      const isValid = await form.trigger(['title']);
      if (!isValid) return;
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const values = form.getValues();
    const titleWithPrefix = values.title?.trim()
      ? `Bài kiểm tra ${values.title.trim()}`
      : 'Bài kiểm tra';
    const quizData = {
      ...values,
      title: editQuiz ? values.title : titleWithPrefix,
      type: 'quiz',
      moduleId,
      questions,
    };
    onSubmit(quizData);
    handleReset();
  };

  const handleReset = () => {
    setCurrentStep(1);
    setQuestions([]);
    setIsEditingQuestion(false);
    form.reset({
      title: '',
      description: '',
      status: 'draft',
    });
    onClose();
  };

  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-8'>
      <div className='flex items-center space-x-4'>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className='flex items-center flex-col gap-1'>
              <div
                className={`flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary-main border-[#BF2F1F] text-white'
                    : 'border-gray-400 bg-gray-400 text-white'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className='w-5 h-5' color='white' />
                ) : (
                  step.id
                )}
              </div>
              <div className='mt-2'>
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? '' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-6 ${
                  currentStep > step.id ? 'bg-primary-main' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) handleReset();
      }}
    >
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto p-6'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-left'>
            {isEditMode ? 'Sửa bài kiểm tra' : 'Thêm bài kiểm tra'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className='py-4'>
            {renderStepIndicator()}

            <div className='mt-6'>
              {currentStep === 1 && <QuizStep1 control={form.control} />}
              {currentStep === 2 && (
                <QuizStep2
                  questions={questions}
                  onQuestionsChange={setQuestions}
                  onEditingStateChange={setIsEditingQuestion}
                />
              )}
            </div>
          </div>
        </Form>

        {!(currentStep === 2 && isEditingQuestion) && (
          <DialogFooter className='flex items-center !justify-between w-full'>
            <div>
              {currentStep > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handlePrevious}
                >
                  Quay lại
                </Button>
              )}
            </div>
            <div className='flex gap-2'>
              <Button type='button' variant='ghost' onClick={handleReset}>
                Hủy bỏ
              </Button>
              {currentStep < 2 ? (
                <Button type='button' onClick={handleNext}>
                  Lưu & Tiếp tục
                </Button>
              ) : (
                <Button type='button' onClick={handleSubmit}>
                  {isEditMode ? 'Cập nhật bài kiểm tra' : 'Tạo bài kiểm tra'}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
