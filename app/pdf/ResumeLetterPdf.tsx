/**
 * ResumeLetterPdf — @react-pdf/renderer Document
 *
 * Desert & Sea visual identity — warm Mediterranean aesthetic.
 * Data comes from runtime props (ResumeLetterProps).
 *
 * Visual Language:
 *  - Libre Franklin (body text) — clean, professional
 *  - Encode Sans (display/headings) — distinctive, refined
 *  - Asymmetric sidebar design with elevated experience cards
 *  - Subtle desert/sea gradients, warm sandy undertones
 *  - Fonts loaded as woff v1 format (woff2 NOT supported by @react-pdf/renderer)
 *
 * Palette (Desert & Sea):
 *   Light Sand  #f9f6f2   Sand        #e6d5b8   Desert      #c1814d
 *   Terracotta  #a65d57   Dusk        #694f5d   Sea         #2c5784
 *   Deep Sea    #1a374d   Text        #2d2d2d   Secondary   #595959
 */

import React from 'react';
import { Document, Page, View, Text, Link, StyleSheet, Font, Svg, Rect, Defs, LinearGradient, Stop, Path } from '@react-pdf/renderer';
import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';
import { buildResumePaginatedCards } from '../templates/resumeSecondaryLayout';

// ─── Font Registration ──────────────────────────────────────────────────────

