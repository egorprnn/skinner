import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

import { JWTTokenType } from './auth.dto';
import { UserSchema } from '../../user/dto/user.dto';

export const AuthAccessTokenUserSchema = UserSchema.extend({
  typ: z.literal(JWTTokenType.ACCESS_TOKEN, {
    description: 'JWT Token Type',
  }),
  iat: z.number({
    description: 'JWT Token issued time',
  }),
  exp: z.number({
    description: 'JWT Token expiration time',
  }),
});

export class AuthAccessTokenUserDto extends createZodDto(AuthAccessTokenUserSchema) {}
