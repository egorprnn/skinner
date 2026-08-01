import { NotFoundException } from '@nestjs/common';

export class AppUnknownMethodException extends NotFoundException {
  constructor() {
    super({ error: 'unknown_method', message: 'Unknown method' });
  }
}
