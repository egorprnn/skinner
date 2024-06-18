import type { Meta } from '@storybook/react';
import type { SkinViewerProps } from './SkinViewer';
import { SkinViewer } from './SkinViewer';

const story: Meta<SkinViewerProps> = {
  id: 'SkinViewer',
  component: SkinViewer,
};

export default story;

export const Base = () => (
  <SkinViewer
    width={200}
    height={200}
    enableRotate
    skin="https://textures.minecraft.net/texture/6ab1ac26197dd5e566c0f47faaf97eb1a55b49d81d2be0d7b0be05abf1165a30"
  />
);
