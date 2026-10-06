'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateCategory } from '@/modules/admin/hooks/useCategoryAdmin';
import { CreateCategoryRequest } from '@/modules/admin/domain/categorySchema';

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategoryMutation = useCreateCategory();

  const [formData, setFormData] = React.useState({
    title: '',
    slug: '',
    short_description: '',
    status: 'draft' as 'published' | 'draft',
  });

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const createData: CreateCategoryRequest = {
      title: formData.title,
      slug: formData.slug,
      short_description: formData.short_description,
      status: formData.status,
    };

    createCategoryMutation.mutate(createData, {
      onSuccess: () => {
        router.push('/admin/topics/categories');
      },
    });
  };

  const isDisabled = createCategoryMutation.isPending;

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Thêm danh mục</h1>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Chuyên đề</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>Thêm danh mục</span>
          </div>
        </div>
        <Button
          variant='outline'
          onClick={() => router.push('/admin/topics/categories')}
          className='flex items-center space-x-2'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Quay lại</span>
        </Button>
      </div>

      {/* Form */}
      <div className='bg-white rounded-xl p-6 space-y-6'>
        {/* Chi tiết section */}
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Chi tiết</h3>
            <p className='text-sm text-gray-600'>Tiêu đề, mô tả ngắn</p>
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Tiêu đề</label>
            <Input
              placeholder='Tiêu đề'
              value={formData.title}
              onChange={e => handleFormChange('title', e.target.value)}
              disabled={isDisabled}
            />
          </div>

          {/* Slug */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Slug</label>
            <Input
              placeholder='slug'
              value={formData.slug}
              onChange={e => handleFormChange('slug', e.target.value)}
              disabled={isDisabled}
            />
          </div>

          {/* Short Description */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Mô tả ngắn
            </label>
            <Textarea
              placeholder='Mô tả ngắn'
              value={formData.short_description}
              onChange={e =>
                handleFormChange('short_description', e.target.value)
              }
              rows={3}
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Publish Toggle */}
        <div className='flex items-center space-x-3'>
          <Switch
            checked={formData.status === 'published'}
            onCheckedChange={checked =>
              handleFormChange('status', checked ? 'published' : 'draft')
            }
            disabled={isDisabled}
          />
          <span className='text-sm font-medium text-gray-700'>Xuất bản</span>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 pt-6 border-t'>
          <Button
            variant='outline'
            onClick={() => router.push('/admin/topics/categories')}
            disabled={isDisabled}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isDisabled ||
              !formData.title ||
              !formData.slug ||
              !formData.short_description
            }
            className='bg-gray-900 hover:bg-gray-800'
          >
            {isDisabled ? 'Đang tạo...' : 'Tạo danh mục'}
          </Button>
        </div>
      </div>
    </div>
  );
}
