import { z } from 'zod';

import { JWTTokenType } from './auth.schema';
import { AuthAccessTokenUserSchema } from './auth-access-token-user.schema';

export const AuthRefreshTokenUserSchema = AuthAccessTokenUserSchema.pick({
  microsoft_id: true,
  iat: true,
  exp: true,
}).extend({
  typ: z.literal(JWTTokenType.REFRESH_TOKEN, {
    description: 'JWT Token Type',
  }),
});
