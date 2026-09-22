'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
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
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Info } from 'lucide-react';
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';
import { type CourseFormData } from '@/modules/auth/domain/schema';
import { COURSE_STATUS_OPTIONS } from '@/constants/constants';

interface CourseDetailsSectionProps {
  control: Control<CourseFormData>;
  categoryOptions: { value: string; label: string }[];
  setValue: UseFormSetValue<CourseFormData>;
}

export default function CourseDetailsSection({
  control,
  categoryOptions,
  setValue,
}: CourseDetailsSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Watch the title field to auto-generate slug
  const titleValue = useWatch({
    control,
    name: 'title',
  });

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (titleValue && titleValue.trim()) {
      const generatedSlug = generateSlug(titleValue);
      setValue('slug', generatedSlug);
    }
  }, [titleValue, setValue]);

  const validateAndProcessFile = (
    file: File,
    onChange: (file: File | null) => void
  ) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP)');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 5MB.');
      return false;
    }

    try {
      console.log('Thumbnail file selected:', file.name, file.size);
      onChange(file);
      return true;
    } catch (error) {
      console.error('Error selecting file:', error);
      return false;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    onChange: (file: File | null) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      validateAndProcessFile(file, onChange);
    }
  };
  return (
    <div className='bg-white rounded-xl shadow p-6'>
      <h2 className='text-lg font-semibold text-gray-900 pb-6 border-b border-[#919EAB3D]'>
        Chi tiết
      </h2>

      <div className='space-y-6 mt-6'>
        <FormField
          control={control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder='VD: Bản thu vinyl nhạc vàng' {...field} />
              </FormControl>
              <p className='text-xs text-gray-500 flex items-center'>
                <Info className='w-3 h-3 mr-1' />
                Tiêu đề đã dài tối đa 30 ký tự
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='category_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>Danh mục</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <SelectTrigger className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F] aria-invalid:border-red-500'>
                    <SelectValue placeholder='Danh mục' />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                Liên kết cố định
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='khoa-hoc-moi'
                  className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F] bg-gray-50'
                  {...field}
                  disabled
                  readOnly
                />
              </FormControl>
              <p className='text-xs text-gray-500 flex items-center'>
                <Info className='w-3 h-3 mr-1' />
                Liên kết được tự động tạo từ tiêu đề.{' '}
                <span className='text-primary-main'>
                  https://kiteacademy.com/{field.value || 'khoa-hoc-moi'}
                </span>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='short_description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                Giới thiệu
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Giới thiệu'
                  className='min-h-[120px] border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='thumbnail'
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormLabel>Hình thu nhỏ</FormLabel>
              <FormControl>
                <div
                  className={`border-2 border-dashed bg-[#919EAB]/8 rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? 'border-[#BF2F1F] bg-primary-main/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, onChange)}
                >
                  {!value ? (
                    <div className='flex flex-col items-center'>
                      <div className='w-18 h-18 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-4'>
                        <Image
                          width={64}
                          height={64}
                          alt='image'
                          src='/images/upload.png'
                        />
                      </div>
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Thả hoặc chọn tệp tin
                      </h3>
                      <p className='text-sm text-gray-500 mb-4'>
                        Thả tệp tin vào đây hoặc nhấp để{' '}
                        <span className='text-primary-main hover:underline cursor-pointer'>
                          duyệt
                        </span>{' '}
                        từ máy tính
                      </p>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center'>
                      <Image
                        src={
                          value instanceof File
                            ? URL.createObjectURL(value)
                            : value
                        }
                        alt='Thumbnail Preview'
                        width={1000}
                        height={600}
                        className='rounded-lg mb-4'
                      />
                      <p className='text-sm text-gray-600 mb-2'>
                        {value instanceof File ? value.name : 'Uploaded image'}
                      </p>
                      <Button
                        variant='outline'
                        size='sm'
                        type='button'
                        onClick={e => {
                          e.stopPropagation();
                          onChange(null);
                          if (inputRef.current) {
                            inputRef.current.value = '';
                          }
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    ref={inputRef}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        validateAndProcessFile(file, onChange);
                      }
                    }}
                    className='hidden'
                    id='thumbnail-upload'
                  />
                </div>
              </FormControl>
              <p className='text-xs text-gray-500 flex items-center'>
                <Info className='w-3 h-3 mr-1' />
                <span className='font-medium'>Kích thước:</span> 700x430 pixel,{' '}
                <span className='font-medium'>Hỗ trợ tệp:</span> JPG, JPEG, PNG,
                GIF, WEBP
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                Trạng thái
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='h-12 border-gray-300 focus:border-[#BF2F1F] focus:ring-[#BF2F1F] aria-invalid:border-red-500'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
