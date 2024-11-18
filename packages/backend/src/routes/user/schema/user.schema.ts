import { z } from 'zod';

import { MinecraftSkinSchema } from '../../minecraft/skin/schema/minecraft-skin.schema';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const UserSchema = z.object({
  microsoft_id: z.string({
    description: 'Microsoft ID',
  }),
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
  minecraft_active_skin: MinecraftSkinSchema,
});
