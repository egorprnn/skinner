import { Catch, NotFoundException, type ExceptionFilter } from '@nestjs/common';

import { AppUnknownMethodException } from '../error/app-unknown-method.error';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch() {
    throw new AppUnknownMethodException();
  }
}
