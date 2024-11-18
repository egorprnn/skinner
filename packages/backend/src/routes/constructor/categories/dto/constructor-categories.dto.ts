import { createZodDto } from 'nestjs-zod';

import { ConstructorCategoriesSchema } from '../schema/constructor-categories.schema';

export class ConstructorCategoriesDto extends createZodDto(ConstructorCategoriesSchema) {}
