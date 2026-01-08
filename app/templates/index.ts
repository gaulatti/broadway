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

export const templates: TemplateDefinition[] = [
  sanremoStoryDefinition,
  sanremoPostDefinition,
  sanremoPost16x9Definition
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
