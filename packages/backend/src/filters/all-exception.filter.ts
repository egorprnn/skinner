import * as Sentry from '@sentry/nestjs';
import { HttpAdapterHost } from '@nestjs/core';
import { Catch, HttpException, HttpStatus, type ExceptionFilter, type ArgumentsHost } from '@nestjs/common';

export const enum CommonErrorCode {
  COMMON = 'common',
  INTERNAL = 'internal',
  UNKNOWN_METHOD = 'unknown_method',
  VALIDATION_ERROR = 'validation_error',
  INVALID_ACCESS_TOKEN = 'invalid_access_token',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();

    if (!(exception instanceof HttpException)) {
      Sentry.captureException(exception);

      exception = new HttpException(
        {
          code: CommonErrorCode.INTERNAL,
          message: exception instanceof Error ? exception.message : exception,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    httpAdapter.reply(
      context.getResponse(),
      {
        error: exception.getResponse(),
      },
      exception.getStatus(),
    );
  }
}
