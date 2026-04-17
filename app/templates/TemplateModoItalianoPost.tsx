/**
 * ModoItaliano Post Template
 *
 * A 1080x1350 Instagram post canvas for ModoItaliano.
 * This is a clean starter canvas (post-only, no story variant yet).
 */

import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';

export interface ModoItalianoPostProps {
  bottomText: string;
  backgroundImageUrl: string;
}

export const defaultProps: ModoItalianoPostProps = {
  bottomText: 'Elettra Lamborghini pide poner fin a las fiestas nocturnas cerca de los hoteles del festival de Sanremo',
  backgroundImageUrl:
    'https://cdn.fifthbell.com/media/2026/02/26/elettra-lamborghini-calls-for-end-to-late-night-parties-near-sanremo-festival-hotels-Hvsjli7JKP.avif'
};

export const fields: Array<FieldDef<ModoItalianoPostProps>> = [
  {
    key: 'bottomText',
    label: 'Bottom Text',
    type: 'text',
    placeholder: 'Elettra Lamborghini pide poner fin a las fiestas nocturnas cerca de los hoteles del festival de Sanremo'
  },
  {
    key: 'backgroundImageUrl',
    label: 'Background Image URL',
    type: 'image',
    placeholder: 'https://...'
  }
];

const WIDTH = 1080;
const HEIGHT = 1350;

const TemplateModoItalianoPost: React.FC<ModoItalianoPostProps> = ({ bottomText, backgroundImageUrl }) => {
  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif",
        color: '#ffffff'
      }}
    >
      {/* Full-bleed background image */}
      <img
        src={backgroundImageUrl}
        alt='Background'
        crossOrigin='anonymous'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Top-centered logo */}
      <div
        style={{
          position: 'absolute',
          top: '72px',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }}
      >
        <img
          src='/mi.svg'
          alt='ModoItaliano'
          style={{
            height: '92px',
            width: 'auto',
            filter: 'brightness(0) saturate(100%) invert(100%) drop-shadow(0 6px 32px rgba(0,0,0,0.5))'
          }}
        />
      </div>

      {/* Bottom box wrapper for shadow and sizing */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderTopRightRadius: '100px',
          boxShadow: '0 6px 32px rgba(0,0,0,0.5)',
          zIndex: 2
        }}
      >
        {/* Clipping container for the glass effect (works when html-to-image drops backdrop-filter) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderTopRightRadius: '100px',
            overflow: 'hidden'
          }}
        >
          <img
            src={backgroundImageUrl}
            alt=''
            crossOrigin='anonymous'
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${WIDTH}px`,
              height: `${HEIGHT}px`,
              objectFit: 'cover',
              filter: 'blur(16px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(45deg, rgba(43, 43, 43, 0.6) 0%, rgba(60, 60, 60, 0.6) 100%)'
            }}
          />
        </div>

        {/* Content container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '54px 72px'
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontSize: '61px',
              fontWeight: 600,
              lineHeight: 1.15,
              textAlign: 'left',
              color: 'rgba(255,255,255,0.98)',
              maxWidth: '920px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {bottomText}
          </p>
        </div>
      </div>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<ModoItalianoPostProps> = {
  id: 'modoitaliano_post',
  name: 'ModoItaliano Post',
  Component: TemplateModoItalianoPost,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.35,
  previewScale: 0.55
};

export default TemplateModoItalianoPost;
