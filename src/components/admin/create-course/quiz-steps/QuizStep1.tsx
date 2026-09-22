'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { QuizFormData } from '@/modules/auth/domain/schema';
import { COURSE_STATUS_OPTIONS } from '@/constants/constants';

interface QuizStep1Props {
  control: Control<QuizFormData>;
}

export default function QuizStep1({ control }: QuizStep1Props) {
  return (
    <div className='space-y-4'>
      <FormField
        control={control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-sm font-semibold'>
              Tiêu đề bài kiểm tra <span className='text-red-500'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Nhập tiêu đề bài kiểm tra'
                className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-sm font-semibold'>Tóm tắt</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Mô tả ngắn về bài kiểm tra'
                rows={4}
                className='border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='status'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-sm font-semibold'>Trạng thái</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
