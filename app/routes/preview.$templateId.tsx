import { ArrowLeft, Download, FileText, LayoutTemplate } from 'lucide-react';
import { Button } from '@gaulatti/bleecker/components/button';
import { Card } from '@gaulatti/bleecker/components/card';
import { DataList } from '@gaulatti/bleecker/components/data-list';
import { Empty } from '@gaulatti/bleecker/components/empty';
import { LoadingSpinner } from '@gaulatti/bleecker/components/loading-spinner';
import { showAlert } from '@gaulatti/bleecker/components/alert';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getTemplateById } from '../templates';
import { exportNodeToPng, generateResumePdf, generateFifthbellLetterPdf, generateGaulattiLetterPdf, imageExportErrorMessage } from '../utils/exportImage';
import { useT } from '../i18n/useT';
import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';
import type { FifthbellLetterProps } from '../templates/TemplateFifthbellLetter';
import type { GaulattiLetterProps } from '../templates/TemplateGaulattiLetter';
import { TemplateFontBoundary } from '../templates/TemplateFontBoundary';

export default function PreviewTemplate() {
  const t = useT();
  const { templateId } = useParams();
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const additionalRefs = useRef<Array<HTMLDivElement | null>>([]);
  const template = templateId ? getTemplateById(templateId) : undefined;
  const isResume = templateId?.startsWith('resume_') ?? false;
  const hasPdf = isResume || templateId === 'fifthbell_letter' || templateId === 'gaulatti_letter';
  const additionalPageElements = template
    ? template.renderAdditionalPages?.(template.defaultProps) ?? template.additionalPages?.map((PageComponent, index) => <PageComponent key={`additional-${index}`} {...template.defaultProps} />) ?? []
    : [];

  const runExport = async (format: 'png' | 'pdf') => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      if (format === 'png') {
        await exportNodeToPng(previewRef.current, `${template.id}.png`, template.width, template.height, template.fonts);
      } else if (templateId === 'fifthbell_letter') {
        await generateFifthbellLetterPdf(template.defaultProps as FifthbellLetterProps, `${template.id}.pdf`);
      } else if (templateId === 'gaulatti_letter') {
        await generateGaulattiLetterPdf(template.defaultProps as GaulattiLetterProps, `${template.id}.pdf`);
      } else {
        await generateResumePdf(template.defaultProps as ResumeLetterProps, `${template.id}.pdf`);
      }
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error);
      showAlert(format === 'png' ? imageExportErrorMessage(error) : 'PDF export failed. Please retry or verify the document data.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (!template) {
    return (
      <main className='page-canvas'><div className='page-container max-w-3xl'>
        <Empty icon={<LayoutTemplate size={22} />} title={t('preview.template.notFound')} description={t('preview.template.notFoundDesc', { templateId })} action={<Button as='a' href='/preview'>{t('preview.template.backToGallery')}</Button>} />
      </div></main>
    );
  }

  return (
    <main className='page-canvas'>
      <div className='page-container'>
        <header className='flex flex-col gap-7 border-b border-sand/25 pb-8 dark:border-white/[0.08] lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <Button as='a' href='/preview' variant='link' className='-ml-1'><ArrowLeft size={14} /> {t('preview.template.backToGallery')}</Button>
            <div className='mt-4 flex items-center gap-3'><p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-desert'>Template preview</p><StatusBadge label={`${template.width} × ${template.height}`} variant='default' /></div>
            <h1 className='mt-3 text-4xl font-semibold tracking-refined sm:text-5xl'>{template.name}</h1>
            <p className='font-secondary mt-3 text-sm text-text-secondary'>{t('preview.template.templateId', { id: template.id })}</p>
          </div>
          <div className='flex flex-wrap gap-3'>
            {hasPdf ? <Button variant='secondary' onClick={() => runExport('pdf')} disabled={isExporting}><FileText size={15} /> {isExporting ? t('generate.exporting') : t('preview.template.exportPdf')}</Button> : null}
            <Button onClick={() => runExport('png')} disabled={isExporting}>{isExporting ? <LoadingSpinner size='sm' /> : <Download size={15} />} {isExporting ? t('generate.exporting') : t('preview.template.exportPng', { width: template.width, height: template.height })}</Button>
          </div>
        </header>

        <section className='mt-9 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]'>
          <Card padding='md' variant='elevated' className='min-w-0'>
            <div className='mb-5 flex items-center justify-between'><div><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Rendered output</p><h2 className='mt-1.5 text-xl font-medium'>{t('preview.template.preview')}</h2></div><StatusBadge label={`${additionalPageElements.length + 1} page${additionalPageElements.length ? 's' : ''}`} /></div>
            <div className='preview-stage flex max-w-full flex-col items-start gap-7 overflow-auto rounded-[var(--radius-ui)] p-4 sm:items-center sm:p-7'>
              {[<template.Component key='primary' {...template.defaultProps} />, ...additionalPageElements].map((pageElement, index) => (
                <div key={index} className='relative mx-auto shrink-0 shadow-[var(--shadow-raised)]' style={{ width: `${template.width * template.previewScale}px`, height: `${template.height * template.previewScale}px`, overflow: 'hidden' }}>
                  <div style={{ transformOrigin: 'top left', transform: `scale(${template.previewScale})`, width: `${template.width}px`, height: `${template.height}px` }}>
                    <div ref={(element) => { if (index === 0) previewRef.current = element; else additionalRefs.current[index - 1] = element; }} style={{ width: `${template.width}px`, height: `${template.height}px` }}><TemplateFontBoundary fonts={template.fonts}>{pageElement}</TemplateFontBoundary></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <aside className='space-y-5'>
            <Card variant='surface'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-desert'>Specifications</p>
              <DataList className='mt-4' items={[
                { id: 'dimensions', label: 'Dimensions', value: `${template.width} × ${template.height}px` },
                { id: 'pages', label: 'Pages', value: String(additionalPageElements.length + 1) },
                { id: 'fields', label: 'Editable fields', value: String(template.fields.length) },
                { id: 'formats', label: 'Export', value: hasPdf ? 'PNG · PDF' : 'PNG' }
              ]} />
            </Card>
            <Card variant='outlined'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>{t('preview.template.templateFields')}</p>
              <div className='mt-4 divide-y divide-sand/20 dark:divide-white/[0.07]'>
                {template.fields.map((field) => <div key={field.key} className='py-3 first:pt-0 last:pb-0'><div className='flex items-baseline justify-between gap-4'><p className='text-sm font-medium'>{field.label}</p><span className='font-secondary text-[10px] uppercase tracking-[0.06em] text-text-secondary'>{field.type}</span></div><p className='font-secondary mt-1 truncate text-[11px] text-text-secondary'>{String(template.defaultProps[field.key] ?? '—')}</p></div>)}
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}
