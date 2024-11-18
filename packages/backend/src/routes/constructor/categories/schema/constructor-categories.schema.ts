import { z } from 'zod';

import { ConstructorCategorySchema } from '../../category/schema/constructor-category.schema';

export const ConstructorCategoriesSchema = z.array(ConstructorCategorySchema);
