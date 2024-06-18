import svgr from 'vite-plugin-svgr';
import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';

export default defineConfig({
  base: './',
  build: {
    minify: true,
    cssCodeSplit: false,
  },
  esbuild: {
    target: 'chrome64',
    legalComments: 'none',
  },
  server: {
    host: true,
    port: 3000,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      clientPort: 3000,
    },
  },
  optimizeDeps: {
    force: true,
  },
  resolve: {
    alias: [{ find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' }],
  },
  plugins: [
    svgr(),
    million.vite({ auto: true }),
    react(),
    TanStackRouterVite({
      routeFilePrefix: '~',
    }),
    // requireTransform({}),
    optimizeCssModules(),
    imagetools(),
  ],
});
