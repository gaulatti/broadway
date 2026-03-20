import type { ResumeLetterProps } from './TemplateResumeLetterP1';

export type ResumeSecondaryCard =
  | {
      section: 'Experience';
      type: 'experience';
      id: string;
      title: string;
      company: string;
      date: string;
      highlights: string[];
    }
  | {
      section: 'Spotlight';
      type: 'spotlight';
      id: string;
      title: string;
      metric?: string;
      impact?: string;
    }
  | {
      section: 'Earlier Experience';
      type: 'earlier';
      id: string;
      items: string[];
    }
  | {
      section: 'Education';
      type: 'education';
      id: string;
      title: string;
      date?: string;
      school: string;
    }
  | {
      section: 'Expertise';
      type: 'expertise';
      id: string;
      groups: Array<{
        title: string;
        text: string;
      }>;
    };

const SECONDARY_KICKER_HEIGHT = 0;
const SECONDARY_MAX_CONTENT_HEIGHT = 620;
const PRIMARY_INITIAL_HEIGHT = 0;
const PRIMARY_MAX_CONTENT_HEIGHT = 652;
const SECTION_HEADING_HEIGHT = 16;
const EXPERIENCE_BASE_HEIGHT = 26;
const SNAPSHOT_BASE_HEIGHT = 24;
const CARD_MARGIN_BOTTOM = 6;

const estimateTextLines = (value: string, charsPerLine: number) => {
  const normalized = value.trim();
  if (!normalized) {
    return 0;
  }
  return Math.max(1, Math.ceil(normalized.length / charsPerLine));
};

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const buildResumeSecondaryCards = (props: ResumeLetterProps): ResumeSecondaryCard[] => {
  const timeline = (props.experience || []).filter(
    (item) => item && (clean(item.title) || clean(item.company) || clean(item.date) || (item.highlights || []).some((line) => clean(line)))
  );
  const spotlightItems = (props.spotlights || []).filter((item) => item && (clean(item.title) || clean(item.metric) || clean(item.impact)));
  const earlierItems = (props.earlierExperiences || [])
    .map((item) => clean(item?.text))
    .filter(Boolean);

  return [
    ...spotlightItems.map((spotlight) => ({
      section: 'Spotlight' as const,
      type: 'spotlight' as const,
      id: `spotlight-${spotlight.id}`,
      title: clean(spotlight.title) || 'Outstanding Achievement',
      metric: clean(spotlight.metric),
      impact: clean(spotlight.impact)
    })),
    ...timeline.map((item) => ({
      section: 'Experience' as const,
      type: 'experience' as const,
      id: `experience-${item.id}`,
      title: clean(item.title),
      company: clean(item.company),
      date: clean(item.date),
      highlights: (item.highlights || []).map((line) => clean(line)).filter(Boolean)
    })),
    ...(earlierItems.length > 0
      ? [
          {
            section: 'Earlier Experience' as const,
            type: 'earlier' as const,
            id: 'earlier-group',
            items: earlierItems
          }
        ]
      : [])
  ];
};

