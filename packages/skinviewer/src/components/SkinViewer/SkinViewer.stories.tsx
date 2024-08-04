import { useRef } from 'react';
import type { Meta } from '@storybook/react';
import { SkinViewer, type SkinViewerProps } from './SkinViewer';

import { BedrockAnimation } from '../../utils';

import yawn from '../../assets/bedrockAnimation/yawn.json';

const story: Meta<SkinViewerProps> = {
  id: 'SkinViewer',
  component: SkinViewer,
};

export default story;

export const Base = () => (
  <SkinViewer
    skin="https://textures.minecraft.net/texture/6ab1ac26197dd5e566c0f47faaf97eb1a55b49d81d2be0d7b0be05abf1165a30"
    width={200}
    height={200}
    enableRotate
  />
);

export const WithBedrockAnimation = () => {
  const animation = useRef(new BedrockAnimation(yawn));

  return (
    <SkinViewer
      skin="https://textures.minecraft.net/texture/6ab1ac26197dd5e566c0f47faaf97eb1a55b49d81d2be0d7b0be05abf1165a30"
      width={200}
      height={200}
      animation={animation.current}
      enableRotate
    />
  );
};
