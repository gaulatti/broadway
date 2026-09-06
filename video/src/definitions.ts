import {ModoItalianoGiorgiaProgram} from './ModoItalianoGiorgiaProgram';
import {
  VIDEO_TEMPLATE_SCHEMA_VERSION,
  assertModoItalianoGiorgiaInput,
  validateVideoTemplateDefinition,
  type ModoItalianoGiorgiaVideoInput,
  type VideoTemplateDefinition
} from './types';

export const modoItalianoGiorgiaDefinition: VideoTemplateDefinition<ModoItalianoGiorgiaVideoInput> = {
  schemaVersion: VIDEO_TEMPLATE_SCHEMA_VERSION,
  id: 'ModoItalianoGiorgiaProgram',
  name: 'Modo Italiano · Giorgia Program',
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 450,
  entryPoint: 'video/src/index.ts',
  Component: ModoItalianoGiorgiaProgram,
  defaultInput: {
    schemaVersion: VIDEO_TEMPLATE_SCHEMA_VERSION,
    eyebrow: 'MODO ITALIANO · ACTUALIDAD',
    headline: 'Una nueva mirada a la actualidad italiana',
    summary: 'Contexto claro. Voces directas. Historias que conectan Italia y el mundo.',
    callToAction: 'Escucha el programa completo',
    handle: '@modoitalianoradio'
  },
  fonts: [
    {
      family: 'Barlow Condensed',
      weights: [500, 600],
      packageName: '@fontsource/barlow-condensed',
      license: 'SIL Open Font License 1.1'
    }
  ]
};

export const videoTemplates = [modoItalianoGiorgiaDefinition] as const;

for (const definition of videoTemplates) validateVideoTemplateDefinition(definition);
assertModoItalianoGiorgiaInput(modoItalianoGiorgiaDefinition.defaultInput);
