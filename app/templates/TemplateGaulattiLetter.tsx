import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import { C, FONT_BODY, FONT_DISPLAY, LogoMark, MARGIN_X, MARGIN_Y, PAGE_HEIGHT, PAGE_WIDTH } from './gaulatti-letter-shared';
import { gaulattiLetterData } from './gaulattiLetterData';

export interface GaulattiLetterProps {
  date: string; toWhom: string; subject: string; body: string; closing: string; name: string; title: string; email: string; phone: string; website: string;
}

const text = { fontFamily: FONT_BODY, fontSize: '10px', lineHeight: 1.6, color: C.FOREGROUND } as const;

const TemplateGaulattiLetter: React.FC<GaulattiLetterProps> = ({ date, toWhom, subject, body, closing, name, title, email, phone, website }) => (
  <div style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, boxSizing: 'border-box', backgroundColor: C.BACKGROUND, padding: `${MARGIN_Y}px ${MARGIN_X}px`, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, color: C.FOREGROUND }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <LogoMark />
      <div style={{ height: '34px', width: '1px', backgroundColor: C.ACCENT_SOFT }} />
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>gaulatti</span>
    </div>
    <div style={{ width: '52px', height: '3px', backgroundColor: C.ACCENT, marginBottom: '20px' }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {date && <div style={{ ...text, color: C.MUTED, marginBottom: '16px', lineHeight: 1.4 }}>{date}</div>}
      {toWhom && <div style={{ ...text, marginBottom: '6px', lineHeight: 1.5 }}>{toWhom}</div>}
      {subject && <div style={{ ...text, fontWeight: 600, marginBottom: '14px', lineHeight: 1.5 }}>{subject}</div>}
      {body && <div style={{ ...text, whiteSpace: 'pre-wrap', marginBottom: 'auto' }}>{body}</div>}
      <div style={{ marginTop: '24px' }}>
        {closing && <div style={{ ...text, lineHeight: 1.5, marginBottom: '14px' }}>{closing}</div>}
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '13px', lineHeight: 1.3 }}>{name}</div>
        <div style={{ ...text, color: C.ACCENT, lineHeight: 1.4 }}>{title}</div>
      </div>
    </div>
    <div style={{ borderTop: `1px solid ${C.BORDER}`, paddingTop: '10px', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', fontFamily: FONT_BODY, fontSize: '8.5px', color: C.MUTED }}>
      {email && <span>{email}</span>}{phone && <span>{phone}</span>} {website && <span>{website}</span>}
    </div>
  </div>
);

export const fields: Array<FieldDef<GaulattiLetterProps>> = [
  { key: 'date', label: 'Date', type: 'text' }, { key: 'toWhom', label: 'Salutation', type: 'text' }, { key: 'subject', label: 'Subject Line', type: 'text' }, { key: 'body', label: 'Letter Body', type: 'textarea', rows: 10 }, { key: 'closing', label: 'Closing', type: 'text' }, { key: 'name', label: 'Signatory Name', type: 'text' }, { key: 'title', label: 'Signatory Title', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, { key: 'website', label: 'Website', type: 'text' }
];

export const templateDefinition: TemplateDefinition<GaulattiLetterProps> = { id: 'gaulatti_letter', name: 'Gaulatti Letter', Component: TemplateGaulattiLetter, defaultProps: gaulattiLetterData, fields, width: PAGE_WIDTH, height: PAGE_HEIGHT, galleryScale: 0.4, previewScale: 0.6 };
export default TemplateGaulattiLetter;
