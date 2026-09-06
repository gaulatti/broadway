import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {makeCancelSignal, renderMedia, selectComposition} from '@remotion/renderer';
import {recordedProgramDraftDefinition} from '../src/definitions';
import {draftDurationInFrames} from '../src/recording-draft';
import {runRecordingDraft} from './recording-draft-workflow';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftDirectory = path.resolve(packageRoot, process.argv[2] ?? 'out/recording-drafts');
if (!process.argv[2]) throw new TypeError('Pass the generated draft directory to render.');

const {cancelSignal, cancel} = makeCancelSignal();
const requestCancellation = () => cancel();
const isCanceled = (error: unknown) => error instanceof Error && error.message.includes('renderMedia() got cancelled');
process.once('SIGINT', requestCancellation);
process.once('SIGTERM', requestCancellation);

try {
  const result = await runRecordingDraft(draftDirectory, {
    isCanceled,
    render: async (inputProps, outputPath) => {
      const serveUrl = await bundle({
        entryPoint: path.join(packageRoot, 'src', 'index.ts'),
        publicDir: path.join(packageRoot, 'public'),
        onProgress: () => undefined
      });
      const composition = await selectComposition({
        serveUrl,
        id: recordedProgramDraftDefinition.id,
        inputProps,
        logLevel: 'warn'
      });
      if (
        composition.width !== recordedProgramDraftDefinition.width ||
        composition.height !== recordedProgramDraftDefinition.height ||
        composition.fps !== recordedProgramDraftDefinition.fps ||
        composition.durationInFrames !== draftDurationInFrames(inputProps)
      ) {
        throw new TypeError('Selected composition metadata does not match the recording-draft contract.');
      }
      await renderMedia({
        serveUrl,
        composition,
        inputProps,
        codec: 'h264',
        crf: 18,
        imageFormat: 'jpeg',
        jpegQuality: 90,
        x264Preset: 'veryfast',
        enforceAudioTrack: true,
        outputLocation: outputPath,
        overwrite: true,
        concurrency: 2,
        cancelSignal,
        logLevel: 'warn'
      });
      return {
        width: composition.width,
        height: composition.height,
        fps: composition.fps,
        durationInFrames: composition.durationInFrames
      };
    }
  });
  console.log(JSON.stringify({draftId: result.job.draftId, state: result.job.state, attempts: result.job.attempts, duplicate: result.duplicate, publicationState: result.job.publicationState}));
} finally {
  process.removeListener('SIGINT', requestCancellation);
  process.removeListener('SIGTERM', requestCancellation);
}
