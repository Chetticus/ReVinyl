'use client';
import { useEffect } from 'react';
import { Locale } from '@/modules/archive/types';

export function LocaleDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
