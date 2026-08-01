import type { Preview } from '@storybook/react';
import { withVKUIProvider } from '../src/decorators/withVKUIProvider';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['guides', 'components', 'layout', 'modal', 'icons', 'helpers', 'hooks', 'utils', '*'],
      },
    },
  },
  decorators: [withVKUIProvider],
  globalTypes: {
    direction: {
      name: 'Direction',
      description: "Attribute indicating the directionality of the element's text",
      defaultValue: 'ltr',
      toolbar: {
        items: [
          { value: 'ltr', icon: 'menu', title: 'ltr' },
          { value: 'rtl', icon: 'menualt', title: 'rtl' },
        ],
      },
    },
    writingMode: {
      name: 'Writing mode',
      description:
        'Sets whether lines of text are laid out horizontally or vertically, as well as the direction in which blocks progress',
      defaultValue: 'horizontal-tb',
      toolbar: {
        icon: 'redirect',
        items: ['horizontal-tb', 'vertical-rl', 'vertical-lr'],
      },
    },
  },
};

export default preview;
