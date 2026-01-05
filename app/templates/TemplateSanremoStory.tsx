/**
 * Sanremo Story Template
 *
 * A 1080x1920 story template for showcasing Sanremo artists.
 * Based on the provided Figma design, converted to accept props.
 *
 * Note: The original template used 'figma:asset' imports which are not available
 * in standard Vite/React setups. Using a placeholder URL instead.
 * Update artistImageUrl prop to point to actual images.
 */

import React, { useState } from 'react';
import type { FieldDef } from './types';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

export interface SanremoStoryProps {
  artistName: string;
  artistImageUrl: string;
  bio1: string;
  bio2: string;
  category: string;
  song: string;
}

export const defaultProps: SanremoStoryProps = {
  artistName: 'Angelica Bove',
  artistImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=480&fit=crop',
  bio1: 'Cantautora italiana nacida en Roma. Su proyecto se inscribe dentro del pop italiano contemporáneo con un enfoque autoral e íntimo.',
  bio2: 'Hace su debut en el Ariston como parte de las Nuove Proposte tras participaciones previas en Sanremo Giovani.',
  category: 'Nuove Proposte',
  song: 'Mattone'
};

export const fields: Array<FieldDef<SanremoStoryProps>> = [
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
    key: 'bio1',
    label: 'Biography Paragraph 1',
    type: 'textarea',
    rows: 3,
    placeholder: 'First paragraph of artist bio...'
  },
  {
    key: 'bio2',
    label: 'Biography Paragraph 2',
    type: 'textarea',
    rows: 3,
    placeholder: 'Second paragraph of artist bio...'
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

const TemplateSanremoStory: React.FC<SanremoStoryProps> = (props) => {
  const { artistName, artistImageUrl, bio1, bio2, category, song } = props;
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
      <div className='relative overflow-hidden' style={{ width: '1080px', height: '1920px' }}>
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
            className='absolute top-[10%] left-[15%] w-80 h-80 rounded-full blur-3xl opacity-10 transition-colors duration-1000'
            style={{ backgroundColor: dominantColor }}
          ></div>
          <div
            className='absolute top-[25%] right-[10%] w-[256px] h-[256px] rounded-full blur-3xl opacity-10 transition-colors duration-1000'
            style={{ backgroundColor: dominantColor }}
          ></div>
          <div
            className='absolute bottom-[30%] left-[20%] w-[232px] h-[232px] rounded-full blur-3xl opacity-10 transition-colors duration-1000'
            style={{ backgroundColor: dominantColor }}
          ></div>
        </div>

        {/* Content layer */}
        <div className='relative z-10 h-full flex flex-col p-16'>
          {/* Header section */}
          <div className='text-center space-y-4'>
            <p className='text-white tracking-[0.3em] uppercase text-[26px] font-medium'>Artistas de la A a la Z</p>
            <div className='inline-block'>
              <h2 className='text-6xl font-bold text-white/80 tracking-wide'>SANREMO</h2>
              <p className='text-5xl font-bold text-white/70 -mt-1'>24</p>
            </div>
          </div>

          {/* Main content - artist info and image */}
          <div className='flex-1 flex flex-col justify-center items-center space-y-10 -mt-5'>
            {/* Artist name and handle */}
            <div className='text-center'>
              <h3 className='text-[128px] text-white font-extralight tracking-tight leading-none' style={{ fontFamily: 'sans-serif' }}>
                {artistName}
              </h3>
              <div className='flex justify-center'>
                <div className='mt-12 bg-white/20 rounded block text-[26px]' style={{ width: '200px', height: '40px' }}>
                  Social Aquí
                </div>
              </div>
            </div>

            {/* Artist photo with decorative frame */}
            <div className='relative my-8'>
              <div
                className='absolute -inset-1 rounded-2xl blur-md opacity-20 transition-all duration-1000'
                style={{
                  background: `linear-gradient(to bottom right, ${dominantColor}, rgba(0, 0, 0, 0.2))`
                }}
              ></div>
              <div className='relative bg-black/20 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10'>
                <img src={artistImageUrl} alt={artistName} className='w-[400px] h-[480px] object-cover rounded-xl' crossOrigin='anonymous' />
              </div>
            </div>

            {/* Biography text */}
            <div className='space-y-6 text-center max-w-4xl'>
              <p className='text-white text-4xl leading-relaxed tracking-wide font-medium'>{bio1}</p>
              <p className='text-white/85 text-3xl leading-relaxed tracking-wide'>{bio2}</p>
            </div>
          </div>

          {/* Footer section */}
          <div className='space-y-8 text-center pb-10'>
            {/* Category and song card */}
            <div className='inline-block bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl px-12 py-6'>
              <p className='text-white/90 uppercase tracking-[0.25em] text-[26px] mb-4 font-semibold'>{category}</p>
              <p className='text-white text-5xl font-bold tracking-wide'>{song}</p>
            </div>

            {/* Brand footer */}
            <div className='flex items-center justify-center gap-5 text-white/50 text-[26px] tracking-[0.3em]'>
              <span className='font-semibold'>MODOITALIANO</span>
              <div className='flex gap-2.5'>
                <div className='w-4 h-4 rounded-full bg-emerald-300/50'></div>
                <div className='w-4 h-4 rounded-sm bg-emerald-300/50'></div>
                <div className='w-4 h-4 rounded-full bg-emerald-300/50'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSanremoStory;
