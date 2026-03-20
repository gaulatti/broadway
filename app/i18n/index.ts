import { en } from './locales/en';
import { es } from './locales/es';
import { it } from './locales/it';

export type Locale = 'en' | 'es' | 'it';

const translations = {
  en,
  es,
  it
};

export const locales: Locale[] = ['en', 'es', 'it'];
export const defaultLocale: Locale = 'en';

export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    it: 'Italiano'
  };
  return names[locale];
}

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

export function t(locale: Locale, path: string, params?: Record<string, any>): string {
  const keys = path.split('.');
  let value: any = translations[locale] || translations[defaultLocale];

  for (const key of keys) {
    value = value?.[key];
  }

  if (typeof value !== 'string') {
    return path; // fallback to key if not found
  }

  // Simple template replacement: {key} → value
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return String(params[key] ?? match);
    });
  }

  return value;
}
