import {
  AppShell,
  BleeckerThemeScript,
  Footer as BleeckerFooter,
  Header as BleeckerHeader,
  HeaderSelect,
  IconButton,
  ThemeProvider,
  ThemeToggle,
  type NavItem,
  type RenderLinkProps
} from '@gaulatti/bleecker';
import { Github } from 'lucide-react';
import type { ReactNode } from 'react';
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import { LocaleProvider, useLocale } from './i18n/LocaleContext';
import { getLocaleName, locales, type Locale } from './i18n';
import { useT } from './i18n/useT';
import './app.css';

const GITHUB_REPO_URL = 'https://github.com/gaulatti/broadway';
const GITHUB_WIKI_URL = 'https://github.com/gaulatti/broadway/wiki/Home';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=MuseoModerno:wght@100..900&display=swap'
  }
];

function renderAppLink({ children, className, item, onClick }: RenderLinkProps<NavItem>) {
  if (item.external) {
    return (
      <a href={item.href} className={className} onClick={onClick} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function HeaderActions({ mobile = false }: { mobile?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={mobile ? 'flex w-full items-center gap-3' : 'flex items-center gap-3'}>
      <IconButton
        aria-label='View source on GitHub'
        title='View source on GitHub'
        onClick={() => {
          window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
        }}
      >
        <Github size={18} className='text-gray-600 dark:text-gray-300' strokeWidth={1.5} />
      </IconButton>

      <HeaderSelect
        aria-label='Select language'
        className='text-xs font-medium uppercase tracking-wide'
        options={locales.map((value) => ({
          label: value.toUpperCase(),
          value
        }))}
        placeholder={getLocaleName(locale)}
        value={locale}
        wrapperClassName={mobile ? 'w-full max-w-[180px]' : undefined}
        onChange={(value) => {
          if (locales.includes(value as Locale)) {
            setLocale(value as Locale);
          }
        }}
      />

      <ThemeToggle />
    </div>
  );
}

function AppContent() {
  const t = useT();

  const headerNavigation: NavItem[] = [
    { href: '/', label: t('nav.home') },
    { href: '/generate', label: t('nav.generate') },
    { href: '/preview', label: t('nav.gallery') }
  ];

  const footerSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: t('footer.navigation'),
      items: [
        { href: '/', label: t('nav.home') },
        { href: '/generate', label: t('nav.generate') },
        { href: '/preview', label: t('nav.gallery') },
        { href: GITHUB_REPO_URL, label: 'Source (GitHub)', external: true },
        { href: GITHUB_WIKI_URL, label: 'Docs (Wiki)', external: true }
      ]
    },
    {
      title: t('footer.features'),
      items: [
        { href: '/preview', label: t('footer.multiFormat') },
        { href: '/generate', label: t('footer.livePreview') },
        { href: '/generate', label: t('footer.pdfExport') },
        { href: '/generate', label: t('footer.easyCustomization') }
      ]
    }
  ];

  return (
    <AppShell
      className='antialiased'
      header={
        <BleeckerHeader
          brand={{
            href: '/',
            logoAlt: 'Broadway template generator',
            logoSrc: '/logo.svg',
            name: 'broadway'
          }}
          navigation={headerNavigation}
          actions={<HeaderActions />}
          mobileActions={<HeaderActions mobile />}
          renderLink={renderAppLink}
        />
      }
      footer={
        <BleeckerFooter
          brand={{
            href: '/',
            logoAlt: 'Broadway template generator',
            logoSrc: '/logo.svg',
            name: 'broadway',
            description: t('footer.brand')
          }}
          bottomLeft={
            <>
              © {new Date().getFullYear()}{' '}
              <a href='https://gaulatti.com' target='_blank' rel='noopener noreferrer' className='font-semibold hover:underline underline-offset-4'>
                gaulatti
              </a>
              . All rights reserved.
            </>
          }
          bottomRight={
            <a href={GITHUB_REPO_URL} target='_blank' rel='noopener noreferrer' className='hover:underline underline-offset-4'>
              {t('footer.viewSource')}
            </a>
          }
          renderLink={renderAppLink}
          sections={footerSections}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en-US'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <BleeckerThemeScript storageKey='theme' />
      </head>
      <body className='bg-light-sand text-text-primary'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider defaultTheme='system' storageKey='theme'>
        <AppContent />
      </ThemeProvider>
    </LocaleProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='container mx-auto p-4 pt-16'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre className='w-full overflow-x-auto p-4'>
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
  );
}
