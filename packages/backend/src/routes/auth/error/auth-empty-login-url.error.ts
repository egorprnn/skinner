import { ServiceUnavailableException } from '@nestjs/common';

export class AuthEmptyLoginUrlException extends ServiceUnavailableException {
  constructor() {
    super({ error: 'empty_login_url', message: 'Empty login url' });
  }
}
