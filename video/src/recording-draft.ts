export const RECORDING_DRAFT_SCHEMA_VERSION = 1 as const;
export const ALANA_RECORDING_CONTRACT_COMMIT = 'fcc1ec29a4239631d7fb146b2d9ea905103aa0f2' as const;
export const MISTIFY_CAPTION_CONTRACT_COMMIT = 'f47aa6bb1fe5ef56f36621abba6d103908faf490' as const;
export const RECORDED_PROGRAM_DRAFT_ID = 'RecordedProgramExcerptDraft' as const;
export const RECORDED_PROGRAM_DRAFT_FPS = 30 as const;
export const MAX_DRAFT_SECONDS = 30 as const;

const SHA256 = /^[a-f0-9]{64}$/;
const DRAFT_ID = /^[a-f0-9]{24}$/;
const OPERATION_ID = /^[a-f0-9]{16}$/;
const REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;

export type DraftCaptionCue = {
  startSeconds: number;
  endSeconds: number;
  text: string;
};

export type RecordedProgramDraftInput = Record<string, unknown> & {
  schemaVersion: typeof RECORDING_DRAFT_SCHEMA_VERSION;
  draftId: string;
  status: 'draft';
  approvalRequired: true;
  publicationState: 'not-published';
  source: {
    producer: 'gaulatti/alana';
    contractCommit: typeof ALANA_RECORDING_CONTRACT_COMMIT;
    operationId: string;
    manifestSha256: string;
    mediaSha256: string;
    mediaAsset: string;
    durationSeconds: number;
    videoCodec: 'h264';
    audioCodec: 'aac';
    width: number;
    height: number;
    fps: '30/1';
    audioRate: 48000;
    audioChannels: number;
    window: {
      startSeconds: number;
      endSeconds: number;
      startFrame: number;
      endFrame: number;
    };
  };
  editorial: {
    requestId: string;
    eyebrow: string;
    headline: string;
    summary: string;
    handle: string;
  };
  captions: null | {
    producer: 'gaulatti/mistify';
    contractCommit: typeof MISTIFY_CAPTION_CONTRACT_COMMIT;
    artifactSha256: string;
    cues: DraftCaptionCue[];
  };
};

function object(value: unknown, location: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${location} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], location: string): void {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    throw new TypeError(`${location} has unsupported or missing fields.`);
  }
}

function text(value: unknown, location: string, maximum: number): string {
  if (typeof value !== 'string' || !value.trim() || value.includes('\n') || value.includes('\r')) {
    throw new TypeError(`${location} must be one non-empty line.`);
  }
  if (Array.from(value).length > maximum) throw new TypeError(`${location} exceeds ${maximum} characters.`);
  return value;
}

export function isSafeLocalAsset(value: string): boolean {
  return (
    value.length > 0 &&
    !value.startsWith('/') &&
    !value.includes('..') &&
    !value.includes('\\') &&
    !/^[a-z]+:/i.test(value)
  );
}

function frameAt(seconds: number): number {
  const frame = Math.round(seconds * RECORDED_PROGRAM_DRAFT_FPS);
  if (Math.abs(frame / RECORDED_PROGRAM_DRAFT_FPS - seconds) > 0.000001) {
    throw new TypeError('Draft timecodes must align to the 30fps frame grid.');
  }
  return frame;
}

export function draftDurationInFrames(input: RecordedProgramDraftInput): number {
  return input.source.window.endFrame - input.source.window.startFrame;
}

