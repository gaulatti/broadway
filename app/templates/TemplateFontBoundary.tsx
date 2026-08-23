import React, { createContext, useContext } from 'react';

import { fontFaceCss, type TemplateFontAsset } from './fontContract';

const TemplateFontsContext = createContext<readonly TemplateFontAsset[] | null>(null);

export function TemplateFontBoundary({ children, fonts }: { children: React.ReactNode; fonts: readonly TemplateFontAsset[] }) {
  return <TemplateFontsContext.Provider value={fonts}><style data-broadway-template-fonts>{fontFaceCss(fonts)}</style>{children}</TemplateFontsContext.Provider>;
}

export function useTemplateFonts(): readonly TemplateFontAsset[] {
  const fonts = useContext(TemplateFontsContext);
  if (!fonts) throw new Error('Template rendering requires a TemplateFontBoundary.');
  return fonts;
}
