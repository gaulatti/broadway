import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Button } from '@gaulatti/bleecker/components/button';
import { Card } from '@gaulatti/bleecker/components/card';
import { Empty } from '@gaulatti/bleecker/components/empty';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import { Link } from 'react-router';
import { templates } from '../templates';
import { useT } from '../i18n/useT';
import { TemplateFontBoundary } from '../templates/TemplateFontBoundary';

export default function PreviewGallery() {
  const t = useT();

  return (
    <main className='page-canvas'>
      <div className='page-container'>
        <header className='flex flex-col gap-6 border-b border-sand/25 pb-9 dark:border-white/[0.08] sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-[10px] font-semibold uppercase tracking-[0.13em] text-desert'>Template collection</p>
            <h1 className='mt-3 text-4xl font-semibold tracking-refined sm:text-5xl'>{t('preview.gallery.title')}</h1>
            <p className='font-secondary mt-3 max-w-xl text-sm leading-6 text-text-secondary'>Browse every production format, inspect its proportions, and open a full-resolution preview.</p>
          </div>
          <StatusBadge label={`${templates.length} available`} variant='default' />
        </header>

        {templates.length ? (
          <section aria-label='Templates' className='mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {templates.map((template) => (
              <Card key={template.id} padding='none' variant='surface' className='group overflow-hidden transition-[border-color,box-shadow] duration-[var(--motion-surface)] ease-premium hover:border-sea/25 hover:shadow-[var(--shadow-raised)]'>
                <Link to={`/preview/${template.id}`} className='block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'>
                  <div className='flex items-start justify-between gap-5 border-b border-sand/20 p-5 dark:border-white/[0.07]'>
                    <div>
                      <h2 className='text-lg font-medium transition-colors duration-[var(--motion-control)] group-hover:text-sea'>{template.name}</h2>
                      <p className='font-secondary mt-1 text-[11px] text-text-secondary'>{template.width} × {template.height}px</p>
                    </div>
                    <ArrowRight size={16} className='mt-1 text-text-secondary transition-[color,transform] duration-[var(--motion-control)] ease-premium group-hover:translate-x-0.5 group-hover:text-sea' />
                  </div>
                  <div className='preview-stage flex min-h-72 items-start justify-center overflow-hidden p-6'>
                    <div className='relative shadow-[var(--shadow-raised)]' style={{ width: `${template.width * template.galleryScale}px`, height: `${template.height * template.galleryScale}px`, overflow: 'hidden' }}>
                      <div style={{ transformOrigin: 'top left', transform: `scale(${template.galleryScale})`, width: `${template.width}px`, height: `${template.height}px` }}>
                        <TemplateFontBoundary fonts={template.fonts}><template.Component {...template.defaultProps} /></TemplateFontBoundary>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between border-t border-sand/20 px-5 py-4 dark:border-white/[0.07]'>
                    <span className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>ID · {template.id}</span>
                    <span className='text-sm font-medium text-sea'>{t('preview.gallery.viewFull')}</span>
                  </div>
                </Link>
              </Card>
            ))}
          </section>
        ) : (
          <Empty className='mt-12' icon={<LayoutGrid size={22} />} title={t('preview.gallery.noTemplates')} description='Templates will appear here as soon as they are available.' action={<Button as='a' href='/'>Return home</Button>} />
        )}
      </div>
    </main>
  );
}
