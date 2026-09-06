import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {copyFile, mkdir, readFile, rename, stat, unlink, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {
  ALANA_RECORDING_CONTRACT_COMMIT,
  MISTIFY_CAPTION_CONTRACT_COMMIT,
  RECORDING_DRAFT_SCHEMA_VERSION,
  RECORDED_PROGRAM_DRAFT_FPS,
  assertRecordedProgramDraftInput,
  draftDurationInFrames,
  type DraftCaptionCue,
  type RecordedProgramDraftInput
} from '../src/recording-draft';

const SHA256 = /^[a-f0-9]{64}$/;
const OPERATION_ID = /^[a-f0-9]{16}$/;
const REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const MANIFEST_FIELDS = new Set([
  'enabled', 'state', 'operationId', 'requestedAt', 'startedAt', 'stoppedAt', 'finalizedAt', 'updatedAt',
  'segmentCount', 'bytes', 'durationSeconds', 'videoCodec', 'audioCodec', 'width', 'height', 'fps',
  'audioRate', 'audioChannels', 'droppedFrames', 'errors', 'restarts', 'finalizationState', 'finalSha256',
  'finalBytes', 'error', 'disk'
]);

export type DraftJobState = 'queued' | 'rendering' | 'rendered' | 'failed' | 'canceled';

export type DraftJob = {
  schemaVersion: 1;
  draftId: string;
  requestId: string;
  state: DraftJobState;
  attempts: number;
  approvalRequired: true;
  publicationState: 'not-published';
  input: 'input.json';
  output: 'draft.mp4';
  result: 'result.json' | null;
  errorCode: 'render-failed' | null;
};

export type DraftResult = {
  schemaVersion: 1;
  draftId: string;
  state: 'rendered';
  approvalRequired: true;
  publicationState: 'not-published';
  output: 'draft.mp4';
  sha256: string;
  bytes: number;
  width: 1080;
  height: 1920;
  fps: 30;
  durationInFrames: number;
};

type CreateDraftOptions = {
  manifestPath: string;
  mediaPath: string;
  selectionPath: string;
  captionArtifactPath?: string;
  draftRoot: string;
  publicDirectory: string;
};

export type DraftRenderMetadata = {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

type RunDraftOptions = {
  render: (input: RecordedProgramDraftInput, outputPath: string) => Promise<DraftRenderMetadata>;
  isCanceled?: (error: unknown) => boolean;
};

type Probe = {
  durationSeconds: number;
  sizeBytes: number;
  video: {codec: string; width: number; height: number; fps: string; durationSeconds: number};
  audio: {codec: string; sampleRate: number; channels: number; durationSeconds: number};
};

function object(value: unknown, location: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${location} must be an object.`);
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], location: string): void {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) throw new TypeError(`${location} has unsupported or missing fields.`);
}

export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

export async function sha256File(filename: string): Promise<string> {
  return sha256(await readFile(filename));
}

async function atomicJson(filename: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filename), {recursive: true});
  const temporary = `${filename}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, filename);
}

export function probeMedia(filename: string): Probe {
  const probe = spawnSync('ffprobe', [
    '-v', 'error', '-show_entries',
    'format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate,sample_rate,channels,duration',
    '-of', 'json', filename
  ], {encoding: 'utf8'});
  if (probe.error || probe.status !== 0) throw new TypeError('Source media could not be probed.');
  const payload = JSON.parse(probe.stdout) as {format?: Record<string, unknown>; streams?: Array<Record<string, unknown>>};
  const video = payload.streams?.filter((stream) => stream.codec_type === 'video') ?? [];
  const audio = payload.streams?.filter((stream) => stream.codec_type === 'audio') ?? [];
  if (video.length !== 1 || audio.length !== 1 || !payload.format) throw new TypeError('Source media must contain exactly one video and one audio stream.');
  const durationSeconds = Number(payload.format.duration);
  const videoDuration = Number(video[0].duration);
  const audioDuration = Number(audio[0].duration);
  const sizeBytes = Number(payload.format.size);
  if (![durationSeconds, videoDuration, audioDuration, sizeBytes].every(Number.isFinite)) throw new TypeError('Source media reports invalid duration or size.');
  return {
    durationSeconds,
    sizeBytes,
    video: {codec: String(video[0].codec_name), width: Number(video[0].width), height: Number(video[0].height), fps: String(video[0].avg_frame_rate), durationSeconds: videoDuration},
    audio: {codec: String(audio[0].codec_name), sampleRate: Number(audio[0].sample_rate), channels: Number(audio[0].channels), durationSeconds: audioDuration}
  };
}

function validateManifest(value: unknown): Record<string, unknown> {
  const manifest = object(value, 'Alana manifest');
  const unknown = Object.keys(manifest).filter((key) => !MANIFEST_FIELDS.has(key));
  if (unknown.length) throw new TypeError('Alana manifest has unsupported fields.');
  if (manifest.state !== 'complete' || manifest.finalizationState !== 'verified') throw new TypeError('Alana recording is not finalized and verified.');
  if (typeof manifest.operationId !== 'string' || !OPERATION_ID.test(manifest.operationId)) throw new TypeError('Alana manifest has an invalid operation ID.');
  if (typeof manifest.finalSha256 !== 'string' || !SHA256.test(manifest.finalSha256)) throw new TypeError('Alana manifest has an invalid final checksum.');
  for (const field of ['durationSeconds', 'finalBytes', 'width', 'height', 'audioRate', 'audioChannels'] as const) {
    if (typeof manifest[field] !== 'number' || !Number.isFinite(manifest[field]) || manifest[field] <= 0) throw new TypeError(`Alana manifest has invalid ${field}.`);
  }
  if (manifest.videoCodec !== 'h264' || manifest.audioCodec !== 'aac' || manifest.fps !== '30/1' || manifest.audioRate !== 48000) throw new TypeError('Alana manifest does not match the landed media contract.');
  return manifest;
}

function validateSelection(value: unknown): Record<string, unknown> {
  const selection = object(value, 'selection');
  const expected = selection.captionArtifact === undefined
    ? ['schemaVersion', 'requestId', 'startSeconds', 'endSeconds', 'editorial']
    : ['schemaVersion', 'requestId', 'startSeconds', 'endSeconds', 'editorial', 'captionArtifact'];
  exactKeys(selection, expected, 'selection');
  if (selection.schemaVersion !== 1) throw new TypeError('Unsupported selection schema.');
  if (typeof selection.requestId !== 'string' || !REQUEST_ID.test(selection.requestId)) throw new TypeError('Invalid editorial request ID.');
  if (typeof selection.startSeconds !== 'number' || typeof selection.endSeconds !== 'number') throw new TypeError('Selection timecodes must be numbers.');
  const editorial = object(selection.editorial, 'selection.editorial');
  exactKeys(editorial, ['eyebrow', 'headline', 'summary', 'handle'], 'selection.editorial');
  if (selection.captionArtifact !== undefined) {
    const caption = object(selection.captionArtifact, 'selection.captionArtifact');
    exactKeys(caption, ['producer', 'contractCommit', 'sha256'], 'selection.captionArtifact');
    if (caption.producer !== 'gaulatti/mistify' || caption.contractCommit !== MISTIFY_CAPTION_CONTRACT_COMMIT || typeof caption.sha256 !== 'string' || !SHA256.test(caption.sha256)) throw new TypeError('Caption artifact does not pin the landed Mistify contract.');
  }
  return selection;
}

function assertMediaMatchesManifest(media: Probe, manifest: Record<string, unknown>, mediaDigest: string, endSeconds: number): void {
  if (mediaDigest !== manifest.finalSha256 || media.sizeBytes !== manifest.finalBytes) throw new TypeError('Source media checksum or size does not match the finalized Alana manifest.');
  if (Math.abs(media.durationSeconds - Number(manifest.durationSeconds)) > 0.12 || media.video.codec !== manifest.videoCodec || media.audio.codec !== manifest.audioCodec || media.video.width !== manifest.width || media.video.height !== manifest.height || media.video.fps !== manifest.fps || media.audio.sampleRate !== manifest.audioRate || media.audio.channels !== manifest.audioChannels) throw new TypeError('Source media probe does not match the finalized Alana manifest.');
  if (endSeconds > media.durationSeconds + 0.000001 || endSeconds > media.video.durationSeconds + 0.000001 || endSeconds > media.audio.durationSeconds + 0.000001) throw new TypeError('Selection exceeds an audio or video stream boundary.');
}

function extractCaptions(value: unknown, sourceSha256: string, startSeconds: number, endSeconds: number): DraftCaptionCue[] {
  const record = object(value, 'Mistify caption artifact');
  if (record.state !== 'succeeded') throw new TypeError('Mistify caption artifact is not succeeded.');
  const result = object(record.result, 'Mistify caption result');
  if (result.source_checksum_sha256 !== sourceSha256 || typeof result.duration_ms !== 'number' || result.duration_ms < endSeconds * 1000 || !Array.isArray(result.transcript)) throw new TypeError('Mistify caption artifact does not match the selected source.');
  const cues: DraftCaptionCue[] = [];
  for (const candidate of result.transcript) {
    const segment = object(candidate, 'Mistify transcript segment');
    if (typeof segment.start_ms !== 'number' || typeof segment.end_ms !== 'number' || typeof segment.text !== 'string' || segment.end_ms <= segment.start_ms || segment.start_ms < 0 || segment.end_ms > result.duration_ms || !segment.text.trim()) throw new TypeError('Mistify caption artifact contains an invalid segment.');
    const overlapStart = Math.max(segment.start_ms / 1000, startSeconds);
    const overlapEnd = Math.min(segment.end_ms / 1000, endSeconds);
    if (overlapEnd > overlapStart) cues.push({startSeconds: overlapStart - startSeconds, endSeconds: overlapEnd - startSeconds, text: segment.text});
  }
  cues.sort((left, right) => left.startSeconds - right.startSeconds);
  if (cues.some((cue, index) => index > 0 && cue.startSeconds < cues[index - 1].endSeconds)) throw new TypeError('Mistify caption segments overlap.');
  if (!cues.length) throw new TypeError('Mistify caption artifact has no cue in the selected window.');
  return cues;
}

export async function createRecordingDraft(options: CreateDraftOptions): Promise<{draftDirectory: string; input: RecordedProgramDraftInput; job: DraftJob; duplicate: boolean}> {
  const [manifestContent, selectionContent, mediaDigest, mediaInfo] = await Promise.all([
    readFile(options.manifestPath, 'utf8'),
    readFile(options.selectionPath, 'utf8'),
    sha256File(options.mediaPath),
    Promise.resolve().then(() => probeMedia(options.mediaPath))
  ]);
  const manifest = validateManifest(JSON.parse(manifestContent));
  const selection = validateSelection(JSON.parse(selectionContent));
  const startSeconds = Number(selection.startSeconds);
  const endSeconds = Number(selection.endSeconds);
  assertMediaMatchesManifest(mediaInfo, manifest, mediaDigest, endSeconds);

  const startFrame = Math.round(startSeconds * RECORDED_PROGRAM_DRAFT_FPS);
  const endFrame = Math.round(endSeconds * RECORDED_PROGRAM_DRAFT_FPS);
  const manifestDigest = sha256(manifestContent);
  let captions: RecordedProgramDraftInput['captions'] = null;
  if (selection.captionArtifact !== undefined) {
    if (!options.captionArtifactPath) throw new TypeError('The pinned caption artifact file was not supplied.');
    const captionContent = await readFile(options.captionArtifactPath, 'utf8');
    const descriptor = selection.captionArtifact as Record<string, unknown>;
    const captionDigest = sha256(captionContent);
    if (captionDigest !== descriptor.sha256) throw new TypeError('Caption artifact checksum mismatch.');
    captions = {producer: 'gaulatti/mistify', contractCommit: MISTIFY_CAPTION_CONTRACT_COMMIT, artifactSha256: captionDigest, cues: extractCaptions(JSON.parse(captionContent), mediaDigest, startSeconds, endSeconds)};
  } else if (options.captionArtifactPath) {
    throw new TypeError('An unpinned caption artifact was supplied.');
  }

  const editorial = selection.editorial as Record<string, unknown>;
  const identity = {
    contractCommit: ALANA_RECORDING_CONTRACT_COMMIT,
    manifestSha256: manifestDigest,
    mediaSha256: mediaDigest,
    requestId: selection.requestId,
    startFrame,
    endFrame,
    editorial,
    captionArtifactSha256: captions?.artifactSha256 ?? null
  };
  const draftId = sha256(stableJson(identity)).slice(0, 24);
  const mediaAsset = `.recording-drafts/${draftId}/source.mp4`;
  const input: RecordedProgramDraftInput = {
    schemaVersion: RECORDING_DRAFT_SCHEMA_VERSION,
    draftId,
    status: 'draft',
    approvalRequired: true,
    publicationState: 'not-published',
    source: {
      producer: 'gaulatti/alana',
      contractCommit: ALANA_RECORDING_CONTRACT_COMMIT,
      operationId: String(manifest.operationId),
      manifestSha256: manifestDigest,
      mediaSha256: mediaDigest,
      mediaAsset,
      durationSeconds: Number(manifest.durationSeconds),
      videoCodec: 'h264',
      audioCodec: 'aac',
      width: Number(manifest.width),
      height: Number(manifest.height),
      fps: '30/1',
      audioRate: 48000,
      audioChannels: Number(manifest.audioChannels),
      window: {startSeconds, endSeconds, startFrame, endFrame}
    },
    editorial: {
      requestId: String(selection.requestId),
      eyebrow: String(editorial.eyebrow),
      headline: String(editorial.headline),
      summary: String(editorial.summary),
      handle: String(editorial.handle)
    },
    captions
  };
  assertRecordedProgramDraftInput(input);

  const draftDirectory = path.join(options.draftRoot, draftId);
  const inputPath = path.join(draftDirectory, 'input.json');
  const requestPath = path.join(options.draftRoot, 'requests', `${selection.requestId}.json`);
  try {
    const request = JSON.parse(await readFile(requestPath, 'utf8')) as {draftId?: string};
    if (request.draftId !== draftId) throw new TypeError('Editorial request ID is already bound to a different draft.');
    const priorInput = JSON.parse(await readFile(inputPath, 'utf8')) as unknown;
    assertRecordedProgramDraftInput(priorInput);
    if (stableJson(priorInput) !== stableJson(input)) throw new TypeError('Existing draft input conflicts with the deterministic request.');
    const {job} = await loadDraft(draftDirectory);
    return {draftDirectory, input, job, duplicate: true};
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }

  await mkdir(path.join(options.publicDirectory, path.dirname(mediaAsset)), {recursive: true});
  await copyFile(options.mediaPath, path.join(options.publicDirectory, mediaAsset));
  const job: DraftJob = {schemaVersion: 1, draftId, requestId: String(selection.requestId), state: 'queued', attempts: 0, approvalRequired: true, publicationState: 'not-published', input: 'input.json', output: 'draft.mp4', result: null, errorCode: null};
  await atomicJson(inputPath, input);
  await atomicJson(path.join(draftDirectory, 'job.json'), job);
  await atomicJson(requestPath, {schemaVersion: 1, requestId: selection.requestId, draftId});
  return {draftDirectory, input, job, duplicate: false};
}

export async function loadDraft(draftDirectory: string): Promise<{input: RecordedProgramDraftInput; job: DraftJob}> {
  const input = JSON.parse(await readFile(path.join(draftDirectory, 'input.json'), 'utf8')) as unknown;
  assertRecordedProgramDraftInput(input);
  const rawJob = object(JSON.parse(await readFile(path.join(draftDirectory, 'job.json'), 'utf8')) as unknown, 'draft job');
  exactKeys(rawJob, ['schemaVersion', 'draftId', 'requestId', 'state', 'attempts', 'approvalRequired', 'publicationState', 'input', 'output', 'result', 'errorCode'], 'draft job');
  const states: DraftJobState[] = ['queued', 'rendering', 'rendered', 'failed', 'canceled'];
  if (rawJob.schemaVersion !== 1 || rawJob.draftId !== input.draftId || rawJob.requestId !== input.editorial.requestId || !states.includes(rawJob.state as DraftJobState) || !Number.isInteger(rawJob.attempts) || Number(rawJob.attempts) < 0 || rawJob.approvalRequired !== true || rawJob.publicationState !== 'not-published' || rawJob.input !== 'input.json' || rawJob.output !== 'draft.mp4') throw new TypeError('Draft job does not match its immutable input.');
  if ((rawJob.state === 'rendered') !== (rawJob.result === 'result.json') || (rawJob.state === 'failed') !== (rawJob.errorCode === 'render-failed')) throw new TypeError('Draft job lifecycle fields are inconsistent.');
  if (rawJob.state !== 'rendered' && rawJob.result !== null) throw new TypeError('Non-rendered draft cannot name a result.');
  if (rawJob.state !== 'failed' && rawJob.errorCode !== null) throw new TypeError('Only a failed draft can expose a closed error code.');
  const job = rawJob as DraftJob;
  return {input, job};
}

export async function writeJob(draftDirectory: string, job: DraftJob): Promise<void> {
  await atomicJson(path.join(draftDirectory, 'job.json'), job);
}

export async function writeResult(draftDirectory: string, result: DraftResult): Promise<void> {
  await atomicJson(path.join(draftDirectory, 'result.json'), result);
}

export async function cancelRecordingDraft(draftDirectory: string): Promise<DraftJob> {
  const {job} = await loadDraft(draftDirectory);
  if (job.state === 'rendered') throw new TypeError('Rendered drafts cannot be retroactively canceled.');
  if (job.state === 'canceled') return job;
  const canceled = {...job, state: 'canceled' as const, errorCode: null};
  await writeJob(draftDirectory, canceled);
  await unlink(path.join(draftDirectory, job.output)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error;
  });
  return canceled;
}

