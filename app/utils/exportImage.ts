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

/**
 * Wait for all images within a node to complete loading
 */
async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll('img'));

  const imagePromises = images.map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 10000); // 10s timeout
      img.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };
    });
  });

  await Promise.all(imagePromises);
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
  height: number = node.offsetHeight
): Promise<void> {
  try {
    // Wait for fonts to load - CRITICAL for proper text rendering
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Wait for images to load
    await waitForImages(node);

    // CRITICAL: Do a first render pass to trigger all image loads and state updates
    // This ensures React state (like dominant color from onLoad) is fully updated
    await toPng(node, {
      width,
      height,
      pixelRatio: 1,
      cacheBust: false
    });

    // Wait for React to flush all state updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Now capture the final render with all state updates applied
    const dataUrl = await toPng(node, {
      width,
      height,
      pixelRatio: 1,
      cacheBust: true,
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
    alert('Failed to export image. Please check console for details.');
    throw error;
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
