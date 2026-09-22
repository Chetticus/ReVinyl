'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  moduleFormSchema,
  type ModuleFormData,
} from '@/modules/auth/domain/schema';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => void;
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    description?: string;
  };
}

export default function ModuleModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: ModuleModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleFormSchema),
    mode: 'onChange',
    defaultValues: {
      moduleTitle: '',
      moduleDescription: '',
    },
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      form.reset({
        moduleTitle: initialData.title,
        moduleDescription: initialData.description || '',
      });
    } else if (isOpen && mode === 'create') {
      form.reset({
        moduleTitle: '',
        moduleDescription: '',
      });
    }
  }, [isOpen, mode, initialData, form]);

  const handleSubmit = async (data: ModuleFormData) => {
    setIsLoading(true);
    try {
      await onSubmit({
        title: data.moduleTitle,
        description: data.moduleDescription,
      });
      if (mode === 'create') {
        form.reset();
      }
      onClose();
    } catch (error) {
      console.error('Error creating module:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormError = (errors: any) => {
    setIsLoading(false);
    console.log('Form validation errors:', errors);
  };

  const onFormSubmit = () => {
    form.handleSubmit(handleSubmit, handleFormError)();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md' showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-left'>
            {mode === 'create' ? 'Thêm chủ đề mới' : 'Chỉnh sửa chủ đề'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className='space-y-4'>
            {/* Title */}
            <FormField
              control={form.control}
              name='moduleTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    Tiêu đề <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tiêu đề chủ đề'
                      className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F] aria-invalid:border-red-500'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='moduleDescription'
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
          </div>
        </Form>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type='button'
            onClick={onFormSubmit}
            disabled={isLoading}
            className='bg-gray-900 hover:bg-gray-800'
          >
            {isLoading
              ? mode === 'create'
                ? 'Đang thêm...'
                : 'Đang cập nhật...'
              : mode === 'create'
                ? 'Thêm chủ đề'
                : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
