/**
 * Template Registry
 *
 * Central registry for all available templates.
 * To add a new template:
 * 1. Create a new template component in this folder
 * 2. Export a templateDefinition from your template file
 * 3. Import and add it to the templates array here
 */

import type { TemplateDefinition } from './types';
import { templateDefinition as sanremoStoryDefinition } from './TemplateSanremoStory';
import { templateDefinition as sanremoPostDefinition } from './TemplateSanremoPost';
import { templateDefinition as sanremoPost16x9Definition } from './TemplateSanremoPost16x9';
import { templateDefinition as sanremoStory16x9Definition } from './TemplateSanremoStory16x9';
import { templateDefinition as sanremoPost16x9GiorgiaDefinition } from './TemplateSanremoPost16x9Giorgia';
import { templateDefinition as sanremoStory16x9GiorgiaDefinition } from './TemplateSanremoStory16x9Giorgia';
import { templateDefinition as sanremoPromoPostDefinition } from './TemplateSanremoPromoPost';
import { templateDefinition as modoitalianoPostDefinition } from './TemplateModoItalianoPost';
import { templateDefinition as modoitalianoGiorgiaPostDefinition } from './TemplateModoItalianoGiorgiaPost';
import { templateDefinition as modoitalianoGiorgiaStoryDefinition } from './TemplateModoItalianoGiorgiaStory';
import { templateDefinition as instagramImageDefinition } from './TemplateInstagramImage';
import { templateDefinition as resumeLetterDefinition } from './TemplateResumeLetterP1';
import { templateDefinition as fifthbellLetterDefinition } from './TemplateFifthbellLetter';
import { templateDefinition as gaulattiLetterDefinition } from './TemplateGaulattiLetter';

export const templates: TemplateDefinition[] = [
  modoitalianoPostDefinition,
  modoitalianoGiorgiaPostDefinition,
  modoitalianoGiorgiaStoryDefinition,
  instagramImageDefinition,
  resumeLetterDefinition,
  fifthbellLetterDefinition,
  gaulattiLetterDefinition,
  sanremoPromoPostDefinition,
  sanremoStoryDefinition,
  sanremoPostDefinition,
  sanremoPost16x9Definition,
  sanremoStory16x9Definition,
  sanremoPost16x9GiorgiaDefinition,
  sanremoStory16x9GiorgiaDefinition
  // Add more templates here as they are created
];

/**
 * Get a template by its ID
 */
export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

/**
 * Get all template IDs
 */
export function getTemplateIds(): string[] {
  return templates.map((t) => t.id);
}

export default templates;
