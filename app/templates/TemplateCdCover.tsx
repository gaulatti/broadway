/** Square CD front cover derived from the Brokaw Instagram image composition. */
import type { FieldDef, TemplateDefinition } from './types';
import { HandlebarsTemplateComponent } from './handlebarsTemplate';
import cdCoverSource from './cd-cover.hbs?raw';
import { FONT_SETS } from './fontAssets';

export interface CdCoverProps {
  imageUrl: string;
  topLine: string;
  title: string;
  subtitle: string;
}

export const defaultProps: CdCoverProps = {
  imageUrl: '/cd-cover-example.svg',
  topLine: 'Project Atlas',
  title: 'Reference Collection',
  subtitle: 'Volume 01'
};

export const fields: Array<FieldDef<CdCoverProps>> = [
  { key: 'imageUrl', label: 'Cover image', type: 'image', placeholder: 'Upload an image or paste its URL' },
  { key: 'topLine', label: 'Top line', type: 'text', placeholder: 'Project, organization, or series' },
  { key: 'title', label: 'Cover title', type: 'textarea', placeholder: 'Main title', rows: 2 },
  { key: 'subtitle', label: 'Subtitle (optional)', type: 'text', placeholder: 'Volume, date, or short description' }
];

const SIZE = 1500;

const TemplateCdCover: React.FC<CdCoverProps> = (props) => (
  <HandlebarsTemplateComponent source={cdCoverSource} width={SIZE} height={SIZE} {...props} />
);

export const templateDefinition: TemplateDefinition<CdCoverProps> = {
  id: 'cd_cover',
  name: 'CD Cover',
  Component: TemplateCdCover,
  defaultProps,
  fields,
  width: SIZE,
  height: SIZE,
  galleryScale: 0.22,
  previewScale: 0.5,
  fonts: FONT_SETS.instagram
};

export default TemplateCdCover;
