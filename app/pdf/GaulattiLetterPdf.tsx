import React from 'react';
import { Document, Page, Path, Svg, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { GaulattiLetterProps } from '../templates/TemplateGaulattiLetter';

const fontUrl = (file: string) => typeof window === 'undefined' ? `/fonts/${file}` : `${window.location.origin}/fonts/${file}`;
Font.register({ family: 'Libre Franklin', fonts: [{ src: fontUrl('libre-franklin-400.ttf'), fontWeight: 400 }, { src: fontUrl('encode-sans-600.ttf'), fontWeight: 600 }] });
Font.register({ family: 'Encode Sans', fonts: [{ src: fontUrl('encode-sans-600.ttf'), fontWeight: 600 }, { src: fontUrl('encode-sans-700.ttf'), fontWeight: 700 }] });
Font.registerHyphenationCallback((word) => [word]);

const C = { blue: '#2c5784', gold: '#c6a760', ink: '#2d2d2d', muted: '#595959', border: '#d4c4a9', paper: '#ffffff' };
const S = StyleSheet.create({
  page: { backgroundColor: C.paper, color: C.ink, fontFamily: 'Libre Franklin', fontSize: 10, paddingTop: 120, paddingBottom: 76, paddingLeft: 56, paddingRight: 56 },
  head: { position: 'absolute', top: 48, left: 56, flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { width: 1, height: 34, backgroundColor: C.gold }, wordmark: { fontFamily: 'Encode Sans', fontWeight: 700, fontSize: 20, letterSpacing: -0.5 },
  bar: { position: 'absolute', top: 97, left: 56, width: 52, height: 3, backgroundColor: C.blue }, body: { flex: 1 }, date: { color: C.muted, marginBottom: 16, lineHeight: 1 }, salutation: { marginBottom: 6, lineHeight: 1.05 }, subject: { fontWeight: 600, marginBottom: 14, lineHeight: 1.05 }, copy: { lineHeight: 0.95, marginBottom: 'auto' }, closing: { marginTop: 28 }, sincerely: { lineHeight: 1.4, marginBottom: 14 }, name: { fontFamily: 'Encode Sans', fontWeight: 600, fontSize: 13, lineHeight: 1.3, marginBottom: 2 }, title: { color: C.blue, lineHeight: 1.4 }, footer: { position: 'absolute', bottom: 38, left: 56, right: 56, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 20 }, footerItem: { color: C.muted, fontSize: 8.5 }
});

/** Exact path data from Bleecker's src/assets/logo.svg; React-PDF cannot render it as an external SVG image. */
const Mark = () => <Svg width={34 * (1000 / 1289.11)} height={34} viewBox='0 0 1000 1289.11'>
  <Path d='M130.76,132.41h503.79C568.89,51.62,468.71,0,356.48,0c-85.56,0-164.12,30.01-225.72,80.07-19.2,15.6-36.75,33.15-52.35,52.34h52.35Z' fill={C.ink} fillRule='evenodd' />
  <Path d='M867.59,421.58v503.79c80.8-65.67,132.41-165.84,132.41-278.07,0-85.56-30.01-164.12-80.07-225.72-15.6-19.2-33.15-36.75-52.34-52.35v52.35Z' fill={C.ink} fillRule='evenodd' />
  <Path d='M582.21,1156.69H78.41c65.67,80.8,165.84,132.41,278.07,132.41,85.56,0,164.12-30.01,225.72-80.07,19.2-15.6,36.75-33.15,52.35-52.34h-52.35Z' fill={C.ink} fillRule='evenodd' />
  <Path d='M356.49,1003.43C160.11,1003.43.35,843.67.35,647.3s159.76-356.13,356.13-356.13,356.13,159.76,356.13,356.13-159.76,356.13-356.13,356.13ZM356.49,421.58c-124.46,0-225.72,101.26-225.72,225.72s101.26,225.72,225.72,225.72,225.72-101.26,225.72-225.72-101.26-225.72-225.72-225.72Z' fill={C.ink} />
  <Path d='M681.87,780.25c21.13-43.23,33.02-90.93,33.4-141.07h-.02c0-.8.02-1.59.02-2.38v-347.39c-53.33,13.4-97.76,45.8-123.61,88.53l90.21,402.31Z' fill={C.ink} fillRule='evenodd' />
  <Path d='M490.84,320.34c-43.23-21.13-90.93-33.02-141.07-33.4v.02c-.8,0-1.59-.02-2.38-.02H0c13.4,53.33,45.8,97.76,88.53,123.61l402.31-90.21Z' fill={C.ink} fillRule='evenodd' />
</Svg>;

export const GaulattiLetterPdf: React.FC<GaulattiLetterProps> = ({ date, toWhom, subject, body, closing, name, title, email, phone, website }) => <Document><Page size='LETTER' style={S.page}>
  <View fixed style={S.head}><Mark /><View style={S.divider} /><Text style={S.wordmark}>gaulatti</Text></View><View fixed style={S.bar} />
  <View style={S.body}>{date && <Text style={S.date}>{date}</Text>}{toWhom && <Text style={S.salutation}>{toWhom}</Text>}{subject && <Text style={S.subject}>{subject}</Text>}{body && <Text style={S.copy}>{body}</Text>}<View wrap={false} style={S.closing}>{closing && <Text style={S.sincerely}>{closing}</Text>}<Text style={S.name}>{name}</Text><Text style={S.title}>{title}</Text></View></View>
  <View fixed style={S.footer}>{email && <Text style={S.footerItem}>{email}</Text>}{phone && <Text style={S.footerItem}>{phone}</Text>}{website && <Text style={S.footerItem}>{website}</Text>}</View>
</Page></Document>;
