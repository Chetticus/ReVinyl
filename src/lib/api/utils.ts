import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { INextApiResponse, ResponseStatus } from './types';

// ✅ Function to Handle Errors with Proper Typing
export function handleApiError(
  error: AxiosError | unknown
): NextResponse<INextApiResponse> {
  if (error instanceof AxiosError) {
    return NextResponse.json<INextApiResponse>(
      {
        status: ResponseStatus.Failure,
        message: error.message || 'Request failed. Please try again.',
      },
      { status: error.response?.status || 500 }
    );
  }
  return NextResponse.json<INextApiResponse>(
    {
      status: ResponseStatus.Failure,
      message: 'Internal Next Server Error',
    },
    { status: 500 }
  );
}
