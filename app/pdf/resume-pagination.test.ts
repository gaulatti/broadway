import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { transformWithEsbuild } from 'vite';
import { parseResumeSchema } from '../templates/resumeSchema.ts';
import { buildResumePaginatedCards } from '../templates/resumeSecondaryLayout.ts';
import { assertResumePdfLayoutFits } from './resumePdfLayout.ts';

// Exercise the real TSX document and real packaged fonts under the Node test runner.
const require = createRequire(import.meta.url);
const filename = new URL('./ResumeLetterPdf.tsx', import.meta.url);
let { code } = await transformWithEsbuild(readFileSync(filename, 'utf8'), filename.pathname, { jsx: 'transform', format: 'esm' });
code = code.replace(/from ['"]([^'"]+)['"]/g, (match, specifier: string) => {
  if (specifier.endsWith('?url'))
    return `from 'data:text/javascript,export default ${encodeURIComponent(JSON.stringify(require.resolve(specifier.slice(0, -4))))}'`;
  const target = specifier.startsWith('.') ? new URL(`${specifier}.ts`, filename) : pathToFileURL(require.resolve(specifier));
  return `from ${JSON.stringify(target.href)}`;
});
const { ResumeLetterPdf } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const fixture = JSON.parse(readFileSync(new URL('../../public/resume-pagination-example.json', import.meta.url), 'utf8'));

async function render(input = fixture) {
  const parsed = parseResumeSchema(input, {} as never);
  assert.equal(parsed.ok, true);
  const props = parsed.value!;
  const document = ResumeLetterPdf(props);
  let layout: any;
  const stream = await pdf(
    React.cloneElement(document, {
      onRender: (result: any) => {
        document.props.onRender(result);
        layout = result._INTERNAL__LAYOUT__DATA_;
      }
    })
  ).toBuffer();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return { layout, props, bytes: Buffer.concat(chunks) };
}

function text(node: any): string {
  return node.type === 'TEXT_INSTANCE' ? node.value : (node.children || []).map(text).join(' ');
}

test('JSON import exports two complete Letter pages without a blank overflow page', async () => {
  const { layout, props, bytes } = await render();
  const plan = buildResumePaginatedCards(props);
  assert.equal(plan.primary.length, 3);
  assert.equal(plan.secondary.length, 1);
  assert.equal(layout.children.length, 2);
  assert.equal((bytes.toString('latin1').match(/\/Type \/Page\b/g) || []).length, 2);
  for (const [index, page] of layout.children.entries()) {
    assert.equal(page.box.width, 612);
    assert.equal(page.box.height, 792);
    assert.match(text(page), new RegExp(`Page\\s+${index + 1}`));
  }
  const output = text(layout);
  for (const entry of props.experience) {
    for (const value of [entry.title, entry.company, ...entry.highlights, ...Object.values(entry.subSpotlight || {})]) {
      assert.ok(output.includes(value), 'all experience text reaches the PDF');
    }
  }
  for (const item of props.earlierExperiences) assert.ok(output.includes(item.text));
  for (const group of props.skillGroups) assert.ok(output.includes(group.items.join(' • ')));
  assertResumePdfLayoutFits(layout, 2);
});

test('oversized sidebar content fails export instead of silently clipping text', async () => {
  await assert.rejects(
    render({ ...fixture, profile: { ...fixture.profile, introStatement: 'A deliberately oversized fictional profile. '.repeat(200) } }),
    /exceeds the printable area|pagination overflowed/
  );
});

test('additional experience remains paginated with matching visible page numbers', async () => {
  const extended = { ...fixture, experience: [...fixture.experience, ...fixture.experience, ...fixture.experience] };
  const { layout, props } = await render(extended);
  const plan = buildResumePaginatedCards(props);
  assert.equal(layout.children.length, plan.secondary.length + 1);
  assert.ok(layout.children.length > 2);
  for (const [index, page] of layout.children.entries()) assert.match(text(page), new RegExp(`Page\\s+${index + 1}`));
});
