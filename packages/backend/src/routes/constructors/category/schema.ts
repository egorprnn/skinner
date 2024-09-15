import { z } from 'zod';

import { constructorCategorySchema } from '../../../db/entities/constructorCategory/schema';

export const getConstructorCategoryIdMask = (parent?: z.infer<typeof constructorCategorySchema>['id']) =>
  new RegExp(
    `^(?:${parent ?? ''}(?:${parent ? '_' : ''}[a-z_]*)?){0,${constructorCategorySchema.shape.id.maxLength}}$`,
  );

export const constructorCategoryPostSchema = constructorCategorySchema
  .omit({
    children: true,
  })
  .extend({
    parent: constructorCategorySchema.shape.id.describe('Parent category ID').optional(),
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
