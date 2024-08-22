import { constructorItemSchema } from '../../../db/entities/constructorItem/schema';

export const constructorsItemPutSchema = constructorItemSchema.omit({
  id: true,
});
