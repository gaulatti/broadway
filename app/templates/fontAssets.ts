import barlow400Url from '@fontsource/barlow/files/barlow-latin-400-normal.woff2?url';
import barlowCondensed500Url from '@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2?url';
import barlowCondensed600Url from '@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2?url';
import barlowCondensed700Url from '@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2?url';
import encodeSans400Url from '@fontsource/encode-sans/files/encode-sans-latin-400-normal.woff2?url';
import encodeSans500Url from '@fontsource/encode-sans/files/encode-sans-latin-500-normal.woff2?url';
import encodeSans600Url from '@fontsource/encode-sans/files/encode-sans-latin-600-normal.woff2?url';
import encodeSans700Url from '@fontsource/encode-sans/files/encode-sans-latin-700-normal.woff2?url';
import encodeSans800Url from '@fontsource/encode-sans/files/encode-sans-latin-800-normal.woff2?url';
import funnelDisplay700Url from '@fontsource/funnel-display/files/funnel-display-latin-700-normal.woff2?url';
import funnelDisplay800Url from '@fontsource/funnel-display/files/funnel-display-latin-800-normal.woff2?url';
import libreFranklin400Url from '@fontsource/libre-franklin/files/libre-franklin-latin-400-normal.woff2?url';
import libreFranklin500Url from '@fontsource/libre-franklin/files/libre-franklin-latin-500-normal.woff2?url';
import libreFranklin600Url from '@fontsource/libre-franklin/files/libre-franklin-latin-600-normal.woff2?url';
import libreFranklin700Url from '@fontsource/libre-franklin/files/libre-franklin-latin-700-normal.woff2?url';
import museoModerno800Url from '@fontsource/museomoderno/files/museomoderno-latin-800-normal.woff2?url';
import outfit400Url from '@fontsource/outfit/files/outfit-latin-400-normal.woff2?url';
import outfit600Url from '@fontsource/outfit/files/outfit-latin-600-normal.woff2?url';

import type { TemplateFontAsset } from './fontContract';

const face = (id: string, family: string, weight: number, url: string): TemplateFontAsset => ({ id, family, style: 'normal', weight, url, owner: 'broadway' });

export const FONTS = {
  barlow400: face('barlow-400', 'Barlow', 400, barlow400Url),
  barlowCondensed500: face('barlow-condensed-500', 'Barlow Condensed', 500, barlowCondensed500Url),
  barlowCondensed600: face('barlow-condensed-600', 'Barlow Condensed', 600, barlowCondensed600Url),
  barlowCondensed700: face('barlow-condensed-700', 'Barlow Condensed', 700, barlowCondensed700Url),
  encodeSans400: face('encode-sans-400', 'Encode Sans', 400, encodeSans400Url),
  encodeSans500: face('encode-sans-500', 'Encode Sans', 500, encodeSans500Url),
  encodeSans600: face('encode-sans-600', 'Encode Sans', 600, encodeSans600Url),
  encodeSans700: face('encode-sans-700', 'Encode Sans', 700, encodeSans700Url),
  encodeSans800: face('encode-sans-800', 'Encode Sans', 800, encodeSans800Url),
  funnelDisplay700: face('funnel-display-700', 'Funnel Display', 700, funnelDisplay700Url),
  funnelDisplay800: face('funnel-display-800', 'Funnel Display', 800, funnelDisplay800Url),
  libreFranklin400: face('libre-franklin-400', 'Libre Franklin', 400, libreFranklin400Url),
  libreFranklin500: face('libre-franklin-500', 'Libre Franklin', 500, libreFranklin500Url),
  libreFranklin600: face('libre-franklin-600', 'Libre Franklin', 600, libreFranklin600Url),
  libreFranklin700: face('libre-franklin-700', 'Libre Franklin', 700, libreFranklin700Url),
  museoModerno800: face('museomoderno-800', 'MuseoModerno', 800, museoModerno800Url),
  outfit400: face('outfit-400', 'Outfit', 400, outfit400Url),
  outfit600: face('outfit-600', 'Outfit', 600, outfit600Url)
} as const;

export const FONT_SETS = {
  giorgia: [FONTS.barlowCondensed500, FONTS.barlowCondensed600],
  giorgiaSanremo: [FONTS.barlow400, FONTS.barlowCondensed600, FONTS.barlowCondensed700],
  instagram: [FONTS.encodeSans600, FONTS.encodeSans700],
  fifthbellLetter: [FONTS.encodeSans600, FONTS.encodeSans800, FONTS.libreFranklin400, FONTS.libreFranklin600],
  gaulattiLetter: [FONTS.encodeSans600, FONTS.encodeSans700, FONTS.libreFranklin400, FONTS.libreFranklin600],
  modoItaliano: [FONTS.outfit400, FONTS.outfit600],
  sanremo: [FONTS.encodeSans400, FONTS.libreFranklin400, FONTS.libreFranklin500, FONTS.libreFranklin600, FONTS.libreFranklin700],
  resumeLetter: [FONTS.encodeSans500, FONTS.encodeSans600, FONTS.libreFranklin400, FONTS.libreFranklin500],
  sanremoPromo: [FONTS.funnelDisplay700, FONTS.funnelDisplay800, FONTS.libreFranklin400, FONTS.museoModerno800]
} as const;

export const UI_FONTS = [FONTS.encodeSans400, FONTS.encodeSans500, FONTS.encodeSans600, FONTS.encodeSans700, FONTS.libreFranklin400, FONTS.libreFranklin500] as const;
