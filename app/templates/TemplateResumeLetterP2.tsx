/**
 * Resume Letter Template — Page 2 (612×792px / US Letter)
 *
 * Desert & Sea visual identity — mirrors Page 1 with a stronger split layout.
 */

import React from 'react';
import type { ResumeLetterProps } from './TemplateResumeLetterP1';
import { buildResumeSecondaryPages } from './resumeSecondaryLayout';
import {
  C,
  FONT_BODY,
  FONT_DISPLAY,
  CONTENT_SAFE_INSET,
  CARD_VERTICAL_PADDING,
  CARD_GAP,
  Bullet,
  SectionHeading,
  SnapshotCard,
  ExpEntry
} from './resume-letter-shared';

const TemplateResumeLetterP2: React.FC<ResumeLetterProps> = (props) => {
  const { name } = props;
  const secondaryPages = buildResumeSecondaryPages(props);
  const pageIndex = Math.max(0, props.secondaryPageIndex || 0);
  const pageNumber = pageIndex + 2;
  const cards = secondaryPages[pageIndex] || [];

  return (
    <div
      style={{
        width: '612px',
        height: '792px',
        backgroundColor: '#ffffff',
        fontFamily: FONT_BODY,
        fontSize: '9px',
        color: C.TEXT,
        wordBreak: 'keep-all',
        overflowWrap: 'normal',
        hyphens: 'none',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '220px',
          borderRight: `1px solid ${C.SAND}`,
          background: `linear-gradient(180deg, ${C.DESERT}14 0%, ${C.TERRACOTTA}08 50%, ${C.SEA}14 100%)`,
          paddingTop: `${28 + CONTENT_SAFE_INSET}px`,
          paddingRight: '16px',
          paddingBottom: `${22 + CONTENT_SAFE_INSET}px`,
          paddingLeft: `${16 + CONTENT_SAFE_INSET}px`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: '18px',
              fontWeight: 500,
              color: C.DEEP_SEA,
              letterSpacing: '-0.3px',
              lineHeight: 1
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: '6px',
              fontFamily: FONT_BODY,
              fontSize: '8px',
              color: C.SECONDARY,
              letterSpacing: '0.8px',
              textTransform: 'uppercase' as const
            }}
          >
            Continued
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <img src='/logo.svg' alt='Broadway logo' style={{ width: '24px', height: 'auto', opacity: 0.75, marginBottom: '10px' }} />
          <div
            style={{
              height: '1px',
              backgroundColor: `${C.DEEP_SEA}44`,
              marginBottom: '7px'
            }}
          />
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '7px',
              letterSpacing: '1px',
              color: C.DEEP_SEA,
              textTransform: 'uppercase' as const
            }}
          >
            Page {pageNumber}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          paddingTop: `${28 + CONTENT_SAFE_INSET}px`,
          paddingRight: `${24 + CONTENT_SAFE_INSET}px`,
          paddingBottom: `${22 + CONTENT_SAFE_INSET}px`,
          paddingLeft: '22px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {cards.map((card, index) => {
          const showSectionHeading = index === 0 || cards[index - 1].section !== card.section;
          return (
            <React.Fragment key={card.id}>
              {showSectionHeading && <SectionHeading label={card.section} />}

              {card.type === 'experience' && (
                <ExpEntry role={card.title || 'Experience'} company={card.company} date={card.date} highlights={card.highlights} />
              )}

              {card.type === 'spotlight' && (
                <SnapshotCard title={card.title.trim() || 'Outstanding Achievement'} variant='highlight'>
                  {card.metric?.trim() && (
                    <div
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 500,
                        fontSize: '10.5px',
                        color: C.SEA,
                        lineHeight: '1.2',
                        marginBottom: card.impact?.trim() ? '4px' : 0,
                        letterSpacing: '-0.2px'
                      }}
                    >
                      {card.metric}
                    </div>
                  )}
                  {card.impact?.trim() && (
                    <div
                      style={{
                        fontFamily: FONT_BODY,
                        fontWeight: 400,
                        fontSize: '8px',
                        color: C.TEXT,
                        lineHeight: '1.38'
                      }}
                    >
                      {card.impact}
                    </div>
                  )}
                </SnapshotCard>
              )}

              {card.type === 'earlier' && (
                <SnapshotCard title='Earlier Experience' frameless>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {card.items.map((item, itemIndex) => (
                      <div key={`earlier-secondary-${itemIndex}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: C.DESERT,
                            marginTop: '4px',
                            flexShrink: 0,
                            display: 'inline-block'
                          }}
                        />
                        <span
                          style={{
                            fontFamily: FONT_BODY,
                            fontWeight: 400,
                            fontSize: '8px',
                            color: C.TEXT,
                            lineHeight: '1.35'
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </SnapshotCard>
              )}

              {card.type === 'education' && (
                <SnapshotCard title={card.title || 'Education'} date={card.date} frameless>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      fontSize: '8.5px',
                      color: C.SEA,
                      lineHeight: '1.35'
                    }}
                  >
                    {card.school}
                  </div>
                </SnapshotCard>
              )}

              {card.type === 'expertise' && (
                <SnapshotCard title='Expertise' frameless>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {card.groups.map((group, groupIndex) => (
                      <div key={`expertise-secondary-${groupIndex}`}>
                        <div
                          style={{
                            fontFamily: FONT_DISPLAY,
                            fontWeight: 500,
                            fontSize: '9px',
                            color: C.DEEP_SEA,
                            marginTop: groupIndex > 0 ? '8px' : '0',
                            marginBottom: '4px',
                            letterSpacing: '-0.1px'
                          }}
                        >
                          {group.title || 'Skills'}
                        </div>
                        <div
                          style={{
                            fontFamily: FONT_BODY,
                            fontWeight: 400,
                            fontSize: '8px',
                            color: C.TEXT,
                            lineHeight: '1.45'
                          }}
                        >
                          {group.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </SnapshotCard>
              )}
            </React.Fragment>
          );
        })}

        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: '1px', backgroundColor: C.SAND, marginBottom: '7px', marginTop: '16px' }} />
          <div
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 400,
              fontSize: '7px',
              color: C.SECONDARY,
              letterSpacing: '0.6px',
              textAlign: 'center'
            }}
          >
            Desert & Sea · 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateResumeLetterP2;
