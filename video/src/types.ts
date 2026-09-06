import type {ComponentType} from 'react';

export const VIDEO_TEMPLATE_SCHEMA_VERSION = 1 as const;

export interface LocalVideoFont {
  family: string;
  weights: readonly number[];
  packageName: string;
  license: string;
}

export interface LocalAudioAsset {
  path: string;
  license: string;
}

export interface VideoTemplateDefinition<TInput extends Record<string, unknown>> {
  schemaVersion: typeof VIDEO_TEMPLATE_SCHEMA_VERSION;
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  entryPoint: string;
  Component: ComponentType<TInput>;
  defaultInput: TInput;
  fonts: readonly LocalVideoFont[];
  audio?: LocalAudioAsset;
}

export interface ModoItalianoGiorgiaVideoInput extends Record<string, unknown> {
  schemaVersion: typeof VIDEO_TEMPLATE_SCHEMA_VERSION;
  eyebrow: string;
  headline: string;
  summary: string;
  callToAction: string;
  handle: string;
  audioAsset?: string;
}

const REQUIRED_TEXT_FIELDS = ['eyebrow', 'headline', 'summary', 'callToAction', 'handle'] as const;
const TEXT_LIMITS: Record<(typeof REQUIRED_TEXT_FIELDS)[number], number> = {
  eyebrow: 36,
  headline: 52,
  summary: 100,
  callToAction: 42,
  handle: 32
};

export function assertModoItalianoGiorgiaInput(value: unknown): asserts value is ModoItalianoGiorgiaVideoInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Video input must be a JSON object.');
  }

  const input = value as Record<string, unknown>;
  const allowed = new Set<string>(['schemaVersion', ...REQUIRED_TEXT_FIELDS, 'audioAsset']);
  const unknownFields = Object.keys(input).filter((key) => !allowed.has(key));
  if (unknownFields.length > 0) {
    throw new TypeError(`Video input has unknown fields: ${unknownFields.join(', ')}.`);
  }
  if (input.schemaVersion !== VIDEO_TEMPLATE_SCHEMA_VERSION) {
    throw new TypeError(`Video input schemaVersion must be ${VIDEO_TEMPLATE_SCHEMA_VERSION}.`);
  }
  for (const field of REQUIRED_TEXT_FIELDS) {
    if (typeof input[field] !== 'string' || !input[field].trim()) {
      throw new TypeError(`Video input field "${field}" must be a non-empty string.`);
    }
    const text = input[field] as string;
    if (text.includes('\n') || text.includes('\r') || Array.from(text).length > TEXT_LIMITS[field]) {
      throw new TypeError(`Video input field "${field}" exceeds its title-safe text boundary.`);
    }
    const longestToken = Math.max(
      ...text
        .trim()
        .split(/\s+/u)
        .map((token) => Array.from(token).length)
    );
    const tokenLimit = field === 'handle' ? TEXT_LIMITS.handle : 24;
    if (longestToken > tokenLimit) {
      throw new TypeError(
        `Video input field "${field}" contains an unbreakable token that exceeds its title-safe boundary.`
      );
    }
  }
  if (input.audioAsset !== undefined) {
    if (typeof input.audioAsset !== 'string' || !isSafeLocalAsset(input.audioAsset)) {
      throw new TypeError('audioAsset must be a safe path inside the video public directory.');
    }
  }
}

export function isSafeLocalAsset(assetPath: string): boolean {
  return (
    assetPath.length > 0 &&
    !assetPath.startsWith('/') &&
    !assetPath.includes('..') &&
    !assetPath.includes('\\') &&
    !/^[a-z]+:/i.test(assetPath)
  );
}

export function validateVideoTemplateDefinition<TInput extends Record<string, unknown>>(
  definition: VideoTemplateDefinition<TInput>
): void {
  if (definition.schemaVersion !== VIDEO_TEMPLATE_SCHEMA_VERSION)
    throw new TypeError('Unsupported video template schema.');
  if (!/^[A-Za-z0-9-]+$/.test(definition.id)) throw new TypeError(`Invalid composition id "${definition.id}".`);
  if (!Number.isInteger(definition.width) || definition.width <= 0)
    throw new TypeError('Video width must be a positive integer.');
  if (!Number.isInteger(definition.height) || definition.height <= 0)
    throw new TypeError('Video height must be a positive integer.');
  if (!Number.isInteger(definition.fps) || definition.fps <= 0)
    throw new TypeError('Video fps must be a positive integer.');
  if (!Number.isInteger(definition.durationInFrames) || definition.durationInFrames <= 0)
    throw new TypeError('Video duration must be a positive integer.');
  if (!definition.entryPoint.endsWith('/index.ts'))
    throw new TypeError('Video entryPoint must identify the package registration module.');
  if (definition.fonts.length === 0) throw new TypeError('A video template must declare at least one local font.');
  for (const font of definition.fonts) {
    if (
      !font.family.trim() ||
      !font.packageName.startsWith('@fontsource/') ||
      !font.license.trim() ||
      font.weights.length === 0
    ) {
      throw new TypeError(`Invalid local font declaration for "${font.family}".`);
    }
  }
  JSON.stringify(definition.defaultInput);
}
