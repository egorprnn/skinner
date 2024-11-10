import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

import { JWTTokenType } from './auth.dto';
import { AuthAccessTokenUserSchema } from './auth-access-token-user.dto';

export const AuthRefreshTokenUserSchema = AuthAccessTokenUserSchema.pick({
  microsoft_id: true,
  iat: true,
  exp: true,
}).extend({
  typ: z.literal(JWTTokenType.REFRESH_TOKEN, {
    description: 'JWT Token Type',
  }),
});

export class AuthRefreshTokenUserDto extends createZodDto(AuthRefreshTokenUserSchema) {}
