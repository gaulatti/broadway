/**
 * Generate Page
 *
 * Main template generation interface where users can:
 * 1. Select a template from dropdown
 * 2. Edit template fields via auto-generated form
 * 3. Preview changes live
 * 4. Export the result as 1080x1920 PNG
 */

import React, { useState, useRef } from 'react';
import { templates } from '../templates';

import { exportNodeToPng } from '../utils/exportImage';

export default function Generate() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [values, setValues] = useState<Record<string, any>>({});
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Get current template
  const template = templates.find((t) => t.id === selectedTemplateId);

  // Initialize values when template changes
  React.useEffect(() => {
    if (template) {
      setValues({ ...template.defaultProps });
    }
  }, [template]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplateId(e.target.value);
  };

  const handleFieldChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

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
          <h1 className='text-4xl font-display font-medium text-text-primary mb-4 tracking-refined'>Template Generator</h1>
          <p className='text-text-secondary'>No templates available. Please add templates to the registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
      <div className='container mx-auto'>
        <h1 className='text-4xl font-display font-medium text-text-primary mb-8 tracking-refined'>Template Generator</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left panel - Controls */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Template selector */}
            <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
              <label className='block text-sm font-medium text-text-primary dark:text-white mb-2 tracking-wide'>Select Template</label>
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue bg-white dark:bg-sand text-text-primary dark:text-white transition-all duration-300'
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic form */}
            <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
              <h2 className='text-lg font-display font-medium text-text-primary dark:text-white mb-4 tracking-refined'>Edit Fields</h2>
              <div className='space-y-4 max-h-[600px] overflow-y-auto'>
                {template.fields.map((field) => (
                  <div key={field.key}>
                    <label className='block text-sm font-medium text-text-primary dark:text-white mb-1 tracking-wide'>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        defaultValue={values[field.key] || ''}
                        onBlur={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue text-sm text-text-primary dark:text-white bg-white dark:bg-sand transition-all duration-300'
                      />
                    ) : field.type === 'number' ? (
                      <input
                        type='number'
                        defaultValue={values[field.key] || ''}
                        onBlur={(e) => handleFieldChange(field.key, parseFloat(e.target.value))}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue text-sm text-text-primary dark:text-white bg-white dark:bg-sand transition-all duration-300'
                      />
                    ) : (
                      <input
                        type='text'
                        defaultValue={values[field.key] || ''}
                        onBlur={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue text-sm text-text-primary dark:text-white bg-white dark:bg-sand transition-all duration-300'
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className='w-full bg-sea dark:bg-accent-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-desert dark:hover:bg-desert disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all duration-400 shadow-sm hover:shadow tracking-elegant'
            >
              {isExporting ? 'Exporting...' : `Export PNG (${template.width}×${template.height})`}
            </button>
          </div>

          {/* Right panel - Preview */}
          <div className='lg:col-span-2'>
            <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
              <h2 className='text-lg font-display font-medium text-text-primary dark:text-white mb-4 tracking-refined'>Live Preview</h2>
              <div className='flex justify-center bg-light-sand dark:bg-dark-sand p-4 rounded-lg'>
                {/* Preview container - scaled down for display */}
                <div
                  className='relative'
                  style={{ width: `${template.width * template.galleryScale}px`, height: `${template.height * template.galleryScale}px`, overflow: 'hidden' }}
                >
                  <div
                    style={{
                      transformOrigin: 'top left',
                      transform: `scale(${template.galleryScale})`,
                      width: `${template.width}px`,
                      height: `${template.height}px`
                    }}
                  >
                    <div ref={previewRef} style={{ width: `${template.width}px`, height: `${template.height}px` }}>
                      <template.Component {...values} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
