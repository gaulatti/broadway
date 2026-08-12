import * as React from 'react';
import { Button } from '@gaulatti/bleecker/components/button';
import { Card } from '@gaulatti/bleecker/components/card';
import { Field } from '@gaulatti/bleecker/components/field';
import { Input } from '@gaulatti/bleecker/components/input';
import { PageHeader } from '@gaulatti/bleecker/components/page-header';
import { Select } from '@gaulatti/bleecker/components/select';
import { Separator } from '@gaulatti/bleecker/components/separator';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import { Switch } from '@gaulatti/bleecker/components/switch';
import { Tabs } from '@gaulatti/bleecker/components/tabs';
import { toast } from '@gaulatti/bleecker/components/sonner';

function PreferenceRow({ id, label, description, defaultChecked = false }: { id: string; label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return <div className='flex items-start justify-between gap-6'><div><label htmlFor={id} className='text-sm font-medium'>{label}</label><p className='font-secondary mt-1 max-w-xl text-xs leading-5 text-text-secondary'>{description}</p></div><Switch id={id} aria-label={label} checked={checked} onCheckedChange={setChecked} /></div>;
}

export default function SettingsPage() {
  const [tab, setTab] = React.useState('general');
  const [timezone, setTimezone] = React.useState('utc');
  const saved = (area: string) => toast.success(`${area} saved`, { description: 'Your changes are now in effect.' });

  return (
    <div className='mx-auto max-w-5xl space-y-9'>
      <PageHeader title='Settings' description='Configuration is grouped by responsibility, with sensitive changes kept distinct.' />
      <Tabs aria-label='Settings sections' activeTab={tab} onChange={setTab} size='lg' tabs={[{ id: 'general', label: 'General', panelId: 'general-panel' }, { id: 'notifications', label: 'Notifications', panelId: 'notifications-panel' }, { id: 'security', label: 'Security', panelId: 'security-panel' }]} />

      {tab === 'general' ? <div id='general-panel' role='tabpanel' aria-label='General settings' className='space-y-5'>
        <Card variant='elevated' className='grid gap-8 lg:grid-cols-[0.7fr_1.3fr]'>
          <div><p className='text-[10px] font-semibold uppercase tracking-[0.11em] text-desert'>Workspace</p><h2 className='mt-2 text-2xl font-medium'>Organization details</h2><p className='font-secondary mt-3 text-sm leading-6 text-text-secondary'>The name and operating timezone shown across administration.</p></div>
          <div className='space-y-5'><Field label='Workspace name' required><Input id='workspace-name' defaultValue='Broadway Admin' /></Field><Field label='Timezone'><Select id='timezone' aria-label='Timezone' value={timezone} onChange={setTimezone} options={[{ value: 'utc', label: 'UTC' }, { value: 'est', label: 'Eastern Time' }, { value: 'pst', label: 'Pacific Time' }, { value: 'cet', label: 'Central European Time' }]} /></Field><div className='flex justify-end'><Button onClick={() => saved('Workspace')}>Save changes</Button></div></div>
        </Card>
        <Card variant='surface'><div className='flex items-start justify-between gap-4'><div><p className='text-[10px] font-semibold uppercase tracking-[0.11em] text-text-secondary'>Appearance</p><h2 className='mt-2 text-xl font-medium'>Interface preferences</h2></div><StatusBadge label='Personal' /></div><div className='mt-6 space-y-5'><PreferenceRow id='dense-mode' label='Dense mode' description='Reduce padding while preserving comfortable control targets.' /><Separator /><PreferenceRow id='show-breadcrumbs' label='Show breadcrumbs' description='Display route context in administration headers.' defaultChecked /></div></Card>
      </div> : null}

      {tab === 'notifications' ? <Card id='notifications-panel' role='tabpanel' aria-label='Notification settings' variant='surface'><div><p className='text-[10px] font-semibold uppercase tracking-[0.11em] text-desert'>Delivery</p><h2 className='mt-2 text-2xl font-medium'>Email notifications</h2><p className='font-secondary mt-2 text-sm text-text-secondary'>Choose which operational moments deserve your attention.</p></div><div className='mt-7 space-y-5'><PreferenceRow id='new-users' label='New user signups' description='Receive an email when a new user creates an account.' defaultChecked /><Separator /><PreferenceRow id='reports' label='Weekly reports' description='Get a considered weekly summary of key metrics.' /><Separator /><PreferenceRow id='errors' label='System alerts' description='Receive alerts for critical system events.' defaultChecked /></div><div className='mt-7 flex justify-end'><Button onClick={() => saved('Notification preferences')}>Save preferences</Button></div></Card> : null}

      {tab === 'security' ? <Card id='security-panel' role='tabpanel' aria-label='Security settings' variant='elevated' className='grid gap-8 lg:grid-cols-[0.7fr_1.3fr]'><div><p className='text-[10px] font-semibold uppercase tracking-[0.11em] text-desert'>Protected access</p><h2 className='mt-2 text-2xl font-medium'>Security settings</h2><p className='font-secondary mt-3 text-sm leading-6 text-text-secondary'>Credentials and secondary authentication are handled as a distinct decision area.</p></div><div className='space-y-5'><Field label='Current password' required><Input id='current-password' type='password' autoComplete='current-password' /></Field><Field label='New password' required description='Use at least 12 characters.'><Input id='new-password' type='password' autoComplete='new-password' /></Field><Separator /><PreferenceRow id='two-factor' label='Two-factor authentication' description='Require a second factor for every administrator sign-in.' /><div className='flex justify-end pt-2'><Button onClick={() => saved('Security settings')}>Update security</Button></div></div></Card> : null}
    </div>
  );
}
