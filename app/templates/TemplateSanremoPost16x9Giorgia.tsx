/**
 * Sanremo Post 16x9 (Giorgia) Template
 *
 * A 1080x1080 template for showcasing Sanremo artists with a 16:9 image,
 * redesigned in the ModoItaliano Giorgia radio language: full-bleed
 * photography, navy depth, magenta signal furniture, and assertive
 * Barlow/Barlow Condensed typography. It intentionally keeps the same
 * editable inputs as the original Sanremo Post 16x9 template.
 */

import React from 'react';
import { ModoItalianoGiorgiaSocials } from './ModoItalianoGiorgiaSocials';
import type { FieldDef, TemplateDefinition } from './types';

export interface SanremoPost16x9GiorgiaProps {
  artistName: string;
  artistImageUrl: string;
  bio: string;
  category: string;
  song: string;
}

export const defaultProps: SanremoPost16x9GiorgiaProps = {
  artistName: 'Angelica Bove',
  artistImageUrl: 'https://cdn-images.dzcdn.net/images/cover/53992fc379156c33299fee1870060c14/0x1900-000000-80-0-0.jpg',
  bio: 'Cantautora italiana nacida en Roma. Su proyecto se inscribe dentro del pop italiano contemporáneo con un enfoque autoral e íntimo.',
  category: 'Nuove Proposte',
  song: 'Mattone'
};

export const fields: Array<FieldDef<SanremoPost16x9GiorgiaProps>> = [
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

const WIDTH = 1080;
const HEIGHT = 1080;
const GIORGIA_MAGENTA = '#ed0076';

const getSongFontSize = (song?: string): string => {
  const length = song?.trim().length ?? 0;

  if (length > 24) return '38px';
  if (length > 10) return '46px';
  return '58px';
};

const TemplateSanremoPost16x9Giorgia: React.FC<SanremoPost16x9GiorgiaProps> = ({ artistName, artistImageUrl, bio, category, song }) => {
  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Barlow', system-ui, sans-serif"
      }}
    >
      {/* One dominant photograph. */}
      <img
        src={artistImageUrl}
        alt='Background'
        crossOrigin='anonymous'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.94
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,18,52,0.5) 0%, rgba(10,18,52,0.05) 34%, rgba(10,18,52,0.22) 52%, rgba(5,8,24,0.98) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 86% 7%, rgba(237,0,118,0.28), rgba(237,0,118,0) 35%)'
        }}
      />

      {/* A proud dual masthead: Giorgia first, Sanremo in partnership. */}
      <header
        style={{
          position: 'absolute',
          top: '54px',
          left: '66px',
          right: '66px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '22px',
          borderBottom: '2px solid rgba(255,255,255,0.3)'
        }}
      >
        <img
          src='/mi.svg'
          alt='ModoItaliano'
          style={{ width: '190px', height: 'auto', filter: 'brightness(0) invert(1) drop-shadow(0 8px 24px rgba(0,0,0,0.55))' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <p
            style={{
              margin: 0,
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '25px',
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textAlign: 'right',
              textTransform: 'uppercase',
              color: GIORGIA_MAGENTA
            }}
          >
            Artistas
            <br />
            de la A a la Z
          </p>
          <img src='/logo-sanremo.svg' alt='Sanremo 24' style={{ height: '68px', width: 'auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))' }} />
        </div>
      </header>

      {/* Editorial information sits directly on the photograph, not in a generic card. */}
      <main
        style={{
          position: 'absolute',
          left: '72px',
          right: '72px',
          bottom: '52px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '34px' }}>
          <section
            style={{
              minWidth: 0,
              flex: 1,
              paddingLeft: '34px',
              borderLeft: `8px solid ${GIORGIA_MAGENTA}`
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontSize: '27px',
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: GIORGIA_MAGENTA
              }}
            >
              {category}
            </p>
            <h3
              style={{
                margin: 0,
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontSize: (artistName?.length ?? 0) > 17 ? '78px' : '104px',
                lineHeight: 0.92,
                fontWeight: 700,
                letterSpacing: '-0.015em',
                textTransform: 'uppercase',
                color: '#ffffff',
                whiteSpace: 'pre-wrap',
                textWrap: 'balance',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {artistName}
            </h3>
            <p
              style={{
                margin: '18px 0 0',
                maxWidth: '610px',
                fontSize: '29px',
                lineHeight: 1.32,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.86)',
                whiteSpace: 'pre-wrap',
                textWrap: 'balance',
                overflowWrap: 'break-word'
              }}
            >
              {bio}
            </p>
          </section>

          <aside
            style={{
              width: '286px',
              flex: '0 0 286px',
              padding: '26px 28px 30px',
              backgroundColor: GIORGIA_MAGENTA,
              color: '#ffffff'
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontSize: '23px',
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.78)'
              }}
            >
              A Sanremo con
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontSize: getSongFontSize(song),
                lineHeight: 0.95,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere'
              }}
            >
              {song}
            </p>
          </aside>
        </div>

        <ModoItalianoGiorgiaSocials fontSize='33px' />
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<SanremoPost16x9GiorgiaProps> = {
  id: 'sanremo_post_16x9_giorgia',
  name: 'Sanremo Post 16x9 Giorgia',
  Component: TemplateSanremoPost16x9Giorgia,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.4,
  previewScale: 0.6
};

export default TemplateSanremoPost16x9Giorgia;
