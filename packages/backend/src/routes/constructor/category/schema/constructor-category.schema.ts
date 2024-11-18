import { z } from 'zod';

const ConstructorCategoryBaseSchema = z.object({
  id: z
    .string({
      description: 'ID',
    })
    .min(1)
    .max(32),
});

export const ConstructorCategorySchema = ConstructorCategoryBaseSchema.extend({
  children: z.array(ConstructorCategoryBaseSchema),
});
