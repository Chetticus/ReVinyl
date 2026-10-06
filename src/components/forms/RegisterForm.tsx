'use client';

import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/modules/auth/domain/types';
import { authInputClass, authPrimaryButtonClass } from '@/components/auth/shared';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  error?: { message: string } | null;
  isPending?: boolean;
}

const RegisterForm = ({
  form,
  onSubmit,
  error,
  isPending,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-6'>
        <AuthErrorAlert
          error={error}
          fallback='Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
        />

        <FormField
          control={form.control}
          name='fullName'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Họ và tên'
                  className={`${authInputClass} ${
                    fieldState.error ? 'border-red-500 focus-visible:border-red-500' : ''
                  }`}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage className='mt-1 text-xs text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='email'
                  placeholder='example@gmail.com'
                  className={`${authInputClass} ${
                    fieldState.error ? 'border-red-500 focus-visible:border-red-500' : ''
                  }`}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage className='mt-1 text-xs text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Mật khẩu'
                    className={`${authInputClass} pr-12 ${
                      fieldState.error ? 'border-red-500 focus-visible:border-red-500' : ''
                    }`}
                    disabled={isPending}
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[#919EAB] hover:text-[#637381]'
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className='mt-1 text-xs text-red-500' />
            </FormItem>
          )}
        />

        <div className='text-center text-xs leading-[18px] text-[#637381]'>
          <p>Bằng cách đăng ký, tôi đồng ý với</p>
          <p>
            <span className='cursor-pointer text-[#212B36] underline hover:text-[#E4722C]'>
              Điều khoản sử dụng
            </span>
            {' và '}
            <span className='cursor-pointer text-[#212B36] underline hover:text-[#E4722C]'>
              Chính sách bảo mật.
            </span>
          </p>
        </div>

        <button type='submit' disabled={isPending} className={authPrimaryButtonClass}>
          {isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Đang tạo tài khoản...
            </span>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>
    </Form>
  );
};

export default RegisterForm;
