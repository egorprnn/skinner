import { createZodDto } from 'nestjs-zod';

import { AuthRefreshTokenUserSchema } from '../schema/auth-refresh-token-user.schema';

export class AuthRefreshTokenUserDto extends createZodDto(AuthRefreshTokenUserSchema) {}
