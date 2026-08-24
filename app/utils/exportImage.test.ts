import assert from 'node:assert/strict';
import test from 'node:test';

import { ImageExportError, imageExportErrorMessage } from './exportImage.ts';

test('reports missing packaged fonts as an actionable font failure', () => {
  const message = imageExportErrorMessage(new ImageExportError('font', 'Font display-700 returned HTTP 404.'));
  assert.match(message, /declared font is missing or could not load/i);
  assert.match(message, /HTTP 404/);
});

test('classifies a cross-origin stylesheet capture failure as a font failure', () => {
  assert.match(imageExportErrorMessage(new Error('Failed to read cssRules from stylesheet')), /declared font/i);
});

test('reports external image failures separately from other capture failures', () => {
  assert.match(imageExportErrorMessage(new ImageExportError('external-resource', 'External image example.invalid is not embeddable.')), /image or external resource/i);
  assert.match(imageExportErrorMessage(new Error('Canvas serialization failed')), /could not capture/i);
});
