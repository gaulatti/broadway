/**
 * Shared constants and components for Resume Letter templates
 * Used by both TemplateResumeLetterP1 and TemplateResumeLetterP2
 */

import React from 'react';
import { RESUME_CARD, RESUME_TYPE } from './resumeGeometry';

// ─── Desert & Sea Palette ───────────────────────────────────────────────────

export const C = {
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

// ─── Typography ─────────────────────────────────────────────────────────────

export const FONT_DISPLAY = "'Encode Sans', -apple-system, system-ui, sans-serif";
export const FONT_BODY = "'Libre Franklin', -apple-system, system-ui, sans-serif";

// ─── Layout Constants ───────────────────────────────────────────────────────

export const CONTENT_SAFE_INSET = 18;
export const CARD_VERTICAL_PADDING = RESUME_CARD.verticalPadding;
export const CARD_GAP = RESUME_CARD.gap;

// ─── Shared Components ──────────────────────────────────────────────────────

export const Bullet = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2px' }}>
    <span
      style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: C.DESERT,
        marginRight: '6px',
        marginTop: '4px',
        flexShrink: 0,
        display: 'inline-block'
      }}
    />
    <span
      style={{
        fontFamily: FONT_BODY,
        color: C.TEXT,
        ...RESUME_TYPE.bullet
      }}
    >
      {text}
    </span>
  </div>
);

export const SectionHeading = ({ label }: { label: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      marginTop: '16px',
      marginBottom: '9px'
    }}
  >
    <span
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        border: `1.3px solid ${C.TERRACOTTA}`,
        backgroundColor: C.TERRACOTTA,
        display: 'inline-block',
        flexShrink: 0
      }}
    />
    <span
      style={{
        fontFamily: FONT_DISPLAY,
        color: C.SEA,
        textTransform: 'uppercase',
        ...RESUME_TYPE.section
      }}
    >
      {label}
    </span>
  </div>
);

interface SnapshotCardProps {
  title?: string;
  date?: string;
  variant?: 'default' | 'highlight';
  frameless?: boolean;
  children: React.ReactNode;
}

export const SnapshotCard = ({ title, date, variant = 'default', frameless = false, children }: SnapshotCardProps) => {
  const isHighlight = variant === 'highlight';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        background: '#ffffff',
        border: 'none',
        borderWidth: 0,
        borderRadius: '8px',
        padding: `${CARD_VERTICAL_PADDING}px 12px`,
        boxShadow: frameless || isHighlight ? 'none' : `0 1px 3px ${C.SAND}60, 0 1px 2px ${C.SAND}40`,
        position: 'relative',
        marginBottom: `${CARD_GAP}px`
      }}
    >
      {/* Date badge */}
      {date && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '8px',
            backgroundColor: `${C.SAND}55`,
            padding: '2px 7px',
            borderRadius: '5px',
            fontFamily: FONT_BODY,
            fontSize: '7px',
            color: C.SECONDARY,
            letterSpacing: '0.4px'
          }}
        >
          {date}
        </div>
      )}

      <div style={{ paddingRight: date ? '72px' : 0 }}>
        {title ? (
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: '9px',
              color: C.DEEP_SEA,
              marginBottom: '5px',
              letterSpacing: '-0.1px'
            }}
          >
            {title}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

interface ExpEntryProps {
  role: string;
  company: string;
  date: string;
  highlights: string[];
  subSpotlight?: {
    title?: string;
    metric?: string;
    impact?: string;
  };
}

export const ExpEntry = ({ role, company, date, highlights, subSpotlight }: ExpEntryProps) => {
  const hasSubSpotlight = Boolean(subSpotlight?.title?.trim() || subSpotlight?.metric?.trim() || subSpotlight?.impact?.trim());

  return (
    <div
      style={{
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: `${CARD_VERTICAL_PADDING}px ${RESUME_CARD.horizontalPadding}px`,
        position: 'relative',
        marginBottom: `${CARD_GAP}px`
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '5px'
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                color: C.DEEP_SEA,
                marginBottom: company ? '3px' : 0,
                ...RESUME_TYPE.role
              }}
            >
              {role}
            </div>

            {company && (
              <div
                style={{
                  fontFamily: FONT_BODY,
                  color: C.TERRACOTTA,
                  ...RESUME_TYPE.company
                }}
              >
                {company}
              </div>
            )}
          </div>

          {date && (
            <div
              style={{
                backgroundColor: `${C.SAND}50`,
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '7px',
                color: C.SECONDARY,
                fontFamily: FONT_BODY,
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap'
              }}
            >
              {date}
            </div>
          )}
        </div>

        {hasSubSpotlight && (
          <div
            style={{
              marginTop: '7px',
              marginLeft: '0px',
              marginBottom: '6px',
              borderLeft: `3px solid ${C.SEA}`,
              borderTop: `1px solid ${C.SAND}`,
              borderRight: `1px solid ${C.SAND}`,
              borderBottom: `1px solid ${C.SAND}`,
              background: `linear-gradient(90deg, ${C.SEA}14 0%, #ffffff 80%)`,
              borderRadius: '0 7px 7px 0',
              padding: '6px 8px'
            }}
          >
            {subSpotlight?.title?.trim() && (
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: C.DEEP_SEA,
                  ...RESUME_TYPE.spotlightTitle
                }}
              >
                {subSpotlight.title}
              </div>
            )}
            {subSpotlight?.metric?.trim() && (
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: C.SEA,
                  ...RESUME_TYPE.spotlightMetric
                }}
              >
                {subSpotlight.metric}
              </div>
            )}
            {subSpotlight?.impact?.trim() && (
              <div
                style={{
                  fontFamily: FONT_BODY,
                  color: C.TEXT,
                  ...RESUME_TYPE.spotlightImpact
                }}
              >
                {subSpotlight.impact}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {(highlights || []).filter(Boolean).map((line, index) => (
            <Bullet key={`${role}-${index}`} text={line} />
          ))}
        </div>
      </div>
    </div>
  );
};
