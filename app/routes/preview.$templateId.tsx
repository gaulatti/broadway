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
      <div className='min-h-screen bg-gray-100 p-8'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Template Not Found</h1>
          <p className='text-gray-600 mb-6'>The template "{templateId}" could not be found.</p>
          <Link to='/preview' className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <Link to='/preview' className='text-blue-600 hover:text-blue-700 mb-2 inline-block'>
              ← Back to Gallery
            </Link>
            <h1 className='text-3xl font-bold text-gray-900'>{template.name}</h1>
            <p className='text-gray-600'>Template ID: {template.id}</p>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg'
          >
            {isExporting ? 'Exporting...' : 'Export PNG (1080×1920)'}
          </button>
        </div>

        {/* Preview */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Preview</h2>
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
                  <template.Component {...template.defaultProps} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template info */}
        <div className='mt-8 bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Template Fields</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {template.fields.map((field) => (
              <div key={field.key} className='border border-gray-200 rounded p-3'>
                <p className='font-medium text-gray-900'>{field.label}</p>
                <p className='text-sm text-gray-500'>Type: {field.type}</p>
                <p className='text-sm text-gray-600 mt-1 truncate'>Default: {String(template.defaultProps[field.key])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
