'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CKEditorWrapper from '@/components/ui/CKEditorWrapper';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  lessonFormSchema,
  type LessonFormData,
} from '@/modules/auth/domain/schema';
import {
  COURSE_STATUS_OPTIONS,
  LESSON_TYPE_OPTIONS,
} from '@/constants/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  onSubmit: (data: any) => void;
  editLesson?: { lessonId: string; form: any } | null;
}

export default function CreateLessonModal({
  isOpen,
  onClose,
  moduleId,
  onSubmit,
  editLesson = null,
}: CreateLessonModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!editLesson;

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      lessonType: 'video',
      description: '',
      videoUrl: '',
      content: '',
      status: 'draft',
    },
  });
  const lessonType = form.watch('lessonType');

  React.useEffect(() => {
    if (!isOpen) return;

    if (!isEditMode) {
      form.reset({
        title: '',
        lessonType: 'video',
        description: '',
        videoUrl: '',
        content: '',
        status: 'draft',
      });
      return;
    }

    if (isEditMode && editLesson?.form) {
      const formData = {
        title: editLesson.form.title ?? '',
        lessonType: editLesson.form.lessonType ?? 'video',
        description: editLesson.form.description ?? '',
        videoUrl: editLesson.form.videoUrl ?? '',
        content: editLesson.form.content ?? '',
        status: editLesson.form.status ?? 'draft',
      };

      form.reset(formData as any);
    }
  }, [isOpen, isEditMode, editLesson]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let payload: any;

      if (data.lessonType === 'video') {
        payload = {
          title: data.title,
          type: 'video',
          description: data.description,
          attachment: data.videoUrl,
          status: data.status,
          moduleId,
          ...(isEditMode ? { lessonId: editLesson?.lessonId } : {}),
        };
      } else {
        payload = {
          title: isEditMode ? data.title : `Chuyên đề ${data.title}`,
          type: 'content',
          description: data.description,
          attachment: data.content,
          status: data.status,
          moduleId,
          ...(isEditMode ? { lessonId: editLesson?.lessonId } : {}),
        };
      }

      await onSubmit(payload);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating lesson/quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='max-w-2xl max-h-[90vh] overflow-y-auto'
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-left'>
            {isEditMode ? 'Sửa Chuyên đề' : 'Thêm Chuyên đề'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    Tiêu đề
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Tiêu đề`}
                      className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className='text-sm font-semibold'>
                Loại Chuyên đề
              </FormLabel>
              <FormField
                control={form.control}
                name='lessonType'
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='h-12'>
                        <SelectValue placeholder='Chọn loại Chuyên đề' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LESSON_TYPE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    Tóm tắt
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tóm tắt'
                      rows={3}
                      className='border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {lessonType === 'video' && (
              <>
                <FormField
                  control={form.control}
                  name='videoUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        Thêm URL Video của bạn
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='url'
                          placeholder='Thêm URL Video của bạn'
                          className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                          {...field}
                        />
                      </FormControl>
                      <div className='flex items-center gap-1 text-xs text-gray-500'>
                        <Info className='w-3 h-3' />
                        Ví dụ:{' '}
                        <Button
                          type='button'
                          variant='link'
                          size='sm'
                          onClick={() => {
                            const exampleUrl =
                              'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                            field.onChange(exampleUrl);
                          }}
                          className='h-auto p-0 text-xs text-primary-main hover:text-primary-main underline'
                        >
                          https://www.youtube.com/watch?v=dQw4w9WgXcQ
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        Trạng thái
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Chọn trạng thái' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COURSE_STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}

            {lessonType === 'document' && (
              <>
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        Nội dung
                      </FormLabel>
                      <FormControl>
                        <CKEditorWrapper
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder='Viết gì đó...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        Trạng thái
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Chọn trạng thái' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COURSE_STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className='bg-gray-900 hover:bg-gray-800'
              >
                {isLoading
                  ? isEditMode
                    ? 'Đang lưu...'
                    : 'Đang tạo...'
                  : isEditMode
                    ? 'Lưu Chuyên đề'
                    : 'Tạo Chuyên đề'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
