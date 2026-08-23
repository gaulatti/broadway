/**
 * Template Generator - Image Export Utility
 *
 * PNG Export: Uses html-to-image to export template renders as PNG images.
 * PDF Export: Uses @react-pdf/renderer for true vector PDFs with selectable text.
 *
 * CRITICAL: Image-to-PDF conversion is FORBIDDEN. Only vector PDF generation allowed.
 */

import React from 'react';
import { toPng } from 'html-to-image';
import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';
import type { FifthbellLetterProps } from '../templates/TemplateFifthbellLetter';
import type { GaulattiLetterProps } from '../templates/TemplateGaulattiLetter';
import { fontFaceCss, type TemplateFontAsset } from '../templates/fontContract.ts';

export type ImageExportFailureKind = 'font' | 'external-resource' | 'capture';

export class ImageExportError extends Error {
  readonly kind: ImageExportFailureKind;

  constructor(kind: ImageExportFailureKind, message: string, options?: ErrorOptions) {
    super(message, options);
    this.kind = kind;
    this.name = 'ImageExportError';
  }
}

export function imageExportErrorMessage(reason: unknown): string {
  const error = reason instanceof ImageExportError ? reason : classifyCaptureError(reason);
  if (error.kind === 'font') return `PNG export stopped because a declared font is missing or could not load. ${error.message}`;
  if (error.kind === 'external-resource') return `PNG export stopped because an image or external resource cannot be embedded. Upload a local image or use a CORS-enabled source. ${error.message}`;
  return `PNG export could not capture this template. ${error.message}`;
}

function classifyCaptureError(reason: unknown): ImageExportError {
  const message = reason instanceof Error ? reason.message : String(reason || 'Unknown capture failure.');
  if (/font|cssrules|stylesheet/i.test(message)) return new ImageExportError('font', message, { cause: reason });
  if (/image|cors|fetch|resource|network/i.test(message)) return new ImageExportError('external-resource', message, { cause: reason });
  return new ImageExportError('capture', message, { cause: reason });
}

function blobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the font asset.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

