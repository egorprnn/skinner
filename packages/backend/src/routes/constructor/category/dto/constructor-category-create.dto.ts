import { createZodDto } from 'nestjs-zod';

import { ConstructorCategoryCreateSchema } from '../schema/constructor-category-create.schema';

export class ConstructorCategoryCreateDto extends createZodDto(ConstructorCategoryCreateSchema) {}
