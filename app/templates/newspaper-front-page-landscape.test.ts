import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import Handlebars from 'handlebars';
import { defaultProps, fields, NEWSPAPER_LANDSCAPE_WIDTH, NEWSPAPER_LANDSCAPE_HEIGHT, toNewspaperRenderData, type NewspaperFrontPageProps } from './newspaperFrontPageData.ts';

const compile = Handlebars.compile(readFileSync(new URL('./newspaper-front-page-landscape.hbs', import.meta.url), 'utf8'));
const render = (props: NewspaperFrontPageProps) => compile(toNewspaperRenderData(props));

test('landscape newspaper canvas is 7008×4672 and matches the template body', () => {
  assert.equal(NEWSPAPER_LANDSCAPE_WIDTH, 7008);
  assert.equal(NEWSPAPER_LANDSCAPE_HEIGHT, 4672);
  assert.match(render(defaultProps), new RegExp(`width: ${NEWSPAPER_LANDSCAPE_WIDTH}px; height: ${NEWSPAPER_LANDSCAPE_HEIGHT}px`));
});

test('landscape newspaper renders every shared editable field', () => {
  const html = render(defaultProps);
  for (const field of fields) {
    if (field.type === 'date') continue;
    const value = `Edited ${field.key} & <news>`;
    assert.ok(render({ ...defaultProps, [field.key]: value }).includes(Handlebars.escapeExpression(value)), `${field.key} reaches the document`);
  }
  assert.ok(html.includes(`class="page-photo" src="${Handlebars.escapeExpression(defaultProps.imageUrl)}"`));
  assert.match(html, /<span>October 3, 2026<\/span>/);
});

test('landscape newspaper keeps optional deck and teasers independent', () => {
  assert.doesNotMatch(render({ ...defaultProps, standfirst: '' }), /<p class="standfirst"/);
  const html = render({ ...defaultProps, storyOneHeadline: '' });
  assert.ok(!html.includes(defaultProps.storyOneHeadline) && html.includes(defaultProps.storyTwoHeadline));
  assert.doesNotMatch(render({ ...defaultProps, storyOneHeadline: '', storyTwoHeadline: '' }), /<nav class="teasers"/);
});
