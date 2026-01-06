/**
 * Template Studio - Type Definitions
 *
 * This module defines the core types for the template system.
 * Templates are React components with typed props, metadata for auto-form generation,
 * and default values for preview/demo purposes.
 */

export type FieldType = 'text' | 'textarea' | 'number' | 'image';

/**
 * Field definition for auto-generating form inputs
 */
export interface FieldDef<TProps> {
  key: keyof TProps & string; // Ensure it's a string key
  label: string;
  type: FieldType;
  placeholder?: string;
  rows?: number; // For textarea
  min?: number; // For number
  max?: number; // For number
  step?: number; // For number
}

/**
 * Complete template definition
 */
export interface TemplateDefinition<TProps = any> {
  id: string;
  name: string;
  Component: React.FC<TProps>;
  defaultProps: TProps;
  fields: Array<FieldDef<TProps>>;
  width: number; // Template width in pixels
  height: number; // Template height in pixels
  galleryScale: number; // Scale factor for gallery preview (e.g., 0.2, 0.5)
  previewScale: number; // Scale factor for gallery preview (e.g., 0.2, 0.5)
}
