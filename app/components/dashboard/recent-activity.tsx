import * as React from 'react';
import { Activity, type LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { ScrollArea } from '~/components/ui/scroll-area';

export interface ActivityItem {
  icon?: LucideIcon;
  title: string;
  description?: string;
  timestamp: string;
  href?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
}

export function RecentActivity({
  activities,
  className,
}: RecentActivityProps) {
  return (
    <ScrollArea className={cn('h-[300px]', className)}>
      <div className="space-y-4 pr-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon ?? Activity;
          const content = (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                {activity.description && (
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          );

          return activity.href ? (
            <a
              key={index}
              href={activity.href}
              className="block rounded-md transition-colors hover:bg-muted/50"
              onClick={(event) => event.preventDefault()}
            >
              {content}
            </a>
          ) : (
            <div key={index}>{content}</div>
          );
        })}

        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        )}
      </div>
    </ScrollArea>
  );
}