export const estimateSecondaryCardHeight = (card: ResumeSecondaryCard) => {
  if (card.type === 'experience') {
    const titleLines = estimateTextLines(card.title, 34);
    const companyLines = estimateTextLines(card.company, 46);
    const highlightLines = card.highlights.length === 0 ? 1 : card.highlights.reduce((sum, line) => sum + estimateTextLines(line, 68), 0);
    return EXPERIENCE_BASE_HEIGHT + titleLines * 11 + companyLines * 10 + highlightLines * 11 + CARD_MARGIN_BOTTOM;
  }
  if (card.type === 'spotlight') {
    const titleLines = estimateTextLines(card.title, 36);
    const metricLines = estimateTextLines(card.metric || '', 42);
    const impactLines = estimateTextLines(card.impact || '', 66);
    return SNAPSHOT_BASE_HEIGHT + titleLines * 10 + metricLines * 12 + impactLines * 11 + CARD_MARGIN_BOTTOM;
  }
  if (card.type === 'earlier') {
    const textLines = card.items.reduce((sum, item) => sum + estimateTextLines(item, 72), 0);
    return SNAPSHOT_BASE_HEIGHT + textLines * 10 + CARD_MARGIN_BOTTOM;
  }
  if (card.type === 'expertise') {
    const titleLines = card.groups.reduce((sum, group) => sum + estimateTextLines(group.title, 42), 0);
    const textLines = card.groups.reduce((sum, group) => sum + estimateTextLines(group.text, 96), 0);
    return SNAPSHOT_BASE_HEIGHT + titleLines * 10 + textLines * 10 + CARD_MARGIN_BOTTOM;
  }
  const titleLines = estimateTextLines(card.title, 42);
  const schoolLines = estimateTextLines(card.school, 74);
  return SNAPSHOT_BASE_HEIGHT + titleLines * 10 + schoolLines * 10 + CARD_MARGIN_BOTTOM;
};

export const paginateResumeSecondaryCards = (cards: ResumeSecondaryCard[], maxHeight = SECONDARY_MAX_CONTENT_HEIGHT): ResumeSecondaryCard[][] => {
  if (cards.length === 0) {
    return [];
  }

  const pages: ResumeSecondaryCard[][] = [];
  let currentCards: ResumeSecondaryCard[] = [];
  let usedHeight = SECONDARY_KICKER_HEIGHT;

  cards.forEach((card) => {
    const cardHeight = estimateSecondaryCardHeight(card);
    const needsHeading = currentCards.length === 0 || currentCards[currentCards.length - 1].section !== card.section;
    const headingHeight = needsHeading ? SECTION_HEADING_HEIGHT : 0;
    const requiredHeight = headingHeight + cardHeight;

    if (currentCards.length > 0 && usedHeight + requiredHeight > maxHeight) {
      pages.push(currentCards);
      currentCards = [card];
      usedHeight = SECONDARY_KICKER_HEIGHT + SECTION_HEADING_HEIGHT + cardHeight;
      return;
    }

    currentCards.push(card);
    usedHeight += requiredHeight;
  });

  if (currentCards.length > 0) {
    pages.push(currentCards);
  }

  return pages;
};

export const buildResumeSecondaryPages = (props: ResumeLetterProps) => {
  return buildResumePaginatedCards(props).secondary;
};

export const buildResumePaginatedCards = (props: ResumeLetterProps) => {
  const cards = buildResumeSecondaryCards(props);
  if (cards.length === 0) {
    return {
      primary: [] as ResumeSecondaryCard[],
      secondary: [] as ResumeSecondaryCard[][]
    };
  }

  const pages: ResumeSecondaryCard[][] = [];
  let currentCards: ResumeSecondaryCard[] = [];
  let usedHeight = PRIMARY_INITIAL_HEIGHT;
  let maxHeight = PRIMARY_MAX_CONTENT_HEIGHT;

  cards.forEach((card) => {
    const cardHeight = estimateSecondaryCardHeight(card);
    const needsHeading = currentCards.length === 0 || currentCards[currentCards.length - 1].section !== card.section;
    const headingHeight = needsHeading ? SECTION_HEADING_HEIGHT : 0;
    const requiredHeight = headingHeight + cardHeight;

    if (currentCards.length > 0 && usedHeight + requiredHeight > maxHeight) {
      pages.push(currentCards);
      currentCards = [card];
      usedHeight = SECONDARY_KICKER_HEIGHT + SECTION_HEADING_HEIGHT + cardHeight;
      maxHeight = SECONDARY_MAX_CONTENT_HEIGHT;
      return;
    }

    currentCards.push(card);
    usedHeight += requiredHeight;
  });

  if (currentCards.length > 0) {
    pages.push(currentCards);
  }

  const [primary = [], ...secondary] = pages;
  return { primary, secondary };
};