async function buildEmbeddedFontCss(fonts: readonly TemplateFontAsset[], ownerDocument: Document): Promise<string> {
  if (!fonts.length) throw new ImageExportError('font', 'The selected template declares no packaged font faces.');
  const dataUrls = new Map<string, string>();
  for (const font of fonts) {
    try {
      const url = new URL(font.url, ownerDocument.baseURI);
      if (url.origin !== window.location.origin) throw new Error(`Font ${font.id} points outside Broadway.`);
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Font ${font.id} returned HTTP ${response.status}.`);
      dataUrls.set(font.id, await blobAsDataUrl(await response.blob()));
    } catch (reason) {
      throw new ImageExportError('font', reason instanceof Error ? reason.message : `Font ${font.id} could not load.`, { cause: reason });
    }
  }

  if (ownerDocument.fonts) {
    await ownerDocument.fonts.ready;
    for (const font of fonts) {
      const loaded = await ownerDocument.fonts.load(`${font.style} ${font.weight} 16px "${font.family}"`);
      if (!loaded.length) throw new ImageExportError('font', `Font ${font.family} ${font.weight} ${font.style} is unavailable in the preview.`);
    }
  }
  return fontFaceCss(fonts, dataUrls);
}

/**
 * Wait for all images within a node to complete loading
 */
async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll('img'));

  const imagePromises = images.map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      };
      const onLoad = () => {
        clearTimeout(timeout);
        cleanup();
        resolve();
      };
      const onError = () => {
        clearTimeout(timeout);
        cleanup();
        reject(new ImageExportError('external-resource', `Image ${img.currentSrc || img.src || '(unknown)'} failed to load.`));
      };
      const timeout = setTimeout(() => { cleanup(); reject(new ImageExportError('external-resource', `Image ${img.currentSrc || img.src || '(unknown)'} timed out.`)); }, 10000);
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
    });
  });

  await Promise.all(imagePromises);

  for (const img of images) {
    const source = img.currentSrc || img.src;
    if (!source || source.startsWith('data:') || source.startsWith('blob:')) continue;
    const url = new URL(source, node.ownerDocument.baseURI);
    if (url.origin === window.location.origin) continue;
    try {
      const response = await fetch(url, { credentials: 'omit', mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (reason) {
      throw new ImageExportError('external-resource', `External image ${url.hostname} is not embeddable.`, { cause: reason });
    }
  }
}

/**
 * Resolve the actual capture target for a preview node.
 * Handlebars templates render inside an iframe, so we capture the iframe body
 * instead of the wrapper div. React templates render directly and are returned as-is.
 */
function resolveCaptureTarget(node: HTMLElement): HTMLElement {
  const iframe = node.querySelector('iframe');
  if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
    return iframe.contentDocument.body;
  }
  return node;
}

/**
 * Export a DOM node to PNG with exact dimensions
 *
 * @param node - The HTML element to capture
 * @param filename - Desired filename for the download
 * @param width - Output width in pixels
 * @param height - Output height in pixels
 */
export async function exportNodeToPng(
  node: HTMLElement,
  filename: string = 'template.png',
  width: number = node.offsetWidth,
  height: number = node.offsetHeight,
  fonts: readonly TemplateFontAsset[]
): Promise<void> {
  try {
    const targetNode = resolveCaptureTarget(node);
    const fontEmbedCSS = await buildEmbeddedFontCss(fonts, targetNode.ownerDocument);

    // Wait for fonts to load - CRITICAL for proper text rendering.
    // Handlebars templates render inside an iframe, so also wait for iframe fonts.
    const fontPromises: Array<Promise<unknown>> = [];
    if (document.fonts && document.fonts.ready) {
      fontPromises.push(document.fonts.ready);
    }
    const iframe = node.querySelector('iframe');
    if (iframe && iframe.contentDocument && iframe.contentDocument.fonts && iframe.contentDocument.fonts.ready) {
      fontPromises.push(iframe.contentDocument.fonts.ready);
    }
    await Promise.all(fontPromises);

    // Wait for images to load
    await waitForImages(targetNode);

    // CRITICAL: Do a first render pass to trigger all image loads and state updates
    // This ensures React state (like dominant color from onLoad) is fully updated
    await toPng(targetNode, {
      width,
      height,
      pixelRatio: 1,
      cacheBust: false,
      fontEmbedCSS
    });

    // Wait for React to flush all state updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Now capture the final render with all state updates applied
    const dataUrl = await toPng(targetNode, {
      width,
      height,
      pixelRatio: 1,
      cacheBust: true,
      fontEmbedCSS,
      // Include external fonts and resources
      includeQueryParams: true,
      // CRITICAL: Custom filter to handle CORS for external images
      filter: (domNode: HTMLElement) => {
        // Don't exclude any nodes
        return true;
      },
      // Custom fetch function to handle CORS for images
      fetchRequestInit: {
        mode: 'cors',
        credentials: 'omit'
      }
    });

    // Convert to blob and download
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw error instanceof ImageExportError ? error : classifyCaptureError(error);
  }
}

/**
 * Generate a true vector PDF using @react-pdf/renderer.
 *
 * Produces a two-page US Letter PDF with selectable text and embedded fonts.
 * Data comes from the props argument passed by the caller.
 *
 * Uses dynamic imports so @react-pdf/renderer is only loaded in the browser,
 * never on the server.
 *
 * CRITICAL: This is the ONLY way to generate resume PDFs. Raster image-to-PDF
 * conversion is FORBIDDEN.
 *
 * @param props    - Resume data to render in the PDF
 * @param filename - Download filename (`.pdf` extension added if missing)
 */
export async function generateResumePdf(props: ResumeLetterProps, filename: string = 'resume.pdf'): Promise<void> {
  // Dynamic imports keep @react-pdf/renderer out of the SSR bundle and allow
  // the heavy renderer to be code-split / lazy-loaded on first use.
  const [{ pdf }, { ResumeLetterPdf }] = await Promise.all([import('@react-pdf/renderer'), import('../pdf/ResumeLetterPdf')]);

  // Pass the props to ResumeLetterPdf
  const element = React.createElement(ResumeLetterPdf, props);
  const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateFifthbellLetterPdf(props: FifthbellLetterProps, filename: string = 'fifthbell-letter.pdf'): Promise<void> {
  const [{ pdf }, { FifthbellLetterPdf }] = await Promise.all([import('@react-pdf/renderer'), import('../pdf/FifthbellLetterPdf')]);

  const element = React.createElement(FifthbellLetterPdf, props);
  const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateGaulattiLetterPdf(props: GaulattiLetterProps, filename: string = 'gaulatti-letter.pdf'): Promise<void> {
  const [{ pdf }, { GaulattiLetterPdf }] = await Promise.all([import('@react-pdf/renderer'), import('../pdf/GaulattiLetterPdf')]);
  const blob = await pdf(React.createElement(GaulattiLetterPdf, props) as Parameters<typeof pdf>[0]).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
