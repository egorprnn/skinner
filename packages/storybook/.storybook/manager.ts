import { addons } from '@storybook/manager-api';
import type { StoryAnnotations } from '@storybook/types';

addons.setConfig({
  sidebar: {
    renderLabel: (item: StoryAnnotations) => item.name,
  },
});
