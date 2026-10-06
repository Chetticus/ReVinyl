'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

type UserAction = 'add' | 'edit' | 'view';

interface UserFormData {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
  age?: number;
  grade?: string;
  avatar?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: UserAction;
  user?: UserFormData | null;
  onSave: (data: UserFormData) => void;
  onDelete?: (userId: string) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  action,
  user,
  onSave,
  onDelete,
}) => {
  // Form states
  const [formData, setFormData] = React.useState<UserFormData>({
    fullName: '',
    email: '',
    password: '',
    role: '',
    age: undefined,
    grade: '',
  });

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Người dùng' },
  ];

  const gradeOptions = [
    { value: 'G1', label: 'Lớp 1' },
    { value: 'G2', label: 'Lớp 2' },
    { value: 'G3', label: 'Lớp 3' },
    { value: 'G4', label: 'Lớp 4' },
    { value: 'G5', label: 'Lớp 5' },
    { value: 'G6', label: 'Lớp 6' },
    { value: 'G7', label: 'Lớp 7' },
    { value: 'G8', label: 'Lớp 8' },
    { value: 'G9', label: 'Lớp 9' },
    { value: 'G10', label: 'Lớp 10' },
    { value: 'G11', label: 'Lớp 11' },
    { value: 'G12', label: 'Lớp 12' },
  ];

  // Initialize form data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (action === 'add') {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          role: '',
          age: undefined,
          grade: '',
        });
      } else if (user) {
        setFormData({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          role: user.role,
          age: user.age,
          grade: user.grade,
        });
      }
    }
  }, [isOpen, action, user]);

  const handleFormChange = (
    field: keyof UserFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (action === 'add' || action === 'edit') {
      onSave(formData);
    }
    onClose();
  };

  const handleDeleteUser = () => {
    if (onDelete && user?.id) {
      onDelete(user.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            {action === 'add'
              ? 'Thêm người dùng mới'
              : action === 'edit'
                ? 'Chỉnh sửa người dùng'
                : 'Chi tiết người dùng'}
          </DialogTitle>
        </DialogHeader>

        <div className='bg-white rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Left Column of Form Fields */}
            <div className='space-y-4'>
              {/* Role */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Vai trò
                </label>
                <div className='relative'>
                  <select
                    value={formData.role}
                    onChange={e => handleFormChange('role', e.target.value)}
                    disabled={action === 'view'}
                    className='appearance-none px-4 h-10 w-full py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
                  >
                    <option value='' className='py-2'>
                      Chọn vai trò
                    </option>
                    {roleOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        className='py-2'
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                    <svg
                      className='w-4 h-4 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Họ và tên
                </label>
                <Input
                  value={formData.fullName}
                  onChange={e => handleFormChange('fullName', e.target.value)}
                  disabled={action === 'view'}
                  placeholder='Nhập họ và tên'
                  className='!h-10 !p-3 !border-input !bg-background !text-sm !ring-offset-background !placeholder:text-muted-foreground !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-ring !focus-visible:ring-offset-2 !disabled:cursor-not-allowed !disabled:opacity-50 !my-0'
                />
              </div>

              {/* Grade */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Lớp</label>
                <div className='relative'>
                  <select
                    value={formData.grade || ''}
                    onChange={e => handleFormChange('grade', e.target.value)}
                    disabled={action === 'view' || action === 'edit'}
                    className='appearance-none px-4 h-10 w-full py-2 border border-[#919EAB52] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer pr-10'
                  >
                    <option value='' className='py-2'>
                      Chọn lớp
                    </option>
                    {gradeOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        className='py-2'
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                    <svg
                      className='w-4 h-4 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </div>
                </div>
                {action === 'edit' && (
                  <p className='text-xs text-gray-500'>
                    Lớp không thể chỉnh sửa sau khi tạo
                  </p>
                )}
              </div>

              {/* Age (only for edit action) */}
              {action === 'edit' && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Tuổi
                  </label>
                  <Input
                    type='number'
                    value={formData.age || ''}
                    onChange={e =>
                      handleFormChange('age', parseInt(e.target.value) || 0)
                    }
                    disabled={false}
                    placeholder='Nhập tuổi'
                    className='!h-10 !p-3 !border-input !bg-background !text-sm !ring-offset-background !placeholder:text-muted-foreground !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-ring !focus-visible:ring-offset-2 !disabled:cursor-not-allowed !disabled:opacity-50 !my-0'
                  />
                </div>
              )}
            </div>

            {/* Right Column of Form Fields */}
            <div className='space-y-4'>
              {/* Email */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Email
                </label>
                <Input
                  type='email'
                  value={formData.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  disabled={action === 'view' || action === 'edit'}
                  placeholder='Nhập email'
                  className='!h-10 !p-3 !border-input !bg-background !text-sm !ring-offset-background !placeholder:text-muted-foreground !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-ring !focus-visible:ring-offset-2 !disabled:cursor-not-allowed !disabled:opacity-50 !my-0'
                />
                {action === 'edit' && (
                  <p className='text-xs text-gray-500'>
                    Email không thể chỉnh sửa sau khi tạo
                  </p>
                )}
              </div>

              {/* Password (only for add action) */}
              {action === 'add' && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Mật khẩu
                  </label>
                  <Input
                    type='password'
                    value={formData.password || ''}
                    onChange={e => handleFormChange('password', e.target.value)}
                    placeholder='Nhập mật khẩu'
                    className='!h-10 !p-3 !border-input !bg-background !text-sm !ring-offset-background !placeholder:text-muted-foreground !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-ring !focus-visible:ring-offset-2 !disabled:cursor-not-allowed !disabled:opacity-50 !my-0'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Delete Button */}
          {action !== 'add' && onDelete && (
            <div className='mt-6 pt-6'>
              <Button
                variant='destructive'
                className='bg-red-100 text-red-600 hover:bg-red-200 border border-red-200'
                onClick={handleDeleteUser}
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Xóa người dùng
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3'>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          {action !== 'view' && (
            <Button
              className='bg-gray-900 hover:bg-gray-800'
              onClick={handleSave}
            >
              Lưu thay đổi
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
