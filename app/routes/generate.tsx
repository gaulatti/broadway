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
import type { TemplateDefinition } from '../templates/types';
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
      <div className='min-h-screen bg-gray-100 p-8'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Template Generator</h1>
          <p className='text-gray-600'>No templates available. Please add templates to the registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Template Generator</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left panel - Controls */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Template selector */}
            <div className='bg-white rounded-lg shadow p-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Select Template</label>
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic form */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Edit Fields</h2>
              <div className='space-y-4 max-h-[600px] overflow-y-auto'>
                {template.fields.map((field) => (
                  <div key={field.key}>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        defaultValue={values[field.key] || ''}
                        onBlur={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white'
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
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white'
                      />
                    ) : (
                      <input
                        type='text'
                        defaultValue={values[field.key] || ''}
                        onBlur={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white'
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
              className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg'
            >
              {isExporting ? 'Exporting...' : 'Export PNG (1080×1920)'}
            </button>
          </div>

          {/* Right panel - Preview */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Live Preview</h2>
              <div className='flex justify-center bg-gray-50 p-4 rounded-lg'>
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
