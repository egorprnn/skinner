import * as Sentry from '@sentry/nestjs';
import type { HonoRequest } from 'hono';
import { PosthogService } from 'nestjs-posthog';
import { AbstractHttpAdapter } from '@nestjs/core';
import {
  Catch,
  Injectable,
  HttpException,
  NotFoundException,
  type ExceptionFilter,
  type ArgumentsHost,
} from '@nestjs/common';

import { AppInternalException } from '../error/app-internal.error';
import { AppUnknownMethodException } from '../error/app-unknown-method.error';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly posthog: PosthogService,
    private readonly httpAdapter: AbstractHttpAdapter,
  ) {}

  catch(exception: HttpException | any, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<HonoRequest>();

    if (exception instanceof NotFoundException) {
      request.distinctId ??= '0';

      exception = new AppUnknownMethodException();
    }

    if (!(exception instanceof HttpException)) {
      Sentry.captureException(exception);

      exception = new AppInternalException(exception instanceof Error ? exception.message : exception);
    }

    const body = exception.getResponse();

    this.posthog.capture({
      distinctId: request.distinctId,
      event: 'api_error',
      properties: body,
    });

    this.httpAdapter.reply(context.getResponse(), body, exception.getStatus());
  }
}
