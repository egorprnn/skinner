import { UnauthorizedException } from '@nestjs/common';

export class AuthRequiredAuthException extends UnauthorizedException {
  constructor() {
    super({ error: 'required_auth', message: 'This method required authorization' });
  }
}
