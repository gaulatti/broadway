/**
 * Sanremo Promo Post Template
 *
 * A 1080x1350 Instagram portrait post template for ModoSanremo program promotions.
 *
 * Layout (fixed):
 *   ┌──────────────────────────────┐
 *   │   Upper photo section        │  ← variable content via overlaysJson
 *   │   (background image +        │
 *   │    ad-libitum text overlays) │
 *   ├──────────────────────────────┤
 *   │   Light-blue program bar     │  ← ModoSanremo logo | day + time
 *   ├──────────────────────────────┤
 *   │   Dark footer strip          │  ← slogan + URL | ModoRadio logo
 *   └──────────────────────────────┘
 *
 * Overlays are passed as OverlayItem[] and edited via the visual OverlayEditor.
 */

import React from 'react';
import type { FieldDef, OverlayItem, TemplateDefinition } from './types';

// ─── Template props ───────────────────────────────────────────────────────────

export interface SanremoPromoPostProps {
  backgroundImageUrl: string;
  overlays: OverlayItem[];
  day: string;
  time: string;
  timezone: string;
}

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_OVERLAYS: OverlayItem[] = [
  {
    id: 'item-1',
    text: 'EDICIÓN ESPECIAL DESDE ROMA',
    placement: 'top',
    align: 'center',
    fontSize: 52,
    fontWeight: 'bold',
    uppercase: true,
    shadow: true
  },
  {
    id: 'item-2',
    text: 'YA ESTAMOS TODOS',
    placement: 'bottom',
    align: 'left',
    fontSize: 80,
    fontWeight: 'bold',
    shadow: true
  },
  {
    id: 'item-2',
    text: 'SOLO FALTAS TÚ!',
    placement: 'bottom',
    align: 'left',
    fontSize: 110,
    fontWeight: 'bold',
    shadow: true
  }
];

export const defaultProps: SanremoPromoPostProps = {
  backgroundImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg',
  overlays: DEFAULT_OVERLAYS,
  day: 'VIERNES',
  time: '22:00',
  timezone: 'HORA CHILENA'
};

// ─── Field definitions ────────────────────────────────────────────────────────

