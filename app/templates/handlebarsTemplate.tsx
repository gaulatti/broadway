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
import { fontFaceCss } from './fontContract';
import { useTemplateFonts } from './TemplateFontBoundary';

export interface HandlebarsTemplateComponentProps {
  source: string;
  width: number;
  height: number;
  [key: string]: unknown;
}

function buildQrCodeHtml(url: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  const qrSvg = qr.createSvgTag(5, 0);
  return `<div class="qr-container"><div class="qr-code" aria-label="QR Code">${qrSvg}</div></div>`;
}

function registerHelpers(): void {
  // Helper used by @fifthbell/brokaw instagram-image.hbs when a URL is
  // provided instead of pre-rendered QR HTML.
  Handlebars.registerHelper('instagramQrCode', (url: string) => {
    if (!url) return '';
    return buildQrCodeHtml(url);
  });
}

export function HandlebarsTemplateComponent({ source, width, height, ...data }: HandlebarsTemplateComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fonts = useTemplateFonts();
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
    const style = doc.createElement('style');
    style.dataset.broadwayTemplateFonts = 'true';
    style.textContent = fontFaceCss(fonts);
    doc.head.appendChild(style);
  }, [fonts, html]);

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
