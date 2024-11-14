import * as Sentry from '@sentry/nestjs';
import { HttpAdapterHost } from '@nestjs/core';
import { Catch, HttpException, type ExceptionFilter, type ArgumentsHost } from '@nestjs/common';
import { AppInternalException } from '../error/app-internal.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();

    if (!(exception instanceof HttpException)) {
      Sentry.captureException(exception);

      exception = new AppInternalException(exception instanceof Error ? exception.message : exception);
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