export async function verifyRenderedResult(draftDirectory: string, input: RecordedProgramDraftInput, job: DraftJob): Promise<DraftResult> {
  if (job.state !== 'rendered' || job.result !== 'result.json') throw new TypeError('Draft job is not rendered.');
  const result = JSON.parse(await readFile(path.join(draftDirectory, job.result), 'utf8')) as DraftResult;
  const outputPath = path.join(draftDirectory, job.output);
  const output = await stat(outputPath);
  if (result.schemaVersion !== 1 || result.draftId !== input.draftId || result.state !== 'rendered' || result.approvalRequired !== true || result.publicationState !== 'not-published' || result.output !== job.output || result.sha256 !== await sha256File(outputPath) || result.bytes !== output.size || result.width !== 1080 || result.height !== 1920 || result.fps !== RECORDED_PROGRAM_DRAFT_FPS || result.durationInFrames !== draftDurationInFrames(input)) throw new TypeError('Rendered draft result is invalid or stale.');
  return result;
}

export async function runRecordingDraft(draftDirectory: string, options: RunDraftOptions): Promise<{job: DraftJob; result: DraftResult | null; duplicate: boolean}> {
  const current = await loadDraft(draftDirectory);
  if (current.job.state === 'rendered') {
    return {job: current.job, result: await verifyRenderedResult(draftDirectory, current.input, current.job), duplicate: true};
  }
  if (current.job.state === 'canceled') return {job: current.job, result: null, duplicate: true};
  if (current.job.state === 'rendering') throw new TypeError('Draft render is already in progress.');

  const rendering: DraftJob = {
    ...current.job,
    state: 'rendering',
    attempts: current.job.attempts + 1,
    result: null,
    errorCode: null
  };
  await writeJob(draftDirectory, rendering);
  const outputPath = path.join(draftDirectory, rendering.output);
  await unlink(outputPath).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error;
  });

  try {
    const metadata = await options.render(current.input, outputPath);
    const expectedDuration = draftDurationInFrames(current.input);
    if (metadata.width !== 1080 || metadata.height !== 1920 || metadata.fps !== RECORDED_PROGRAM_DRAFT_FPS || metadata.durationInFrames !== expectedDuration) {
      throw new TypeError('Rendered composition metadata does not match the draft contract.');
    }
    const latest = await loadDraft(draftDirectory);
    if (latest.job.state === 'canceled') {
      await unlink(outputPath).catch(() => undefined);
      return {job: latest.job, result: null, duplicate: false};
    }
    if (latest.job.state !== 'rendering' || latest.job.attempts !== rendering.attempts) throw new TypeError('Draft job changed during render.');
    const output = await stat(outputPath);
    const result: DraftResult = {
      schemaVersion: 1,
      draftId: current.input.draftId,
      state: 'rendered',
      approvalRequired: true,
      publicationState: 'not-published',
      output: rendering.output,
      sha256: await sha256File(outputPath),
      bytes: output.size,
      width: 1080,
      height: 1920,
      fps: RECORDED_PROGRAM_DRAFT_FPS,
      durationInFrames: expectedDuration
    };
    await writeResult(draftDirectory, result);
    const rendered: DraftJob = {...rendering, state: 'rendered', result: 'result.json', errorCode: null};
    await writeJob(draftDirectory, rendered);
    return {job: rendered, result, duplicate: false};
  } catch (error) {
    await unlink(outputPath).catch(() => undefined);
    const canceled = options.isCanceled?.(error) ?? false;
    const failed: DraftJob = {
      ...rendering,
      state: canceled ? 'canceled' : 'failed',
      result: null,
      errorCode: canceled ? null : 'render-failed'
    };
    await writeJob(draftDirectory, failed);
    if (canceled) return {job: failed, result: null, duplicate: false};
    throw new Error('Draft render failed.');
  }
}
