import * as React from 'react';
import { cn } from '~/lib/utils';
import { Sheet, SheetContent } from '~/components/ui/sheet';

interface AdminShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  className?: string;
}

export function AdminShell({
  children,
  sidebar,
  header,
  className,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const headerWithTrigger = React.isValidElement(header)
    ? React.cloneElement(
        header as React.ReactElement<{ onMenuClick?: () => void }>,
        {
          onMenuClick: () => setMobileOpen((open) => !open),
        }
      )
    : header;

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <div
        className={cn(
          'flex h-screen w-full overflow-hidden bg-background',
          className
        )}
      >
        <aside className="hidden h-full w-64 flex-col border-r bg-background md:flex">
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b">{headerWithTrigger}</div>
          <main className="flex-1 overflow-auto bg-background p-6 text-foreground">
            {children}
          </main>
        </div>

        <SheetContent side="left" className="w-64 p-0 sm:max-w-xs">
          {sidebar}
        </SheetContent>
      </div>
    </Sheet>
  );
}
