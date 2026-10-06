'use client';

import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import CKEditorWrapper from '@/components/ui/CKEditorWrapper';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { type CourseFormData } from '@/modules/auth/domain/schema';

interface AdditionalInfoSectionProps {
  control: Control<CourseFormData>;
}

export default function AdditionalInfoSection({
  control,
}: AdditionalInfoSectionProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className='bg-white rounded-xl shadow p-6'>
      {/* Header */}
      <div
        className='flex items-center justify-between cursor-pointer pb-6 border-b border-[#919EAB3D]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className='text-lg font-semibold text-gray-900'>Thêm thông tin</h2>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className='mt-6 space-y-6'>
          <FormField
            control={control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>Mô tả</FormLabel>
                <FormControl>
                  <CKEditorWrapper
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder='Viết mô tả cho Chuyên đề...'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='requirements'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>Phạm vi tư liệu</FormLabel>
                <FormControl>
                  <CKEditorWrapper
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder='Viết yêu cầu cho Chuyên đề...'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='learning_outcomes'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-semibold'>
                  Giá trị khám phá
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Ví dụ: Mở rộng kiến thức, Tích luỹ kinh nghiệm'
                    rows={3}
                    className='border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                    {...field}
                  />
                </FormControl>
                <p className='text-xs text-gray-500 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  Kết quả người dùng sẽ đạt được sau khi kết thúc Chuyên đề, bạn
                  cần nhập các kết quả tách nhau bằng 1 giấu phẩy
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
