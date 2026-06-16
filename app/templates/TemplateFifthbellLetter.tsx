import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import {
  C,
  FONT_DISPLAY,
  FONT_BODY,
  PAGE_WIDTH,
  PAGE_HEIGHT,
  MARGIN_X,
  MARGIN_Y,
  CONTENT_WIDTH,
  LogoMark
} from './fifthbell-letter-shared';
import { fifthbellLetterData } from './fifthbellLetterData';

export interface FifthbellLetterProps {
  date: string;
  toWhom: string;
  subject: string;
  body: string;
  name: string;
  title: string;
  email: string;
  phone: string;
}

const TemplateFifthbellLetter: React.FC<FifthbellLetterProps> = (props) => {
  const { date, toWhom, subject, body, name, title, email, phone } = props;

  return (
    <div
      style={{
        width: `${PAGE_WIDTH}px`,
        height: `${PAGE_HEIGHT}px`,
        backgroundColor: C.BACKGROUND,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_BODY,
        display: 'flex',
        flexDirection: 'column',
        padding: `${MARGIN_Y}px ${MARGIN_X}px`
      }}
    >
      {/* ── Letterhead ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <LogoMark iconSize={22} boxPadding={8} />
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: '18px',
            fontWeight: 600,
            color: C.FOREGROUND,
            letterSpacing: '-0.3px'
          }}
        >
          fifth<span style={{ fontWeight: 800 }}>bell</span>
        </span>
      </div>
      <div
        style={{
          width: '44px',
          height: '3px',
          backgroundColor: C.ACCENT,
          marginBottom: '20px'
        }}
      />

      {/* ── Body ────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0
        }}
      >
        {date && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              color: C.MUTED,
              marginBottom: '16px',
              lineHeight: 1.4
            }}
          >
            {date}
          </div>
        )}

        {toWhom && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              color: C.FOREGROUND,
              marginBottom: '6px',
              lineHeight: 1.5
            }}
          >
            {toWhom}
          </div>
        )}

        {subject && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              color: C.FOREGROUND,
              fontWeight: 600,
              marginBottom: '14px',
              lineHeight: 1.5
            }}
          >
            {subject}
          </div>
        )}

        {body && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              color: C.FOREGROUND,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              marginBottom: 'auto'
            }}
          >
            {body}
          </div>
        )}

        {/* ── Signature block ─────────────────────────────── */}
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              color: C.FOREGROUND,
              lineHeight: 1.5
            }}
          >
            Sincerely,
          </div>
          <div style={{ marginTop: '12px' }}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '13px',
                fontWeight: 600,
                color: C.FOREGROUND,
                lineHeight: 1.3
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: '10px',
                color: C.ACCENT,
                lineHeight: 1.4
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: '10px',
                color: C.MUTED,
                lineHeight: 1.4
              }}
            >
              fifthbell
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid ${C.BORDER}`,
          paddingTop: '10px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px'
        }}
      >
        {email && (
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: '8.5px',
              color: C.MUTED
            }}
          >
            {email}
          </span>
        )}
        {phone && (
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: '8.5px',
              color: C.MUTED
            }}
          >
            {phone}
          </span>
        )}
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: '8.5px',
            color: C.MUTED
          }}
        >
          fifthbell.com
        </span>
      </div>
    </div>
  );
};

export const fields: Array<FieldDef<FifthbellLetterProps>> = [
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'toWhom', label: 'Salutation', type: 'text' },
  { key: 'subject', label: 'Subject Line', type: 'text' },
  { key: 'body', label: 'Letter Body', type: 'textarea', rows: 10 },
  { key: 'name', label: 'Signatory Name', type: 'text' },
  { key: 'title', label: 'Signatory Title', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' }
];

export const templateDefinition: TemplateDefinition<FifthbellLetterProps> = {
  id: 'fifthbell_letter',
  name: 'FifthBell Letter',
  Component: TemplateFifthbellLetter,
  defaultProps: fifthbellLetterData,
  fields,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  galleryScale: 0.4,
  previewScale: 0.6
};

export default TemplateFifthbellLetter;
