import { createZodDto } from 'nestjs-zod';

import { AuthMicrosoftSchema } from '../schema/auth-microsoft.schema';

export class AuthMicrosoftDto extends createZodDto(AuthMicrosoftSchema) {}