export const fields: Array<FieldDef<SanremoPromoPostProps>> = [
  {
    key: 'backgroundImageUrl',
    label: 'Background Image URL',
    type: 'image',
    placeholder: 'https://...'
  },
  {
    key: 'overlays',
    label: 'Text Overlays',
    type: 'overlays'
  },
  {
    key: 'day',
    label: 'Day',
    type: 'text',
    placeholder: 'VIERNES'
  },
  {
    key: 'time',
    label: 'Time',
    type: 'text',
    placeholder: '22:00'
  },
  {
    key: 'timezone',
    label: 'Timezone Label',
    type: 'text',
    placeholder: 'HORA CHILENA'
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function overlayTextStyle(item: OverlayItem): React.CSSProperties {
  return {
    fontFamily: "'Funnel Display', sans-serif",
    fontSize: `${item.fontSize ?? 80}px`,
    fontWeight: item.fontWeight ?? 'bold',
    color: item.color ?? 'white',
    textTransform: item.uppercase ? 'uppercase' : undefined,
    letterSpacing: item.letterSpacing,
    lineHeight: item.lineHeight ?? 1.05,
    textAlign: item.align ?? 'left',
    textShadow: (item.shadow ?? true) ? '0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)' : undefined,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    margin: 0
  };
}

function alignItems(align: OverlayItem['align']): React.CSSProperties['alignItems'] {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
}

// ─── Dimensions ───────────────────────────────────────────────────────────────

const TOTAL_WIDTH = 1080;
const TOTAL_HEIGHT = 1350;
const FOOTER_HEIGHT = 230; // gray footer strip
const PROGRAM_BAR_OUTER_MARGIN_X = 55;
const PROGRAM_BAR_X = PROGRAM_BAR_OUTER_MARGIN_X;
const PROGRAM_BAR_Y = TOTAL_HEIGHT - 330;
const PROGRAM_BAR_WIDTH = 970;
const PROGRAM_BAR_HEIGHT = 200;
const OVERLAY_AREA_HEIGHT = PROGRAM_BAR_Y;
const FOOTER_TOP = TOTAL_HEIGHT - FOOTER_HEIGHT;
const PROGRAM_BAR_BOTTOM = PROGRAM_BAR_Y + PROGRAM_BAR_HEIGHT;
const PROGRAM_FOOTER_OVERLAP = Math.max(0, PROGRAM_BAR_BOTTOM - FOOTER_TOP);
const FOOTER_CONTENT_TOP_GAP = 15;

// ─── Template component ───────────────────────────────────────────────────────

const TemplateSanremoPromoPost: React.FC<SanremoPromoPostProps> = (props) => {
  const { backgroundImageUrl, overlays = [], day, time, timezone } = props;

  const topItems = overlays.filter((o) => o.placement === 'top');
  const centerItems = overlays.filter((o) => o.placement === 'center');
  const bottomItems = overlays.filter((o) => (o.placement ?? 'bottom') === 'bottom');

  const renderGroup = (items: OverlayItem[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: alignItems(items[0]?.align), gap: '8px', width: '100%' }}>
      {items.map((item) => (
        <p key={item.id} style={overlayTextStyle(item)}>
          {item.text}
        </p>
      ))}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "'Libre Franklin', sans-serif",
        width: `${TOTAL_WIDTH}px`,
        height: `${TOTAL_HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* ── BACKGROUND PHOTO (COVER) ──────────────────────────────────── */}
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
          objectPosition: 'center top',
          zIndex: 0
        }}
      />

      {/* ── OVERLAY TEXT LAYER ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${OVERLAY_AREA_HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {topItems.length > 0 && renderGroup(topItems)}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{centerItems.length > 0 && renderGroup(centerItems)}</div>

        {bottomItems.length > 0 && <div style={{ marginTop: 'auto' }}>{renderGroup(bottomItems)}</div>}
      </div>

      {/* ── LIGHT-BLUE PROGRAM BAR (ABSOLUTELY POSITIONED) ──────────────── */}
      <div
        style={{
          position: 'absolute',
          top: `${PROGRAM_BAR_Y}px`,
          left: `${PROGRAM_BAR_X}px`,
          width: `${PROGRAM_BAR_WIDTH}px`,
          height: `${PROGRAM_BAR_HEIGHT}px`,
          backgroundColor: '#83c1ff',
          padding: '25px',
          boxSizing: 'border-box',
          clipPath: 'polygon(50px 0, 100% 0, 100% 100%, 0 100%, 0 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch'
          }}
        >
          {/* Left: program logo */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src='/modosanremo-logo.png' alt='ModoSanremo' style={{ width: '100%' }} />
          </div>

          {/* Right: day + time + timezone */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: 0,
              gap: '15px'
            }}
          >
            <span
              style={{
                fontFamily: "'Funnel Display', sans-serif",
                fontWeight: 800,
                fontSize: '45px',
                color: '#000',
                lineHeight: 0.75,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                opacity: 0.9,
                textAlign: 'right'
              }}
            >
              {day}
            </span>
            <span
              style={{
                fontFamily: "'Funnel Display', sans-serif",
                fontWeight: 800,
                fontSize: '87px',
                color: '#000',
                lineHeight: 0.75,
                letterSpacing: '-0.02em',
                textAlign: 'right'
              }}
            >
              {time}
            </span>
            <span
              style={{
                fontFamily: "'Funnel Display', sans-serif",
                fontWeight: 800,
                fontSize: '28px',
                color: '#000',
                lineHeight: 0.75,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textAlign: 'right'
              }}
            >
              {timezone}
            </span>
          </div>
        </div>
      </div>

      {/* ── GRAY FOOTER STRIP (ABSOLUTELY POSITIONED) ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${FOOTER_HEIGHT}px`,
          backgroundColor: '#3a3a3a',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: `${PROGRAM_FOOTER_OVERLAP}px ${PROGRAM_BAR_OUTER_MARGIN_X}px 0 ${PROGRAM_BAR_OUTER_MARGIN_X}px`,
          zIndex: 3
        }}
      >
        {/* Left: slogan + URL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: `${FOOTER_CONTENT_TOP_GAP}px` }}>
          <span
            style={{
              fontFamily: "'MuseoModerno', sans-serif",
              fontWeight: 800,
              fontSize: '36px',
              lineHeight: '40px',
              color: 'white',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            TU SONIDO, TU ESPACIO
          </span>
          <span
            style={{
              fontFamily: "'MuseoModerno', sans-serif",
              fontWeight: 800,
              fontSize: '30px',
              lineHeight: '30px',
              color: 'white',
              letterSpacing: '0.01em'
            }}
          >
            modoradio.cl
          </span>
        </div>

        {/* Right: ModoRadio logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <img src='/modoradio.svg' alt='ModoRadio' style={{ height: '64px', width: 'auto' }} />
        </div>
      </div>
    </div>
  );
};

// ─── Template definition ──────────────────────────────────────────────────────

export const templateDefinition: TemplateDefinition<SanremoPromoPostProps> = {
  id: 'sanremo_promo_post',
  name: 'Sanremo Promo Post',
  Component: TemplateSanremoPromoPost,
  defaultProps,
  fields,
  width: TOTAL_WIDTH,
  height: TOTAL_HEIGHT,
  galleryScale: 0.35,
  previewScale: 0.55
};

export default TemplateSanremoPromoPost;
