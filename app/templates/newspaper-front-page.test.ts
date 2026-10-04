import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import Handlebars from 'handlebars';
import { defaultProps, fields, NEWSPAPER_WIDTH, NEWSPAPER_HEIGHT, toNewspaperRenderData, type NewspaperFrontPageProps } from './newspaperFrontPageData.ts';

const source = readFileSync(new URL('./newspaper-front-page.hbs', import.meta.url), 'utf8');
const compile = Handlebars.compile(source);
const render = (props: NewspaperFrontPageProps) => compile(toNewspaperRenderData(props));

test('newspaper gallery fixture renders every editable field through the real template', () => {
  const html = render(defaultProps);
  assert.match(html, new RegExp(`width: ${NEWSPAPER_WIDTH}px; height: ${NEWSPAPER_HEIGHT}px`));
  assert.equal(new Set(fields.map((field) => field.key)).size, fields.length);
  assert.deepEqual(fields.map((field) => field.key).sort(), Object.keys(defaultProps).sort());
  for (const field of fields) {
    if (field.type === 'date') continue; // Calendar values are tested through their formatted output below.
    const value = `Edited ${field.key} & <news>`;
    assert.ok(render({ ...defaultProps, [field.key]: value }).includes(Handlebars.escapeExpression(value)), `${field.key} reaches the document`);
  }
  assert.ok(html.includes(`class="page-photo" src="${Handlebars.escapeExpression(defaultProps.imageUrl)}"`));
  assert.match(html, /class="publication">banger<\/p>/);
  assert.match(html, /\.page-photo, \.photo-shade \{ position: absolute; inset: 0; width: 100%; height: 100%; \}/);
  assert.doesNotMatch(html, /class="article-body"/);
  assert.match(html, /aria-label="Inside this issue"/);
  assert.match(html, /<div class="eyebrow"><span>October 3, 2026<\/span><span>Vol\. 01 \/ No\. 001<\/span><\/div>/);
  assert.doesNotMatch(html, /Independent voices|broadway\.example|\$3\.00|class="page-ref"|class="folio"|class="photo-credit"|File photograph|Pages? \d/);
});

test('selected issue date reaches the cover as a formatted calendar date without time-zone shifts', () => {
  assert.equal(fields.find((field) => field.key === 'date')?.type, 'date');
  assert.match(render({ ...defaultProps, date: '2026-10-04' }), /<span>October 4, 2026<\/span>/);
  assert.match(render({ ...defaultProps, date: '2024-02-29' }), /<span>February 29, 2024<\/span>/);
  assert.match(render({ ...defaultProps, date: '' }), /<div class="eyebrow"><span><\/span>/);
  for (const date of ['2026-02-29', '2026-13-01', '10/03/2026', '<script>']) {
    assert.match(render({ ...defaultProps, date }), /<span>Invalid issue date<\/span>/);
  }
});

test('newspaper preserves headline line breaks and escapes the short deck', () => {
  const html = render({ ...defaultProps, headline: 'A headline\non two lines', standfirst: '<script>alert(1)</script>' });
  assert.match(html, /A headline\non two lines/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('optional deck and teasers can be omitted independently', () => {
  const html = render({ ...defaultProps, standfirst: '', storyOneHeadline: '' });
  assert.doesNotMatch(html, /<p class="standfirst"/);
  assert.ok(!html.includes(defaultProps.storyOneHeadline));
  assert.ok(html.includes(defaultProps.storyTwoHeadline));
  assert.doesNotMatch(render({ ...defaultProps, storyOneHeadline: '', storyTwoHeadline: '' }), /<nav class="teasers"/);
});
