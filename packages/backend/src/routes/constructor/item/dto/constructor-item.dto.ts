import { createZodDto } from 'nestjs-zod';

import { ConstructorItemSchema } from '../schema/constructor-item.schema';

export class ConstructorItemDto extends createZodDto(ConstructorItemSchema) {}
