/**
 * ModoItaliano Giorgia Story Template
 *
 * A 1080x1920 Instagram Story adaptation of the Giorgia post template.
 * It preserves the post's two editable inputs and visual hierarchy while
 * moving its fixed furniture into the Story-safe vertical composition.
 */

import React from 'react';
import { ModoItalianoGiorgiaSocials } from './ModoItalianoGiorgiaSocials';
import {
  defaultProps as postDefaultProps,
  fields as postFields,
  type ModoItalianoGiorgiaPostProps
} from './TemplateModoItalianoGiorgiaPost';
import type { FieldDef, TemplateDefinition } from './types';
import { FONT_SETS } from './fontAssets';

export type ModoItalianoGiorgiaStoryProps = ModoItalianoGiorgiaPostProps;

export const defaultProps: ModoItalianoGiorgiaStoryProps = postDefaultProps;

export const fields: Array<FieldDef<ModoItalianoGiorgiaStoryProps>> = postFields;

const WIDTH = 1080;
const HEIGHT = 1920;
const GIORGIA_MAGENTA = '#ed0076';

const TemplateModoItalianoGiorgiaStory: React.FC<ModoItalianoGiorgiaStoryProps> = ({ bottomText, backgroundImageUrl }) => {
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

      {/* The post's radio atmosphere extended over the Story canvas. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,18,52,0.36) 0%, rgba(10,18,52,0.02) 38%, rgba(10,18,52,0.2) 55%, rgba(10,18,52,0.98) 100%)'
        }}
      />

      <img
        src='/mi.svg'
        alt='ModoItaliano'
        style={{
          position: 'absolute',
          top: '118px',
          left: '50%',
          width: '230px',
          height: 'auto',
          transform: 'translateX(-50%)',
          filter: 'brightness(0) invert(1) drop-shadow(0 10px 34px rgba(0,0,0,0.72))'
        }}
      />

      <main
        style={{
          position: 'absolute',
          left: '86px',
          right: '86px',
          bottom: '160px',
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

        <ModoItalianoGiorgiaSocials />
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<ModoItalianoGiorgiaStoryProps> = {
  id: 'modoitaliano_giorgia_story',
  name: 'ModoItaliano Giorgia Story',
  Component: TemplateModoItalianoGiorgiaStory,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.3,
  previewScale: 0.5,
  fonts: FONT_SETS.giorgia
};

export default TemplateModoItalianoGiorgiaStory;
