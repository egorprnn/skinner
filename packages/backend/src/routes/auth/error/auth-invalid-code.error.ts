import { ForbiddenException } from '@nestjs/common';

export class AuthInvalidCodeException extends ForbiddenException {
  constructor() {
    super({ error: 'invalid_code', message: 'Invalid Microsoft authorization code' });
  }
}
