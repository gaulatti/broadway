import type { TemplateDefinition } from './types';
import { HandlebarsTemplateComponent } from './handlebarsTemplate';
import newspaperLandscapeSource from './newspaper-front-page-landscape.hbs?raw';
import { FONT_SETS } from './fontAssets';
import { defaultProps, fields, NEWSPAPER_LANDSCAPE_WIDTH, NEWSPAPER_LANDSCAPE_HEIGHT, toNewspaperRenderData, type NewspaperFrontPageProps } from './newspaperFrontPageData';

const TemplateNewspaperFrontPageLandscape: React.FC<NewspaperFrontPageProps> = (props) => (
  <HandlebarsTemplateComponent source={newspaperLandscapeSource} width={NEWSPAPER_LANDSCAPE_WIDTH} height={NEWSPAPER_LANDSCAPE_HEIGHT} {...toNewspaperRenderData(props)} />
);

export const templateDefinition: TemplateDefinition<NewspaperFrontPageProps> = {
  id: 'newspaper_front_page_landscape',
  name: 'Newspaper Front Page (Landscape)',
  Component: TemplateNewspaperFrontPageLandscape,
  defaultProps,
  fields,
  width: NEWSPAPER_LANDSCAPE_WIDTH,
  height: NEWSPAPER_LANDSCAPE_HEIGHT,
  galleryScale: 0.05,
  previewScale: 0.1,
  fonts: FONT_SETS.newspaper
};

export default TemplateNewspaperFrontPageLandscape;
