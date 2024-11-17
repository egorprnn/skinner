import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@sentry/nestjs/setup';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { ConstructorItemModule } from './routes/constructor/item/constructor-item.module';
import { ConstructorCategoryModule } from './routes/constructor/category/constructor-category.module';
import { ConstructorCategoriesModule } from './routes/constructor/categories/constructor-categories.module';
import { MinecraftCapeModule } from './routes/minecraft/cape/minecraft-cape.module';
import { MinecraftSkinModule } from './routes/minecraft/skin/minecraft-skin.module';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_NAME'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET']!,
    }),
    AuthModule,
    UserModule,
    ConstructorCategoriesModule,
    ConstructorCategoryModule,
    ConstructorItemModule,
    MinecraftCapeModule,
    MinecraftSkinModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
