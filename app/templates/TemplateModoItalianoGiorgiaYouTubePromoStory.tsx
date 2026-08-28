/**
 * ModoItaliano Giorgia YouTube Promo Story Template
 *
 * A 1080x1920 Instagram Story companion to the YouTube promo post.
 */

import React from 'react';
import { ModoItalianoGiorgiaSocials } from './ModoItalianoGiorgiaSocials';
import { FONT_SETS } from './fontAssets';
import {
  defaultProps as postDefaultProps,
  fields as postFields,
  type ModoItalianoGiorgiaYouTubePromoProps
} from './TemplateModoItalianoGiorgiaYouTubePromoPost';
import type { FieldDef, TemplateDefinition } from './types';

export type ModoItalianoGiorgiaYouTubePromoStoryProps = ModoItalianoGiorgiaYouTubePromoProps;

export const defaultProps: ModoItalianoGiorgiaYouTubePromoStoryProps = postDefaultProps;

export const fields: Array<FieldDef<ModoItalianoGiorgiaYouTubePromoStoryProps>> = postFields;

const WIDTH = 1080;
const HEIGHT = 1920;
const GIORGIA_MAGENTA = '#ed0076';
const GIORGIA_NAVY = '#0a1234';

const getTitleFontSize = (title?: string): string => {
  const length = title?.trim().length ?? 0;

  if (length > 52) return '78px';
  if (length > 34) return '92px';
  return '108px';
};

const TemplateModoItalianoGiorgiaYouTubePromoStory: React.FC<ModoItalianoGiorgiaYouTubePromoStoryProps> = ({
  kicker,
  title,
  premiereDate,
  premiereTimes,
  backgroundImageUrl
}) => {
  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: GIORGIA_NAVY,
        color: '#ffffff'
      }}
    >
      <img
        src={backgroundImageUrl}
        alt='Show background'
        crossOrigin='anonymous'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          opacity: 0.92
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,18,52,0.36) 0%, rgba(10,18,52,0.04) 34%, rgba(10,18,52,0.38) 55%, rgba(10,18,52,0.92) 100%)'
        }}
      />

      <img
        src='/mi.svg'
        alt='ModoItaliano'
        style={{
          position: 'absolute',
          top: '98px',
          left: '76px',
          width: '204px',
          height: 'auto',
          filter: 'brightness(0) invert(1) drop-shadow(0 10px 32px rgba(0,0,0,0.7))'
        }}
      />

      <main
        style={{
          position: 'absolute',
          left: '80px',
          right: '80px',
          bottom: '132px',
          paddingLeft: '38px',
          borderLeft: `8px solid ${GIORGIA_MAGENTA}`
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '54px',
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: '0.025em',
            textTransform: 'uppercase'
          }}
        >
          {premiereDate}
        </p>

        <p
          style={{
            margin: '14px 0 0',
            maxWidth: '840px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '34px',
            lineHeight: 1.2,
            fontWeight: 500,
            letterSpacing: '0.035em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.82)',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word'
          }}
        >
          {premiereTimes}
        </p>

        <div style={{ width: '84px', height: '6px', margin: '38px 0 32px', backgroundColor: GIORGIA_MAGENTA }} />

        <p
          style={{
            margin: '0 0 16px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '34px',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
            color: GIORGIA_MAGENTA
          }}
        >
          {kicker}
        </p>

        <h1
          style={{
            margin: 0,
            maxWidth: '850px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: getTitleFontSize(title),
            lineHeight: 0.96,
            fontWeight: 600,
            letterSpacing: '-0.014em',
            color: '#ffffff',
            whiteSpace: 'pre-wrap',
            textWrap: 'balance',
            overflowWrap: 'break-word'
          }}
        >
          {title}
        </h1>

        <ModoItalianoGiorgiaSocials fontSize='31px' />
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<ModoItalianoGiorgiaYouTubePromoStoryProps> = {
  id: 'modoitaliano_giorgia_youtube_promo_story',
  name: 'ModoItaliano Giorgia YouTube Promo Story',
  Component: TemplateModoItalianoGiorgiaYouTubePromoStory,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.3,
  previewScale: 0.5,
  fonts: FONT_SETS.giorgiaPromo
};

export default TemplateModoItalianoGiorgiaYouTubePromoStory;
