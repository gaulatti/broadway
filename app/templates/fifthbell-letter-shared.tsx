import React from 'react';

export const C = {
  ACCENT: '#b21100',
  ACCENT_DARK: '#ff2e1a',
  FOREGROUND: '#0a0a0a',
  MUTED: '#737373',
  BORDER: '#e5e5e5',
  BACKGROUND: '#ffffff'
} as const;

export const FONT_DISPLAY = "'Encode Sans', -apple-system, system-ui, sans-serif";
export const FONT_BODY = "'Libre Franklin', -apple-system, system-ui, sans-serif";
export const FONT_SERIF = "'EB Garamond', Georgia, serif";

export const PAGE_WIDTH = 612;
export const PAGE_HEIGHT = 792;
export const MARGIN_X = 56;
export const MARGIN_Y = 48;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const BellSvg = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M10.268 21a2 2 0 0 0 3.464 0' />
    <path d='M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' />
    <path d='M4 2C2.8 3.7 2 5.7 2 8' />
    <path d='M22 8a10 10 0 0 0-2-6' />
  </svg>
);

export const LogoMark = ({ iconSize = 22, boxPadding = 8 }: { iconSize?: number; boxPadding?: number }) => (
  <div
    style={{
      backgroundColor: C.ACCENT,
      color: '#ffffff',
      padding: `${boxPadding}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0
    }}
  >
    <BellSvg size={iconSize} />
  </div>
);
