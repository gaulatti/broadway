import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {recordedProgramDraftDefinition} from '../src/definitions';
import {draftDurationInFrames} from '../src/recording-draft';
import {loadDraft} from './recording-draft-workflow';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftDirectory = path.resolve(packageRoot, process.argv[2] ?? 'out/recording-drafts');
if (!process.argv[2]) throw new TypeError('Pass the rendered draft directory to review.');
const outputDirectory = path.resolve(packageRoot, process.argv[3] ?? path.join(draftDirectory, 'review'));
const {input} = await loadDraft(draftDirectory);
await mkdir(outputDirectory, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(packageRoot, 'src', 'index.ts'), publicDir: path.join(packageRoot, 'public'), onProgress: () => undefined});
const composition = await selectComposition({serveUrl, id: recordedProgramDraftDefinition.id, inputProps: input, logLevel: 'warn'});
const lastFrame = draftDurationInFrames(input) - 1;
const frames = [
  {name: 'opening', frame: Math.round(lastFrame * 0.15)},
  {name: 'midpoint', frame: Math.round(lastFrame * 0.5)},
  {name: 'closing', frame: Math.round(lastFrame * 0.85)}
] as const;

for (const review of frames) {
  const first = path.join(outputDirectory, `${review.name}.png`);
  const repeat = path.join(outputDirectory, `${review.name}.repeat.png`);
  for (const output of [first, repeat]) {
    await renderStill({serveUrl, composition, inputProps: input, frame: review.frame, imageFormat: 'png', output, overwrite: true, logLevel: 'warn'});
  }
  const firstHash = createHash('sha256').update(await readFile(first)).digest('hex');
  const repeatHash = createHash('sha256').update(await readFile(repeat)).digest('hex');
  if (firstHash !== repeatHash) throw new TypeError(`${review.name} recording-draft frame is not deterministic.`);
  console.log(`${review.name}\tframe=${review.frame}\tsha256=${firstHash}`);
}
