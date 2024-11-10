import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AuthMicrosoftSchema = z.object({
  code: z
    .string({
      description: 'Microsoft OAuth code',
    })
    .min(1),
});

export class AuthMicrosoftDto extends createZodDto(AuthMicrosoftSchema) {}
