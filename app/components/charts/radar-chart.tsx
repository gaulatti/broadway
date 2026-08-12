import * as React from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '~/lib/utils';

export interface RadarSeries {
  key: string;
  color: string;
  name: string;
}

interface RadarChartCardProps {
  data: Record<string, unknown>[];
  radars: RadarSeries[];
  angleKey: string;
  className?: string;
}

export function RadarChartCard({
  data,
  radars,
  angleKey,
  className,
}: RadarChartCardProps) {
  return (
    <div className={cn('h-[360px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
        >
          <PolarGrid stroke="var(--app-border)" />
          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fill: 'var(--app-text-secondary)', fontSize: 12 }}
          />
          <PolarRadiusAxis
            tick={{ fill: 'var(--app-text-secondary)', fontSize: 10 }}
            stroke="var(--app-border)"
            tickCount={5}
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
          {radars.map((radar) => (
            <Radar
              key={radar.key}
              name={radar.name}
              dataKey={radar.key}
              stroke={radar.color}
              fill={radar.color}
              fillOpacity={0.25}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
