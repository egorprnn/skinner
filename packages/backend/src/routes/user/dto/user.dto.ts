import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

import { MinecraftSkinSchema } from '../../minecraft/skin/dto/minecraft-skin.dto';

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

export class UserDto extends createZodDto(UserSchema) {}
