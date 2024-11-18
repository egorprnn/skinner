import { z } from 'zod';

import { JWTTokenType } from './auth.schema';
import { UserSchema } from '../../user/schema/user.schema';

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
