export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'vi';

export const isLocale = (value: string): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);

export function buildLocalePath(locale: Locale, path = '/') {
  const normalized = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `/${locale}${normalized}`;
}

export function replacePathLocale(pathname: string, locale: Locale) {
  return /^\/(vi|en)(?=\/|$)/.test(pathname)
    ? pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${locale}`)
    : buildLocalePath(locale, pathname);
}
