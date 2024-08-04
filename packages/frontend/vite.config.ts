import path from 'path';
import svgr from 'vite-plugin-svgr';
import million from 'million/compiler';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';

export default defineConfig({
  base: '/',
  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return `vendor-${getModuleNameFromPath(id)}`;
          }
        },
      },
    },
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
    million.vite({
      auto: { rsc: true },
      rsc: true,
      experimental_options: {
        noSlot: true,
      },
    }),
    react({
      tsDecorators: true,
    }),
    TanStackRouterVite({
      routeFilePrefix: '~',
    }),
    optimizeCssModules(),
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
});

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
