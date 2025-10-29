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
      react(
        command === 'serve'
          ? { 
              babel: { 
                plugins: [babelPlugin]
              } 
            }
          : {}
      ),
    ],
    server: {
      port: 5175,
      open: true,
      hmr: { overlay: true }
    }
  };
});