export function assertRecordedProgramDraftInput(value: unknown): asserts value is RecordedProgramDraftInput {
  const input = object(value, 'draft input');
  exactKeys(input, ['schemaVersion', 'draftId', 'status', 'approvalRequired', 'publicationState', 'source', 'editorial', 'captions'], 'draft input');
  if (input.schemaVersion !== RECORDING_DRAFT_SCHEMA_VERSION) throw new TypeError('Unsupported draft schema.');
  if (typeof input.draftId !== 'string' || !DRAFT_ID.test(input.draftId)) throw new TypeError('Invalid deterministic draft ID.');
  if (input.status !== 'draft' || input.approvalRequired !== true || input.publicationState !== 'not-published') {
    throw new TypeError('Recorded-program output must remain an approval-required unpublished draft.');
  }

  const source = object(input.source, 'source');
  exactKeys(source, ['producer', 'contractCommit', 'operationId', 'manifestSha256', 'mediaSha256', 'mediaAsset', 'durationSeconds', 'videoCodec', 'audioCodec', 'width', 'height', 'fps', 'audioRate', 'audioChannels', 'window'], 'source');
  if (source.producer !== 'gaulatti/alana' || source.contractCommit !== ALANA_RECORDING_CONTRACT_COMMIT) {
    throw new TypeError('Draft source must pin the landed Alana recording contract.');
  }
  if (typeof source.operationId !== 'string' || !OPERATION_ID.test(source.operationId)) throw new TypeError('Invalid Alana operation ID.');
  for (const [field, digest] of [['manifestSha256', source.manifestSha256], ['mediaSha256', source.mediaSha256]] as const) {
    if (typeof digest !== 'string' || !SHA256.test(digest)) throw new TypeError(`Invalid ${field}.`);
  }
  if (typeof source.mediaAsset !== 'string' || !isSafeLocalAsset(source.mediaAsset)) throw new TypeError('Source media must be a safe packaged asset.');
  if (typeof source.durationSeconds !== 'number' || !Number.isFinite(source.durationSeconds) || source.durationSeconds <= 0) throw new TypeError('Invalid source duration.');
  if (source.videoCodec !== 'h264' || source.audioCodec !== 'aac' || source.fps !== '30/1' || source.audioRate !== 48000) {
    throw new TypeError('Source media does not match the landed Alana H.264/AAC contract.');
  }
  if (typeof source.width !== 'number' || !Number.isInteger(source.width) || source.width <= 0 || typeof source.height !== 'number' || !Number.isInteger(source.height) || source.height <= 0) throw new TypeError('Invalid source dimensions.');
  if (typeof source.audioChannels !== 'number' || !Number.isInteger(source.audioChannels) || source.audioChannels < 1 || source.audioChannels > 8) throw new TypeError('Invalid source channel count.');

  const window = object(source.window, 'source.window');
  exactKeys(window, ['startSeconds', 'endSeconds', 'startFrame', 'endFrame'], 'source.window');
  if (typeof window.startSeconds !== 'number' || typeof window.endSeconds !== 'number' || !Number.isFinite(window.startSeconds) || !Number.isFinite(window.endSeconds)) {
    throw new TypeError('Draft timecodes must be finite numbers.');
  }
  const startFrame = frameAt(window.startSeconds);
  const endFrame = frameAt(window.endSeconds);
  if (window.startFrame !== startFrame || window.endFrame !== endFrame) throw new TypeError('Draft frame and second timecodes disagree.');
  if (startFrame < 0 || endFrame <= startFrame || window.endSeconds > source.durationSeconds + 0.000001) throw new TypeError('Draft timecodes fall outside the finalized source.');
  const duration = (endFrame - startFrame) / RECORDED_PROGRAM_DRAFT_FPS;
  if (duration < 1 || duration > MAX_DRAFT_SECONDS) throw new TypeError(`Draft window must be between 1 and ${MAX_DRAFT_SECONDS} seconds.`);

  const editorial = object(input.editorial, 'editorial');
  exactKeys(editorial, ['requestId', 'eyebrow', 'headline', 'summary', 'handle'], 'editorial');
  if (typeof editorial.requestId !== 'string' || !REQUEST_ID.test(editorial.requestId)) throw new TypeError('Invalid editorial request ID.');
  text(editorial.eyebrow, 'editorial.eyebrow', 36);
  text(editorial.headline, 'editorial.headline', 72);
  text(editorial.summary, 'editorial.summary', 140);
  text(editorial.handle, 'editorial.handle', 32);

  if (input.captions !== null) {
    const captions = object(input.captions, 'captions');
    exactKeys(captions, ['producer', 'contractCommit', 'artifactSha256', 'cues'], 'captions');
    if (captions.producer !== 'gaulatti/mistify' || captions.contractCommit !== MISTIFY_CAPTION_CONTRACT_COMMIT) throw new TypeError('Captions must pin the landed Mistify contract.');
    if (typeof captions.artifactSha256 !== 'string' || !SHA256.test(captions.artifactSha256)) throw new TypeError('Invalid caption artifact digest.');
    if (!Array.isArray(captions.cues)) throw new TypeError('Caption cues must be an array.');
    let previousEnd = 0;
    for (const [index, candidate] of captions.cues.entries()) {
      const cue = object(candidate, `captions.cues[${index}]`);
      exactKeys(cue, ['startSeconds', 'endSeconds', 'text'], `captions.cues[${index}]`);
      if (typeof cue.startSeconds !== 'number' || typeof cue.endSeconds !== 'number' || !Number.isFinite(cue.startSeconds) || !Number.isFinite(cue.endSeconds) || cue.startSeconds < previousEnd || cue.endSeconds <= cue.startSeconds || cue.endSeconds > duration + 0.000001) throw new TypeError('Caption cues must be ordered within the selected window.');
      text(cue.text, `captions.cues[${index}].text`, 500);
      previousEnd = cue.endSeconds;
    }
  }
}
