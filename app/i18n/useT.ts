import { useLocale } from './LocaleContext';
import { t } from './index';

export function useT() {
  const { locale } = useLocale();

  return (path: string, params?: Record<string, any>) => {
    return t(locale, path, params);
  };
}
