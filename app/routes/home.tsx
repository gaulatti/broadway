import type { Route } from './+types/home';
import { Link } from 'react-router';
import { templates } from '../templates';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Template Studio - Story Template Generator' }, { name: 'description', content: 'Create and export beautiful 1080x1920 story templates' }];
}

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='max-w-7xl mx-auto px-8 py-16'>
        {/* Hero section */}
        <div className='text-center mb-16'>
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>Template Studio</h1>
          <p className='text-xl text-gray-700 mb-2'>Create stunning 1080×1920 story templates</p>
          <p className='text-lg text-gray-600'>Select a template, customize it, and export perfect PNG images</p>
        </div>

        {/* Feature cards */}
        <div className='grid md:grid-cols-2 gap-8 mb-16'>
          <Link to='/generate' className='bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>Generate Template</h2>
              <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </div>
            <p className='text-gray-600 mb-4'>
              Select a template, edit its fields with a dynamic form, preview changes live, and export as a perfect 1080×1920 PNG.
            </p>
            <span className='text-blue-600 font-semibold group-hover:underline'>Start generating →</span>
          </Link>

          <Link to='/preview' className='bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>Browse Templates</h2>
              <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
            <p className='text-gray-600 mb-4'>
              View all available templates in the gallery with thumbnail previews. Click any template to see it full-size with default values.
            </p>
            <span className='text-blue-600 font-semibold group-hover:underline'>View gallery →</span>
          </Link>
        </div>

        {/* Stats */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <p className='text-4xl font-bold text-blue-600 mb-2'>{templates.length}</p>
              <p className='text-gray-700 font-medium'>Available Templates</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-blue-600 mb-2'>1080×1920</p>
              <p className='text-gray-700 font-medium'>Perfect Story Size</p>
            </div>
            <div>
              <p className='text-4xl font-bold text-blue-600 mb-2'>PNG</p>
              <p className='text-gray-700 font-medium'>High-Quality Export</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className='mt-16 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>How It Works</h2>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='bg-white rounded-lg p-6 shadow'>
              <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>1</div>
              <h3 className='font-semibold text-gray-900 mb-2'>Select Template</h3>
              <p className='text-sm text-gray-600'>Choose from available story templates</p>
            </div>
            <div className='bg-white rounded-lg p-6 shadow'>
              <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>2</div>
              <h3 className='font-semibold text-gray-900 mb-2'>Customize Fields</h3>
              <p className='text-sm text-gray-600'>Edit text, images, and other properties</p>
            </div>
            <div className='bg-white rounded-lg p-6 shadow'>
              <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>3</div>
              <h3 className='font-semibold text-gray-900 mb-2'>Preview Live</h3>
              <p className='text-sm text-gray-600'>See changes update in real-time</p>
            </div>
            <div className='bg-white rounded-lg p-6 shadow'>
              <div className='w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold'>4</div>
              <h3 className='font-semibold text-gray-900 mb-2'>Export PNG</h3>
              <p className='text-sm text-gray-600'>Download perfect 1080×1920 image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
