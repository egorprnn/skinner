import type { Meta } from '@storybook/react';
import type { MinecraftAvatarProps } from './MinecraftAvatar';
import { MinecraftAvatar } from './MinecraftAvatar';

const story: Meta<MinecraftAvatarProps> = {
  id: 'MinecraftAvatar',
  component: MinecraftAvatar,
};

export default story;

export const Base = () => (
  <MinecraftAvatar
    size={200}
    url="https://textures.minecraft.net/texture/6ab1ac26197dd5e566c0f47faaf97eb1a55b49d81d2be0d7b0be05abf1165a30"
  />
);
