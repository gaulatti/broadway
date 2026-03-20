/**
 * TemplateResumeLetterP1 — Broadway live preview (816 × 1056 px)
 *
 * Desert & Sea visual identity — Mediterranean sophistication.
 * Page 1 focuses on profile + dynamic experience timeline.
 */

import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import { resumeData } from './resumeData';
import TemplateResumeLetterP2 from './TemplateResumeLetterP2';
import { buildResumePaginatedCards, buildResumeSecondaryPages } from './resumeSecondaryLayout';
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

// ─── Data shape ─────────────────────────────────────────────────────────────

export interface ResumeExperienceItem {
  id: string;
  title: string;
  company: string;
  date: string;
  highlights: string[];
}

export interface ResumeEducationItem {
  id: string;
  degree: string;
  school: string;
  date: string;
}

export interface ResumeSkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeEarlierExperienceItem {
  id: string;
  text: string;
}

export interface ResumeSpotlightItem {
  id: string;
  title: string;
  metric: string;
  impact: string;
}

export interface ResumeLanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface ResumeLetterProps {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  contactLinks: string[];
  languages: ResumeLanguageItem[];
  introStatement?: string;
  secondaryPageIndex?: number;

  experience: ResumeExperienceItem[];
  earlierExperiences: ResumeEarlierExperienceItem[];
  spotlights: ResumeSpotlightItem[];

  education: ResumeEducationItem[];
  skillGroups: ResumeSkillGroup[];
}

// ─── Template Component ─────────────────────────────────────────────────────

