import { z } from 'zod';

export const authMicrosoftPostSchema = z.object({
  code: z
    .string({
      description: 'Microsoft OAuth code',
    })
    .min(1),
});
