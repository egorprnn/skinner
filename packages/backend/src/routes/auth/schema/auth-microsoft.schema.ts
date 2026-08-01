import { z } from 'zod';

export const AuthMicrosoftSchema = z.object({
  code: z
    .string({
      description: 'Microsoft OAuth code',
    })
    .min(1),
});