const TemplateResumeLetterP1: React.FC<ResumeLetterProps> = (props) => {
  const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  const { name, title, email, phone, location, contactLinks, languages, introStatement, skillGroups, education } = props;
  const links = (contactLinks || []).map((item) => clean(item)).filter(Boolean);
  const languageItems = (languages || []).filter((item) => item && (clean(item.language) || clean(item.proficiency)));
  const educationItems = (education || []).filter((item) => item && (clean(item.degree) || clean(item.school) || clean(item.date)));
  const expertiseGroups = (skillGroups || [])
    .filter((group) => Boolean(group))
    .map((group, index) => ({
      id: group.id || `skills-group-${index}`,
      title: clean(group.title) || 'Skills',
      text: (group.items || []).map((item) => clean(item)).filter(Boolean).join(' • ')
    }))
    .filter((group) => group.title || group.text);
  const { primary: primaryCards } = buildResumePaginatedCards(props);

  return (
    <div
      style={{
        width: '612px',
        height: '792px',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_BODY,
        wordBreak: 'keep-all',
        overflowWrap: 'normal',
        hyphens: 'none',
        display: 'flex',
        flexDirection: 'row-reverse'
      }}
    >
      <div
        style={{
          width: '190px',
          background: `linear-gradient(180deg, ${C.DESERT}15 0%, ${C.TERRACOTTA}08 50%, ${C.SEA}12 100%)`,
          paddingTop: `${28 + CONTENT_SAFE_INSET}px`,
          paddingRight: `${18 + CONTENT_SAFE_INSET}px`,
          paddingBottom: `${28 + CONTENT_SAFE_INSET}px`,
          paddingLeft: '18px',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `1px solid ${C.SAND}`,
          position: 'relative'
        }}
      >
        {educationItems.length > 0 && (
          <div
            style={{
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '8px',
                color: C.TERRACOTTA,
                letterSpacing: '1.4px',
                textTransform: 'uppercase' as const,
                marginBottom: '6px',
                fontWeight: 500
              }}
            >
              Education
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {educationItems.map((item) => (
                <div key={`sidebar-education-${item.id}`}>
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: '7.5px',
                      color: C.DEEP_SEA,
                      letterSpacing: '0.2px',
                      fontWeight: 500,
                      marginBottom: '3px'
                    }}
                  >
                    {item.degree || 'Education'}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: '7px',
                      color: C.TEXT,
                      lineHeight: '1.35'
                    }}
                  >
                    {item.school}
                    {clean(item.date) ? ` · ${item.date}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expertiseGroups.length > 0 && (
          <div
            style={{
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '8px',
                color: C.TERRACOTTA,
                letterSpacing: '1.4px',
                textTransform: 'uppercase' as const,
                marginBottom: '6px',
                fontWeight: 500
              }}
            >
              Expertise
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {expertiseGroups.map((group) => (
                <div key={`sidebar-expertise-${group.id}`}>
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: '7.5px',
                      color: C.DEEP_SEA,
                      letterSpacing: '0.2px',
                      fontWeight: 500,
                      marginBottom: '3px'
                    }}
                  >
                    {group.title}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: '7px',
                      color: C.TEXT,
                      lineHeight: '1.35'
                    }}
                  >
                    {group.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languageItems.length > 0 && (
          <div
            style={{
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '8px',
                color: C.TERRACOTTA,
                letterSpacing: '1.4px',
                textTransform: 'uppercase' as const,
                marginBottom: '6px',
                fontWeight: 500
              }}
            >
              Languages
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {languageItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: '8px',
                    color: C.TEXT,
                    lineHeight: '1.35'
                  }}
                >
                  {item.language}
                  {clean(item.proficiency) ? ` — ${item.proficiency}` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {introStatement?.trim() && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '8px',
              color: C.TEXT,
              lineHeight: '1.45',
              marginBottom: '20px'
            }}
          >
            {introStatement}
          </div>
        )}

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <img src='/logo.svg' alt='Broadway logo' style={{ width: '24px', height: 'auto', opacity: 0.75 }} />
          <div
            style={{
              width: '48px',
              height: '2px',
              background: `linear-gradient(90deg, ${C.DESERT}, transparent)`,
              opacity: 0.4
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
            Page 1
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          paddingTop: `${28 + CONTENT_SAFE_INSET}px`,
          paddingRight: `${24 + CONTENT_SAFE_INSET}px`,
          paddingBottom: `${20 + CONTENT_SAFE_INSET}px`,
          paddingLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '12px'
          }}
        >
          <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: '24px',
                fontWeight: 600,
                color: C.DEEP_SEA,
                letterSpacing: '-0.6px',
                lineHeight: '0.98',
                marginBottom: '6px'
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: '9px',
                color: C.DESERT,
                letterSpacing: '1.2px',
                textTransform: 'uppercase' as const,
                lineHeight: '1.4'
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: '8px',
                color: C.TEXT,
                lineHeight: '1.35',
                marginTop: '3px'
              }}
            >
              {email}
            </div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: '8px',
                color: C.TEXT,
                lineHeight: '1.35'
              }}
            >
              {location}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', maxWidth: '190px' }}>
            {phone?.trim() && (
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: '8px',
                  color: C.TEXT,
                  lineHeight: '1.35',
                  textAlign: 'right'
                }}
              >
                {phone}
              </div>
            )}
            {links.map((link, index) => (
              <div
                key={`contact-link-main-${index}`}
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: '8px',
                  color: C.SEA,
                  lineHeight: '1.35',
                  textAlign: 'right'
                }}
              >
                {link}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            height: '1px',
            background: `linear-gradient(90deg, ${C.DESERT}, ${C.SEA})`,
            opacity: 0.55,
            marginBottom: '8px'
          }}
        />

        {primaryCards.map((card, index) => {
          const showSectionHeading = index === 0 || primaryCards[index - 1].section !== card.section;
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
                <SnapshotCard frameless>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {card.items.map((item, itemIndex) => (
                      <div key={`earlier-primary-${itemIndex}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
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

            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ─── Template registry ───────────────────────────────────────────────────────

export const fields: Array<FieldDef<ResumeLetterProps>> = [
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'title', label: 'Job Title', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone (optional)', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'contactLinks', label: 'Website / Links', type: 'contactLinks' },
  { key: 'languages', label: 'Languages', type: 'languageItems' },
  { key: 'introStatement', label: 'Intro Statement (optional)', type: 'textarea', rows: 3 },
  { key: 'experience', label: 'Experience', type: 'experienceItems' },
  { key: 'earlierExperiences', label: 'Earlier Experience', type: 'earlierExperienceItems' },
  { key: 'spotlights', label: 'Spotlights', type: 'spotlightItems' },
  { key: 'education', label: 'Education', type: 'educationItems' },
  { key: 'skillGroups', label: 'Skill Groups', type: 'skillGroups' }
];

export const templateDefinition: TemplateDefinition<ResumeLetterProps> = {
  id: 'resume_letter',
  name: 'Resume Letter',
  Component: TemplateResumeLetterP1,
  defaultProps: resumeData,
  fields,
  width: 612,
  height: 792,
  galleryScale: 0.4,
  previewScale: 0.6,
  renderAdditionalPages: (props) =>
    buildResumeSecondaryPages(props).map((_, index) => <TemplateResumeLetterP2 key={`resume-secondary-${index}`} {...props} secondaryPageIndex={index} />),
  additionalPages: [TemplateResumeLetterP2]
};

export default TemplateResumeLetterP1;
