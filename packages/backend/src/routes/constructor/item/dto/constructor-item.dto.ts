import { z } from 'zod';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';

export const ConstructorItemSchema = z.object({
  id: z
    .string({
      description: 'ID',
    })
    .min(1)
    .max(64),
  title: z
    .string({
      description: 'Title',
    })
    .min(1)
    .max(64),
  description: z
    .string({
      description: 'Description',
    })
    .min(0)
    .max(256),
  variant: z.enum([MinecraftTextureVariant.CLASSIC, MinecraftTextureVariant.SLIM], {
    description: 'Variant',
  }),
});
