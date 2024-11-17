import { UnauthorizedException } from '@nestjs/common';

import type { JWTTokenType } from '../dto/auth.dto';

export class AuthInvalidTokenException extends UnauthorizedException {
  static readonly CODE = 'invalid_token';

  constructor(tokenType: JWTTokenType) {
    super({ error: AuthInvalidTokenException.CODE, message: `Invalid ${tokenType}` });
  }
}
