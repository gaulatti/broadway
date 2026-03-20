import React from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { locales, getLocaleName, type Locale } from '../i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='inline-flex items-center justify-center rounded-full p-2.5 border border-sand/20 dark:border-sand/70 bg-white/35 dark:bg-sand/25 backdrop-blur-md shadow-sm dark:shadow-[0_1px_8px_rgba(0,0,0,0.35)] ring-1 ring-sand/10 dark:ring-sand/35 cursor-pointer select-none transition-all duration-400 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/55 hover:border-sand/30 hover:shadow-md hover:ring-sea/25 dark:hover:bg-sand/35 dark:hover:border-sand/80 dark:hover:ring-accent-blue/35 active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sea dark:focus-visible:ring-accent-blue text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide'
        title={`Language: ${getLocaleName(locale)}`}
      >
        {locale.toUpperCase()}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-32 bg-white dark:bg-dark-sand border border-sand/20 dark:border-sand/40 rounded-lg shadow-lg z-50'>
          {locales.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLocale(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                locale === lang
                  ? 'bg-sea/10 dark:bg-accent-blue/10 text-sea dark:text-accent-blue font-semibold'
                  : 'text-text-primary dark:text-white hover:bg-sand/10 dark:hover:bg-sand/20'
              }`}
            >
              {getLocaleName(lang as Locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
