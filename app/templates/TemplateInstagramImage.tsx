/**
 * Instagram Image Template
 *
 * A 1080x1350 social image kept in sync with @fifthbell/brokaw's
 * Instagram image template.
 */

import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import { HandlebarsTemplateComponent } from './handlebarsTemplate';
import instagramImageSource from './instagram-image.hbs?raw';

export interface InstagramImageProps {
  imageUrl: string;
  title: string;
  category?: string;
  slug?: string;
  url?: string;
}

export const defaultProps: InstagramImageProps = {
  imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1080&h=1350&q=80',
  title: 'Major Update: Shared Instagram Template Now Lives in Brokaw',
  category: 'Technology',
  slug: 'technology',
  url: 'https://fifthbell.com/technology/shared-instagram-template'
};

export const fields: Array<FieldDef<InstagramImageProps>> = [
  {
    key: 'imageUrl',
    label: 'Background Image URL',
    type: 'image',
    placeholder: 'https://...'
  },
  {
    key: 'url',
    label: 'URL (for QR code)',
    type: 'text',
    placeholder: 'https://www.instagram.com/...'
  },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'Technology'
  },
  {
    key: 'slug',
    label: 'Slug (category fallback)',
    type: 'text',
    placeholder: 'latest-news'
  },
  {
    key: 'title',
    label: 'Title',
    type: 'textarea',
    placeholder: 'Enter headline...',
    rows: 3
  }
];

const WIDTH = 1080;
const HEIGHT = 1350;

function resolveCategoryName({ category, slug }: InstagramImageProps): string {
  if (category) return category.toUpperCase();
  if (slug) return slug.replace(/-/g, ' ').toUpperCase();
  return 'LATEST STORY';
}

const TemplateInstagramImage: React.FC<InstagramImageProps> = (props) => (
  <HandlebarsTemplateComponent
    source={instagramImageSource}
    width={WIDTH}
    height={HEIGHT}
    {...props}
    categoryName={resolveCategoryName(props)}
  />
);

export const templateDefinition: TemplateDefinition<InstagramImageProps> = {
  id: 'instagram_image',
  name: 'Instagram Image',
  Component: TemplateInstagramImage,
  defaultProps,
  fields,
  width: WIDTH,
  height: HEIGHT,
  galleryScale: 0.35,
  previewScale: 0.55
};

export default TemplateInstagramImage;
