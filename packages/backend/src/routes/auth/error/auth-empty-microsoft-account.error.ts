import { ForbiddenException } from '@nestjs/common';

export class AuthEmptyMicrosoftAccountException extends ForbiddenException {
  constructor() {
    super({ error: 'empty_microsoft_account', message: "Microsoft account response empty, it probably doesn't exist" });
  }
}
