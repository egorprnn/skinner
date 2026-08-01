import { UnauthorizedException } from '@nestjs/common';

import type { JWTTokenType } from '../schema/auth.schema';

export class AuthInvalidTokenTypeException extends UnauthorizedException {
  constructor(tokenType: JWTTokenType, allowedTokenType: JWTTokenType) {
    super({
      error: 'invalid_token_type',
      message: `${tokenType} cannot be used for route with ${allowedTokenType} authorization`,
    });
  }
}
