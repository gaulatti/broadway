/**
 * Sanremo Story 16x9 (Giorgia) Template
 *
 * A 1080x1920 story template for showcasing Sanremo artists with a 16:9
 * image, redesigned in the Giorgia editorial language: deterministic red
 * accent, Barlow/Barlow Condensed typography, black glass panels, square
 * corners, and a quiet image-forward composition. It intentionally keeps
 * the same editable inputs as the original Sanremo Story 16x9 template.
 */

import React from 'react';
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
const GIORGIA_RED = '#b21100';
const GIORGIA_SIGNAL = '#ff2e1a';

const TemplateSanremoStory16x9Giorgia: React.FC<SanremoStory16x9GiorgiaProps> = ({ artistName, artistImageUrl, bio1, bio2, category, song }) => {
  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Barlow', system-ui, sans-serif"
      }}
    >
      {/* Full-bleed hero, deliberately quiet. */}
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
          opacity: 0.9
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0.24) 45%, rgba(0,0,0,0.94) 100%)'
        }}
      />

      {/* Masthead strip: show mark and kicker. */}
      <header
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          padding: '44px 40px 30px',
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.14)'
        }}
      >
        <img src='/logo-sanremo.svg' alt='Sanremo 24' style={{ height: '104px', width: 'auto' }} />
        <p
          style={{
            margin: 0,
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: GIORGIA_SIGNAL
          }}
        >
          Artistas de la A a la Z
        </p>
      </header>

      {/* Name and image share the middle stage. */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '52px',
          minHeight: 0,
          padding: '40px 40px'
        }}
      >
        <h3
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontSize: (artistName?.length ?? 0) > 17 ? '92px' : '124px',
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '0.01em',
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
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.28)'
          }}
        >
          <img
            src={artistImageUrl}
            alt={artistName}
            crossOrigin='anonymous'
            style={{ display: 'block', width: '683px', height: '384px', objectFit: 'cover' }}
          />
        </div>
      </main>

      {/* Editorial card. */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <div style={{ padding: '44px 110px 26px' }}>
          <div style={{ width: '64px', height: '6px', backgroundColor: GIORGIA_RED, margin: '0 0 26px' }} />
          <p
            style={{
              margin: 0,
              fontSize: '32px',
              lineHeight: 1.5,
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
              margin: '20px 0 0',
              fontSize: '28px',
              lineHeight: 1.5,
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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 24px' }}>
          <img
            src='/mi.svg'
            alt='ModoItaliano'
            style={{ height: '46px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
          />
        </div>
        {/* Red brand strip: category and song. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            height: '108px',
            padding: '0 40px',
            backgroundColor: GIORGIA_RED
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontSize: '36px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {category}
          </span>
          <span style={{ width: '2px', height: '34px', backgroundColor: 'rgba(255,255,255,0.55)', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '36px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {song}
          </span>
        </div>
      </footer>
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
