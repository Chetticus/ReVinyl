'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, Loader2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useUserCourse } from '@/modules/auth/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';

type TabType = 'profile' | 'security';

// Grade enum
enum Grade {
  G1 = 'G1',
  G2 = 'G2',
  G3 = 'G3',
  G4 = 'G4',
  G5 = 'G5',
  G6 = 'G6',
  G7 = 'G7',
  G8 = 'G8',
  G9 = 'G9',
  G10 = 'G10',
  G11 = 'G11',
  G12 = 'G12',
}

// Grade options for select
const gradeOptions = [
  { value: Grade.G1, label: 'Lớp 1 (G1)' },
  { value: Grade.G2, label: 'Lớp 2 (G2)' },
  { value: Grade.G3, label: 'Lớp 3 (G3)' },
  { value: Grade.G4, label: 'Lớp 4 (G4)' },
  { value: Grade.G5, label: 'Lớp 5 (G5)' },
  { value: Grade.G6, label: 'Lớp 6 (G6)' },
  { value: Grade.G7, label: 'Lớp 7 (G7)' },
  { value: Grade.G8, label: 'Lớp 8 (G8)' },
  { value: Grade.G9, label: 'Lớp 9 (G9)' },
  { value: Grade.G10, label: 'Lớp 10 (G10)' },
  { value: Grade.G11, label: 'Lớp 11 (G11)' },
  { value: Grade.G12, label: 'Lớp 12 (G12)' },
];

// Schema validation for Profile
const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên không được để trống')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự'),
  age: z
    .string()
    .min(1, 'Tuổi không được để trống')
    .refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 120;
    }, 'Tuổi phải là số từ 1 đến 120'),
  grade: z.nativeEnum(Grade, {
    errorMap: () => ({ message: 'Vui lòng chọn lớp học' }),
  }),
});

// Schema validation for Security
const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu cũ không được để trống'),
    newPassword: z
      .string()
      .min(1, 'Mật khẩu mới không được để trống')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được để trống'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type SecurityFormData = z.infer<typeof securitySchema>;

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatarMutation, getUserMe, updateUserMutation } =
    useUserCourse();

  // Profile form setup
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      age: '',
      grade: Grade.G1,
    },
  });

  // Security form setup
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Map user data to form when data is available
  useEffect(() => {
    if (getUserMe?.data) {
      const userData = getUserMe.data;

      profileForm.reset({
        fullName: userData.fullName || '',
        age: (userData as any).age || '',
        grade: (userData as any).grade || Grade.G1,
      });
    }
  }, [getUserMe?.data, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsProfileSaving(true);
    try {
      await updateUserMutation.mutateAsync(data as any);
      queryClient.invalidateQueries({ queryKey: ['getUserMe'] });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsProfileSaving(false);
    }
  };

  const onSecuritySubmit = async (data: SecurityFormData) => {
    setIsPasswordUpdating(true);
    try {
      console.log('Update password:', data);
      // Handle password update logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      securityForm.reset(); // Reset form after successful update
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 5MB.');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await uploadAvatarMutation.mutateAsync(file);
      queryClient.invalidateQueries({ queryKey: ['getUserMe'] });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Get user avatar from API data
  const userAvatar = getUserMe?.data?.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
  console.log("🚀 ~ SettingsPage ~ userAvatar:", userAvatar)

  return (
    <div className='bg-white shadow h-max p-6 rounded-2xl'>
      <h2 className='text-2xl font-semibold mb-6'>Setting</h2>

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleAvatarUpload}
        className='hidden'
      />

      {/* Tabs */}
      <div className='border-b border-gray-200 mb-6'>
        <div className='flex space-x-8'>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            Hồ sơ
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'security'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('security')}
          >
            Bảo mật
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className='space-y-6'>
          {/* Profile Banner */}
          <Card className='overflow-hidden'>
            <div className='relative h-40 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500'>
              <div
                className='absolute inset-0'
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundBlendMode: 'overlay',
                }}
              >
                <div
                  className='absolute inset-0'
                  style={{
                    background: "url('/images/abstract-bg.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.3,
                  }}
                ></div>
              </div>

              <div className='absolute bottom-4 left-4 flex items-center gap-4'>
                <div className='relative'>
                  <img
                    src={userAvatar}
                    alt='Profile'
                    className='w-16 h-16 rounded-full border-4 border-white object-cover'
                  />
                  <button
                    className='absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 disabled:opacity-50'
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className='w-3 h-3 text-gray-600 animate-spin' />
                    ) : (
                      <Camera className='w-3 h-3 text-gray-600' />
                    )}
                  </button>
                </div>
              </div>

              {/*<button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">*/}
              {/*  Sửa ảnh bìa*/}
              {/*</button>*/}
            </div>
          </Card>

          {/* Profile Form */}
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className='space-y-6'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Full Name */}
                <FormField
                  control={profileForm.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700'>
                        Họ và tên
                      </label>
                      <FormControl>
                        <Input
                          placeholder='Nhập họ và tên'
                          className='border border-gray-200'
                          disabled={isProfileSaving}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={profileForm.control}
                  name='age'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium text-gray-700'>
                        Tuổi
                      </label>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Nhập tuổi'
                          className='border border-gray-200'
                          disabled={isProfileSaving}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grade */}
                <FormField
                  control={profileForm.control}
                  name='grade'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium text-gray-700'>
                        Lớp
                      </label>
                      <FormControl>
                        <div className='relative'>
                          <select
                            {...field}
                            disabled={isProfileSaving}
                            className='w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 appearance-none bg-white pr-10'
                          >
                            {gradeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  disabled={isProfileSaving}
                  className='bg-gray-800 hover:bg-gray-700 text-white px-6'
                >
                  {isProfileSaving ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className='space-y-6'>
          <Form {...securityForm}>
            <form
              onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
              className='space-y-6'
            >
              {/* Current Password */}
              <FormField
                control={securityForm.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium text-gray-700'>
                      Mật khẩu cũ
                    </label>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder='Mật khẩu cũ'
                          className='border border-gray-200 pr-12'
                          disabled={isPasswordUpdating}
                          {...field}
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                          disabled={isPasswordUpdating}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={securityForm.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium text-gray-700'>
                      Mật khẩu mới
                    </label>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder='Mật khẩu mới'
                          className='border border-gray-200 pr-12'
                          disabled={isPasswordUpdating}
                          {...field}
                        />
                        <button
                          type='button'
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                          disabled={isPasswordUpdating}
                        >
                          {showNewPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={securityForm.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium text-gray-700'>
                      Nhập lại mật khẩu mới
                    </label>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='Nhập lại mật khẩu mới'
                          className='border border-gray-200 pr-12'
                          disabled={isPasswordUpdating}
                          {...field}
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                          disabled={isPasswordUpdating}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  disabled={isPasswordUpdating}
                  className='bg-gray-800 hover:bg-gray-700 text-white px-6'
                >
                  {isPasswordUpdating ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật mật khẩu'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
