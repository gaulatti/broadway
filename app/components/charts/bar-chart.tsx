import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '~/lib/utils';

export interface BarSeries {
  key: string;
  color: string;
  name: string;
}

interface BarChartCardProps {
  data: Record<string, unknown>[];
  bars: BarSeries[];
  xAxisKey: string;
  className?: string;
}

export function BarChartCard({
  data,
  bars,
  xAxisKey,
  className,
}: BarChartCardProps) {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: 'var(--app-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--app-border)' }}
            tickLine={{ stroke: 'var(--app-border)' }}
          />
          <YAxis
            tick={{ fill: 'var(--app-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--app-border)' }}
            tickLine={{ stroke: 'var(--app-border)' }}
          />
          <Tooltip
            cursor={{ fill: 'var(--app-muted)', opacity: 0.3 }}
            contentStyle={{
              backgroundColor: 'var(--app-card)',
              border: '1px solid var(--app-border)',
              borderRadius: 'var(--radius-ui)',
              color: 'var(--app-card-foreground)',
            }}
          />
          <Legend wrapperStyle={{ color: 'var(--app-text-secondary)', fontSize: 12 }} />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
