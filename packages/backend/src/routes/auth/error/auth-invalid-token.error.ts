import { UnauthorizedException } from '@nestjs/common';

import type { JWTTokenType } from '../schema/auth.schema';

export class AuthInvalidTokenException extends UnauthorizedException {
  constructor(tokenType: JWTTokenType) {
    super({ error: 'invalid_token', message: `Invalid ${tokenType}` });
  }
}
