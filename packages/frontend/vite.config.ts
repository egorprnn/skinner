import path from 'path';
import svgr from 'vite-plugin-svgr';
import million from 'million/compiler';
import react from '@vitejs/plugin-react-swc';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig(({ command }) => ({
  base: '/',
  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@swc') || id.includes('@babel') || id.includes('tslib')) {
            return 'helpers';
          }

          if (id.includes('three') || id.includes('skinview3d') || id.includes('skinview-utils')) {
            return '3d';
          }

          if (id.includes('@vkontakte') || id.includes('@floating-ui')) {
            return 'vkontakte';
          }

          if (id.includes('i18next') || id.includes('i18next-browser-languagedetector')) {
            return 'i18next';
          }

          if (id.includes('framer-motion')) {
            return 'animations';
          }

          if (id.includes('mobx') || id.includes('mobx-react-lite')) {
            return 'state-management';
          }

          if (id.includes('zod') || id.includes('tsyringe') || id.includes('reflect-metadata')) {
            return 'validation-and-di';
          }

          if (id.includes('node_modules')) {
            return `vendor-${getModuleNameFromPath(id)}`;
          }
        },
      },
    },
  },
  esbuild: {
    target: 'chrome84',
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
    million.vite({
      auto: { rsc: true },
      rsc: true,
      experimental_options: {
        noSlot: true,
      },
    }),
    command === 'build' ? typescript() : undefined,
    react({
      tsDecorators: command !== 'build',
    }),
    TanStackRouterVite({
      routeFilePrefix: '~',
    }),
    imagetools(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, '..', 'i18next', 'locales'),
          dest: './i18next',
        },
      ],
    }),
  ],
}));

function getModuleNameFromPath(absolutePath: string) {
  const parts = absolutePath.split(path.sep);
  const nodeModulesIndex = parts.lastIndexOf('node_modules');

  if (nodeModulesIndex !== -1 && parts[nodeModulesIndex + 1]) {
    /*if (moduleName.startsWith('@') && parts[nodeModulesIndex + 2]) {
      return `${moduleName}/${parts[nodeModulesIndex + 2]}`;
    }*/

    return parts[nodeModulesIndex + 1];
  }

  return 'vendor';
}
