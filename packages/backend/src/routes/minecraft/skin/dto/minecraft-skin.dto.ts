import { createZodDto } from 'nestjs-zod';

import { MinecraftSkinSchema } from '../schema/minecraft-skin.schema';

export class MinecraftSkinDto extends createZodDto(MinecraftSkinSchema) {}
