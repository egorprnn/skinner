import './sentry';

import fs from 'fs/promises';
import { SITE_URL } from '@skinner/constants';
import { patchNestJsSwagger } from 'nestjs-zod';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HonoAdapter, type NestHonoApplication } from '@kiyasov/platform-hono';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';
import { AuthAccessTokenUserDto } from './routes/auth/dto/auth-access-token-user.dto';
import { ZodValidationExceptionFilter } from './filters/zod-validation-exception.filter';

declare module 'hono' {
  interface HonoRequest {
    user?: AuthAccessTokenUserDto;
  }
}

const app = await NestFactory.create<NestHonoApplication>(AppModule, new HonoAdapter(), {
  cors: {
    origin: [SITE_URL],
  },
});

const httpAdapter = app.get(HttpAdapterHost);
app.useGlobalFilters(
  new AllExceptionsFilter(httpAdapter),
  new NotFoundExceptionFilter(),
  new ZodValidationExceptionFilter(),
);

patchNestJsSwagger();

const config = new DocumentBuilder().setTitle('Skinner API').setVersion('1.0').build();

const document = SwaggerModule.createDocument(app, config);

fs.writeFile('./dist/schema.json', JSON.stringify(document));

await app.listen(parseInt(process.env['PORT']!) || 3001);
