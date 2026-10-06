'use client';

import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { logoGoogle } from '@/constants/images';
import { registerSchema } from '@/modules/auth/domain/schema';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { RegisterFormData } from '@/modules/auth/domain/types';
import { toast } from 'sonner';
import { ERouteTable } from '@/constants/route';
import RegisterForm from '@/components/forms/RegisterForm';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  AuthDivider,
  AuthHeader,
  AuthLinkRow,
  AuthPageContent,
} from '@/components/auth/shared';

function RegisterPage() {
  const { registerMutation } = useAuth();
  const { mutate: register, isPending, error } = registerMutation;
  const router = useRouter();
  const { setEmail } = useAuthStore();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setEmail(data.email);
    register(data);
  };

  const handleGoogleLogin = () => {
    toast('Tính năng Google login chưa được triển khai');
  };

  return (
    <AuthPageContent>
      <AuthHeader
        title='Bắt đầu hoàn toàn miễn phí'
        linkRow={
          <AuthLinkRow
            text='Bạn đã có tài khoản?'
            linkText='Đăng nhập'
            onLinkClick={() => router.push(ERouteTable.LOGIN)}
          />
        }
      />

      <div className='flex flex-col gap-6'>
        <RegisterForm
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

export default RegisterPage;
