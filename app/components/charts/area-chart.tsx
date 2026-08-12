import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '~/lib/utils';

export interface AreaSeries {
  key: string;
  color: string;
  name: string;
}

interface AreaChartCardProps {
  data: Record<string, unknown>[];
  areas: AreaSeries[];
  xAxisKey: string;
  className?: string;
}

export function AreaChartCard({
  data,
  areas,
  xAxisKey,
  className,
}: AreaChartCardProps) {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <defs>
            {areas.map((area, index) => (
              <linearGradient
                key={`${area.key}-${index}`}
                id={`areaGradient-${area.key}-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={area.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={area.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
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
          {areas.map((area, index) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={area.color}
              fill={`url(#areaGradient-${area.key}-${index})`}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: 'var(--app-background)' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
