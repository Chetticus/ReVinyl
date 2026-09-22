'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/modules/admin/domain/categorySchema';

type CategoryAction = 'add' | 'edit' | 'view';

interface CategoryFormData {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  status: 'published' | 'draft';
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: CategoryAction;
  category?: Category | null;
  onSave: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  action,
  category,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<CategoryFormData>({
    title: '',
    slug: '',
    short_description: '',
    status: 'draft',
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

  React.useEffect(() => {
    if (isOpen) {
      if (category && (action === 'edit' || action === 'view')) {
        setFormData({
          id: category.id,
          title: category.title,
          slug: category.slug,
          short_description: category.short_description,
          status: category.status,
        });
      } else {
        setFormData({
          title: '',
          slug: '',
          short_description: '',
          status: 'draft',
        });
      }
    }
  }, [isOpen, category, action]);

  // Auto-generate slug when title changes (only for add action)
  React.useEffect(() => {
    if (action === 'add' && formData.title && formData.title.trim()) {
      const generatedSlug = generateSlug(formData.title);
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.title, action]);

  const handleFormChange = (
    field: keyof CategoryFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const isDisabled = action === 'view' || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            {action === 'add' && 'Thêm danh mục'}
            {action === 'edit' && 'Chỉnh sửa danh mục'}
            {action === 'view' && 'Chi tiết danh mục'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Chi tiết section */}
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Chi tiết</h3>
              <p className='text-sm text-gray-600'>Tiêu đề, mô tả ngắn</p>
            </div>

            {/* Title */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Tiêu đề
              </label>
              <Input
                placeholder='Tiêu đề'
                value={formData.title || ''}
                onChange={e => handleFormChange('title', e.target.value)}
                disabled={isDisabled}
              />
            </div>

            {/* Slug */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>Slug</label>
              <Input
                placeholder='slug'
                value={formData.slug || ''}
                onChange={e => handleFormChange('slug', e.target.value)}
                disabled={true}
                readOnly
                className='bg-gray-50 cursor-not-allowed'
              />
              {action === 'add' && (
                <p className='text-xs text-gray-500'>
                  Liên kết được tự động tạo từ tiêu đề
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Mô tả ngắn
              </label>
              <Textarea
                placeholder='Mô tả ngắn'
                value={formData.short_description || ''}
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
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          {action !== 'view' && (
            <Button
              onClick={handleSave}
              disabled={
                isLoading || !formData.title || !formData.short_description
              }
              className='bg-gray-900 hover:bg-gray-800'
            >
              {isLoading
                ? 'Đang lưu...'
                : action === 'add'
                  ? 'Tạo danh mục'
                  : 'Cập nhật'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
