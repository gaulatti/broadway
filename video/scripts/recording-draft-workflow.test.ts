import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {assertRecordedProgramDraftInput} from '../src/recording-draft';
import {cancelRecordingDraft, createRecordingDraft, loadDraft, runRecordingDraft, sha256} from './recording-draft-workflow';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureManifest = path.join(packageRoot, 'fixtures', 'alana-recording-manifest.json');
const fixtureSelection = path.join(packageRoot, 'fixtures', 'recorded-program-selection.json');
const fixtureCaptions = path.join(packageRoot, 'fixtures', 'mistify-caption-result.json');
const fixtureMedia = path.join(packageRoot, 'public', 'fixtures', 'alana-recording.mp4');

async function workspace(): Promise<{root: string; manifest: Record<string, unknown>; selection: Record<string, unknown>; cleanup: () => Promise<void>}> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'broadway-draft-'));
  const manifest = JSON.parse(await readFile(fixtureManifest, 'utf8')) as Record<string, unknown>;
  const selection = JSON.parse(await readFile(fixtureSelection, 'utf8')) as Record<string, unknown>;
  return {root, manifest, selection, cleanup: () => rm(root, {recursive: true, force: true})};
}

async function createFrom(value: Awaited<ReturnType<typeof workspace>>, includeCaptions = true) {
  const manifestPath = path.join(value.root, 'manifest.json');
  const selectionPath = path.join(value.root, 'selection.json');
  await writeFile(manifestPath, `${JSON.stringify(value.manifest, null, 2)}\n`);
  await writeFile(selectionPath, `${JSON.stringify(value.selection, null, 2)}\n`);
  return createRecordingDraft({
    manifestPath,
    mediaPath: fixtureMedia,
    selectionPath,
    captionArtifactPath: includeCaptions ? fixtureCaptions : undefined,
    draftRoot: path.join(value.root, 'drafts'),
    publicDirectory: path.join(value.root, 'public')
  });
}

test('creates one deterministic approval-required draft with pinned source and optional captions', async () => {
  const value = await workspace();
  try {
    const first = await createFrom(value);
    const duplicate = await createFrom(value);
    assert.equal(first.duplicate, false);
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.input.draftId, first.input.draftId);
    assert.equal(first.input.status, 'draft');
    assert.equal(first.input.approvalRequired, true);
    assert.equal(first.input.publicationState, 'not-published');
    assert.equal(first.input.source.mediaSha256, value.manifest.finalSha256);
    assert.equal(first.input.captions?.cues.length, 2);
    await readFile(path.join(value.root, 'public', first.input.source.mediaAsset));
  } finally {
    await value.cleanup();
  }
});

test('accepts a human selection without making captions required', async () => {
  const value = await workspace();
  try {
    delete value.selection.captionArtifact;
    const created = await createFrom(value, false);
    assert.equal(created.input.captions, null);
  } finally {
    await value.cleanup();
  }
});

test('rejects caption data unless the selection pins its landed artifact digest', async () => {
  const value = await workspace();
  try {
    const descriptor = value.selection.captionArtifact as Record<string, unknown>;
    descriptor.sha256 = 'a'.repeat(64);
    await assert.rejects(createFrom(value), /Caption artifact checksum mismatch/);
  } finally {
    await value.cleanup();
  }
});

