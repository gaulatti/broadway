import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, Link, useLocation } from 'react-router';
import React from 'react';

import type { Route } from './+types/root';
import './app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500&display=swap'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700&display=swap'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Encode+Sans:wght@100..900&display=swap'
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='bg-light-sand text-text-primary'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem("theme");
                  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const useDark = saved ? saved === "dark" : systemDark;
                  
                  if (useDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
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
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDark(false);
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = React.useCallback(() => {
    const html = document.documentElement;
    const nextDark = !html.classList.contains('dark');
    html.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    setIsDark(nextDark);
  }, []);

  return (
    <>
      {/* Navigation Header - Gaulatti Style */}
      <header className='fixed w-full top-0 z-50 bg-white/90 dark:bg-dark-sand/95 backdrop-blur-2xl border-b border-sand/5 dark:border-sand shadow-[0_1px_3px_0_rgb(0,0,0,0.02)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.3)]'>
        <div className='container mx-auto px-4'>
          <nav className='flex items-center justify-between h-20'>
            {/* Logo */}
            <Link to='/' className='group transition-all duration-400 flex items-center gap-4'>
              <img
                src='/logo.svg'
                alt='Template Studio'
                className='h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-400 dark:invert'
              />
              <div className='h-8 w-[1px] bg-gradient-to-b from-sunset/0 via-sunset to-sunset/0'></div>
              <span className='text-xl font-bold tracking-tight text-text-primary dark:text-white'>stronzi</span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-12'>
              <Link to='/' className='text-base hover:text-sea dark:hover:text-accent-blue transition-colors duration-400 tracking-refined font-medium'>
                Home
              </Link>
              <Link to='/generate' className='text-base hover:text-sea dark:hover:text-accent-blue transition-colors duration-400 tracking-refined font-medium'>
                Generate
              </Link>
              <Link to='/preview' className='text-base hover:text-sea dark:hover:text-accent-blue transition-colors duration-400 tracking-refined font-medium'>
                Gallery
              </Link>
            </div>

            {/* Theme Toggle */}
            <button
              type='button'
              onClick={toggleTheme}
              className='hidden md:inline-flex items-center justify-center rounded-full p-2.5 border border-sand/20 dark:border-sand/70 bg-white/35 dark:bg-sand/25 backdrop-blur-md shadow-sm dark:shadow-[0_1px_8px_rgba(0,0,0,0.35)] ring-1 ring-sand/10 dark:ring-sand/35 cursor-pointer select-none transition-all duration-400 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/55 hover:border-sand/30 hover:shadow-md hover:ring-sea/25 dark:hover:bg-sand/35 dark:hover:border-sand/80 dark:hover:ring-accent-blue/35 active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sea dark:focus-visible:ring-accent-blue'
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Light theme' : 'Dark theme'}
            >
              {isDark ? (
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='stroke-gray-600 dark:stroke-gray-300'>
                  <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              ) : (
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='stroke-gray-600 dark:stroke-gray-300'>
                  <path d='M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                  <path d='M12 2v2' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M12 20v2' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M4.93 4.93l1.41 1.41' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M17.66 17.66l1.41 1.41' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M2 12h2' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M20 12h2' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M4.93 19.07l1.41-1.41' strokeWidth='1.8' strokeLinecap='round' />
                  <path d='M17.66 6.34l1.41-1.41' strokeWidth='1.8' strokeLinecap='round' />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button className='md:hidden group' aria-label='Toggle menu' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className='w-6 h-5 flex flex-col justify-between'>
                <span
                  className={`w-full h-[1px] bg-text-primary transform transition-all duration-400 opacity-90 group-hover:opacity-100 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                ></span>
                <span
                  className={`w-full h-[1px] bg-text-primary transform transition-all duration-400 opacity-90 group-hover:opacity-100 ${mobileMenuOpen ? 'opacity-0' : ''}`}
                ></span>
                <span
                  className={`w-full h-[1px] bg-text-primary transform transition-all duration-400 opacity-90 group-hover:opacity-100 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                ></span>
              </div>
            </button>
          </nav>

          {/* Mobile Menu */}
          <div className={`md:hidden bg-light-sand/95 dark:bg-sand/95 backdrop-blur-md border-t border-sand/10 ${mobileMenuOpen ? '' : 'hidden'}`}>
            <div className='py-6 space-y-6'>
              <Link
                to='/'
                className='block text-base hover:text-sea dark:hover:text-accent-blue transition-colors duration-400 tracking-refined px-4 font-medium'
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to='/generate'
                className='block text-base hover:text-sea dark:hover:text-accent-blue transition-colors duration-400 tracking-refined px-4 font-medium'
                onClick={() => setMobileMenuOpen(false)}
              >
                Generate
              </Link>
              <Link
                to='/preview'
                className='block text-base hover:text-sea dark:hover:text-accent-blue transition-colors duration-400 tracking-refined px-4 font-medium'
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <div className='pt-20'>
        <Outlet />
      </div>

      {/* Footer - Gaulatti Style */}
      <footer className='bg-light-sand dark:bg-sand text-text-primary dark:text-white border-t border-sand/10'>
        {/* Natural Decorative Element */}
        <div className='h-[1px] w-full bg-gradient-to-r from-transparent via-sunset/30 to-transparent'></div>

        <div className='container mx-auto px-4 py-20'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16'>
            {/* Brand Column */}
            <div className='lg:col-span-2'>
              <div className='flex items-center gap-4 mb-8'>
                <img src='/logo.svg' alt='Template Studio' className='h-12 w-auto fill-current opacity-90 dark:invert' />
                <div className='h-12 w-[1px] bg-gradient-to-b from-sunset/0 via-sunset to-sunset/0'></div>
                <span className='text-3xl font-bold tracking-tight text-text-primary dark:text-white'>stronzi</span>
              </div>
              <p className='text-text-secondary dark:text-text-secondary max-w-md leading-relaxed tracking-refined'>
                Crafting beautiful story templates for social media. Design, customize, and export perfect 1080×1920 images with ease.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='font-medium tracking-elegant text-sm text-desert dark:text-desert mb-8 uppercase'>Navigation</h3>
              <ul className='space-y-4'>
                <li>
                  <Link to='/' className='text-text-secondary dark:text-text-secondary hover:text-sunset transition-colors duration-400'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to='/generate' className='text-text-secondary dark:text-text-secondary hover:text-sunset transition-colors duration-400'>
                    Generate
                  </Link>
                </li>
                <li>
                  <Link to='/preview' className='text-text-secondary dark:text-text-secondary hover:text-sunset transition-colors duration-400'>
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className='font-medium tracking-elegant text-sm text-desert dark:text-desert mb-8 uppercase'>Features</h3>
              <ul className='space-y-4 text-text-secondary dark:text-text-secondary'>
                <li className='tracking-refined'>1080×1920 Templates</li>
                <li className='tracking-refined'>Live Preview</li>
                <li className='tracking-refined'>PNG Export</li>
                <li className='tracking-refined'>Easy Customization</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='border-t border-sand/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center'>
            <div className='text-sm text-text-secondary dark:text-text-secondary tracking-refined'>
              © {new Date().getFullYear()}{' '}
              <a href='https://gaulatti.com' target='_blank' rel='noopener noreferrer' className='font-semibold hover:underline underline-offset-4'>
                gaulatti
              </a>
              . All rights reserved.
            </div>
          </div>
        </div>

        {/* Natural Bottom Accent */}
        <div className='h-1 w-full bg-gradient-to-r from-desert via-sunset to-sea opacity-80'></div>
      </footer>
    </>
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
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
