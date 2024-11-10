import './instrument';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HonoAdapter, type NestHonoApplication } from '@kiyasov/platform-hono';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';
import { ZodValidationExceptionFilter } from './filters/zod-validation-exception.filter';

const app = await NestFactory.create<NestHonoApplication>(AppModule, new HonoAdapter());

const httpAdapter = app.get(HttpAdapterHost);
app.useGlobalFilters(
  new AllExceptionsFilter(httpAdapter),
  new NotFoundExceptionFilter(),
  new ZodValidationExceptionFilter(),
);

await app.listen(parseInt(process.env['PORT']!) || 3001);
