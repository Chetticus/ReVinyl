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
import { ResetPasswordFormData } from '@/modules/auth/domain/types';
import {
  AuthBackLink,
  authInputClass,
  authPrimaryButtonClass,
} from '@/components/auth/shared';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

interface UpdatePasswordFormProps {
  form: UseFormReturn<ResetPasswordFormData>;
  onSubmit: (data: ResetPasswordFormData) => void;
  error?: { message: string } | null;
  isPending?: boolean;
}

const UpdatePasswordForm = ({
  form,
  onSubmit,
  error,
  isPending,
}: UpdatePasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-6'>
        <AuthErrorAlert
          error={error}
          fallback='Đặt lại mật khẩu thất bại. Vui lòng thử lại.'
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
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[#919EAB] hover:text-[#637381] disabled:opacity-50'
                    disabled={isPending}
                    tabIndex={-1}
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

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Nhập lại mật khẩu'
                    className={`${authInputClass} pr-12 ${
                      fieldState.error ? 'border-red-500 focus-visible:border-red-500' : ''
                    }`}
                    disabled={isPending}
                    {...field}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[#919EAB] hover:text-[#637381] disabled:opacity-50'
                    disabled={isPending}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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

        <button
          type='submit'
          disabled={isPending || !form.formState.isValid}
          className={authPrimaryButtonClass}
        >
          {isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Đang đặt lại mật khẩu...
            </span>
          ) : (
            'Đặt lại mật khẩu'
          )}
        </button>

        <div className='flex justify-center'>
          <AuthBackLink />
        </div>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
