import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { spawnSync } from 'child_process';
import { componentTagger } from 'lovable-tagger';

/** Watches content/**\/*.md and re-runs compile.cjs on changes, then full-reloads. */
function contentWatcher(): Plugin {
  return {
    name: 'content-watcher',
    configureServer(server) {
      const contentGlob = path.resolve(__dirname, 'content/**/*.md');
      server.watcher.add(contentGlob);

      server.watcher.on('change', (file) => {
        if (!file.endsWith('.md')) return;

        server.config.logger.info(
          `[content-watcher] ${path.relative(__dirname, file)} changed — recompiling...`,
        );

        const result = spawnSync('bun', ['scripts/compile.cjs'], {
          cwd: __dirname,
          stdio: 'inherit',
        });

        if (result.status !== 0) {
          server.config.logger.error('[content-watcher] compile.cjs failed');
          return;
        }

        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    contentWatcher(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    },
  },
}));
