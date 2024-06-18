import path from 'path';
import type { StorybookConfig } from '@storybook/types';
import type { Configuration, RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx', '../CHANGELOG.mdx'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
      },
    },
    '@storybook/addon-storysource',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      lazyCompilation: true,
    },
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  typescript: {
    check: true,
    // @ts-ignore Неверная типизация модуля
    checkOptions: {
      typescript: {
        configFile: path.resolve('../', '../', 'tsconfig.json'),
        configOverwrite: {
          include: [path.resolve(process.cwd(), 'src', '**', '*')],
        },
      },
    },
    skipCompiler: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop: any) => (prop.parent ? !prop.parent.fileName.includes('react') : true),
    },
  },
  webpackFinal: async (config: Configuration) => {
    config.module?.rules?.push({
      test: /\.stories\.tsx?$/,
      use: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: { parser: 'typescript' },
        },
      ],
      enforce: 'pre',
    });

    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('swc-loader'),
      options: {
        sourceMaps: true,
        jsc: {
          target: 'esnext',
          loose: true,
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
            dynamicImport: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      },
      enforce: 'post',
    });

    const cssRule = findCssRule(config);

    if (cssRule && Array.isArray(cssRule.use)) {
      cssRule.use.push({
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: ['autoprefixer'],
          },
        },
      });
    }

    const cssLoader = findCssLoader(config);

    if (cssLoader && typeof cssLoader === 'object') {
      const options = cssLoader.options as Record<string, any>;

      cssLoader.options = {
        ...options,
        modules: {
          ...options?.['modules'],
          auto: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      };
    }

    config.module?.rules?.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    config.experiments ||= {};
    config.experiments.asyncWebAssembly = true;

    return config;
  },
};

export default config;

function findCssLoader(config: Configuration) {
  const cssRule = findCssRule(config);

  if (!Array.isArray(cssRule?.use)) {
    return;
  }

  return cssRule?.use?.find((rule) => (typeof rule === 'object' ? rule?.loader?.includes('css-loader') : false));
}

function findCssRule(config: Configuration) {
  return config?.module?.rules?.find((rule) =>
    typeof rule === 'object' ? rule?.test?.toString() === '/\\.css$/' : false,
  ) as RuleSetRule | undefined;
}
