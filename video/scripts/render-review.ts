import {createHash} from 'node:crypto';
import {readFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {modoItalianoGiorgiaDefinition} from '../src/definitions';
import {assertModoItalianoGiorgiaInput} from '../src/types';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.resolve(packageRoot, process.argv[2] ?? 'fixtures/modo-italiano-giorgia.json');
const outputDir = path.resolve(packageRoot, process.argv[3] ?? 'out/review');
const inputProps = JSON.parse(await readFile(fixturePath, 'utf8')) as unknown;
assertModoItalianoGiorgiaInput(inputProps);
await mkdir(outputDir, {recursive: true});

const serveUrl = await bundle({
  entryPoint: path.join(packageRoot, 'src', 'index.ts'),
  publicDir: path.join(packageRoot, 'public'),
  onProgress: () => undefined
});
const composition = await selectComposition({
  serveUrl,
  id: modoItalianoGiorgiaDefinition.id,
  inputProps,
  logLevel: 'warn'
});
const reviewFrames = [
  {name: 'opening', frame: 105},
  {name: 'midpoint', frame: 225},
  {name: 'outro', frame: 390}
] as const;

for (const review of reviewFrames) {
  const first = path.join(outputDir, `${review.name}.png`);
  const repeat = path.join(outputDir, `${review.name}.repeat.png`);
  for (const output of [first, repeat]) {
    await renderStill({
      serveUrl,
      composition,
      inputProps,
      frame: review.frame,
      imageFormat: 'png',
      output,
      overwrite: true,
      logLevel: 'warn'
    });
  }
  const firstHash = createHash('sha256').update(await readFile(first)).digest('hex');
  const repeatHash = createHash('sha256').update(await readFile(repeat)).digest('hex');
  if (firstHash !== repeatHash) throw new Error(`${review.name} frame is not deterministic.`);
  console.log(`${review.name}\tframe=${review.frame}\tsha256=${firstHash}`);
}
