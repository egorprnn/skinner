import { constructorCategorySchema } from '../../../db/entities/constructorCategory/schema';

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
        return id.startsWith(`${parent}_`);
      }

      return true;
    },
    ({ id, parent }) => ({
      message: `Must start with the same prefix as parent id, e.g: ${parent}_${id}`,
      path: ['id'],
    }),
  );
