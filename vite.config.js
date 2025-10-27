import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
                plugins: [[ resolve(__dirname, 'plugins/situ-design/babel-jsx-source-attr.cjs'), {} ]] 
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
