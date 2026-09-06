import {createHash} from 'node:crypto';
import {readFile, mkdir, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {modoItalianoGiorgiaDefinition} from '../src/definitions';
import {assertModoItalianoGiorgiaInput} from '../src/types';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.resolve(packageRoot, process.argv[2] ?? 'fixtures/modo-italiano-giorgia.json');
const outputPath = path.resolve(packageRoot, process.argv[3] ?? 'out/modo-italiano-giorgia.mp4');
const inputProps = JSON.parse(await readFile(fixturePath, 'utf8')) as unknown;
assertModoItalianoGiorgiaInput(inputProps);
await mkdir(path.dirname(outputPath), {recursive: true});

let peakRssBytes = process.memoryUsage.rss();
const memorySample = setInterval(() => {
  peakRssBytes = Math.max(peakRssBytes, process.memoryUsage.rss());
}, 100);
const wallStartedAt = process.hrtime.bigint();
const cpuStartedAt = process.cpuUsage();

try {
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

  if (
    composition.width !== modoItalianoGiorgiaDefinition.width ||
    composition.height !== modoItalianoGiorgiaDefinition.height ||
    composition.fps !== modoItalianoGiorgiaDefinition.fps ||
    composition.durationInFrames !== modoItalianoGiorgiaDefinition.durationInFrames
  ) {
    throw new Error('Selected composition metadata does not match the versioned template definition.');
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
    logLevel: 'warn'
  });

  const artifact = await readFile(outputPath);
  const output = await stat(outputPath);
  const cpu = process.cpuUsage(cpuStartedAt);
  const report = {
    schemaVersion: 1,
    compositionId: composition.id,
    output: path.relative(packageRoot, outputPath),
    width: composition.width,
    height: composition.height,
    fps: composition.fps,
    durationInFrames: composition.durationInFrames,
    wallSeconds: Number(process.hrtime.bigint() - wallStartedAt) / 1_000_000_000,
    cpuSeconds: (cpu.user + cpu.system) / 1_000_000,
    peakRssBytes,
    outputBytes: output.size,
    sha256: createHash('sha256').update(artifact).digest('hex')
  };
  await writeFile(path.join(path.dirname(outputPath), 'render-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report));
} finally {
  clearInterval(memorySample);
}
