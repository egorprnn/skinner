import { ZodValidationException } from 'nestjs-zod';
import { Catch, type ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { CommonErrorCode } from './all-exception.filter';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException) {
    throw new HttpException(
      {
        code: CommonErrorCode.VALIDATION_ERROR,
        message: Object.entries(exception.getZodError().flatten().fieldErrors)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', '),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
