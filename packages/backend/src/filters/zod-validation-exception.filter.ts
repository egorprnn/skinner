import { ZodValidationException } from 'nestjs-zod';
import { Catch, type ExceptionFilter } from '@nestjs/common';

import { AppValidationException } from '../error/app-validation.error';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException) {
    throw new AppValidationException(
      Object.entries(exception.getZodError().flatten().fieldErrors)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', '),
    );
  }
}
