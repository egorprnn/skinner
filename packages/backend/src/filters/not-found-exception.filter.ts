import { Catch, HttpStatus, HttpException, NotFoundException, type ExceptionFilter } from '@nestjs/common';

import { CommonErrorCode } from './all-exception.filter';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch() {
    throw new HttpException(
      {
        code: CommonErrorCode.UNKNOWN_METHOD,
        message: 'Unknown method',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
