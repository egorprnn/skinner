import { createZodDto } from 'nestjs-zod';

import { AuthUrlSchema } from '../schema/auth-url.schema';

export class AuthUrlDto extends createZodDto(AuthUrlSchema) {}
