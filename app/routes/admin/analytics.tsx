import * as React from 'react';
import { Card } from '@gaulatti/bleecker/components/card';
import { CollectionFilters } from '@gaulatti/bleecker/components/collection-filters';
import { PageHeader } from '@gaulatti/bleecker/components/page-header';
import { SearchInput } from '@gaulatti/bleecker/components/search-input';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import type { SortState } from '@gaulatti/bleecker/components/table';
import { ComposedChartCard } from '~/components/charts/composed-chart';
import { RadarChartCard } from '~/components/charts/radar-chart';

const composedData = [
  { month: 'Jan', revenue: 4200, target: 4000 }, { month: 'Feb', revenue: 5100, target: 4500 }, { month: 'Mar', revenue: 4800, target: 5000 },
  { month: 'Apr', revenue: 6200, target: 5500 }, { month: 'May', revenue: 7100, target: 6500 }, { month: 'Jun', revenue: 6900, target: 7000 }, { month: 'Jul', revenue: 8200, target: 7500 }
];
const radarData = [
  { metric: 'Acquisition', current: 85, previous: 72 }, { metric: 'Activation', current: 70, previous: 65 }, { metric: 'Retention', current: 90, previous: 80 },
  { metric: 'Revenue', current: 78, previous: 70 }, { metric: 'Referral', current: 65, previous: 55 }
];

export default function AnalyticsPage() {
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState<Record<string, boolean | string>>({});
  const [sort, setSort] = React.useState<SortState>({ field: 'period', order: 'desc' });

  return (
    <div className='mx-auto max-w-7xl space-y-9'>
      <PageHeader title='Analytics' description='A disciplined view of acquisition, retention, and commercial performance.' />
      <section aria-label='Report filters' className='space-y-3'>
        <SearchInput aria-label='Search reports' value={search} onChange={(event) => setSearch(event.target.value)} onClear={() => setSearch('')} placeholder='Search reports…' className='max-w-sm' />
        <CollectionFilters defaultExpanded currentFilters={filters} currentSort={sort} onFilterChange={setFilters} onSortChange={setSort} filterOptions={[
          { field: 'range', label: 'Date range', type: 'select', options: [{ value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }] },
          { field: 'metric', label: 'Metric', type: 'select', options: [{ value: 'revenue', label: 'Revenue' }, { value: 'users', label: 'Users' }, { value: 'orders', label: 'Orders' }] }
        ]} sortOptions={[{ field: 'period', label: 'Most recent' }, { field: 'revenue', label: 'Revenue' }, { field: 'growth', label: 'Growth' }]} />
      </section>
      <div className='grid gap-5 lg:grid-cols-2'>
        <Card variant='elevated'><div className='mb-7 flex items-start justify-between gap-5'><div><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-desert'>Revenue</p><h2 className='mt-1.5 text-xl font-medium'>Performance against target</h2><p className='font-secondary mt-1 text-xs text-text-secondary'>Monthly revenue compared with plan</p></div><StatusBadge label='Above plan' variant='live' /></div><ComposedChartCard data={composedData} xAxisKey='month' bars={[{ key: 'revenue', name: 'Revenue', color: 'var(--app-sea)' }]} lines={[{ key: 'target', name: 'Target', color: 'var(--app-desert)' }]} /></Card>
        <Card variant='surface'><div className='mb-7'><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Lifecycle quality</p><h2 className='mt-1.5 text-xl font-medium'>Current and prior period</h2><p className='font-secondary mt-1 text-xs text-text-secondary'>Normalized performance across five signals</p></div><RadarChartCard data={radarData} angleKey='metric' radars={[{ key: 'current', name: 'Current', color: 'var(--app-sea)' }, { key: 'previous', name: 'Previous', color: 'var(--app-desert)' }]} /></Card>
      </div>
    </div>
  );
}
