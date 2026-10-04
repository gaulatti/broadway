import type { TemplateDefinition } from './types';
import { HandlebarsTemplateComponent } from './handlebarsTemplate';
import newspaperSource from './newspaper-front-page.hbs?raw';
import { FONT_SETS } from './fontAssets';
import { defaultProps, fields, NEWSPAPER_WIDTH, NEWSPAPER_HEIGHT, toNewspaperRenderData, type NewspaperFrontPageProps } from './newspaperFrontPageData';

export { defaultProps, fields, type NewspaperFrontPageProps } from './newspaperFrontPageData';

const TemplateNewspaperFrontPage: React.FC<NewspaperFrontPageProps> = (props) => (
  <HandlebarsTemplateComponent source={newspaperSource} width={NEWSPAPER_WIDTH} height={NEWSPAPER_HEIGHT} {...toNewspaperRenderData(props)} />
);

export const templateDefinition: TemplateDefinition<NewspaperFrontPageProps> = {
  id: 'newspaper_front_page',
  name: 'Newspaper Front Page',
  Component: TemplateNewspaperFrontPage,
  defaultProps,
  fields,
  width: NEWSPAPER_WIDTH,
  height: NEWSPAPER_HEIGHT,
  galleryScale: 0.28,
  previewScale: 0.55,
  fonts: FONT_SETS.newspaper
};

export default TemplateNewspaperFrontPage;
