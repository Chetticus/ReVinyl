'use client';

import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { logoGoogle } from '@/constants/images';
import { loginSchema } from '@/modules/auth/domain/schema';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { LoginFormData } from '@/modules/auth/domain/types';
import { toast } from 'sonner';
import { ERouteTable } from '@/constants/route';
import LoginForm from '@/components/forms/LoginForm';
import {
  AuthDivider,
  AuthHeader,
  AuthLinkRow,
  AuthPageContent,
} from '@/components/auth/shared';

function LoginPage() {
  const { loginMutation } = useAuth();
  const { mutate: login, isPending, error } = loginMutation;
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    const cleanData = {
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
    };

    const validation = loginSchema.safeParse(cleanData);
    if (!validation.success) {
      validation.error.errors.forEach(error => {
        form.setError(error.path[0] as keyof LoginFormData, {
          type: 'manual',
          message: error.message,
        });
      });
      return;
    }
    login(cleanData);
  };

  const handleGoogleLogin = () => {
    toast('Tính năng Google login chưa được triển khai');
  };

  return (
    <AuthPageContent>
      <AuthHeader
        title='Chào mừng bạn trở lại'
        linkRow={
          <AuthLinkRow
            text='Bạn chưa phải là thành viên?'
            linkText='Đăng ký'
            onLinkClick={() => router.push(ERouteTable.REGISTER)}
          />
        }
      />

      <div className='flex flex-col gap-6'>
        <LoginForm
          onSubmit={onSubmit}
          isPending={isPending}
          error={error}
          form={form}
        />

        <AuthDivider />

        <button
          type='button'
          onClick={handleGoogleLogin}
          disabled={isPending}
          className='flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[rgba(145,158,171,0.08)] text-[15px] text-[#212B36] hover:bg-[rgba(145,158,171,0.14)] disabled:cursor-not-allowed disabled:opacity-70'
        >
          <Image
            src={logoGoogle}
            alt='Google logo'
            className='h-6 w-6 object-cover'
          />
          Đăng nhập với Google
        </button>
      </div>
    </AuthPageContent>
  );
}

export default LoginPage;
