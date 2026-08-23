export interface TemplateFontAsset {
  id: string;
  family: string;
  style: 'normal' | 'italic';
  weight: number;
  url: string;
  owner: string;
}

export interface FontAwareTemplateDefinition {
  id: string;
  fonts?: readonly TemplateFontAsset[];
}

export class TemplateFontContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateFontContractError';
  }
}

export function isPackagedFontUrl(url: string): boolean {
  const value = url.trim();
  return value.startsWith('/') || value.startsWith('./') || value.startsWith('../') || value.startsWith('data:font/') || value.startsWith('data:application/font-');
}

export function validateTemplateFontContract(templates: readonly FontAwareTemplateDefinition[]): void {
  const templateIds = new Set<string>();
  for (const template of templates) {
    if (!template.id || templateIds.has(template.id)) throw new TemplateFontContractError(`Template id "${template.id}" is missing or duplicated.`);
    templateIds.add(template.id);
    if (!template.fonts?.length) throw new TemplateFontContractError(`Template "${template.id}" must declare its packaged fonts.`);

    const faceIds = new Set<string>();
    for (const font of template.fonts) {
      if (!font.id || faceIds.has(font.id)) throw new TemplateFontContractError(`Template "${template.id}" has a missing or duplicate font face id.`);
      faceIds.add(font.id);
      if (!font.family.trim() || !font.owner.trim() || !Number.isInteger(font.weight) || font.weight < 100 || font.weight > 900) {
        throw new TemplateFontContractError(`Template "${template.id}" has invalid metadata for font "${font.id}".`);
      }
      if (!isPackagedFontUrl(font.url)) throw new TemplateFontContractError(`Template "${template.id}" font "${font.id}" is not a packaged local asset.`);
    }
  }
}

function cssString(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

export function fontFaceCss(fonts: readonly TemplateFontAsset[], resolvedUrls?: ReadonlyMap<string, string>): string {
  return fonts.map((font) => `@font-face{font-family:'${cssString(font.family)}';font-style:${font.style};font-weight:${font.weight};font-display:block;src:url('${cssString(resolvedUrls?.get(font.id) ?? font.url)}') format('woff2');}`).join('\n');
}