test('rejects missing, non-finalized, corrupted, incompatible, and out-of-bounds source media before render', async (context) => {
  const cases: Array<{name: string; mutate: (value: Awaited<ReturnType<typeof workspace>>) => void; pattern: RegExp}> = [
    {name: 'non-finalized', mutate: ({manifest}) => { manifest.state = 'active'; }, pattern: /not finalized/},
    {name: 'unverified', mutate: ({manifest}) => { manifest.finalizationState = 'pending'; }, pattern: /not finalized/},
    {name: 'checksum mismatch', mutate: ({manifest}) => { manifest.finalSha256 = 'a'.repeat(64); }, pattern: /checksum or size/},
    {name: 'codec mismatch', mutate: ({manifest}) => { manifest.videoCodec = 'vp9'; }, pattern: /landed media contract/},
    {name: 'off-grid timecode', mutate: ({selection}) => { selection.startSeconds = 1.01; }, pattern: /30fps frame grid/},
    {name: 'audio-video bound', mutate: ({selection}) => { selection.endSeconds = 6.1; }, pattern: /audio or video stream boundary/}
  ];
  for (const candidate of cases) {
    await context.test(candidate.name, async () => {
      const value = await workspace();
      try {
        delete value.selection.captionArtifact;
        candidate.mutate(value);
        await assert.rejects(createFrom(value, false), candidate.pattern);
      } finally {
        await value.cleanup();
      }
    });
  }

  await context.test('missing media', async () => {
    const value = await workspace();
    try {
      delete value.selection.captionArtifact;
      await writeFile(path.join(value.root, 'manifest.json'), `${JSON.stringify(value.manifest)}\n`);
      await writeFile(path.join(value.root, 'selection.json'), `${JSON.stringify(value.selection)}\n`);
      await assert.rejects(createRecordingDraft({manifestPath: path.join(value.root, 'manifest.json'), mediaPath: path.join(value.root, 'missing.mp4'), selectionPath: path.join(value.root, 'selection.json'), draftRoot: path.join(value.root, 'drafts'), publicDirectory: path.join(value.root, 'public')}));
    } finally {
      await value.cleanup();
    }
  });
});

test('binds an editorial request ID to one deterministic draft', async () => {
  const value = await workspace();
  try {
    delete value.selection.captionArtifact;
    await createFrom(value, false);
    const editorial = value.selection.editorial as Record<string, unknown>;
    editorial.headline = 'A different selection under the same request';
    await assert.rejects(createFrom(value, false), /already bound to a different draft/);
  } finally {
    await value.cleanup();
  }
});

test('records render failure, retries the same draft, and reuses a completed result', async () => {
  const value = await workspace();
  try {
    delete value.selection.captionArtifact;
    const created = await createFrom(value, false);
    await assert.rejects(runRecordingDraft(created.draftDirectory, {render: async () => { throw new Error('private renderer detail'); }}), /Draft render failed/);
    assert.deepEqual((await loadDraft(created.draftDirectory)).job, {...created.job, state: 'failed', attempts: 1, errorCode: 'render-failed'});
    const render = async (_input: unknown, outputPath: string) => {
      await mkdir(path.dirname(outputPath), {recursive: true});
      await writeFile(outputPath, 'fixture render');
      return {width: 1080, height: 1920, fps: 30, durationInFrames: 120};
    };
    const retried = await runRecordingDraft(created.draftDirectory, {render});
    assert.equal(retried.job.state, 'rendered');
    assert.equal(retried.job.attempts, 2);
    assert.equal(retried.result?.sha256, sha256('fixture render'));
    const duplicate = await runRecordingDraft(created.draftDirectory, {render: async () => { throw new Error('must not execute'); }});
    assert.equal(duplicate.duplicate, true);
    assert.equal(duplicate.job.attempts, 2);
  } finally {
    await value.cleanup();
  }
});

test('cancels a queued draft without rendering or publishing it', async () => {
  const value = await workspace();
  try {
    delete value.selection.captionArtifact;
    const created = await createFrom(value, false);
    const canceled = await cancelRecordingDraft(created.draftDirectory);
    assert.equal(canceled.state, 'canceled');
    let called = false;
    const result = await runRecordingDraft(created.draftDirectory, {render: async () => { called = true; throw new Error('must not execute'); }});
    assert.equal(called, false);
    assert.equal(result.job.publicationState, 'not-published');
    assert.equal(result.result, null);
  } finally {
    await value.cleanup();
  }
});

test('input validation fails closed if a caller marks a draft as published', () => {
  const invalid = {...JSON.parse(JSON.stringify({
    schemaVersion: 1,
    draftId: 'a'.repeat(24),
    status: 'draft',
    approvalRequired: true,
    publicationState: 'published',
    source: {},
    editorial: {},
    captions: null
  }))};
  assert.throws(() => assertRecordedProgramDraftInput(invalid), /unpublished draft/);
});
