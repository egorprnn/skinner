import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AuthUrlSchema = z.object({
  url: z
    .string({
      description: 'Microsoft auth url',
    })
    .min(1),
});

export class AuthUrlDto extends createZodDto(AuthUrlSchema) {}
