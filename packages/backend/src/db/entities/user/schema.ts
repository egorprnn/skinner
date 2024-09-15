import { z } from 'zod';

import { minecraftSkinSchema } from '../minecraftSkin/schema';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const userSchema = z.object({
  uuid: z.string({
    description: 'Minecraft UUID',
  }),
  name: z
    .string({
      description: 'Minecraft name',
    })
    .min(1)
    .max(16),
  role: z
    .nativeEnum(UserRole, {
      description: 'User role',
    })
    .default(UserRole.USER),
  minecraft_active_skin: minecraftSkinSchema,
});
