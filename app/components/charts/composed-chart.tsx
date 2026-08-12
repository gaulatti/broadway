import * as React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '~/lib/utils';

export interface ComposedBarSeries {
  key: string;
  color: string;
  name: string;
}

export interface ComposedLineSeries {
  key: string;
  color: string;
  name: string;
}

interface ComposedChartCardProps {
  data: Record<string, unknown>[];
  xAxisKey: string;
  bars: ComposedBarSeries[];
  lines: ComposedLineSeries[];
  className?: string;
}

export function ComposedChartCard({
  data,
  xAxisKey,
  bars,
  lines,
  className,
}: ComposedChartCardProps) {
  return (
    <div className={cn('h-[360px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: 'var(--app-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--app-border)' }}
            tickLine={{ stroke: 'var(--app-border)' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: 'var(--app-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--app-border)' }}
            tickLine={{ stroke: 'var(--app-border)' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
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
              yAxisId="left"
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
          {lines.map((line, index) => (
            <Line
              key={line.key}
              yAxisId="right"
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: 'var(--app-background)' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
