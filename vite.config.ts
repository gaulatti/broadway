import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BLEECKER_REMOTE_FONT_IMPORT = /^@import url\(['"]https:\/\/fonts\.googleapis\.com\/[^\n]+\);\s*/;
const BLEECKER_STYLES_IMPORT = '@import "@gaulatti/bleecker/styles.base.css";';
const BLEECKER_STYLES_PATH = path.resolve(__dirname, 'node_modules/@gaulatti/bleecker/src/styles/global.css');
const BLEECKER_TOKENS_PATH = path.resolve(__dirname, 'node_modules/@gaulatti/bleecker/src/styles/tokens.generated.css');

function packageBleeckerFontsLocally() {
  return {
    name: 'package-bleecker-fonts-locally',
    enforce: 'pre' as const,
    transform(source: string, id: string) {
      if (!id.endsWith('/app/app.css') || !source.includes(BLEECKER_STYLES_IMPORT)) return null;

      const bleeckerStyles = fs.readFileSync(BLEECKER_STYLES_PATH, 'utf8');
      if (!BLEECKER_REMOTE_FONT_IMPORT.test(bleeckerStyles)) {
        throw new Error('Bleecker global styles no longer contain the expected Google Fonts import. Update Broadway’s local font boundary.');
      }

      const localBleeckerStyles = bleeckerStyles
        .replace(BLEECKER_REMOTE_FONT_IMPORT, '')
        .replace('@import "./tokens.generated.css";', fs.readFileSync(BLEECKER_TOKENS_PATH, 'utf8'))
        .replace('@source "../**/*.{ts,tsx}";', '');
      if (/https:\/\/fonts\.(googleapis|gstatic)\.com/.test(localBleeckerStyles)) {
        throw new Error('Bleecker global styles contain an unexpected remote font dependency.');
      }
      return { code: source.replace(BLEECKER_STYLES_IMPORT, localBleeckerStyles), map: null };
    }
  };
}

function resolveBleeckerEntrypoints() {
  return {
    name: 'resolve-bleecker-entrypoints',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (!importer?.includes('/@gaulatti/bleecker/dist/')) return null;
      if (source === '../core.js' || source === './core.js') {
        return path.resolve(__dirname, 'node_modules/@gaulatti/bleecker/dist/core/index.js');
      }
      if (source === '../tokens.js' || source === './tokens.js') {
        return path.resolve(__dirname, 'node_modules/@gaulatti/bleecker/dist/tokens/index.js');
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [packageBleeckerFontsLocally(), resolveBleeckerEntrypoints(), tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      // Bleecker 0.1.36 emits these imports as files although they are directories.
      // Keep this narrow compatibility alias until the package's ESM output is corrected.
      [path.resolve(__dirname, 'node_modules/@gaulatti/bleecker/dist/core.js')]: path.resolve(
        __dirname,
        'node_modules/@gaulatti/bleecker/dist/core/index.js'
      ),
      [path.resolve(__dirname, 'node_modules/@gaulatti/bleecker/dist/tokens.js')]: path.resolve(
        __dirname,
        'node_modules/@gaulatti/bleecker/dist/tokens/index.js'
      )
    }
  },
  optimizeDeps: {
    include: ['fast-average-color'],
    exclude: ['@gaulatti/bleecker']
  },
  ssr: {
    noExternal: ['@gaulatti/bleecker']
  }
});
