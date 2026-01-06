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
    <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
      <div className='container mx-auto'>
        <h1 className='text-4xl font-display font-medium text-text-primary mb-8 tracking-refined'>Template Gallery</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {templates.map((template) => (
            <Link
              key={template.id}
              to={`/preview/${template.id}`}
              className='bg-white dark:bg-dark-sand rounded-lg shadow-sm hover:shadow-md transition-all duration-400 overflow-hidden group hover-lift border border-sand/10 dark:border-dark-sand/20'
            >
              <div className='p-4 border-b border-sand/10 dark:border-dark-sand/20'>
                <h2 className='text-xl font-display font-medium text-text-primary group-hover:text-sea dark:group-hover:text-accent-blue transition-colors duration-400 tracking-refined'>
                  {template.name}
                </h2>
                <p className='text-sm text-text-secondary mt-1'>ID: {template.id}</p>
              </div>

              {/* Thumbnail preview */}
              <div className='bg-light-sand dark:bg-dark-sand p-4 flex justify-center items-start overflow-hidden'>
                <div
                  className='relative'
                  style={{
                    width: `${template.width * template.galleryScale}px`,
                    height: `${template.height * template.galleryScale}px`,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      transformOrigin: 'top left',
                      transform: `scale(${template.galleryScale})`,
                      width: `${template.width}px`,
                      height: `${template.height}px`
                    }}
                  >
                    <template.Component {...template.defaultProps} />
                  </div>
                </div>
              </div>

              <div className='p-4 bg-light-sand dark:bg-dark-sand border-t border-sand/10 dark:border-dark-sand/20'>
                <span className='text-sm text-sea dark:text-accent-blue group-hover:underline font-medium tracking-elegant'>View full preview →</span>
              </div>
            </Link>
          ))}
        </div>

        {templates.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-text-secondary text-lg'>No templates available. Add templates to the registry to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
