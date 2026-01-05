/**
 * Template Studio - Image Export Utility
 *
 * Uses html-to-image to export template renders as PNG images.
 * html-to-image properly handles modern CSS including filters, gradients, and Google Fonts.
 * Ensures output is exactly 1080x1920 pixels regardless of device pixel ratio.
 */

import { toPng } from 'html-to-image';

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
 * Export a DOM node to PNG with exact 1080x1920 dimensions
 *
 * @param node - The HTML element to capture
 * @param filename - Desired filename for the download
 */
export async function exportNodeToPng(node: HTMLElement, filename: string = 'template.png'): Promise<void> {
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
      width: 1080,
      height: 1920,
      pixelRatio: 1,
      cacheBust: false
    });

    // Wait for React to flush all state updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Now capture the final render with all state updates applied
    const dataUrl = await toPng(node, {
      width: 1080,
      height: 1920,
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
