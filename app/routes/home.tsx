import { ArrowRight, FileOutput, LayoutTemplate, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@gaulatti/bleecker/components/button';
import { Card } from '@gaulatti/bleecker/components/card';
import { Metric } from '@gaulatti/bleecker/components/metric';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import type { Route } from './+types/home';
import { templates } from '../templates';
import { useT } from '../i18n/useT';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Broadway — Template-Based Generator' },
    { name: 'description', content: 'Generate polished visuals and documents from reusable templates' }
  ];
}

const workflowIcons = [LayoutTemplate, SlidersHorizontal, Sparkles, FileOutput];

export default function Home() {
  const t = useT();
  const workflow = [1, 2, 3, 4].map((step) => ({
    title: t(`home.workflow.step${step}.title`),
    description: t(`home.workflow.step${step}.desc`)
  }));

  return (
    <main className='page-canvas overflow-hidden'>
      <section className='relative isolate border-b border-sand/25 px-5 py-20 dark:border-white/[0.08] sm:px-8 sm:py-24 lg:py-32'>
        <div aria-hidden='true' className='absolute -right-48 -top-72 -z-10 h-[42rem] w-[42rem] rounded-full border border-sea/[0.08] dark:border-white/[0.05]' />
        <div aria-hidden='true' className='absolute -right-28 -top-56 -z-10 h-[31rem] w-[31rem] rounded-full border border-desert/20' />
        <div className='mx-auto max-w-6xl'>
          <StatusBadge label={`${templates.length} templates ready`} variant='live' />
          <h1 className='mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl'>
            {t('home.hero.title')}
          </h1>
          <p className='mt-6 text-lg font-medium text-sea sm:text-xl'>{t('home.hero.subtitle')}</p>
          <p className='font-secondary mt-5 max-w-2xl text-[15px] leading-7 text-text-secondary'>{t('home.hero.description')}</p>
          <div className='mt-10 flex flex-wrap gap-3'>
            <Button as='a' href='/generate' size='lg'>{t('home.cta.openGenerator')} <ArrowRight size={16} /></Button>
            <Button as='a' href='/preview' size='lg' variant='secondary'>{t('home.cta.viewGallery')}</Button>
          </div>
        </div>
      </section>

      <div className='page-container space-y-16'>
        <section aria-label='Product capabilities' className='grid border-y border-sand/25 py-7 dark:border-white/[0.08] sm:grid-cols-3'>
          {[
            [templates.length, t('home.stats.templates')],
            ['Multi-size', t('home.stats.formats')],
            ['PNG + PDF', t('home.stats.export')]
          ].map(([value, label], index) => (
            <div key={String(label)} className='border-b border-sand/20 px-5 py-5 last:border-0 sm:border-b-0 sm:border-r sm:py-2 sm:first:pl-0 sm:last:border-r-0'>
              {typeof value === 'number' ? <Metric value={value} className='text-3xl font-medium tabular-nums' /> : <p className='text-2xl font-medium tracking-refined'>{value}</p>}
              <p className='font-secondary mt-2 text-xs text-text-secondary'>{label}</p>
            </div>
          ))}
        </section>

        <section className='grid gap-5 lg:grid-cols-2'>
          {[
            { eyebrow: 'Create', title: t('home.features.useGenerator'), description: t('home.features.useGeneratorDesc'), label: t('home.features.openGen'), href: '/generate' },
            { eyebrow: 'Explore', title: t('home.features.browseTemplates'), description: t('home.features.browseDesc'), label: t('home.features.viewGal'), href: '/preview' }
          ].map((feature, index) => (
            <Card key={feature.href} variant={index === 0 ? 'elevated' : 'surface'} padding='lg' className='group flex min-h-64 flex-col justify-between'>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-desert'>{feature.eyebrow}</p>
                <h2 className='mt-3 text-3xl font-medium tracking-refined'>{feature.title}</h2>
                <p className='font-secondary mt-4 max-w-lg text-sm leading-6 text-text-secondary'>{feature.description}</p>
              </div>
              <Button as='a' href={feature.href} variant='link' className='mt-8 self-start'>{feature.label} <ArrowRight size={14} /></Button>
            </Card>
          ))}
        </section>

        <section>
          <div className='max-w-2xl'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-desert'>A precise workflow</p>
            <h2 className='mt-3 text-3xl font-medium tracking-refined sm:text-4xl'>{t('home.workflow.title')}</h2>
          </div>
          <ol className='mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-sand/25 bg-sand/25 dark:border-white/[0.08] dark:bg-white/[0.08] md:grid-cols-2 lg:grid-cols-4'>
            {workflow.map((step, index) => {
              const Icon = workflowIcons[index];
              return (
                <li key={step.title} className='bg-card p-6 lg:p-7'>
                  <div className='flex items-center justify-between'>
                    <span className='flex h-9 w-9 items-center justify-center rounded-[var(--radius-ui)] bg-sea/[0.07] text-sea'><Icon size={17} /></span>
                    <span className='text-xs font-medium tabular-nums text-text-secondary'>0{index + 1}</span>
                  </div>
                  <h3 className='mt-8 text-lg font-medium'>{step.title}</h3>
                  <p className='font-secondary mt-2 text-xs leading-5 text-text-secondary'>{step.description}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </main>
  );
}
