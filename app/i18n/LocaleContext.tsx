import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Locale } from './index';
import { defaultLocale, locales } from './index';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Initialize locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  // Update HTML lang attribute when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
