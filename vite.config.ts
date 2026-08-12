import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  plugins: [resolveBleeckerEntrypoints(), tailwindcss(), reactRouter(), tsconfigPaths()],
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
