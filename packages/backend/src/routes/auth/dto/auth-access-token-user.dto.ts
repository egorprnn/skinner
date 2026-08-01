import { createZodDto } from 'nestjs-zod';

import { AuthAccessTokenUserSchema } from '../schema/auth-access-token-user.schema';

export class AuthAccessTokenUserDto extends createZodDto(AuthAccessTokenUserSchema) {}
