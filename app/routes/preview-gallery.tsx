/**
 * Preview Gallery Page
 *
 * Lists all available templates with thumbnail previews.
 * Each template links to its dedicated preview page.
 */

import React from 'react';
import { Link } from 'react-router';
import { templates } from '../templates';

export default function PreviewGallery() {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Template Gallery</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {templates.map((template) => (
            <Link
              key={template.id}
              to={`/preview/${template.id}`}
              className='bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group'
            >
              <div className='p-4 border-b border-gray-200'>
                <h2 className='text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>{template.name}</h2>
                <p className='text-sm text-gray-500 mt-1'>ID: {template.id}</p>
              </div>

              {/* Thumbnail preview */}
              <div className='bg-gray-50 p-4 flex justify-center items-start overflow-hidden'>
                <div
                  className='relative'
                  style={{
                    width: '216px',
                    height: '384px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      transformOrigin: 'top left',
                      transform: 'scale(0.2)',
                      width: '1080px',
                      height: '1920px'
                    }}
                  >
                    <template.Component {...template.defaultProps} />
                  </div>
                </div>
              </div>

              <div className='p-4 bg-gray-50 border-t border-gray-200'>
                <span className='text-sm text-blue-600 group-hover:underline'>View full preview →</span>
              </div>
            </Link>
          ))}
        </div>

        {templates.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No templates available. Add templates to the registry to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
