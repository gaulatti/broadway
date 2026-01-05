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
import { exportNodeToPng } from '../utils/exportImage';

export default function PreviewTemplate() {
  const { templateId } = useParams();
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const template = templateId ? getTemplateById(templateId) : undefined;

  const handleExport = async () => {
    if (!previewRef.current || !template) return;

    setIsExporting(true);
    try {
      await exportNodeToPng(previewRef.current, `${template.id}.png`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!template) {
    return (
      <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
        <div className='container mx-auto'>
          <h1 className='text-4xl font-display font-medium text-text-primary mb-4 tracking-refined'>Template Not Found</h1>
          <p className='text-text-secondary mb-6'>The template "{templateId}" could not be found.</p>
          <Link
            to='/preview'
            className='inline-block bg-sea dark:bg-accent-blue text-white px-6 py-2 rounded-lg hover:bg-desert dark:hover:bg-desert transition-all duration-400 font-medium tracking-elegant'
          >
            ← Back to Gallery
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
              ← Back to Gallery
            </Link>
            <h1 className='text-4xl font-display font-medium text-text-primary tracking-refined'>{template.name}</h1>
            <p className='text-text-secondary'>Template ID: {template.id}</p>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className='bg-sea dark:bg-accent-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-desert dark:hover:bg-desert disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all duration-400 shadow-sm hover:shadow tracking-elegant'
          >
            {isExporting ? 'Exporting...' : 'Export PNG (1080×1920)'}
          </button>
        </div>

        {/* Preview */}
        <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
          <h2 className='text-lg font-display font-medium text-text-primary mb-4 tracking-refined'>Preview</h2>
          <div className='flex justify-center bg-light-sand dark:bg-dark-sand p-4 rounded-lg'>
            {/* Preview container - scaled down for display */}
            <div className='relative' style={{ width: '324px', height: '576px', overflow: 'hidden' }}>
              <div
                style={{
                  transformOrigin: 'top left',
                  transform: 'scale(0.3)',
                  width: '1080px',
                  height: '1920px'
                }}
              >
                <div ref={previewRef} style={{ width: '1080px', height: '1920px' }}>
                  <template.Component {...template.defaultProps} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template info */}
        <div className='mt-8 bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
          <h2 className='text-lg font-display font-medium text-text-primary mb-4 tracking-refined'>Template Fields</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {template.fields.map((field) => (
              <div key={field.key} className='border border-sand/30 dark:border-dark-sand rounded p-3'>
                <p className='font-medium text-text-primary'>{field.label}</p>
                <p className='text-sm text-text-secondary'>Type: {field.type}</p>
                <p className='text-sm text-text-secondary mt-1 truncate'>Default: {String(template.defaultProps[field.key])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
