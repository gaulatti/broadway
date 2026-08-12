import { Button } from '@gaulatti/bleecker/components/button';
import { Card } from '@gaulatti/bleecker/components/card';
import { DashboardGrid } from '@gaulatti/bleecker/components/dashboard-grid';
import { DashboardSection } from '@gaulatti/bleecker/components/dashboard-section';
import { Metric } from '@gaulatti/bleecker/components/metric';
import { PageHeader } from '@gaulatti/bleecker/components/page-header';
import { Progress } from '@gaulatti/bleecker/components/progress';
import { StatCard } from '@gaulatti/bleecker/components/stat-card';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import { CreditCard, Download, Plus, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { AreaChartCard } from '~/components/charts/area-chart';
import { BarChartCard } from '~/components/charts/bar-chart';
import { LineChartCard } from '~/components/charts/line-chart';
import { PieChartCard } from '~/components/charts/pie-chart';

const monthlyData = [
  { month: 'Jan', revenue: 4200, users: 240, orders: 120 }, { month: 'Feb', revenue: 5100, users: 320, orders: 145 },
  { month: 'Mar', revenue: 4800, users: 380, orders: 132 }, { month: 'Apr', revenue: 6200, users: 450, orders: 178 },
  { month: 'May', revenue: 7100, users: 520, orders: 210 }, { month: 'Jun', revenue: 6900, users: 610, orders: 195 },
  { month: 'Jul', revenue: 8200, users: 720, orders: 250 }
];
const categoryData = [
  { name: 'Electronics', value: 35, color: 'var(--app-sea)' }, { name: 'Clothing', value: 25, color: 'var(--app-desert)' },
  { name: 'Home', value: 20, color: 'var(--app-dusk)' }, { name: 'Books', value: 12, color: 'var(--app-sand)' }, { name: 'Other', value: 8, color: 'var(--app-text-secondary)' }
];
const activities = [
  ['New user registered', 'alice@example.com signed up', '2 min ago'], ['Order completed', 'Order #3829 · $129.00', '15 min ago'],
  ['Payment received', 'Stripe payment from Acme Inc.', '1 hr ago'], ['Refund processed', 'Order #3812 · $45.00', '3 hr ago']
];
const health = [['Server uptime', 99.9], ['Storage used', 72], ['API rate limit', 58]] as const;

export default function AdminDashboard() {
  return (
    <div className='mx-auto max-w-7xl space-y-10'>
      <PageHeader title='Executive overview' description='Revenue, audience, and operational health in one measured view.' actions={<><Button variant='secondary' size='sm'><Download size={14} /> Export</Button><Button size='sm'><Plus size={14} /> Add record</Button></>} />

      <DashboardGrid columns={4}>
        <StatCard title='Revenue' value={<Metric value={42305} format='currency' decimals={0} />} trend={{ direction: 'up', value: '+12.5%', label: 'month' }} icon={<CreditCard size={17} />} sparklineData={monthlyData} sparklineDataKey='revenue' />
        <StatCard title='Users' value={<Metric value={3245} />} trend={{ direction: 'up', value: '+8.2%', label: 'month' }} icon={<Users size={17} />} sparklineData={monthlyData} sparklineDataKey='users' />
        <StatCard title='Orders' value={<Metric value={1230} />} trend={{ direction: 'down', value: '−3.1%', label: 'month' }} icon={<ShoppingCart size={17} />} sparklineData={monthlyData} sparklineDataKey='orders' />
        <StatCard title='Conversion' value={<Metric value={0.036} format='percent' decimals={1} />} trend={{ direction: 'up', value: '+1.4%', label: 'month' }} icon={<TrendingUp size={17} />} />
      </DashboardGrid>

      <DashboardSection title='Commercial performance' description='Seven-month revenue trajectory and category composition.'>
        <div className='grid gap-5 lg:grid-cols-[1.5fr_0.5fr]'>
          <Card variant='surface'><div className='mb-6 flex items-end justify-between'><div><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Revenue trend</p><h2 className='mt-1.5 text-xl font-medium'>Monthly revenue</h2></div><StatusBadge label='On target' variant='live' /></div><LineChartCard data={monthlyData} xAxisKey='month' lines={[{ key: 'revenue', name: 'Revenue', color: 'var(--app-sea)' }]} /></Card>
          <Card variant='surface'><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Sales mix</p><h2 className='mt-1.5 text-xl font-medium'>Category share</h2><div className='mt-6'><PieChartCard data={categoryData} /></div></Card>
        </div>
      </DashboardSection>

      <div className='grid gap-5 lg:grid-cols-[1.35fr_0.65fr]'>
        <Card variant='surface'><div className='mb-6'><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Volume</p><h2 className='mt-1.5 text-xl font-medium'>Orders and audience</h2><p className='font-secondary mt-1 text-xs text-text-secondary'>Comparative monthly movement</p></div><BarChartCard data={monthlyData} xAxisKey='month' bars={[{ key: 'orders', name: 'Orders', color: 'var(--app-sea)' }, { key: 'users', name: 'Users', color: 'var(--app-desert)' }]} /></Card>
        <div className='space-y-5'>
          <Card variant='surface'><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-desert'>Recent activity</p><div className='mt-4 divide-y divide-sand/20 dark:divide-white/[0.07]'>{activities.map(([title, detail, time]) => <div key={title} className='py-3 first:pt-0 last:pb-0'><div className='flex justify-between gap-4'><p className='text-sm font-medium'>{title}</p><time className='font-secondary shrink-0 text-[10px] text-text-secondary'>{time}</time></div><p className='font-secondary mt-1 text-xs text-text-secondary'>{detail}</p></div>)}</div></Card>
          <Card variant='subtle'><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>System health</p><div className='mt-5 space-y-4'>{health.map(([label, value]) => <div key={label}><div className='mb-1.5 flex justify-between text-xs'><span className='font-medium'>{label}</span><span className='tabular-nums text-text-secondary'>{value}%</span></div><Progress value={value} size='sm' variant={value > 90 ? 'success' : 'default'} /></div>)}</div></Card>
        </div>
      </div>

      <Card variant='surface'><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Growth overview</p><h2 className='mt-1.5 text-xl font-medium'>Revenue and audience growth</h2><div className='mt-6'><AreaChartCard data={monthlyData} xAxisKey='month' areas={[{ key: 'revenue', name: 'Revenue', color: 'var(--app-sea)' }, { key: 'users', name: 'Users', color: 'var(--app-desert)' }]} /></div></Card>
    </div>
  );
}
