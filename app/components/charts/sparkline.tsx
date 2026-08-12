import * as React from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '~/lib/utils';

interface SparklineProps {
  data: Record<string, unknown>[];
  dataKey: string;
  color?: string;
  fill?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  dataKey,
  color = 'hsl(var(--primary))',
  fill = true,
  className,
}: SparklineProps) {
  return (
    <div className={cn('h-10 w-24', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={fill ? 0.35 : 0} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded border bg-popover px-2 py-1 text-xs text-popover-foreground shadow">
                    {payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill="url(#sparklineGradient)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
