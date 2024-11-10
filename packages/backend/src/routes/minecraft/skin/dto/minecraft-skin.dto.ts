import { z } from 'zod';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';

export const MinecraftSkinSchema = z.object({
  id: z.string(),
  variant: z.nativeEnum(MinecraftTextureVariant),
  url: z.string(),
});
