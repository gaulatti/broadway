import { Document, Font, Image, Page, Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import type { CdCoverProps } from '../templates/TemplateCdCover';

// A single standard jewel-case front insert. PDF units are points.
export const CD_COVER_PRINT_MM = 120;
export const CD_COVER_PRINT_PT = CD_COVER_PRINT_MM * 72 / 25.4;
const scale = CD_COVER_PRINT_PT / 1500;
const px = (value: number) => value * scale;

const fontUrl = (file: string) => `${window.location.origin}/fonts/${file}`;
Font.register({ family: 'Encode Sans CD Cover', fonts: [
  { src: fontUrl('encode-sans-600.ttf'), fontWeight: 600 },
  { src: fontUrl('encode-sans-700.ttf'), fontWeight: 700 }
] });
Font.registerHyphenationCallback((word) => [word]);

const S = StyleSheet.create({
  page: { position: 'relative', width: CD_COVER_PRINT_PT, height: CD_COVER_PRINT_PT, backgroundColor: '#101117', color: '#ffffff', fontFamily: 'Encode Sans CD Cover' },
  image: { position: 'absolute', top: 0, left: 0, width: CD_COVER_PRINT_PT, height: CD_COVER_PRINT_PT },
  topLine: { position: 'absolute', top: px(104), left: px(110), right: px(110), fontSize: px(62), lineHeight: 1.15, fontWeight: 600, letterSpacing: px(8), textTransform: 'uppercase' },
  topLineShadow: { position: 'absolute', top: px(107), left: px(113), right: px(107), fontSize: px(62), lineHeight: 1.15, fontWeight: 600, letterSpacing: px(8), textTransform: 'uppercase', color: '#000000', opacity: 0.5 },
  bottom: { position: 'absolute', bottom: px(112), left: px(110), right: px(110) },
  mark: { marginBottom: px(30) },
  // React-pdf reserves leading above the title glyphs; no extra margin keeps the visible gaps even.
  accent: { width: px(92), height: px(9), backgroundColor: '#b21100' },
  titleBox: { position: 'relative' },
  title: { fontSize: px(146), lineHeight: 1.03, fontWeight: 700, letterSpacing: px(-6) },
  titleShadow: { position: 'absolute', top: px(3), left: px(3), width: px(1280), fontSize: px(146), lineHeight: 1.03, fontWeight: 700, letterSpacing: px(-6), color: '#000000', opacity: 0.55 },
  subtitle: { marginTop: px(32), fontSize: px(35), lineHeight: 1.2, fontWeight: 600, letterSpacing: px(3), textTransform: 'uppercase' }
});

export interface CdCoverPdfProps extends CdCoverProps {
  backgroundDataUrl: string;
}

/** Exact paths from public/logo.svg, retained as vectors for print. */
function GaulattiMark() {
  return <Svg width={px(90)} height={px(115)} viewBox='0 0 1000 1289.11' style={S.mark}>
    <Path d='M130.76,132.41h503.79C568.89,51.62,468.71,0,356.48,0c-85.56,0-164.12,30.01-225.72,80.07-19.2,15.6-36.75,33.15-52.35,52.34h52.35Z' fill='#ffffff' fillRule='evenodd' />
    <Path d='M867.59,421.58v503.79c80.8-65.67,132.41-165.84,132.41-278.07,0-85.56-30.01-164.12-80.07-225.72-15.6-19.2-33.15-36.75-52.34-52.35v52.35Z' fill='#ffffff' fillRule='evenodd' />
    <Path d='M582.21,1156.69H78.41c65.67,80.8,164.12,132.41,278.07,132.41,85.56,0,164.12-30.01,225.72-80.07,19.2-15.6,36.75-33.15,52.35-52.34h-52.35Z' fill='#ffffff' fillRule='evenodd' />
    <Path d='M356.49,1003.43C160.11,1003.43.35,843.67.35,647.3s159.76-356.13,356.13-356.13,356.13,159.76,356.13,356.13-159.76,356.13-356.13,356.13ZM356.49,421.58c-124.46,0-225.72,101.26-225.72,225.72s101.26,225.72,225.72,225.72,225.72-101.26,225.72-225.72-101.26-225.72-225.72-225.72Z' fill='#ffffff' />
    <Path d='M681.87,780.25c21.13-43.23,33.02-90.93,33.4-141.07h-.02c0-.8.02-1.59.02-2.38v-347.39c-53.33,13.4-97.76,45.8-123.61,88.53l90.21,402.31Z' fill='#ffffff' fillRule='evenodd' />
    <Path d='M490.84,320.34c-43.23-21.13-90.93-33.02-141.07-33.4v.02c-.8,0-1.59-.02-2.38-.02H0c13.4,53.33,45.8,97.76,88.53,123.61l402.31-90.21Z' fill='#ffffff' fillRule='evenodd' />
  </Svg>;
}

export function CdCoverPdf({ backgroundDataUrl, topLine, title, subtitle }: CdCoverPdfProps) {
  return <Document title={`${title} - CD cover`}><Page size={[CD_COVER_PRINT_PT, CD_COVER_PRINT_PT]} wrap={false} style={S.page}>
    <View style={{ width: CD_COVER_PRINT_PT, height: CD_COVER_PRINT_PT }} />
    <Image src={backgroundDataUrl} style={S.image} />
    <Text style={S.topLineShadow}>{topLine}</Text>
    <Text style={S.topLine}>{topLine}</Text>
    <View style={S.bottom}>
      <GaulattiMark />
      <View style={S.accent} />
      <View style={S.titleBox}>
        <Text style={S.titleShadow}>{title}</Text>
        <Text style={S.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={S.subtitle}>{subtitle}</Text> : null}
    </View>
  </Page></Document>;
}
