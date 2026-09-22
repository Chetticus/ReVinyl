import { getAuthApiErrorMessage } from '@/lib/api/auth-error';

type AuthErrorAlertProps = {
  error: unknown;
  fallback?: string;
};

export function AuthErrorAlert({
  error,
  fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.',
}: AuthErrorAlertProps) {
  if (!error) return null;

  const message = getAuthApiErrorMessage(error, fallback);

  return (
    <div
      className='rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'
      role='alert'
      aria-live='polite'
    >
      {message}
    </div>
  );
}
