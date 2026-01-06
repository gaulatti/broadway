/**
 * Sanremo Post Template
 *
 * A 1080x1080 Instagram post template for showcasing Sanremo artists.
 * Square format optimized for Instagram feed posts.
 */

import React, { useState } from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

export interface SanremoPostProps {
  artistName: string;
  artistImageUrl: string;
  bio: string;
  category: string;
  song: string;
}

export const defaultProps: SanremoPostProps = {
  artistName: 'Angelica Bove',
  artistImageUrl: 'https://cdn-images.dzcdn.net/images/cover/53992fc379156c33299fee1870060c14/0x1900-000000-80-0-0.jpg',
  bio: 'Cantautora italiana nacida en Roma. Su proyecto se inscribe dentro del pop italiano contemporáneo con un enfoque autoral e íntimo.',
  category: 'Nuove Proposte',
  song: 'Mattone'
};

export const fields: Array<FieldDef<SanremoPostProps>> = [
  {
    key: 'artistName',
    label: 'Artist Name',
    type: 'text',
    placeholder: 'Angelica Bove'
  },
  {
    key: 'artistImageUrl',
    label: 'Artist Image URL',
    type: 'image',
    placeholder: 'https://...'
  },
  {
    key: 'bio',
    label: 'Biography',
    type: 'textarea',
    rows: 4,
    placeholder: 'Artist biography...'
  },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'Nuove Proposte'
  },
  {
    key: 'song',
    label: 'Song Title',
    type: 'text',
    placeholder: 'Mattone'
  }
];

const TemplateSanremoPost: React.FC<SanremoPostProps> = (props) => {
  const { artistName, artistImageUrl, bio, category, song } = props;
  const [dominantColor, setDominantColor] = useState('#10b981');

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    try {
      const color = fac.getColor(e.currentTarget);
      setDominantColor(color.hex);
    } catch (error) {
      console.error('Error getting average color', error);
    }
  };

  return (
    <div className='bg-gray-900' style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
      <div className='relative overflow-hidden' style={{ width: '1080px', height: '1080px' }}>
        {/* Background layer with artist image blurred */}
        <div className='absolute inset-0'>
          <img
            src={artistImageUrl}
            alt='Background'
            className='w-full h-full object-cover blur-lg scale-110'
            crossOrigin='anonymous'
            onLoad={handleImageLoad}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className='absolute inset-0 transition-all duration-1000'
          style={{
            background: `linear-gradient(to bottom, ${dominantColor}99, rgba(15, 23, 42, 0.85), rgba(0, 0, 0, 0.95))`
          }}
        ></div>

        {/* Second background layer - more blurred */}
        <div className='absolute inset-0'>
          <img src={artistImageUrl} alt='Background Layer' className='w-full h-full object-cover blur-2xl scale-105 opacity-40' crossOrigin='anonymous' />
        </div>

        {/* Ambient light orbs */}
        <div className='absolute inset-0 overflow-hidden'>
          <div
            className='absolute top-[10%] left-[15%] w-64 h-64 rounded-full blur-3xl opacity-10 transition-colors duration-1000'
            style={{ backgroundColor: dominantColor }}
          ></div>
          <div
            className='absolute top-[25%] right-[10%] w-48 h-48 rounded-full blur-3xl opacity-10 transition-colors duration-1000'
            style={{ backgroundColor: dominantColor }}
          ></div>
          <div
            className='absolute bottom-[30%] left-[20%] w-56 h-56 rounded-full blur-3xl opacity-10 transition-colors duration-1000'
            style={{ backgroundColor: dominantColor }}
          ></div>
        </div>

        {/* Content layer */}
        <div className='relative z-10 h-full flex flex-col p-8'>
          {/* Header section */}
          <div className='text-center space-y-3'>
            <p className='text-white tracking-[0.3em] uppercase text-[20px] font-medium'>Artistas de la A a la Z</p>
            <div className='inline-block'>
              <img src='/logo-sanremo.svg' alt='Sanremo 24' className='h-20 w-auto mx-auto' />
            </div>
          </div>

          {/* Main content - artist info and image */}
          <div className='flex-1 flex flex-col justify-center items-center space-y-6 mt-4'>
            {/* Artist name */}
            <div className='text-center'>
              <h3
                className='text-white tracking-tight leading-none'
                style={{ fontFamily: "'Encode Sans', sans-serif", fontWeight: 400, fontSize: (artistName?.length ?? 0) > 17 ? '64px' : '80px' }}
              >
                {artistName}
              </h3>
            </div>

            {/* Artist image */}
            <div className='relative my-8'>
              <div
                className='absolute -inset-1 rounded-2xl blur-md opacity-20 transition-all duration-1000'
                style={{
                  background: `linear-gradient(to bottom right, ${dominantColor}, rgba(0, 0, 0, 0.2))`
                }}
              ></div>
              <div className='relative bg-black/20 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10'>
                <img src={artistImageUrl} alt={artistName} className='w-[320px] h-[320px] object-cover rounded-xl' crossOrigin='anonymous' />
              </div>
            </div>

            {/* Bio text */}
            <div className='max-w-[900px] px-8'>
              <p className='text-white/90 text-center leading-relaxed' style={{ fontSize: '30px' }}>
                {bio}
              </p>
            </div>
          </div>

          {/* Footer section */}
          <div className='text-center space-y-2'>
            <div
              className='inline-flex items-center gap-3 px-6 py-2 rounded-full'
              style={{ backgroundColor: `${dominantColor}20`, border: `1px solid ${dominantColor}40` }}
            >
              <span className='text-white/60 text-[26px] uppercase tracking-wider'>{category}</span>
              <span className='text-white/40 text-[26px]'>•</span>
              <span className='text-white text-[26px] font-medium'>{song}</span>
            </div>
          </div>
          {/* Brand footer */}
          <div className='flex items-center justify-center text-white/50 text-[26px] tracking-[0.3em]'>
            <img src='/logo-modoitaliano.svg' alt='ModoItaliano' className='h-24 w-auto' />
          </div>
        </div>
      </div>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<SanremoPostProps> = {
  id: 'sanremo_post',
  name: 'Sanremo Post',
  Component: TemplateSanremoPost,
  defaultProps,
  fields,
  width: 1080,
  height: 1080,
  galleryScale: 0.4,
  previewScale: 0.6
};

export default TemplateSanremoPost;
