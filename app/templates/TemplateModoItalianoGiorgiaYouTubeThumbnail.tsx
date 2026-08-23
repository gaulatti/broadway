/**
 * ModoItaliano Giorgia YouTube Thumbnail Template
 *
 * A 1280x720 YouTube thumbnail adaptation of the Giorgia post template.
 * It preserves the post's editable inputs, adds an optional subheader, and
 * tightens the composition for a landscape thumbnail.
 */

import React from 'react';
import {
  defaultProps as postDefaultProps,
  fields as postFields,
  type ModoItalianoGiorgiaPostProps
} from './TemplateModoItalianoGiorgiaPost';
import type { FieldDef, TemplateDefinition } from './types';
import { FONT_SETS } from './fontAssets';

export interface ModoItalianoGiorgiaYouTubeThumbnailProps extends ModoItalianoGiorgiaPostProps {
  subheader?: string;
}

export const defaultProps: ModoItalianoGiorgiaYouTubeThumbnailProps = {
  ...postDefaultProps,
  subheader: 'T7–E23 · Domingo 30 de agosto'
};

export const fields: Array<FieldDef<ModoItalianoGiorgiaYouTubeThumbnailProps>> = [
  {
    key: 'subheader',
    label: 'Subheader',
    type: 'text',
    placeholder: 'T7–E23 · Domingo 30 de agosto'
  },
  ...postFields
];

const WIDTH = 1280;
const HEIGHT = 720;
const GIORGIA_MAGENTA = '#ed0076';

const TemplateModoItalianoGiorgiaYouTubeThumbnail: React.FC<ModoItalianoGiorgiaYouTubeThumbnailProps> = ({
  bottomText,
  backgroundImageUrl,
  subheader
}) => {
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,18,52,0.32) 0%, rgba(10,18,52,0.02) 34%, rgba(10,18,52,0.3) 56%, rgba(10,18,52,0.98) 100%)'
        }}
      />

      <img
        src='/mi.svg'
        alt='ModoItaliano'
        style={{
          position: 'absolute',
          top: '46px',
          left: '64px',
          width: '148px',
          height: 'auto',
          filter: 'brightness(0) invert(1) drop-shadow(0 10px 34px rgba(0,0,0,0.72))'
        }}
      />

      <main
        style={{
          position: 'absolute',
          left: '68px',
          right: '68px',
          bottom: '58px',
          paddingLeft: '32px',
          borderLeft: `8px solid ${GIORGIA_MAGENTA}`
        }}
      >
        {subheader?.trim() ? (
          <p
            style={{
              margin: '0 0 16px',
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '42px',
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.84)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 4px 20px rgba(0,0,0,0.72)'
            }}
          >
            {subheader}
          </p>
        ) : null}

        <p
          style={{
            margin: 0,
            maxWidth: '1080px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '82px',
            lineHeight: 0.98,
            fontWeight: 600,
            letterSpacing: '-0.012em',
            color: '#ffffff',
            whiteSpace: 'pre-wrap',
            textWrap: 'balance',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 6px 28px rgba(0,0,0,0.72)'
          }}
        >
          {bottomText}
        </p>
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<ModoItalianoGiorgiaYouTubeThumbnailProps> = {
  id: 'modoitaliano_giorgia_youtube_thumbnail',
  name: 'ModoItaliano Giorgia YouTube Thumbnail',
  Component: TemplateModoItalianoGiorgiaYouTubeThumbnail,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.36,
  previewScale: 0.68,
  fonts: FONT_SETS.giorgia
};

export default TemplateModoItalianoGiorgiaYouTubeThumbnail;
