import React from 'react';

export const C = {
  ACCENT: '#2c5784',
  ACCENT_SOFT: '#c6a760',
  FOREGROUND: '#2d2d2d',
  MUTED: '#595959',
  BORDER: '#d4c4a9',
  BACKGROUND: '#ffffff'
} as const;

export const FONT_DISPLAY = "'Encode Sans', -apple-system, system-ui, sans-serif";
export const FONT_BODY = "'Libre Franklin', -apple-system, system-ui, sans-serif";
export const PAGE_WIDTH = 612;
export const PAGE_HEIGHT = 792;
export const MARGIN_X = 56;
export const MARGIN_Y = 48;

/** The canonical Bleecker logo asset; do not recreate or alter its paths. */
export const LogoMark = ({ size = 34 }: { size?: number }) => (
  <img src='/logo.svg' width={size * (1000 / 1289.11)} height={size} alt='Gaulatti logo' style={{ display: 'block' }} />
);
