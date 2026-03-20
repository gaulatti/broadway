/**
 * Preview Template Page
 *
 * Displays a single template with its default props.
 * Provides export functionality for quick downloads.
 * Route: /preview/:templateId
 */

import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getTemplateById } from '../templates';
import { exportNodeToPng, generateResumePdf } from '../utils/exportImage';
import { useT } from '../i18n/useT';
import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';

export default function PreviewTemplate() {
  const t = useT();
  const { templateId } = useParams();
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const additionalRefs = useRef<Array<HTMLDivElement | null>>([]);

  const template = templateId ? getTemplateById(templateId) : undefined;
  const isResume = templateId?.startsWith('resume_') ?? false;
  const additionalPageElements = template
    ? template.renderAdditionalPages
      ? template.renderAdditionalPages(template.defaultProps)
      : template.additionalPages?.map((PageComponent, index) => <PageComponent key={`additional-${index}`} {...template.defaultProps} />) || []
    : [];

  const handleExportPng = async () => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      await exportNodeToPng(previewRef.current, `${template.id}.png`, template.width, template.height);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      // Vector PDF only — @react-pdf/renderer with true selectable text
      await generateResumePdf(template.defaultProps as ResumeLetterProps, `${template.id}.pdf`);
    } catch (error) {
      console.error('Vector PDF export failed:', error);
      alert('PDF export failed. Check console for details.');
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  if (!template) {
    return (
      <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
        <div className='container mx-auto'>
          <h1 className='text-4xl font-display font-medium text-text-primary mb-4 tracking-refined'>{t('preview.template.notFound')}</h1>
          <p className='text-text-secondary mb-6'>{t('preview.template.notFoundDesc', { templateId })}</p>
          <Link
            to='/preview'
            className='inline-block bg-sea dark:bg-accent-blue text-white px-6 py-2 rounded-lg hover:bg-desert dark:hover:bg-desert transition-all duration-400 font-medium tracking-elegant'
          >
            {t('preview.template.backToGallery')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
      <div className='container mx-auto'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <Link
              to='/preview'
              className='text-sea dark:text-accent-blue hover:text-desert dark:hover:text-desert mb-2 inline-block font-medium tracking-elegant transition-colors duration-400'
            >
              {t('preview.template.backToGallery')}
            </Link>
            <h1 className='text-4xl font-display font-medium text-text-primary tracking-refined'>{template.name}</h1>
            <p className='text-text-secondary'>{t('preview.template.templateId', { id: template.id })}</p>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={handleExportPng}
              disabled={isExporting}
              className='bg-sea dark:bg-accent-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-desert dark:hover:bg-desert disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all duration-400 shadow-sm hover:shadow tracking-elegant'
            >
              {isExporting ? t('generate.exporting') : t('preview.template.exportPng', { width: template.width, height: template.height })}
            </button>
            {isResume && (
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className='bg-desert text-white px-6 py-3 rounded-lg font-medium hover:bg-sea dark:hover:bg-sea disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all duration-400 shadow-sm hover:shadow tracking-elegant'
              >
                {isExporting ? t('generate.exporting') : t('preview.template.exportPdf')}
              </button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
          <h2 className='text-lg font-display font-medium text-text-primary mb-4 tracking-refined'>{t('preview.template.preview')}</h2>
          <div className='flex flex-col items-center gap-6 bg-light-sand dark:bg-dark-sand p-4 rounded-lg'>
            {/* Page 1 */}
            <div
              className='relative'
              style={{ width: `${template.width * template.previewScale}px`, height: `${template.height * template.previewScale}px`, overflow: 'hidden' }}
            >
              <div
                style={{
                  transformOrigin: 'top left',
                  transform: `scale(${template.previewScale})`,
                  width: `${template.width}px`,
                  height: `${template.height}px`
                }}
              >
                <div ref={previewRef} style={{ width: `${template.width}px`, height: `${template.height}px` }}>
                  <template.Component {...template.defaultProps} />
                </div>
              </div>
            </div>

            {/* Additional pages (e.g. resume page 2) */}
            {additionalPageElements.map((pageElement, index) => (
              <div
                key={index}
                className='relative'
                style={{ width: `${template.width * template.previewScale}px`, height: `${template.height * template.previewScale}px`, overflow: 'hidden' }}
              >
                <div
                  style={{
                    transformOrigin: 'top left',
                    transform: `scale(${template.previewScale})`,
                    width: `${template.width}px`,
                    height: `${template.height}px`
                  }}
                >
                  <div
                    ref={(el) => {
                      additionalRefs.current[index] = el;
                    }}
                    style={{ width: `${template.width}px`, height: `${template.height}px` }}
                  >
                    {pageElement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template info */}
        <div className='mt-8 bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
          <h2 className='text-lg font-display font-medium text-text-primary mb-4 tracking-refined'>{t('preview.template.templateFields')}</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {template.fields.map((field) => (
              <div key={field.key} className='border border-sand/30 dark:border-dark-sand rounded p-3'>
                <p className='font-medium text-text-primary'>{field.label}</p>
                <p className='text-sm text-text-secondary'>{t('preview.template.type', { type: field.type })}</p>
                <p className='text-sm text-text-secondary mt-1 truncate'>{t('preview.template.default', { value: String(template.defaultProps[field.key]) })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
