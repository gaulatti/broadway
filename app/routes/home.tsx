import type { Route } from './+types/home';
import { Link } from 'react-router';
import { templates } from '../templates';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Stronzi - Instagram Story Template Generator' }, { name: 'description', content: 'Create and export beautiful 1080x1920 story templates' }];
}

export default function Home() {
  return (
    <div className='min-h-screen bg-light-sand dark:bg-deep-sea'>
      {/* Hero section - Gaulatti Style */}
      <section className='py-32 relative overflow-hidden'>
        {/* Natural Background Pattern */}
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute inset-0 bg-gradient-to-b from-sand/10 via-transparent to-transparent'></div>
        </div>

        {/* Sunset Accent Line */}

        <div className='container mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8 relative z-10 justify-center'>
          <div className='max-w-4xl mx-auto text-center'>
            {/* Main Heading */}
            <h1 className='font-display text-6xl md:text-7xl font-medium mb-8 tracking-tight leading-tight text-text-primary dark:text-white'>
              <span className='block text-fade-in'>Template Studio</span>
            </h1>
            {/* Role Description */}
            <p className='font-display text-2xl md:text-3xl mb-6 text-sea tracking-refined font-normal'>Instagram Story Generator</p>
            {/* Personal Philosophy */}
            <p className='text-lg md:text-xl mb-12 max-w-2xl mx-auto text-text-secondary leading-relaxed font-light'>
              Create stunning 1080×1920 story templates. Select a template, customize it, and export perfect PNG images with ease.
            </p>
            {/* CTA Buttons */}
            <div className='flex justify-center gap-6 flex-wrap'>
              <Link
                to='/generate'
                className='px-8 py-3.5 bg-sea text-white hover:bg-desert transition-all duration-400 tracking-elegant text-base font-medium border border-transparent hover:border-desert/20'
              >
                Start Generating
              </Link>
              <Link
                to='/preview'
                className='px-8 py-3.5 border border-dusk dark:border-white hover:border-desert dark:hover:border-accent-blue text-dusk dark:text-white hover:text-desert dark:hover:text-accent-blue transition-all duration-400 tracking-elegant text-base font-medium'
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
        {/* Stats */}
        <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-8 mb-16 max-w-5xl mx-auto border border-sand/10 dark:border-dark-sand/20'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <p className='text-5xl font-display font-medium text-sea dark:text-accent-blue mb-3 tracking-refined'>{templates.length}</p>
              <p className='text-text-secondary dark:text-text-secondary font-medium tracking-wide'>Available Templates</p>
            </div>
            <div>
              <p className='text-5xl font-display font-medium text-sea dark:text-accent-blue mb-3 tracking-refined'>1080×1920</p>
              <p className='text-text-secondary font-medium tracking-wide'>Perfect Story Size</p>
            </div>
            <div>
              <p className='text-5xl font-display font-medium text-sea dark:text-accent-blue mb-3 tracking-refined'>PNG</p>
              <p className='text-text-secondary font-medium tracking-wide'>High-Quality Export</p>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className='grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto'>
          <Link
            to='/generate'
            className='bg-white dark:bg-dark-sand rounded-lg shadow-sm hover:shadow-md p-8 transition-all duration-400 hover-lift group border border-sand/10 dark:border-dark-sand/20'
          >
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-3xl font-display font-medium text-text-primary group-hover:text-sea dark:group-hover:text-accent-blue transition-colors duration-400 tracking-refined'>
                Generate Template
              </h2>
              <svg
                className='w-10 h-10 text-sea dark:text-accent-blue transition-transform duration-400 group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </div>
            <p className='text-text-secondary mb-6 leading-relaxed'>
              Select a template, edit its fields with a dynamic form, preview changes live, and export as a perfect 1080×1920 PNG.
            </p>
            <span className='text-sea dark:text-accent-blue font-medium tracking-elegant group-hover:underline inline-flex items-center gap-2'>
              Start generating
              <span className='transition-transform duration-400 group-hover:translate-x-1'>→</span>
            </span>
          </Link>

          <Link
            to='/preview'
            className='bg-white dark:bg-dark-sand rounded-lg shadow-sm hover:shadow-md p-8 transition-all duration-400 hover-lift group border border-sand/10 dark:border-dark-sand/20'
          >
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-3xl font-display font-medium text-text-primary group-hover:text-sea dark:group-hover:text-accent-blue transition-colors duration-400 tracking-refined'>
                Browse Templates
              </h2>
              <svg
                className='w-10 h-10 text-sea dark:text-accent-blue transition-transform duration-400 group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
            <p className='text-text-secondary mb-6 leading-relaxed'>
              View all available templates in the gallery with thumbnail previews. Click any template to see it full-size with default values.
            </p>
            <span className='text-sea dark:text-accent-blue font-medium tracking-elegant group-hover:underline inline-flex items-center gap-2'>
              View gallery
              <span className='transition-transform duration-400 group-hover:translate-x-1'>→</span>
            </span>
          </Link>
        </div>

        {/* How it works */}
        <div className='mt-16 text-center max-w-6xl mx-auto'>
          <h2 className='text-4xl font-display font-medium text-text-primary dark:text-white mb-12 tracking-refined'>How It Works</h2>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='bg-white dark:bg-dark-sand rounded-lg p-8 shadow-sm hover-lift border border-sand/10 dark:border-dark-sand/20 transition-all duration-400'>
              <div className='w-16 h-16 bg-sand dark:bg-dark-sand text-sea dark:text-accent-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-display font-medium'>
                1
              </div>
              <h3 className='font-display font-medium text-text-primary dark:text-white mb-3 text-lg tracking-refined'>Select Template</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>Choose from available story templates</p>
            </div>
            <div className='bg-white dark:bg-dark-sand rounded-lg p-8 shadow-sm hover-lift border border-sand/10 dark:border-dark-sand/20 transition-all duration-400'>
              <div className='w-16 h-16 bg-sand dark:bg-dark-sand text-sea dark:text-accent-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-display font-medium'>
                2
              </div>
              <h3 className='font-display font-medium text-text-primary dark:text-white mb-3 text-lg tracking-refined'>Customize Fields</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>Edit text, images, and other properties</p>
            </div>
            <div className='bg-white dark:bg-dark-sand rounded-lg p-8 shadow-sm hover-lift border border-sand/10 dark:border-dark-sand/20 transition-all duration-400'>
              <div className='w-16 h-16 bg-sand dark:bg-dark-sand text-sea dark:text-accent-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-display font-medium'>
                3
              </div>
              <h3 className='font-display font-medium text-text-primary dark:text-white mb-3 text-lg tracking-refined'>Preview Live</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>See changes update in real-time</p>
            </div>
            <div className='bg-white dark:bg-dark-sand rounded-lg p-8 shadow-sm hover-lift border border-sand/10 dark:border-dark-sand/20 transition-all duration-400'>
              <div className='w-16 h-16 bg-sand dark:bg-dark-sand text-sea dark:text-accent-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-display font-medium'>
                4
              </div>
              <h3 className='font-display font-medium text-text-primary dark:text-white mb-3 text-lg tracking-refined'>Export PNG</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>Download perfect 1080×1920 image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
