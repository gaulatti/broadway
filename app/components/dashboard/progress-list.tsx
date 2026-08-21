import * as React from 'react';
import { cn } from '~/lib/utils';
import { Progress } from '~/components/ui/progress';

export interface ProgressItem {
  label: string;
  value: number;
  max?: number;
  valueText?: string;
}

interface ProgressListProps {
  items: ProgressItem[];
  className?: string;
}

export function ProgressList({ items, className }: ProgressListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => {
        const max = item.max ?? 100;
        const percent = Math.min(
          100,
          Math.max(0, (item.value / max) * 100)
        );

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                {item.valueText ?? `${Math.round(percent)}%`}
              </span>
            </div>
            <Progress value={percent} />
          </div>
        );
      })}
    </div>
  );
}
