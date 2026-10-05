import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import Handlebars from 'handlebars';

const source = readFileSync(new URL('./cd-cover.hbs', import.meta.url), 'utf8');
const render = Handlebars.compile(source);

test('CD cover renders square artwork with editable general-purpose text and escaped content', () => {
  const html = render({
    imageUrl: '/cd-cover-example.svg',
    topLine: 'Atlas & Co.',
    title: '<Reference Collection>',
    subtitle: 'Volume 01'
  });

  assert.match(html, /width: 1500px;\s*height: 1500px/);
  assert.match(html, /src="\/cd-cover-example\.svg"/);
  assert.match(html, /<img class="brand-mark" src="\/logo\.svg" alt="gaulatti"/);
  assert.match(html, /\.brand-mark \{[^}]*margin-bottom: 30px/);
  assert.match(html, /\.accent \{[^}]*margin-bottom: 30px/);
  assert.match(html, /Atlas &amp; Co\./);
  assert.match(html, /&lt;Reference Collection&gt;/);
  assert.match(html, /<p class="subtitle">Volume 01<\/p>/);
});

test('CD cover omits the optional subtitle when empty', () => {
  const html = render({ imageUrl: '/cd-cover-example.svg', topLine: 'Project Atlas', title: 'Reference Collection', subtitle: '' });
  assert.doesNotMatch(html, /<p class="subtitle">/);
});
