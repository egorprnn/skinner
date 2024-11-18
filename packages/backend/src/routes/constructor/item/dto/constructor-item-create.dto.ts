import { createZodDto } from 'nestjs-zod';

import { ConstructorItemCreateSchema } from '../schema/constructor-item-create.schema';

export class ConstructorItemCreateDto extends createZodDto(ConstructorItemCreateSchema) {}
