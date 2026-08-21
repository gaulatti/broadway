import * as React from 'react';
import { ArrowDown, ArrowUp, type LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: LucideIcon;
  trend?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const positive = change === undefined ? undefined : change >= 0;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div
            className={cn(
              'mt-1 flex items-center text-xs',
              positive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {positive ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
        {trend && <div className="mt-3">{trend}</div>}
      </CardContent>
    </Card>
  );
}
