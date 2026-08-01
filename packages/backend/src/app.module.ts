import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@sentry/nestjs/setup';
import { PosthogService, PosthogModule } from 'nestjs-posthog';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, HttpAdapterHost } from '@nestjs/core';

import { ConstructorItemModule } from './routes/constructor/item/constructor-item.module';
import { ConstructorItemsModule } from './routes/constructor/items/constructor-items.module';
import { ConstructorCategoryModule } from './routes/constructor/category/constructor-category.module';
import { ConstructorCategoriesModule } from './routes/constructor/categories/constructor-categories.module';
import { MinecraftCapeModule } from './routes/minecraft/cape/minecraft-cape.module';
import { MinecraftSkinModule } from './routes/minecraft/skin/minecraft-skin.module';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './routes/auth/auth.module';

import { AllExceptionsFilter } from './filters/all-exception.filter';

@Module({
  imports: [
    SentryModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env['DB_URL'],
      ...(!process.env['DB_URL'] && {
        host: process.env['DB_HOST'],
        port: Number(process.env['DB_PORT']),
        username: process.env['DB_USERNAME'],
        password: process.env['DB_PASSWORD'],
        database: process.env['DB_NAME'],
      }),
      synchronize: true,
      autoLoadEntities: true,
    }),
    PosthogModule.forRootAsync({
      useFactory: () => ({
        apiKey: process.env['POSTHOG_API_KEY']!,
        options: {
          host: 'https://pe.nnstd.dev',
        },
        mock: false,
      }),
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET']!,
    }),
    AuthModule,
    UserModule,
    ConstructorCategoriesModule,
    ConstructorCategoryModule,
    ConstructorItemsModule,
    ConstructorItemModule,
    MinecraftCapeModule,
    MinecraftSkinModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useFactory: (posthog: PosthogService, httpAdapterHost: HttpAdapterHost) =>
        new AllExceptionsFilter(posthog, httpAdapterHost.httpAdapter),
      inject: [PosthogService, HttpAdapterHost],
    },
  ],
})
export class AppModule {}
