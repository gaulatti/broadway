import {ModoItalianoGiorgiaProgram} from './ModoItalianoGiorgiaProgram';
import {RecordedProgramExcerptDraft} from './RecordedProgramExcerptDraft';
import {
  ALANA_RECORDING_CONTRACT_COMMIT,
  MISTIFY_CAPTION_CONTRACT_COMMIT,
  RECORDED_PROGRAM_DRAFT_FPS,
  RECORDED_PROGRAM_DRAFT_ID,
  assertRecordedProgramDraftInput,
  draftDurationInFrames,
  type RecordedProgramDraftInput
} from './recording-draft';
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

export const recordedProgramDraftDefinition: VideoTemplateDefinition<RecordedProgramDraftInput> = {
  schemaVersion: VIDEO_TEMPLATE_SCHEMA_VERSION,
  id: RECORDED_PROGRAM_DRAFT_ID,
  name: 'Recorded Program · Review Draft',
  width: 1080,
  height: 1920,
  fps: RECORDED_PROGRAM_DRAFT_FPS,
  durationInFrames: 120,
  calculateMetadata: ({props}) => {
    assertRecordedProgramDraftInput(props);
    return {durationInFrames: draftDurationInFrames(props)};
  },
  entryPoint: 'video/src/index.ts',
  Component: RecordedProgramExcerptDraft,
  defaultInput: {
    schemaVersion: 1,
    draftId: 'a011d45e9a6e728f7a4a4750',
    status: 'draft',
    approvalRequired: true,
    publicationState: 'not-published',
    source: {
      producer: 'gaulatti/alana',
      contractCommit: ALANA_RECORDING_CONTRACT_COMMIT,
      operationId: '0123456789abcdef',
      manifestSha256: '4a73fd6b4406c353f3bec5e57843281c0007cf8c81a0ac22ac6c0ef98e5c0805',
      mediaSha256: 'fb1b746448dd934d3ffef38e6c026bc97b1b0063b97f3661790cfdc839175b7b',
      mediaAsset: 'fixtures/alana-recording.mp4',
      durationSeconds: 6,
      videoCodec: 'h264',
      audioCodec: 'aac',
      width: 640,
      height: 360,
      fps: '30/1',
      audioRate: 48000,
      audioChannels: 1,
      window: {startSeconds: 1, endSeconds: 5, startFrame: 30, endFrame: 150}
    },
    editorial: {
      requestId: 'fixture-review-001',
      eyebrow: 'MODO ITALIANO · EXCERPT',
      headline: 'A human-selected program moment',
      summary: 'Finalized source, verified provenance, and an explicit approval gate.',
      handle: '@modoitalianoradio'
    },
    captions: {
      producer: 'gaulatti/mistify',
      contractCommit: MISTIFY_CAPTION_CONTRACT_COMMIT,
      artifactSha256: 'e5af2f8c25ebe0842968bc89252557fb36f6a6955f2676c87a4d2f862de12fd7',
      cues: [
        {startSeconds: 0, endSeconds: 1.8, text: 'Una historia conecta Italia y el mundo.'},
        {startSeconds: 2, endSeconds: 4, text: 'El contexto convierte un momento en una conversación.'}
      ]
    }
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

export const videoTemplates = [modoItalianoGiorgiaDefinition, recordedProgramDraftDefinition] as const;

validateVideoTemplateDefinition(modoItalianoGiorgiaDefinition);
validateVideoTemplateDefinition(recordedProgramDraftDefinition);
assertModoItalianoGiorgiaInput(modoItalianoGiorgiaDefinition.defaultInput);
assertRecordedProgramDraftInput(recordedProgramDraftDefinition.defaultInput);
