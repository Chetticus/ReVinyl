'use client';

import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { type CourseFormData } from '@/modules/auth/domain/schema';
import { Button } from '@/components/ui/button';

interface MediaIntroSectionProps {
  control: Control<CourseFormData>;
}

export default function MediaIntroSection({ control }: MediaIntroSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='bg-white rounded-xl shadow p-6'>
      {/* Header */}
      <div
        className='flex items-center justify-between cursor-pointer pb-6 border-b border-[#919EAB3D]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className='text-lg font-semibold text-gray-900 flex items-center'>
          Video giới thiệu
        </h2>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className='mt-6'>
          <FormField
            control={control}
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
                <div className='flex items-center justify-between'>
                  <FormMessage />
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
                </div>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
