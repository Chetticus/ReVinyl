'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, CheckboxInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  questionFormSchema,
  type QuestionFormData,
} from '@/modules/auth/domain/schema';
import { type Question } from '@/modules/admin/domain/types';

interface QuizStep2Props {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
  onEditingStateChange: (isEditing: boolean) => void;
}

export default function QuizStep2({
  questions,
  onQuestionsChange,
  onEditingStateChange,
}: QuizStep2Props) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const questionForm = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      question: '',
      answers: [{ value: '' }, { value: '' }, { value: '' }],
      correct_answer: '',
      explanation: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: questionForm.control,
    name: 'answers',
  });

  useEffect(() => {
    onEditingStateChange(showQuestionForm);
  }, [showQuestionForm, onEditingStateChange]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    questionForm.reset({
      question: '',
      answers: [{ value: '' }, { value: '' }, { value: '' }],
      correct_answer: '',
      explanation: '',
    });
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = async (data: any) => {
    const isValid = await questionForm.trigger([
      'question',
      'answers',
      'correct_answer',
    ]);

    if (!isValid) {
      console.log('Validation failed:', questionForm.formState.errors);
      return;
    }

    const answerValues = data.answers
      .map((opt: any) => opt.value || opt)
      .filter((answer: string) => answer && answer.trim() !== '')
      .map((answer: string) => answer.trim().toLowerCase());

    const uniqueAnswers = new Set(answerValues);
    if (uniqueAnswers.size !== answerValues.length) {
      return;
    }

    const newQuestion: Question = {
      id: editingQuestion?.id || Date.now(),
      question: data.question,
      answers: data.answers
        .map((opt: any) => opt.value || opt)
        .filter((answer: string) => answer && answer.trim() !== ''),
      correct_answer: data.correct_answer,
      explanation: data.explanation,
    };

    let updatedQuestions;
    if (editingQuestion) {
      updatedQuestions = questions.map(q =>
        q.id === editingQuestion.id ? newQuestion : q
      );
    } else {
      updatedQuestions = [...questions, newQuestion];
    }

    onQuestionsChange(updatedQuestions);
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    questionForm.reset({
      question: question.question,
      answers: question.answers.map(answer => ({ value: answer })),
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
    });
    setShowQuestionForm(true);
  };

  const handleCancelQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  if (showQuestionForm) {
    return (
      <Form {...questionForm}>
        <form
          className='space-y-4'
          onSubmit={questionForm.handleSubmit(handleSaveQuestion)}
        >
          <FormField
            control={questionForm.control}
            name='question'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>
                  Nhập câu hỏi
                </FormLabel>
                <FormControl>
                  <Textarea placeholder='Nhập câu hỏi' rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className='text-sm font-semibold'>Đáp án</FormLabel>
            <div className='space-y-2 mt-2'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-center space-x-4'>
                  <FormField
                    control={questionForm.control}
                    name={`answers.${index}.value`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                            className='h-10'
                            {...field}
                            onChange={e => {
                              field.onChange(e);
                              if (
                                questionForm.formState.isSubmitted ||
                                questionForm.formState.isDirty
                              ) {
                                setTimeout(() => {
                                  questionForm.trigger('answers');
                                }, 100);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex items-center space-x-2'>
                    <CheckboxInput
                      checked={
                        questionForm.watch('correct_answer') ===
                          questionForm.watch(`answers.${index}.value`) &&
                        questionForm.watch('correct_answer') !== ''
                      }
                      onChange={checked => {
                        if (checked) {
                          const answerValue = questionForm.getValues(
                            `answers.${index}.value`
                          );
                          if (answerValue && answerValue.trim() !== '') {
                            questionForm.setValue(
                              'correct_answer',
                              answerValue,
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              }
                            );
                          }
                        } else {
                          questionForm.setValue('correct_answer', '', {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }
                      }}
                    />
                    {fields.length > 2 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          const currentCorrectAnswer =
                            questionForm.getValues('correct_answer');
                          const answerToRemove = questionForm.getValues(
                            `answers.${index}.value`
                          );

                          remove(index);

                          if (currentCorrectAnswer === answerToRemove) {
                            questionForm.setValue('correct_answer', '', {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }

                          if (
                            questionForm.formState.isSubmitted ||
                            questionForm.formState.isDirty
                          ) {
                            setTimeout(() => {
                              questionForm.trigger('answers');
                            }, 100);
                          }
                        }}
                        className='text-[#637381] hover:text-[#637381] !p-1'
                      >
                        <Trash2 className='!w-5 !h-5' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='flex justify-center mt-3'>
              <Button
                type='button'
                onClick={() => {
                  append({ value: '' });
                  if (
                    questionForm.formState.isSubmitted ||
                    questionForm.formState.isDirty
                  ) {
                    setTimeout(() => {
                      questionForm.trigger('answers');
                    }, 100);
                  }
                }}
                className='w-full bg-[#919EAB14] hover:bg-gray-300 text-[#212B36]'
              >
                <Plus /> Thêm đáp án
              </Button>
            </div>

            <FormField
              control={questionForm.control}
              name='answers'
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={questionForm.control}
            name='correct_answer'
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={questionForm.control}
            name='explanation'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>
                  Giải thích đáp án đúng
                </FormLabel>
                <FormControl>
                  <Textarea placeholder='Viết gì đó...' rows={2} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='flex justify-between pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancelQuestionForm}
            >
              Quay lại
            </Button>
            <div className='flex space-x-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={handleCancelQuestionForm}
              >
                Hủy bỏ
              </Button>
              <Button type='submit'>Lưu & Tiếp tục</Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <div className='space-y-4'>
      {questions.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          Chưa có câu hỏi nào. Nhấp &#34;Thêm câu hỏi&#34; để bắt đầu.
        </div>
      ) : (
        <div className='space-y-3'>
          {questions.map(q => (
            <div
              key={q.id}
              className='border rounded-lg p-3 flex items-start justify-between'
            >
              <div className='font-medium mb-2'>{q.question}</div>
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleEditQuestion(q)}
                  className='ml-3 p-2'
                >
                  <SquarePen className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='flex justify-center pt-4'>
        <Button
          onClick={handleAddQuestion}
          className='w-full bg-[#919EAB14] hover:bg-gray-300 text-[#212B36]'
        >
          <Plus className='w-4 h-4 mr-2' /> Thêm câu hỏi
        </Button>
      </div>
    </div>
  );
}
