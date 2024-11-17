import { z } from 'zod';

import { ConstructorCategorySchema } from '../../category/dto/constructor-category.dto';
import { createZodDto } from 'nestjs-zod';

const ConstructorCategoriesSchema = z.array(ConstructorCategorySchema);

export class ConstructorCategoriesDto extends createZodDto(ConstructorCategoriesSchema) {}
