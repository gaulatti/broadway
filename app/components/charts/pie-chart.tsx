import * as React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '~/lib/utils';

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  data: PieSlice[];
  className?: string;
}

export function PieChartCard({ data, className }: PieChartCardProps) {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--app-card)',
              border: '1px solid var(--app-border)',
              borderRadius: 'var(--radius-ui)',
              color: 'var(--app-card-foreground)',
            }}
          />
          <Legend wrapperStyle={{ color: 'var(--app-text-secondary)', fontSize: 12 }} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            stroke="var(--app-background)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
