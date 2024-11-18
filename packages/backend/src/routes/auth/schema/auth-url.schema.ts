import { z } from 'zod';

export const AuthUrlSchema = z.object({
  url: z
    .string({
      description: 'Microsoft auth url',
    })
    .min(1),
});
