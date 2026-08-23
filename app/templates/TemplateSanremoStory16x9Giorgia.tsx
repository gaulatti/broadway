/**
 * Sanremo Story 16x9 (Giorgia) Template
 *
 * A 1080x1920 story template for showcasing Sanremo artists with a 16:9
 * image, redesigned in the ModoItaliano Giorgia radio language: full-bleed
 * photography, navy depth, magenta signal furniture, and assertive
 * Barlow/Barlow Condensed typography. It intentionally keeps the same
 * editable inputs as the original Sanremo Story 16x9 template.
 */

import React from 'react';
import { ModoItalianoGiorgiaSocials } from './ModoItalianoGiorgiaSocials';
import type { FieldDef, TemplateDefinition } from './types';

export interface SanremoStory16x9GiorgiaProps {
  artistName: string;
  artistImageUrl: string;
  bio1: string;
  bio2: string;
  category: string;
  song: string;
}

export const defaultProps: SanremoStory16x9GiorgiaProps = {
  artistName: 'Angelica Bove',
  artistImageUrl: 'https://cdn-images.dzcdn.net/images/cover/53992fc379156c33299fee1870060c14/0x1900-000000-80-0-0.jpg',
  bio1: 'Cantautora italiana nacida en Roma. Su proyecto se inscribe dentro del pop italiano contemporáneo con un enfoque autoral e íntimo.',
  bio2: 'Hace su debut en el Ariston como parte de las Nuove Proposte tras participaciones previas en Sanremo Giovani.',
  category: 'Nuove Proposte',
  song: 'Mattone'
};

export const fields: Array<FieldDef<SanremoStory16x9GiorgiaProps>> = [
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

const WIDTH = 1080;
const HEIGHT = 1920;
const GIORGIA_MAGENTA = '#ed0076';

const TemplateSanremoStory16x9Giorgia: React.FC<SanremoStory16x9GiorgiaProps> = ({ artistName, artistImageUrl, bio1, bio2, category, song }) => {
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
            'linear-gradient(180deg, rgba(10,18,52,0.5) 0%, rgba(10,18,52,0.04) 32%, rgba(10,18,52,0.2) 48%, rgba(5,8,24,0.99) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 86% 7%, rgba(237,0,118,0.3), rgba(237,0,118,0) 34%)'
        }}
      />

      {/* A proud dual masthead: Giorgia first, Sanremo in partnership. */}
      <header
        style={{
          position: 'absolute',
          top: '92px',
          left: '76px',
          right: '76px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '28px',
          borderBottom: '2px solid rgba(255,255,255,0.3)'
        }}
      >
        <img
          src='/mi.svg'
          alt='ModoItaliano'
          style={{ width: '210px', height: 'auto', filter: 'brightness(0) invert(1) drop-shadow(0 10px 30px rgba(0,0,0,0.58))' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <p
            style={{
              margin: 0,
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '28px',
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
          <img src='/logo-sanremo.svg' alt='Sanremo 24' style={{ height: '86px', width: 'auto', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.58))' }} />
        </div>
      </header>

      {/* The lower third carries the complete editorial story without repeating the image. */}
      <main
        style={{
          position: 'absolute',
          left: '76px',
          right: '76px',
          bottom: '150px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '38px',
          borderLeft: `8px solid ${GIORGIA_MAGENTA}`
        }}
      >
        <p
          style={{
            margin: '0 0 10px',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: '33px',
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
            fontSize: (artistName?.length ?? 0) > 17 ? '106px' : '142px',
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

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '18px',
            marginTop: '24px'
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '27px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.68)'
            }}
          >
            A Sanremo con
          </span>
          <span
            style={{
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '70px',
              lineHeight: 1,
              fontWeight: 700,
              color: '#ffffff',
              overflowWrap: 'anywhere'
            }}
          >
            {song}
          </span>
        </div>

        <div style={{ width: '72px', height: '6px', backgroundColor: GIORGIA_MAGENTA, margin: '34px 0 26px' }} />
        <div style={{ maxWidth: '850px' }}>
          <p
            style={{
              margin: 0,
              fontSize: '36px',
              lineHeight: 1.4,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.92)',
              whiteSpace: 'pre-wrap',
              textWrap: 'balance',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {bio1}
          </p>
          <p
            style={{
              margin: '18px 0 0',
              fontSize: '32px',
              lineHeight: 1.4,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.72)',
              whiteSpace: 'pre-wrap',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {bio2}
          </p>
        </div>

        <ModoItalianoGiorgiaSocials fontSize='33px' />
      </main>
    </div>
  );
};

export const templateDefinition: TemplateDefinition<SanremoStory16x9GiorgiaProps> = {
  id: 'sanremo_story_16x9_giorgia',
  name: 'Sanremo Story 16x9 Giorgia',
  Component: TemplateSanremoStory16x9Giorgia,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.3,
  previewScale: 0.5
};

export default TemplateSanremoStory16x9Giorgia;
