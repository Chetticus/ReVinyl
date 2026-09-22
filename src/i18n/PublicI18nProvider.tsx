'use client';
import { createContext, useContext } from 'react';
import { Locale } from './config';
import { getDictionary, PublicDictionary } from './dictionaries';

const Context = createContext<{ locale: Locale; dictionary: PublicDictionary }>({ locale: 'vi', dictionary: getDictionary('vi') });
export function PublicI18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Context.Provider value={{ locale, dictionary: getDictionary(locale) }}>{children}</Context.Provider>;
}
export const usePublicI18n = () => useContext(Context);