// Register fonts using ttf format (downloaded from Google Fonts)
// Fonts must use full URLs with protocol + host for proper fetching
const getFontUrl = (filename: string) => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/fonts/${filename}`;
  }
  return `/fonts/${filename}`;
};

// Libre Franklin for body text
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

// Encode Sans for display/titles
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

// Disable automatic hyphenation to keep words intact across lines.
Font.registerHyphenationCallback((word) => [word]);

// ─── Desert & Sea Palette ───────────────────────────────────────────────────

const C = {
  LIGHT_SAND: '#f9f6f2',
  SAND: '#e6d5b8',
  DESERT: '#c1814d',
  TERRACOTTA: '#a65d57',
  DUSK: '#694f5d',
  SEA: '#2c5784',
  DEEP_SEA: '#1a374d',
  TEXT: '#2d2d2d',
  SECONDARY: '#595959'
} as const;
const CONTENT_SAFE_INSET = 18;
const SIDEBAR_WIDTH = 225;
const SECONDARY_SIDEBAR_WIDTH = 220;

// ─── Refined Stylesheet ─────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    fontFamily: 'Libre Franklin',
    fontSize: 9.5,
    color: C.TEXT
  },

  // ── Left sidebar — desert gradient feel ──────────────────────────────────
  sidebar: {
    width: SIDEBAR_WIDTH,
    paddingTop: 28 + CONTENT_SAFE_INSET,
    paddingBottom: 28 + CONTENT_SAFE_INSET,
    paddingLeft: 18 + CONTENT_SAFE_INSET,
    paddingRight: 18,
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: C.SAND,
    borderRightStyle: 'solid',
    position: 'relative'
  },
  sidebarName: {
    fontFamily: 'Encode Sans',
    fontWeight: 700,
    fontSize: 22,
    color: C.DEEP_SEA,
    letterSpacing: -0.6,
    lineHeight: 0.95,
    marginBottom: 6
  },
  sidebarTitle: {
    fontFamily: 'Encode Sans',
    fontWeight: 400,
    fontSize: 8,
    color: C.DESERT,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 18,
    lineHeight: 1.4
  },
  contactBlock: {
    marginBottom: 14
  },
  contactLabel: {
    fontFamily: 'Encode Sans',
    fontWeight: 600,
    fontSize: 7,
    color: C.TERRACOTTA,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 5
  },
  contactText: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 7,
    color: C.TEXT,
    lineHeight: 1.4,
    marginBottom: 2
  },
  contactLink: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 7,
    color: C.SEA,
    lineHeight: 1.4,
    marginBottom: 2
  },
  sidebarMetaBlock: {
    marginBottom: 14
  },
  sidebarMetaLabel: {
    fontFamily: 'Encode Sans',
    fontWeight: 600,
    fontSize: 7,
    color: C.TERRACOTTA,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 5
  },
  sidebarMetaText: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 7,
    color: C.TEXT,
    lineHeight: 1.4,
    marginBottom: 2
  },
  sidebarIntro: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 7.8,
    color: C.TEXT,
    lineHeight: 1.4,
    marginBottom: 14
  },
  sidebarBottom: {
    marginTop: 'auto',
    flexDirection: 'column'
  },
  sidebarLogoWrap: {
    width: 24,
    height: 31
  },
  sidebarRule: {
    width: 48,
    height: 2,
    marginTop: 10,
    backgroundColor: C.DESERT,
    opacity: 0.4
  },

  // ── Main content area ─────────────────────────────────────────────────────
  mainContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 28 + CONTENT_SAFE_INSET,
    paddingRight: 28 + CONTENT_SAFE_INSET,
    paddingBottom: 28 + CONTENT_SAFE_INSET,
    paddingLeft: 20,
    flexDirection: 'column'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12
  },
  sectionMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.TERRACOTTA,
    marginRight: 6,
    marginTop: 1,
    flexShrink: 0
  },
  sectionMarkerHollow: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: C.TERRACOTTA,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    marginRight: 6,
    marginTop: 1,
    flexShrink: 0
  },
  sectionLabel: {
    fontFamily: 'Encode Sans',
    fontWeight: 700,
    fontSize: 9,
    color: C.SEA,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },

  // ── Experience card with elevation ────────────────────────────────────────
  expCard: {
    backgroundColor: 'transparent',
    marginBottom: 0,
    padding: 8,
    flexDirection: 'column'
  },
  expDateBadge: {
    backgroundColor: C.SAND,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Libre Franklin',
    fontWeight: 300,
    fontSize: 6.5,
    color: C.SECONDARY,
    letterSpacing: 0.4
  },
  expHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    columnGap: 8,
    marginBottom: 5
  },
  expHeaderMain: {
    flex: 1
  },
  expRole: {
    fontFamily: 'Encode Sans',
    fontWeight: 600,
    fontSize: 9.5,
    color: C.DEEP_SEA,
    marginBottom: 2,
    letterSpacing: -0.2,
    lineHeight: 1.2
  },
  expCompany: {
    fontFamily: 'Encode Sans',
    fontWeight: 600,
    fontSize: 7.5,
    color: C.TERRACOTTA,
    marginBottom: 0,
    letterSpacing: 0.2
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-start'
  },
  bulletMark: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.DESERT,
    marginRight: 5,
    marginTop: 4,
    flexShrink: 0
  },
  bulletText: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    flex: 1,
    fontSize: 8,
    lineHeight: 1.45,
    color: C.TEXT
  },

  // ── Page 2 specific styles ───────────────────────────────────────────────
  page2: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    fontFamily: 'Libre Franklin',
    fontSize: 8.5,
    color: C.TEXT
  },
  page2Sidebar: {
    width: SECONDARY_SIDEBAR_WIDTH,
    paddingTop: 28 + CONTENT_SAFE_INSET,
    paddingBottom: 24 + CONTENT_SAFE_INSET,
    paddingLeft: 16 + CONTENT_SAFE_INSET,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: C.SAND,
    borderRightStyle: 'solid',
    position: 'relative',
    flexDirection: 'column'
  },
  page2Name: {
    fontFamily: 'Encode Sans',
    fontWeight: 700,
    fontSize: 18,
    color: C.DEEP_SEA,
    letterSpacing: -0.3,
    lineHeight: 1,
    marginBottom: 6
  },
  page2Continued: {
    fontFamily: 'Libre Franklin',
    fontWeight: 300,
    fontSize: 8,
    color: C.SECONDARY,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14
  },
  page2AsideCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: C.SAND,
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 10
  },
  page2AsideSpacer: {
    flex: 1
  },
  page2AsideLogo: {
    marginBottom: 10
  },
  page2AsideRule: {
    height: 1,
    backgroundColor: C.DEEP_SEA,
    opacity: 0.3,
    marginBottom: 6
  },
  page2AsideFooter: {
    fontFamily: 'Libre Franklin',
    fontWeight: 300,
    fontSize: 7,
    color: C.DEEP_SEA,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  sidebarPageNumber: {
    fontFamily: 'Libre Franklin',
    fontWeight: 300,
    fontSize: 7,
    color: C.DEEP_SEA,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 6
  },
  page2Main: {
    flex: 1,
    paddingTop: 28 + CONTENT_SAFE_INSET,
    paddingBottom: 24 + CONTENT_SAFE_INSET,
    paddingLeft: 22,
    paddingRight: 24 + CONTENT_SAFE_INSET,
    flexDirection: 'column'
  },
  snapshotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 0,
    padding: 8,
    flexDirection: 'column'
  },
  snapshotHighlightCard: {
    backgroundColor: '#ffffff'
  },
  snapshotDateBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: C.SAND,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Libre Franklin',
    fontWeight: 300,
    fontSize: 6.5,
    color: C.SECONDARY,
    letterSpacing: 0.4
  },
  snapshotHighlightBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: C.SEA,
    borderWidth: 1,
    borderColor: C.SEA,
    borderStyle: 'solid',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontFamily: 'Encode Sans',
    fontWeight: 700,
    fontSize: 6.3,
    color: C.SAND,
    textAlign: 'center',
    lineHeight: 1.1,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  snapshotTitle: {
    fontFamily: 'Encode Sans',
    fontWeight: 600,
    fontSize: 9.2,
    color: C.DEEP_SEA,
    marginBottom: 4,
    letterSpacing: -0.1
  },
  snapshotTitleWithDate: {
    paddingRight: 60
  },
  snapshotTitleWithBadge: {
    paddingRight: 74
  },
  snapshotMetric: {
    fontFamily: 'Encode Sans',
    fontWeight: 600,
    fontSize: 10.3,
    color: C.SEA,
    lineHeight: 1.2,
    marginBottom: 4,
    letterSpacing: -0.2
  },
  snapshotImpact: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 8,
    color: C.TEXT,
    lineHeight: 1.38
  },
  snapshotText: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 8.5,
    color: C.SEA,
    lineHeight: 1.35
  },
  snapshotSkillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3
  },
  snapshotSkillDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: C.DESERT,
    marginRight: 4,
    marginTop: 3,
    flexShrink: 0
  },
  snapshotSkillText: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 8,
    color: C.TEXT,
    lineHeight: 1.35,
    flex: 1
  },
  snapshotSkillBody: {
    fontFamily: 'Libre Franklin',
    fontWeight: 400,
    fontSize: 8,
    color: C.TEXT,
    lineHeight: 1.35
  },
  spacer: { flex: 1 },
  footerRule: {
    height: 0.5,
    backgroundColor: C.SAND,
    marginBottom: 6,
    marginTop: 16
  },
  footerText: {
    fontFamily: 'Libre Franklin',
    fontWeight: 300,
    fontSize: 7,
    color: C.SECONDARY,
    textAlign: 'center',
    letterSpacing: 0.6
  }
});

// ─── Visual Components ──────────────────────────────────────────────────────

const SectionHeading = ({ label, hollow = false }: { label: string; hollow?: boolean }) => (
  <View style={S.sectionHeader}>
    <View style={hollow ? S.sectionMarkerHollow : S.sectionMarker} />
    <Text style={S.sectionLabel}>{label.toUpperCase()}</Text>
  </View>
);

const BulletLines = ({ highlights }: { highlights: string[] }) => (
  <>
    {(highlights || []).filter(Boolean).map((line, i) => (
      <View key={i} style={S.bulletRow}>
        <View style={S.bulletMark} />
        <Text style={S.bulletText}>{line}</Text>
      </View>
    ))}
  </>
);

const toExternalUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const BrandLogoMark = () => (
  <Svg viewBox='0 0 1000 1289.11' style={S.sidebarLogoWrap}>
    <Path
      d='M130.76,132.41h503.79C568.89,51.62,468.71,0,356.48,0c-85.56,0-164.12,30.01-225.72,80.07-19.2,15.6-36.75,33.15-52.35,52.34h52.35Z'
      fill={C.DEEP_SEA}
      fillRule='evenodd'
    />
    <Path
      d='M867.59,421.58v503.79c80.8-65.67,132.41-165.84,132.41-278.07,0-85.56-30.01-164.12-80.07-225.72-15.6-19.2-33.15-36.75-52.34-52.35v52.35Z'
      fill={C.DEEP_SEA}
      fillRule='evenodd'
    />
    <Path
      d='M582.21,1156.69H78.41c65.67,80.8,165.84,132.41,278.07,132.41,85.56,0,164.12-30.01,225.72-80.07,19.2-15.6,36.75-33.15,52.35-52.34h-52.35Z'
      fill={C.DEEP_SEA}
      fillRule='evenodd'
    />
    <Path
      d='M356.49,1003.43C160.11,1003.43.35,843.67.35,647.3s159.76-356.13,356.13-356.13,356.13,159.76,356.13,356.13-159.76,356.13-356.13,356.13ZM356.49,421.58c-124.46,0-225.72,101.26-225.72,225.72s101.26,225.72,225.72,225.72,225.72-101.26,225.72-225.72-101.26-225.72-225.72-225.72Z'
      fill={C.DEEP_SEA}
    />
    <Path
      d='M681.87,780.25c21.13-43.23,33.02-90.93,33.4-141.07h-.02c0-.8.02-1.59.02-2.38v-347.39c-53.33,13.4-97.76,45.8-123.61,88.53l90.21,402.31Z'
      fill={C.DEEP_SEA}
      fillRule='evenodd'
    />
    <Path
      d='M490.84,320.34c-43.23-21.13-90.93-33.02-141.07-33.4v.02c-.8,0-1.59-.02-2.38-.02H0c13.4,53.33,45.8,97.76,88.53,123.61l402.31-90.21Z'
      fill={C.DEEP_SEA}
      fillRule='evenodd'
    />
  </Svg>
);

const SnapshotCard = ({
  title,
  date,
  variant = 'default',
  frameless = false,
  children
}: {
  title: string;
  date?: string;
  variant?: 'default' | 'highlight';
  frameless?: boolean;
  children: React.ReactNode;
}) => {
  const isHighlight = variant === 'highlight';

  return (
    <View
      wrap={false}
      style={isHighlight ? [S.snapshotCard, S.snapshotHighlightCard] : frameless ? [S.snapshotCard, { backgroundColor: 'transparent' }] : S.snapshotCard}
    >
      {date && <Text style={S.snapshotDateBadge}>{date}</Text>}
      <Text style={date ? [S.snapshotTitle, S.snapshotTitleWithDate] : S.snapshotTitle}>{title}</Text>
      {children}
    </View>
  );
};

interface ExpEntryProps {
  role: string;
  company: string;
  date: string;
  highlights: string[];
}

// Card-based experience entry with modern styling
const ExpEntry = ({ role, company, date, highlights }: ExpEntryProps) => (
  <View style={S.expCard} wrap={false}>
    <View style={S.expHeaderRow}>
      <View style={S.expHeaderMain}>
        <Text style={S.expRole}>{role}</Text>
        {company.trim() && <Text style={S.expCompany}>{company}</Text>}
      </View>
      {date.trim() && <Text style={S.expDateBadge}>{date}</Text>}
    </View>
    <BulletLines highlights={highlights} />
  </View>
);

// ─── Document ────────────────────────────────────────────────────────────────

export type ResumeLetterPdfProps = ResumeLetterProps;

export const ResumeLetterPdf: React.FC<ResumeLetterPdfProps> = (props) => {
  const { name, title, email, phone, location, contactLinks, languages, introStatement } = props;
  const links = (contactLinks || []).map((item) => item.trim()).filter(Boolean);
  const languageItems = (languages || []).filter((item) => item.language.trim() || item.proficiency.trim());
  const { primary: primaryCards, secondary: secondaryPages } = buildResumePaginatedCards(props);

  return (
    <Document>
      {/* ══════════════════════════════════════ PAGE 1 ══════════════════════════════════════ */}
      <Page size='LETTER' style={S.page}>
        {/* Left Sidebar — Name + Contact */}
        <View style={S.sidebar}>
          {/* Subtle vertical gradient background */}
          <Svg style={{ position: 'absolute', top: 0, left: 0, width: SIDEBAR_WIDTH, height: 792 }}>
            <Defs>
              <LinearGradient id='desertGradient' x1='0' y1='0' x2='0' y2='1'>
                <Stop offset='0%' stopColor={C.DESERT} stopOpacity='0.08' />
                <Stop offset='50%' stopColor={C.TERRACOTTA} stopOpacity='0.03' />
                <Stop offset='100%' stopColor={C.SEA} stopOpacity='0.07' />
              </LinearGradient>
            </Defs>
            <Rect x='0' y='0' width={`${SIDEBAR_WIDTH}`} height='792' fill='url(#desertGradient)' />
          </Svg>

          <Text style={S.sidebarName}>{name}</Text>
          <Text style={S.sidebarTitle}>{title}</Text>

          {/* Contact */}
          <View style={S.contactBlock}>
            <Text style={S.contactLabel}>Contact</Text>
            <Text style={S.contactText}>{email}</Text>
            {phone?.trim() && <Text style={S.contactText}>{phone}</Text>}
            <Text style={S.contactText}>{location}</Text>
            {links.map((link, index) => {
              const href = toExternalUrl(link);
              return (
                <Link key={`contact-link-${index}`} src={href} style={S.contactLink}>
                  {link}
                </Link>
              );
            })}
          </View>

          {languageItems.length > 0 && (
            <View style={S.sidebarMetaBlock}>
              <Text style={S.sidebarMetaLabel}>Languages</Text>
              {languageItems.map((item, index) => (
                <Text key={`language-${index}`} style={S.sidebarMetaText}>
                  {item.language}
                  {item.proficiency.trim() ? ` — ${item.proficiency}` : ''}
                </Text>
              ))}
            </View>
          )}

          {introStatement?.trim() && <Text style={S.sidebarIntro}>{introStatement}</Text>}

          <View style={S.sidebarBottom}>
            <BrandLogoMark />
            <View style={S.sidebarRule} />
            <Text style={S.sidebarPageNumber}>Page 1</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={S.mainContent}>
          {primaryCards.map((card, index) => {
            const showSectionHeading = index === 0 || primaryCards[index - 1].section !== card.section;
            return (
              <React.Fragment key={card.id}>
                {showSectionHeading && <SectionHeading label={card.section} />}
                {card.type === 'experience' && (
                  <ExpEntry role={card.title || 'Experience'} company={card.company} date={card.date} highlights={card.highlights} />
                )}
                {card.type === 'spotlight' && (
                  <SnapshotCard title={card.title || 'Outstanding Achievement'} variant='highlight'>
                    {card.metric && <Text style={S.snapshotMetric}>{card.metric}</Text>}
                    {card.impact && <Text style={S.snapshotImpact}>{card.impact}</Text>}
                  </SnapshotCard>
                )}
                {card.type === 'earlier' && (
                  <SnapshotCard title='Earlier Experience' frameless>
                    {card.items.map((item, itemIndex) => (
                      <View key={`${card.id}-primary-earlier-${itemIndex}`} style={S.snapshotSkillRow}>
                        <View style={S.snapshotSkillDot} />
                        <Text style={S.snapshotSkillText}>{item}</Text>
                      </View>
                    ))}
                  </SnapshotCard>
                )}
                {card.type === 'education' && (
                  <SnapshotCard title={card.title} date={card.date} frameless>
                    <Text style={S.snapshotText}>{card.school}</Text>
                  </SnapshotCard>
                )}
                {card.type === 'expertise' && (
                  <SnapshotCard title='Expertise' frameless>
                    {card.groups.map((group, groupIndex) => (
                      <View
                        key={`${card.id}-primary-expertise-${groupIndex}`}
                        style={{ marginTop: groupIndex > 0 ? 8 : 0, marginBottom: groupIndex < card.groups.length - 1 ? 5 : 0 }}
                      >
                        <Text style={S.snapshotTitle}>{group.title || 'Skills'}</Text>
                        <Text style={S.snapshotSkillBody}>{group.text}</Text>
                      </View>
                    ))}
                  </SnapshotCard>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </Page>

      {/* ══════════════════════════════════════ SECONDARY PAGES ══════════════════════════════════════ */}
      {secondaryPages.map((cards, pageIndex) => (
        <Page key={`secondary-${pageIndex}`} size='LETTER' style={S.page2}>
          <View style={S.page2Sidebar}>
            <Svg style={{ position: 'absolute', top: 0, left: 0, width: SECONDARY_SIDEBAR_WIDTH, height: 792 }}>
              <Defs>
                <LinearGradient id={`desertGradientP2-${pageIndex}`} x1='0' y1='0' x2='0' y2='1'>
                  <Stop offset='0%' stopColor={C.DESERT} stopOpacity='0.12' />
                  <Stop offset='50%' stopColor={C.TERRACOTTA} stopOpacity='0.04' />
                  <Stop offset='100%' stopColor={C.SEA} stopOpacity='0.1' />
                </LinearGradient>
              </Defs>
              <Rect x='0' y='0' width={`${SECONDARY_SIDEBAR_WIDTH}`} height='792' fill={`url(#desertGradientP2-${pageIndex})`} />
            </Svg>

            <Text style={S.page2Name}>{name}</Text>
            <Text style={S.page2Continued}>Continued</Text>

            <View style={S.page2AsideSpacer} />
            <View style={S.page2AsideLogo}>
              <BrandLogoMark />
            </View>
            <View style={S.page2AsideRule} />
            <Text style={S.page2AsideFooter}>Page {pageIndex + 2}</Text>
          </View>

          <View style={S.page2Main}>
            {cards.map((card, index) => {
              const showSectionHeading = index === 0 || cards[index - 1].section !== card.section;
              return (
                <React.Fragment key={card.id}>
                  {showSectionHeading && <SectionHeading label={card.section} />}
                  {card.type === 'experience' && (
                    <ExpEntry role={card.title || 'Experience'} company={card.company} date={card.date} highlights={card.highlights} />
                  )}
                  {card.type === 'spotlight' && (
                    <SnapshotCard title={card.title || 'Outstanding Achievement'} variant='highlight'>
                      {card.metric && <Text style={S.snapshotMetric}>{card.metric}</Text>}
                      {card.impact && <Text style={S.snapshotImpact}>{card.impact}</Text>}
                    </SnapshotCard>
                  )}
                  {card.type === 'earlier' && (
                    <SnapshotCard title='Earlier Experience' frameless>
                      {card.items.map((item, itemIndex) => (
                        <View key={`${card.id}-secondary-earlier-${itemIndex}`} style={S.snapshotSkillRow}>
                          <View style={S.snapshotSkillDot} />
                          <Text style={S.snapshotSkillText}>{item}</Text>
                        </View>
                      ))}
                    </SnapshotCard>
                  )}
                  {card.type === 'education' && (
                    <SnapshotCard title={card.title} date={card.date} frameless>
                      <Text style={S.snapshotText}>{card.school}</Text>
                    </SnapshotCard>
                  )}
                  {card.type === 'expertise' && (
                    <SnapshotCard title='Expertise' frameless>
                      {card.groups.map((group, groupIndex) => (
                        <View
                          key={`${card.id}-secondary-expertise-${groupIndex}`}
                          style={{ marginTop: groupIndex > 0 ? 8 : 0, marginBottom: groupIndex < card.groups.length - 1 ? 5 : 0 }}
                        >
                          <Text style={S.snapshotTitle}>{group.title || 'Skills'}</Text>
                          <Text style={S.snapshotSkillBody}>{group.text}</Text>
                        </View>
                      ))}
                    </SnapshotCard>
                  )}
                </React.Fragment>
              );
            })}

            <View style={S.spacer} />

            <View style={S.footerRule} />
            <Text style={S.footerText}>Generated with Broadway · broadway.gaulatti.com</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};
