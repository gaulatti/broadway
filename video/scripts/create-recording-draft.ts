import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRecordingDraft} from './recording-draft-workflow';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.resolve(packageRoot, process.argv[2] ?? 'fixtures/alana-recording-manifest.json');
const mediaPath = path.resolve(packageRoot, process.argv[3] ?? 'public/fixtures/alana-recording.mp4');
const selectionPath = path.resolve(packageRoot, process.argv[4] ?? 'fixtures/recorded-program-selection.json');
const draftRoot = path.resolve(packageRoot, process.argv[5] ?? 'out/recording-drafts');
const captionArtifactPath = process.argv[6]
  ? path.resolve(packageRoot, process.argv[6])
  : process.argv.length === 2
    ? path.join(packageRoot, 'fixtures', 'mistify-caption-result.json')
    : undefined;

const result = await createRecordingDraft({manifestPath, mediaPath, selectionPath, captionArtifactPath, draftRoot, publicDirectory: path.join(packageRoot, 'public')});
console.log(JSON.stringify({draftId: result.input.draftId, state: result.job.state, duplicate: result.duplicate, approvalRequired: true, publicationState: 'not-published'}));
