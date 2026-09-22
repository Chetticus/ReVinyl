'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/modules/auth/domain/schema';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ResetPasswordFormData } from '@/modules/auth/domain/types';
import { useAuthStore } from '@/stores/useAuthStore';
import UpdatePasswordForm from '@/components/forms/UpdatePasswordForm';
import { ERouteTable } from '@/constants/route';
import { AuthHeader, AuthPageContent } from '@/components/auth/shared';

function UpdatePasswordPage() {
  const { resetPasswordMutation } = useAuth();
  const { mutate: resetPassword, isPending, error } = resetPasswordMutation;
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const isFromForgotPassword =
      localStorage.getItem('forgotPasswordFlow') === 'true';
    const storedOtp = localStorage.getItem('resetPasswordOtp');

    if (!isFromForgotPassword || !user?.id || !storedOtp) {
      router.push(ERouteTable.LOGIN);
      return;
    }
  }, [user, router]);

  const onSubmit = (data: ResetPasswordFormData) => {
    const cleanData = {
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
    };

    const validation = resetPasswordSchema.safeParse(cleanData);
    if (!validation.success) {
      validation.error.errors.forEach(error => {
        form.setError(error.path[0] as keyof ResetPasswordFormData, {
          type: 'manual',
          message: error.message,
        });
      });
      return;
    }
    resetPassword(cleanData);
  };

  if (
    !user?.id ||
    localStorage.getItem('forgotPasswordFlow') !== 'true' ||
    !localStorage.getItem('resetPasswordOtp')
  ) {
    return <div>Đang chuyển hướng...</div>;
  }

  return (
    <AuthPageContent>
      <AuthHeader
        title='Đặt lại mật khẩu'
        description='Yêu cầu đặt lại mật khẩu.'
      />

      <UpdatePasswordForm
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
        form={form}
      />
    </AuthPageContent>
  );
}

export default UpdatePasswordPage;
