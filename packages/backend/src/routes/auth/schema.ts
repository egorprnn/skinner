import { z } from 'zod';

export const authPostSchema = z.object({
  code: z
    .string({
      description: 'Microsoft OAuth code',
    })
    .min(1)
    .optional(),
});
