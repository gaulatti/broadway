import type { FieldDef } from './types';

export const NEWSPAPER_WIDTH = 1080;
export const NEWSPAPER_HEIGHT = 1350;

export interface NewspaperFrontPageProps {
  publication: string;
  date: string;
  edition: string;
  issue: string;
  imageUrl: string;
  imageAlt: string;
  leadSection: string;
  headline: string;
  standfirst: string;
  storyOneSection: string;
  storyOneHeadline: string;
  storyTwoSection: string;
  storyTwoHeadline: string;
}

/** Fictional editorial copy: a deterministic gallery and editor fixture. */
export const defaultProps: NewspaperFrontPageProps = {
  publication: 'banger',
  date: '2026-10-03',
  edition: 'Weekend edition',
  issue: 'Vol. 01 / No. 001',
  imageUrl: 'https://cdn.fifthbell.com/media/gotham-chicago-nwsl-sep-25-2026-gotham.chicago.20260926-20260925-212357-001638-DSC03848.avif',
  imageAlt: 'Gotham and Chicago soccer players contesting the ball on the pitch',
  leadSection: 'The city',
  headline: 'The city,\nreimagined.',
  standfirst: 'A new chapter begins at street level.',
  storyOneSection: 'Culture',
  storyOneHeadline: 'Small rooms. Big ideas.',
  storyTwoSection: 'The weekend',
  storyTwoHeadline: 'The art of slowing down.'
};

export const fields: Array<FieldDef<NewspaperFrontPageProps>> = [
  { key: 'publication', label: 'Publication name', type: 'text' },
  { key: 'date', label: 'Issue date', type: 'date' },
  { key: 'edition', label: 'Edition', type: 'text' },
  { key: 'issue', label: 'Volume / issue', type: 'text' },
  { key: 'imageUrl', label: 'Full-page photograph', type: 'image', placeholder: 'Upload an image or paste a CORS-enabled URL' },
  { key: 'imageAlt', label: 'Photo description (accessibility)', type: 'text' },
  { key: 'leadSection', label: 'Lead section', type: 'text' },
  { key: 'headline', label: 'Lead headline (line breaks supported)', type: 'textarea', rows: 2 },
  { key: 'standfirst', label: 'Short deck (optional)', type: 'text' },
  { key: 'storyOneSection', label: 'Teaser 1 — section', type: 'text' },
  { key: 'storyOneHeadline', label: 'Teaser 1 — headline (optional)', type: 'text' },
  { key: 'storyTwoSection', label: 'Teaser 2 — section', type: 'text' },
  { key: 'storyTwoHeadline', label: 'Teaser 2 — headline (optional)', type: 'text' }
];

/** Format a calendar date without shifting it into the browser's time zone. */
export function toNewspaperRenderData(props: NewspaperFrontPageProps): NewspaperFrontPageProps {
  if (!props.date) return { ...props, date: '' };
  const day = new Date(`${props.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(props.date) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== props.date) {
    return { ...props, date: 'Invalid issue date' };
  }
  return {
    ...props,
    date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(day)
  };
}
