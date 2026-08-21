import * as React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';

export interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  items?: NavItem[];
  badge?: string;
}

interface AdminSidebarProps {
  items: NavItem[];
  activeHref: string;
  brand: { name: string; logoSrc?: string };
  onNavigate?: (href: string) => void;
  className?: string;
}

function hasActiveDescendant(items: NavItem[], activeHref: string): boolean {
  return items.some((item) => {
    if (item.href === activeHref) return true;
    if (item.items) return hasActiveDescendant(item.items, activeHref);
    return false;
  });
}

interface NavLinkProps {
  item: NavItem;
  activeHref: string;
  onNavigate?: (href: string) => void;
}

function NavLink({ item, activeHref, onNavigate }: NavLinkProps) {
  const active = item.href === activeHref;
  const Icon = item.icon;

  const baseClasses = cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
  );

  if (item.items && item.items.length > 0) {
    const defaultOpen =
      active || hasActiveDescendant(item.items, activeHref);
    const [open, setOpen] = React.useState(defaultOpen);

    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <button type="button" className={cn(baseClasses, 'w-full justify-between')}>
            <span className="flex items-center gap-3">
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 transition-transform',
                open && 'rotate-180'
              )}
            />
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-2">
            {item.items.map((subItem) => (
              <NavLink
                key={subItem.href}
                item={subItem}
                activeHref={activeHref}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <a
      href={item.href}
      className={cn(baseClasses, 'justify-between')}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.(item.href);
      }}
    >
      <span className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4" />}
        {item.label}
      </span>
      {item.badge && (
        <Badge variant="secondary" className="text-[10px]">
          {item.badge}
        </Badge>
      )}
    </a>
  );
}

export function AdminSidebar({
  items,
  activeHref,
  brand,
  onNavigate,
  className,
}: AdminSidebarProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex h-14 items-center gap-2 border-b px-4">
        {brand.logoSrc && (
          <img
            src={brand.logoSrc}
            alt=""
            className="h-6 w-6 object-contain"
          />
        )}
        <span className="font-semibold">{brand.name}</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-auto p-3">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}
