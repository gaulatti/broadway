/**
 * Template Registry
 *
 * Central registry for all available templates.
 * To add a new template:
 * 1. Create a new template component in this folder
 * 2. Import it here
 * 3. Add it to the templates array with id, name, Component, defaultProps, and fields
 */

import type { TemplateDefinition } from './types';
import TemplateSanremoStory, { defaultProps as sanremoDefaultProps, fields as sanremoFields, type SanremoStoryProps } from './TemplateSanremoStory';

export const templates: TemplateDefinition[] = [
  {
    id: 'sanremo_story',
    name: 'Sanremo Story',
    Component: TemplateSanremoStory,
    defaultProps: sanremoDefaultProps,
    fields: sanremoFields
  } as TemplateDefinition<SanremoStoryProps>
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
