'use client';

import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ForgotPasswordFormData } from '@/modules/auth/domain/types';
import {
  AuthBackLink,
  authInputClass,
  authPrimaryButtonClass,
} from '@/components/auth/shared';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotPasswordFormData>;
  onSubmit: (data: ForgotPasswordFormData) => void;
  error?: { message: string } | null;
  isPending?: boolean;
}

const ForgotPasswordForm = ({
  form,
  onSubmit,
  error,
  isPending,
}: ForgotPasswordFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-6'>
        <AuthErrorAlert
          error={error}
          fallback='Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.'
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Email'
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

        <button
          type='submit'
          disabled={isPending || !form.formState.isValid}
          className={authPrimaryButtonClass}
        >
          {isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Đang gửi yêu cầu...
            </span>
          ) : (
            'Gửi yêu cầu'
          )}
        </button>

        <div className='flex justify-center'>
          <AuthBackLink />
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
