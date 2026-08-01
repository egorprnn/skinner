import { InternalServerErrorException } from '@nestjs/common';

export class AppInternalException extends InternalServerErrorException {
  constructor(message: string) {
    super({ error: 'internal', message });
  }
}
