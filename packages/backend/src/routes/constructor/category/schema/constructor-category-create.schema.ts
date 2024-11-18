import { z } from 'zod';

import { ConstructorCategorySchema } from './constructor-category.schema';

export const getConstructorCategoryIdMask = (parent?: z.infer<typeof ConstructorCategorySchema>['id']) =>
  new RegExp(
    `^(?:${parent ?? ''}(?:${parent ? '_' : ''}[a-z_]*)?){0,${ConstructorCategorySchema.shape.id.maxLength}}$`,
  );

export const ConstructorCategoryCreateSchema = ConstructorCategorySchema.omit({
  children: true,
})
  .extend({
    parent: ConstructorCategorySchema.shape.id.describe('Parent category ID').optional(),
  })
  .refine(
    ({ id, parent }) => {
      if (parent) {
        return getConstructorCategoryIdMask(parent).test(id) && !id.endsWith('_');
      }

      return true;
    },
    ({ id, parent }) => ({
      message: `Must start with the same prefix as parent id, e.g: ${parent}_${id}`,
      path: ['id'],
    }),
  );
