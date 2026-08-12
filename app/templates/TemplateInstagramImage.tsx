/**
 * Instagram Image Template
 *
 * A 1080x1350 social image template loaded from @fifthbell/brokaw's
 * Handlebars template bundle.
 */

import React from 'react';
import type { FieldDef, TemplateDefinition } from './types';
import { HandlebarsTemplateComponent } from './handlebarsTemplate';
import instagramImageSource from '@brokaw/templates/instagram-image.hbs?raw';

export interface InstagramImageProps {
  imageUrl: string;
  qrCodeHtml: string;
  url: string;
  categoryName: string;
  title: string;
}

export const defaultProps: InstagramImageProps = {
  imageUrl:
    'https://cdn.fifthbell.com/media/2026/02/26/elettra-lamborghini-calls-for-end-to-late-night-parties-near-sanremo-festival-hotels-Hvsjli7JKP.avif',
  qrCodeHtml: `<div class="qr-container"><div class="qr-code"><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ffffff"/><path d="M10 10h30v30H10zm5 5v20h20V15zm40-5h30v30H55zm5 5v20h20V15zM10 55h30v30H10zm5 5v20h20V60zm15-40h5v5h-5zm0 45h5v5h-5zm10-45h5v5h-5zm0 10h5v5h-5zm0 10h5v5h-5zm0 10h5v5h-5zm0 10h5v5h-5zm10-40h5v5h-5zm0 10h5v5h-5zm0 10h5v5h-5zm0 10h5v5h-5zm0 10h5v5h-5zm10 0h5v5h-5zm0-10h5v5h-5zm0-10h5v5h-5zm0-10h5v5h-5zm0-10h5v5h-5zm10 40h5v5h-5zm0 10h5v5h-5zm0-10h5v5h-5zm-10-10h5v5h-5zm-10 0h5v5h-5zm-10 0h5v5h-5z" fill="#000000"/></svg></div></div>`,
  url: '',
  categoryName: 'Sanremo',
  title: 'Elettra Lamborghini pide poner fin a las fiestas nocturnas cerca de los hoteles del festival'
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
    key: 'qrCodeHtml',
    label: 'QR Code HTML (overrides URL)',
    type: 'textarea',
    placeholder: '<div class="qr-container">...</div>',
    rows: 6
  },
  {
    key: 'categoryName',
    label: 'Category Name',
    type: 'text',
    placeholder: 'SANREMO'
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

const TemplateInstagramImage: React.FC<InstagramImageProps> = (props) => (
  <HandlebarsTemplateComponent source={instagramImageSource} width={WIDTH} height={HEIGHT} {...props} />
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
