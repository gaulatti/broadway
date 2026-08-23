/**
 * ModoItaliano Giorgia Post Template
 *
 * A 1080x1350 Instagram post adapted from Giorgia's editorial image system.
 * It intentionally keeps the same two editable inputs as the original
 * ModoItaliano post template.
 */

import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import { ModoItalianoGiorgiaSocials } from './ModoItalianoGiorgiaSocials';
import { FONT_SETS } from './fontAssets';

export interface ModoItalianoGiorgiaPostProps {
  bottomText: string;
  backgroundImageUrl: string;
}

export const defaultProps: ModoItalianoGiorgiaPostProps = {
  bottomText: 'Elettra Lamborghini pide poner fin a las fiestas nocturnas cerca de los hoteles del festival de Sanremo',
  backgroundImageUrl:
    'https://cdn.fifthbell.com/media/2026/02/26/elettra-lamborghini-calls-for-end-to-late-night-parties-near-sanremo-festival-hotels-Hvsjli7JKP.avif'
};

export const fields: Array<FieldDef<ModoItalianoGiorgiaPostProps>> = [
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
const GIORGIA_MAGENTA = '#ed0076';
const GIORGIA_NAVY = '#0a1234';

const TemplateModoItalianoGiorgiaPost: React.FC<ModoItalianoGiorgiaPostProps> = ({ bottomText, backgroundImageUrl }) => {
  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000000',
        color: '#ffffff'
      }}
    >
      <img
        src={backgroundImageUrl}
        alt='Background'
        crossOrigin='anonymous'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.9
        }}
      />

      {/* Giorgia's radio atmosphere, kept deliberately quiet. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,18,52,0.36) 0%, rgba(10,18,52,0.02) 38%, rgba(10,18,52,0.2) 55%, rgba(10,18,52,0.98) 100%)'
        }}
      />

      {/* The centered mark is the only brand furniture. */}
      <img
        src='/mi.svg'
        alt='ModoItaliano'
        style={{
          position: 'absolute',
          top: '74px',
          left: '50%',
          width: '230px',
          height: 'auto',
          transform: 'translateX(-50%)',
          filter: 'brightness(0) invert(1) drop-shadow(0 10px 34px rgba(0,0,0,0.72))'
        }}
      />

      {/* One editorial field: signal line and headline. */}
      <main
        style={{
          position: 'absolute',
          left: '86px',
          right: '86px',
          bottom: '84px',
          paddingLeft: '38px',
          borderLeft: `8px solid ${GIORGIA_MAGENTA}`
        }}
      >
        <p
          style={{
            margin: 0,
            maxWidth: '850px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '84px',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '-0.012em',
            color: '#ffffff',
            whiteSpace: 'pre-wrap',
            textWrap: 'balance',
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {bottomText}
        </p>

        {/* Giorgia's compact footer language, adapted to the current ModoItaliano handles. */}
        <ModoItalianoGiorgiaSocials />
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<ModoItalianoGiorgiaPostProps> = {
  id: 'modoitaliano_giorgia_post',
  name: 'ModoItaliano Giorgia Post',
  Component: TemplateModoItalianoGiorgiaPost,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.35,
  previewScale: 0.55,
  fonts: FONT_SETS.giorgia
};

export default TemplateModoItalianoGiorgiaPost;
