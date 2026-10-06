'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/modules/auth/domain/schema';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ForgotPasswordFormData } from '@/modules/auth/domain/types';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';
import { AuthHeader, AuthPageContent } from '@/components/auth/shared';

function ForgotPasswordPage() {
  const { forgotPasswordMutation } = useAuth();
  const { mutate: forgotPassword, isPending, error } = forgotPasswordMutation;

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    const cleanData = {
      email: data.email.trim().toLowerCase(),
    };

    const validation = forgotPasswordSchema.safeParse(cleanData);
    if (!validation.success) {
      validation.error.errors.forEach(error => {
        form.setError(error.path[0] as keyof ForgotPasswordFormData, {
          type: 'manual',
          message: error.message,
        });
      });
      return;
    }
    forgotPassword(cleanData);
  };

  return (
    <AuthPageContent>
      <AuthHeader
        title='Quên mật khẩu'
        description='Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.'
      />

      <ForgotPasswordForm
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
        form={form}
      />
    </AuthPageContent>
  );
}

export default ForgotPasswordPage;
