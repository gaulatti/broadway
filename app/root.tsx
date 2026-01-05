import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, Link, useLocation } from 'react-router';

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
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700&display=swap'
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      {/* Navigation Header */}
      <nav className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-8'>
              <Link to='/' className='text-xl font-bold text-gray-900'>
                Template Studio
              </Link>
              <div className='flex space-x-4'>
                <Link
                  to='/generate'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/generate' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Generate
                </Link>
                <Link
                  to='/preview'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/preview') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Preview Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <Outlet />
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
