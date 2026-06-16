import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font, Svg, Rect, Path } from '@react-pdf/renderer';
import type { FifthbellLetterProps } from '../templates/TemplateFifthbellLetter';

const getFontUrl = (filename: string) => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/fonts/${filename}`;
  }
  return `/fonts/${filename}`;
};

Font.register({
  family: 'Libre Franklin',
  fonts: [
    {
      src: getFontUrl('libre-franklin-300.ttf'),
      fontWeight: 300,
      fontStyle: 'normal'
    },
    {
      src: getFontUrl('libre-franklin-400.ttf'),
      fontWeight: 400,
      fontStyle: 'normal'
    },
    {
      src: getFontUrl('libre-franklin-400-italic.ttf'),
      fontWeight: 400,
      fontStyle: 'italic'
    }
  ]
});

Font.register({
  family: 'Encode Sans',
  fonts: [
    {
      src: getFontUrl('encode-sans-400.ttf'),
      fontWeight: 400,
      fontStyle: 'normal'
    },
    {
      src: getFontUrl('encode-sans-600.ttf'),
      fontWeight: 600,
      fontStyle: 'normal'
    },
    {
      src: getFontUrl('encode-sans-700.ttf'),
      fontWeight: 700,
      fontStyle: 'normal'
    }
  ]
});

Font.registerHyphenationCallback((word) => [word]);

const ACCENT = '#b21100';
const FOREGROUND = '#0a0a0a';
const MUTED = '#737373';
const BORDER = '#e5e5e5';
const MARGIN_X = 56;
const MARGIN_Y = 48;

const S = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Libre Franklin',
    fontSize: 10,
    color: FOREGROUND,
    paddingTop: MARGIN_Y,
    paddingBottom: MARGIN_Y,
    paddingLeft: MARGIN_X,
    paddingRight: MARGIN_X,
    flexDirection: 'column'
  },
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  date: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 16,
    lineHeight: 1.4
  },
  salutation: {
    fontSize: 10,
    color: FOREGROUND,
    marginBottom: 6,
    lineHeight: 1.5
  },
  subject: {
    fontSize: 10,
    color: FOREGROUND,
    fontWeight: 600,
    marginBottom: 14,
    lineHeight: 1.5
  },
  bodyText: {
    fontSize: 10,
    color: FOREGROUND,
    lineHeight: 1.6,
    marginBottom: 'auto'
  },
  closing: {
    fontSize: 10,
    color: FOREGROUND,
    lineHeight: 1.5,
    marginBottom: 14
  },
  name: {
    fontFamily: 'Encode Sans',
    fontSize: 13,
    fontWeight: 600,
    color: FOREGROUND,
    lineHeight: 1.3,
    marginBottom: 2
  },
  title: {
    fontSize: 10,
    color: ACCENT,
    lineHeight: 1.4,
    marginBottom: 2
  },
  org: {
    fontSize: 10,
    color: MUTED,
    lineHeight: 1.4
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: 'solid',
    paddingTop: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  footerItem: {
    fontSize: 8.5,
    color: MUTED
  },
  letterheadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  },
  wordmark: {
    fontFamily: 'Encode Sans',
    fontSize: 18,
    fontWeight: 600,
    color: FOREGROUND,
    letterSpacing: -0.3
  },
  wordmarkBold: {
    fontWeight: 700
  },
  accentBar: {
    width: 44,
    height: 3,
    backgroundColor: ACCENT,
    marginBottom: 20
  }
});

const LogoMark = () => (
  <Svg width={38} height={38} viewBox='0 0 38 38'>
    <Rect x={0} y={0} width={38} height={38} fill={ACCENT} />
    <Path
      d='M14.5 31.5a2 2 0 0 0 3 0M9 24.5a1 1 0 0 0 .7 1.5h12.6a1 1 0 0 0 .7-1.5C21.8 23 20.5 21.5 20.5 17a4.5 4.5 0 0 0-9 0c0 4.5-1.3 6-2.5 7.5M9 8a10 10 0 0 0-1.5 4M29 12a10 10 0 0 0-1.5-4'
      stroke='white'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
  </Svg>
);

export type FifthbellLetterPdfProps = FifthbellLetterProps;

export const FifthbellLetterPdf: React.FC<FifthbellLetterPdfProps> = (props) => {
  const { date, toWhom, subject, body, name, title, email, phone } = props;

  return (
    <Document>
      <Page size='LETTER' style={S.page}>
        {/* Letterhead */}
        <View style={S.letterheadRow}>
          <LogoMark />
          <Text style={S.wordmark}>
            fifth<Text style={S.wordmarkBold}>bell</Text>
          </Text>
        </View>
        <View style={S.accentBar} />

        {/* Body */}
        <View style={S.body}>
          {date && <Text style={S.date}>{date}</Text>}
          {toWhom && <Text style={S.salutation}>{toWhom}</Text>}
          {subject && <Text style={S.subject}>{subject}</Text>}
          {body && <Text style={S.bodyText}>{body}</Text>}

          {/* Signature */}
          <View style={{ marginTop: 24 }}>
            <Text style={S.closing}>Sincerely,</Text>
            <Text style={S.name}>{name}</Text>
            <Text style={S.title}>{title}</Text>
            <Text style={S.org}>fifthbell</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={S.footer}>
          {email && <Text style={S.footerItem}>{email}</Text>}
          {phone && <Text style={S.footerItem}>{phone}</Text>}
          <Text style={S.footerItem}>fifthbell.com</Text>
        </View>
      </Page>
    </Document>
  );
};
