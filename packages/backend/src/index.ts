import './sentry';

import fs from 'fs/promises';
import { NestFactory } from '@nestjs/core';
import { patchNestJsSwagger } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IS_DEVELOPMENT_MODE, SITE_URL } from '@skinner/constants';
import { HonoAdapter, type NestHonoApplication } from '@kiyasov/platform-hono';

import { AppModule } from './app.module';
import { AuthAccessTokenUserDto } from './routes/auth/dto/auth-access-token-user.dto';
import { ZodValidationExceptionFilter } from './filters/zod-validation-exception.filter';

declare module 'hono' {
  interface HonoRequest {
    user?: AuthAccessTokenUserDto;
    distinctId: string;
  }
}

const app = await NestFactory.create<NestHonoApplication>(AppModule, new HonoAdapter(), {
  logger: IS_DEVELOPMENT_MODE ? ['debug', 'log', 'verbose'] : ['warn', 'error'],
  cors: {
    origin: [SITE_URL],
  },
});

app.useGlobalFilters(new ZodValidationExceptionFilter());

patchNestJsSwagger();

const config = new DocumentBuilder().setTitle('Skinner API').setVersion('1.0').build();

const document = SwaggerModule.createDocument(app, config);

fs.writeFile('./dist/schema.json', JSON.stringify(document));

await app.listen(parseInt(process.env['PORT']!) || 3001);
