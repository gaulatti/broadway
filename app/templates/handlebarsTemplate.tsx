/**
 * Handlebars Template Renderer
 *
 * A React bridge that compiles a Handlebars source string at runtime
 * and renders the resulting HTML into a fixed-size iframe.
 *
 * Using an iframe keeps the template's full HTML document (including <html>,
 * <head>, <style>, and external resources) isolated from the rest of the
 * Broadway UI, preventing broken layouts or hydration issues.
 */

import Handlebars from 'handlebars';
import qrcode from 'qrcode-generator';
import React, { useEffect, useMemo, useRef } from 'react';

export interface HandlebarsTemplateComponentProps {
  source: string;
  width: number;
  height: number;
  [key: string]: unknown;
}

function renderQrCodeSvg(url: string): string {
  const typeNumber = 0;
  const errorCorrectionLevel = 'M';
  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(url);
  qr.make();
  // SVG with a white background and black modules
  const cellSize = 4;
  const margin = 4;
  const count = qr.getModuleCount();
  const size = (count + margin * 2) * cellSize;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">`;
  svg += `<rect width="${size}" height="${size}" fill="#ffffff"/>`;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        const x = (col + margin) * cellSize;
        const y = (row + margin) * cellSize;
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
      }
    }
  }
  svg += '</svg>';
  return svg;
}

function registerHelpers(): void {
  // Helper used by @fifthbell/brokaw instagram-image.hbs when a URL is
  // provided instead of pre-rendered QR HTML.
  Handlebars.registerHelper('instagramQrCode', (url: string) => {
    if (!url) return '';
    const svg = renderQrCodeSvg(url);
    return `<div class="qr-container"><div class="qr-code">${svg}</div></div>`;
  });
}

export function HandlebarsTemplateComponent({ source, width, height, ...data }: HandlebarsTemplateComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const html = useMemo(() => {
    registerHelpers();
    const template = Handlebars.compile(source);
    return template(data);
  }, [source, data]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title='Handlebars template preview'
      style={{
        width,
        height,
        border: 'none',
        display: 'block'
      }}
    />
  );
}
