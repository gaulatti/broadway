import * as React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';

export interface Notification {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function NotificationsPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  className,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center px-1 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader className="items-start pb-4">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && onMarkAllRead && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={onMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-3 pr-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'relative rounded-lg border p-3 transition-colors',
                  notification.read ? 'bg-background' : 'bg-accent/40'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {notification.description && (
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!notification.read && onMarkRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onMarkRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDismiss(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No notifications.
              </p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
