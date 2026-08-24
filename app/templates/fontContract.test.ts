import assert from 'node:assert/strict';
import test from 'node:test';

import { fontFaceCss, TemplateFontContractError, validateTemplateFontContract, type TemplateFontAsset } from './fontContract.ts';

const localFont: TemplateFontAsset = { id: 'display-700', family: 'Display', style: 'normal', weight: 700, url: '/assets/display.woff2', owner: 'test-package' };

test('accepts template-package-owned local font assets and emits their exact face', () => {
  validateTemplateFontContract([{ id: 'valid', fonts: [localFont] }]);
  assert.match(fontFaceCss([localFont]), /font-family:'Display'.*font-weight:700.*\/assets\/display\.woff2/);
});

test('rejects a registered template without declared packaged fonts', () => {
  assert.throws(() => validateTemplateFontContract([{ id: 'missing' }]), TemplateFontContractError);
});

test('rejects remote runtime font assets and duplicate faces', () => {
  assert.throws(() => validateTemplateFontContract([{ id: 'remote', fonts: [{ ...localFont, url: 'https://fonts.example/font.woff2' }] }]), /not a packaged local asset/);
  assert.throws(() => validateTemplateFontContract([{ id: 'duplicate', fonts: [localFont, localFont] }]), /duplicate font face id/);
});
