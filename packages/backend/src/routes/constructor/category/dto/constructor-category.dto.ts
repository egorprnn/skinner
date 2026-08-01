import { createZodDto } from 'nestjs-zod';

import { ConstructorCategorySchema } from '../schema/constructor-category.schema';

export class ConstructorCategoryDto extends createZodDto(ConstructorCategorySchema) {}
