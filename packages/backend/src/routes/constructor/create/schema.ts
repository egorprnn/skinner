import { constructorItemSchema } from '../../../db/entities/constructorItem/schema';

export const constructorCreateSchema = constructorItemSchema.omit({
  id: true,
});
