'use client';

import React, { useRef, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import {
  AuthBackLink,
  AuthHeader,
  AuthPageContent,
  authPrimaryButtonClass,
} from '@/components/auth/shared';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

const VerifyOtpPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyMutation, resendOtpMutation } = useAuth();

  const { mutate: verify, isPending, error } = verifyMutation;
  const { mutate: resendOtp, isPending: isResendingOtp } = resendOtpMutation;

  React.useEffect(() => {
    if (!user?.id || !user?.email) {
      router.push('/register');
    }
  }, [user, router]);

  React.useEffect(() => {
    if (error) {
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }, [error]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && user?.id) {
      const fullCode = [...newCode];
      fullCode[index] = value;
      if (fullCode.every(digit => digit !== '')) {
        setTimeout(() => {
          verify({
            userId: user.id!,
            otpCode: fullCode.join(''),
          });
        }, 100);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6);

    if (pastedNumbers.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedNumbers[i] || '';
      }
      setCode(newCode);

      const lastFilledIndex = pastedNumbers.length - 1;
      const nextEmptyIndex = newCode.findIndex(digit => digit === '');
      const targetIndex =
        nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(lastFilledIndex, 5);
      inputRefs.current[targetIndex]?.focus();

      if (pastedNumbers.length === 6 && user?.id) {
        setTimeout(() => {
          verify({
            userId: user.id!,
            otpCode: pastedNumbers,
          });
        }, 100);
      }
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6 || !user?.id) {
      return;
    }

    verify({
      userId: user.id,
      otpCode: verificationCode,
    });
  };

  const handleResendCode = () => {
    if (user?.email) {
      resendOtp({ email: user.email });
    }
  };

  if (!user?.id || !user?.email) {
    return <div>Đang chuyển hướng...</div>;
  }

  return (
    <AuthPageContent>
      <AuthHeader
        title='Xác thực tài khoản'
        description='Chúng tôi đã gửi mã xác nhận gồm 6 chữ số qua email. Vui lòng nhập mã vào ô bên dưới để xác minh email của bạn.'
      />

      <div className='flex flex-col gap-6'>
        <AuthErrorAlert
          error={error}
          fallback='Mã xác thực không hợp lệ. Vui lòng thử lại.'
        />

        <div className='flex gap-4'>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type='text'
              inputMode='numeric'
              value={digit}
              onChange={e => handleCodeChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className='h-[54px] w-full min-w-0 flex-1 rounded-lg border border-[rgba(145,158,171,0.32)] text-center text-base text-[#212B36] outline-none focus:border-[#E4722C] disabled:opacity-50'
              maxLength={1}
              disabled={isPending}
            />
          ))}
        </div>

        <button
          type='button'
          onClick={handleVerify}
          disabled={isPending || code.some(digit => !digit)}
          className={authPrimaryButtonClass}
        >
          {isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Đang xác thực...
            </span>
          ) : (
            'Xác thực tài khoản'
          )}
        </button>

        <div className='text-center text-sm'>
          <span className='text-[#212B36]'>Bạn không nhận được mã? </span>
          <button
            type='button'
            onClick={handleResendCode}
            className='font-semibold text-[#E4722C] hover:underline disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isPending || isResendingOtp}
          >
            {isResendingOtp ? 'Đang gửi...' : 'Gửi lại mã'}
          </button>
        </div>

        <div className='flex justify-center'>
          <AuthBackLink />
        </div>
      </div>
    </AuthPageContent>
  );
};

export default VerifyOtpPage;
