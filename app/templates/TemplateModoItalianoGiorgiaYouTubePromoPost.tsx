/**
 * ModoItaliano Giorgia YouTube Promo Post Template
 *
 * A 1080x1350 Instagram post for promoting ModoItaliano YouTube shows.
 * The schedule, show title, and photograph remain editable while the fixed
 * ModoItaliano furniture follows the established Giorgia visual language.
 */

import React from 'react';
import { ModoItalianoGiorgiaSocials } from './ModoItalianoGiorgiaSocials';
import { FONT_SETS } from './fontAssets';
import type { FieldDef, TemplateDefinition } from './types';

export interface ModoItalianoGiorgiaYouTubePromoProps {
  kicker: string;
  title: string;
  premiereDate: string;
  premiereTimes: string;
  backgroundImageUrl: string;
}

export const defaultProps: ModoItalianoGiorgiaYouTubePromoProps = {
  kicker: 'Estrenos',
  title: 'TIM Summer Hits 2026, Lo Mejor',
  premiereDate: 'Miércoles 11',
  premiereTimes: '20:00 CHI / NY · 21:00 URU · 02:00 ITA / ESP',
  backgroundImageUrl: '/modoitaliano-youtube-promo.jpg'
};

export const fields: Array<FieldDef<ModoItalianoGiorgiaYouTubePromoProps>> = [
  {
    key: 'kicker',
    label: 'Kicker',
    type: 'text',
    placeholder: 'Estrenos'
  },
  {
    key: 'title',
    label: 'Show Title',
    type: 'textarea',
    rows: 2,
    placeholder: 'TIM Summer Hits 2026, Lo Mejor'
  },
  {
    key: 'premiereDate',
    label: 'Premiere Date',
    type: 'text',
    placeholder: 'Miércoles 11'
  },
  {
    key: 'premiereTimes',
    label: 'Premiere Times',
    type: 'textarea',
    rows: 2,
    placeholder: '20:00 CHI / NY · 21:00 URU · 02:00 ITA / ESP'
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

const getTitleFontSize = (title?: string): string => {
  const length = title?.trim().length ?? 0;

  if (length > 52) return '64px';
  if (length > 34) return '76px';
  return '88px';
};

const TemplateModoItalianoGiorgiaYouTubePromoPost: React.FC<ModoItalianoGiorgiaYouTubePromoProps> = ({
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
            'linear-gradient(180deg, rgba(10,18,52,0.34) 0%, rgba(10,18,52,0.04) 35%, rgba(10,18,52,0.42) 58%, rgba(10,18,52,0.9) 100%)'
        }}
      />

      <img
        src='/mi.svg'
        alt='ModoItaliano'
        style={{
          position: 'absolute',
          top: '68px',
          left: '68px',
          width: '184px',
          height: 'auto',
          filter: 'brightness(0) invert(1) drop-shadow(0 10px 30px rgba(0,0,0,0.68))'
        }}
      />

      <main
        style={{
          position: 'absolute',
          left: '68px',
          right: '68px',
          bottom: '62px',
          paddingLeft: '36px',
          borderLeft: `8px solid ${GIORGIA_MAGENTA}`
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '34px',
            paddingBottom: '28px',
            borderBottom: '1px solid rgba(255,255,255,0.34)'
          }}
        >
          <p
            style={{
              margin: 0,
              flex: '0 0 auto',
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '46px',
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
              margin: 0,
              maxWidth: '560px',
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '29px',
              lineHeight: 1.12,
              fontWeight: 500,
              letterSpacing: '0.035em',
              textAlign: 'right',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.84)',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word'
            }}
          >
            {premiereTimes}
          </p>
        </div>

        <p
          style={{
            margin: '30px 0 12px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '30px',
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
            maxWidth: '860px',
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

        <ModoItalianoGiorgiaSocials />
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<ModoItalianoGiorgiaYouTubePromoProps> = {
  id: 'modoitaliano_giorgia_youtube_promo_post',
  name: 'ModoItaliano Giorgia YouTube Promo Post',
  Component: TemplateModoItalianoGiorgiaYouTubePromoPost,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.35,
  previewScale: 0.55,
  fonts: FONT_SETS.giorgiaPromo
};

export default TemplateModoItalianoGiorgiaYouTubePromoPost;
