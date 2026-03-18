export interface ExperienceLayoutItem {
  id: string;
  title: string;
  company: string;
  date: string;
  highlights: string[];
}

const PRIMARY_HEADER_UNITS = 2;
const PRIMARY_MAX_CONTENT_HEIGHT = 652;
const EXPERIENCE_CARD_GAP = 10;
const EXPERIENCE_BASE_HEIGHT = 28;
const CHARS_PER_TITLE_LINE = 34;
const CHARS_PER_COMPANY_LINE = 44;
const CHARS_PER_HIGHLIGHT_LINE = 74;
const ROLE_LINE_HEIGHT = 12;
const COMPANY_LINE_HEIGHT = 9;
const BULLET_LINE_HEIGHT = 11;
const HEADER_HEIGHT = 28;

const estimateTextLines = (value: string, charsPerLine: number) => {
  const normalized = value.trim();
  if (!normalized) {
    return 0;
  }
  return Math.max(1, Math.ceil(normalized.length / charsPerLine));
};

export const estimateExperienceCardHeight = (item: ExperienceLayoutItem) => {
  const highlights = (item.highlights || []).map((line) => line.trim()).filter(Boolean);
  const titleLines = estimateTextLines(item.title, CHARS_PER_TITLE_LINE);
  const companyLines = estimateTextLines(item.company, CHARS_PER_COMPANY_LINE);
  const highlightLines = highlights.length === 0 ? 1 : highlights.reduce((sum, line) => sum + estimateTextLines(line, CHARS_PER_HIGHLIGHT_LINE), 0);

  return EXPERIENCE_BASE_HEIGHT + titleLines * ROLE_LINE_HEIGHT + companyLines * COMPANY_LINE_HEIGHT + highlightLines * BULLET_LINE_HEIGHT;
};

export const splitPrimaryExperience = <T extends ExperienceLayoutItem>(items: T[]) => {
  const primary: T[] = [];
  const overflow: T[] = [];
  let usedHeight = PRIMARY_HEADER_UNITS * HEADER_HEIGHT;

  items.forEach((item, index) => {
    const nextHeight = estimateExperienceCardHeight(item);

    if (index === 0) {
      primary.push(item);
      usedHeight += nextHeight;
      return;
    }

    if (usedHeight + EXPERIENCE_CARD_GAP + nextHeight <= PRIMARY_MAX_CONTENT_HEIGHT) {
      primary.push(item);
      usedHeight += EXPERIENCE_CARD_GAP + nextHeight;
      return;
    }

    overflow.push(item);
  });

  return {
    primary,
    overflow
  };
};
