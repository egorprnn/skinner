import { BadRequestException } from '@nestjs/common';

export class AppValidationException extends BadRequestException {
  constructor(message: string) {
    super({ error: 'validation_error', message });
  }
}
