import { z } from 'zod';

const constructorCategoryBaseSchema = z.object({
  id: z
    .string({
      description: 'ID',
    })
    .min(1)
    .max(32),
});

export const constructorCategorySchema = constructorCategoryBaseSchema.extend({
  children: z.array(constructorCategoryBaseSchema),
});
