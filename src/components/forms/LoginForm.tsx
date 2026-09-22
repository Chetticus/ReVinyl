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
import { LoginFormData } from '@/modules/auth/domain/types';
import { useRouter } from 'next/navigation';
import { ERouteTable } from '@/constants/route';
import { authInputClass, authPrimaryButtonClass } from '@/components/auth/shared';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

interface LoginFormProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
  error?: { message: string } | null;
  isPending?: boolean;
}

const LoginForm = ({ form, onSubmit, error, isPending }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-6'>
        <AuthErrorAlert
          error={error}
          fallback='Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'
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

        <button
          type='button'
          className='w-full text-right text-sm text-[#212B36] underline hover:text-[#E4722C]'
          onClick={() => router.push(ERouteTable.FORGOT_PASSWORD)}
        >
          Quên mật khẩu?
        </button>

        <button
          type='submit'
          disabled={isPending || !form.formState.isValid}
          className={authPrimaryButtonClass}
        >
          {isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Đang đăng nhập...
            </span>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>
    </Form>
  );
};

export default LoginForm;
