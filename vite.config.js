import { createRequire } from 'module';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);
const babelPlugin = require('./plugins/situ-design/babel-jsx-source-attr.cjs');

export default defineConfig(({ command }) => {
  return {
    base: '/Situ-Design-Demo/',
    resolve: {
      alias: {
        // No @plugins alias needed - we're using bundled scripts
      },
    },
    plugins: [
      // MCP servers removed - demo uses bundled inspector with localStorage
      react({
        // Always use Babel plugin to inject data-source attributes for inspector
        // This is required for inspector overlays to work in production builds
        babel: { 
          plugins: [babelPlugin]
        }
      }),
    ],
    server: {
      port: 5175,
      open: true,
      hmr: { overlay: true }
    }
  };
});
