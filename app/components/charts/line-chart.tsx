import * as React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '~/lib/utils';

export interface LineSeries {
  key: string;
  color: string;
  name: string;
}

interface LineChartCardProps {
  data: Record<string, unknown>[];
  lines: LineSeries[];
  xAxisKey: string;
  className?: string;
}

export function LineChartCard({
  data,
  lines,
  xAxisKey,
  className,
}: LineChartCardProps) {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
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
            contentStyle={{
              backgroundColor: 'var(--app-card)',
              border: '1px solid var(--app-border)',
              borderRadius: 'var(--radius-ui)',
              color: 'var(--app-card-foreground)',
            }}
          />
          <Legend wrapperStyle={{ color: 'var(--app-text-secondary)', fontSize: 12 }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: 'var(--app-background)' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
