import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs';

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

export function AdminHeader({
  title,
  breadcrumbs,
  actions,
  onMenuClick,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b bg-background px-4',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="truncate text-lg font-semibold">{title}</h1>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} />
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
