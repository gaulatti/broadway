import assert from 'node:assert/strict';
import {access, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {modoItalianoGiorgiaDefinition, videoTemplates} from '../src/definitions';
import {assertModoItalianoGiorgiaInput, validateVideoTemplateDefinition} from '../src/types';
import {assertInputAssets} from './input-assets';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.join(packageRoot, 'fixtures', 'modo-italiano-giorgia.json');
const fixture = JSON.parse(await readFile(fixturePath, 'utf8')) as unknown;

assertModoItalianoGiorgiaInput(fixture);
await assertInputAssets(fixture, path.join(packageRoot, 'public'));
validateVideoTemplateDefinition(modoItalianoGiorgiaDefinition);
assert.equal(videoTemplates.length, 1);
assert.equal(modoItalianoGiorgiaDefinition.width, 1080);
assert.equal(modoItalianoGiorgiaDefinition.height, 1920);
assert.equal(modoItalianoGiorgiaDefinition.fps, 30);
assert.equal(modoItalianoGiorgiaDefinition.durationInFrames, 450);
assert.equal(modoItalianoGiorgiaDefinition.durationInFrames / modoItalianoGiorgiaDefinition.fps, 15);
assert.deepEqual(JSON.parse(JSON.stringify(fixture)), fixture);
await access(path.join(packageRoot, 'public', 'mi.svg'));

assert.throws(
  () =>
    assertModoItalianoGiorgiaInput({
      ...fixture,
      audioAsset: '../outside.mp3'
    }),
  /safe path/
);
assert.throws(() => assertModoItalianoGiorgiaInput({...fixture, unexpected: true}), /unknown fields/);
assert.throws(() => assertModoItalianoGiorgiaInput({...fixture, headline: 'x'.repeat(53)}), /title-safe text boundary/);
assert.throws(
  () =>
    assertModoItalianoGiorgiaInput({
      ...fixture,
      summary: 'first line\nsecond line'
    }),
  /title-safe text boundary/
);
await assert.rejects(
  assertInputAssets({...fixture, audioAsset: 'missing.mp3'}, path.join(packageRoot, 'public')),
  /regular file inside video\/public/
);

console.log('Video template contract: 14 checks passed.');
