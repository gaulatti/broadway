import * as React from 'react';
import { AdminShell } from '@gaulatti/bleecker/layout/admin-shell';
import { Avatar } from '@gaulatti/bleecker/components/avatar';
import { BrandLockup } from '@gaulatti/bleecker/components/brand-lockup';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@gaulatti/bleecker/components/dropdown-menu';
import { IconButton } from '@gaulatti/bleecker/components/icon-button';
import { Sheet } from '@gaulatti/bleecker/components/sheet';
import { Sidebar, type SidebarItem } from '@gaulatti/bleecker/components/sidebar';
import { Sonner } from '@gaulatti/bleecker/components/sonner';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import { ThemeToggle } from '@gaulatti/bleecker/components/theme-toggle';
import { BarChart3, LayoutDashboard, Menu, Settings, Users } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

const navigation = [
  { id: 'dashboard', href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'analytics', href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'users', href: '/admin/users', label: 'Users', icon: <Users size={16} /> },
  { id: 'settings', href: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> }
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items: SidebarItem[] = navigation.map((item) => ({ ...item, active: location.pathname === item.href }));
  const activeTitle = navigation.find((item) => item.href === location.pathname)?.label ?? 'Administration';

  const sidebar = (
    <Sidebar
      className='h-full w-full border-r-0 md:w-64 md:border-r'
      items={items}
      header={<BrandLockup href='/' logoAlt='Broadway' logoSrc='/logo.svg' name='broadway' size='sm' />}
      footer={<div><p className='text-[10px] font-semibold uppercase tracking-[0.11em] text-text-secondary'>Operations</p><div className='mt-2 flex items-center gap-2'><StatusBadge label='Systems normal' variant='live' /></div></div>}
      renderLink={({ item, className, children, onClick }) => <Link to={item.href} className={className} onClick={() => { onClick?.(); setMobileOpen(false); }}>{children}</Link>}
    />
  );

  return (
    <>
      <AdminShell
        className='h-screen overflow-hidden'
        sidebar={<div className='hidden h-full md:block'>{sidebar}</div>}
        header={
          <header className='flex h-16 shrink-0 items-center justify-between border-b border-sand/25 bg-white/90 px-4 backdrop-blur-md dark:border-white/[0.08] dark:bg-deep-sea/90 sm:px-7'>
            <div className='flex min-w-0 items-center gap-3'>
              <IconButton aria-label='Open navigation' className='md:hidden' onClick={() => setMobileOpen(true)}><Menu size={18} /></IconButton>
              <div><p className='text-[10px] font-semibold uppercase tracking-[0.11em] text-desert'>Broadway admin</p><p className='truncate text-sm font-medium'>{activeTitle}</p></div>
            </div>
            <div className='flex items-center gap-2'>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button type='button' className='rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' aria-label='Open account menu'><Avatar fallback='GU' size='sm' /></button></DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My account</DropdownMenuLabel><DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/admin/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem><DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        }
        contentClassName='bg-[color-mix(in_srgb,var(--surface-muted)_55%,var(--surface-canvas))]'
      >
        <Outlet />
      </AdminShell>
      <Sheet isOpen={mobileOpen} onClose={() => setMobileOpen(false)} side='left' title='Navigation' className='w-[min(20rem,88vw)] p-0'>{sidebar}</Sheet>
      <Sonner position='bottom-right' />
    </>
  );
}
