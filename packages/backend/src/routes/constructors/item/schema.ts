import { constructorItemSchema } from '../../../db/entities/constructorItem/schema';
import { constructorCategorySchema } from '../../../db/entities/constructorCategory/schema';

export const constructorsItemPutSchema = constructorItemSchema
  .omit({
    id: true,
  })
  .extend({
    category: constructorCategorySchema.shape.id.describe('Item category id'),
  });
