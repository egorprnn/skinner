import { randomUUID } from 'crypto';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Context, HonoRequest } from 'hono';
import type { PosthogService } from 'nestjs-posthog';
import { type CanActivate, type ExecutionContext, Inject, Injectable, SetMetadata } from '@nestjs/common';

import { JWTTokenType } from './schema/auth.schema';
import { AuthAccessTokenUserDto } from './dto/auth-access-token-user.dto';
import { AuthInvalidTokenException } from './error/auth-invalid-token.error';
import { AuthRequiredAuthException } from './error/auth-required-auth.error';
import { AuthInvalidTokenTypeException } from './error/auth-invalid-token-type.error';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly SKIP_KEY = 'skipAuth';
  static readonly Skip = () => SetMetadata(AuthGuard.SKIP_KEY, true);

  private static readonly ALLOWED_TOKEN_TYPE_KEY = 'authAllowedTokenType';
  static readonly AllowedTokenType = (type: JWTTokenType) => SetMetadata(AuthGuard.ALLOWED_TOKEN_TYPE_KEY, type);

  constructor(
    @Inject('PosthogClient') private readonly posthog: PosthogService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const hasSkip = this.reflector.getAllAndOverride<boolean>(AuthGuard.SKIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const http = context.switchToHttp();
    const request = http.getRequest<HonoRequest>();
    const response = http.getResponse<Context>();

    let distinctId = request.header('Distinct-Id');

    if (!distinctId) {
      distinctId = randomUUID();

      response.header('Distinct-Id', distinctId);
      response.header('Access-Control-Expose-Headers', 'Distinct-Id');
    }

    request.distinctId = distinctId;

    if (hasSkip) {
      return true;
    }

    const [, token] = request.header('Authorization')?.split(' ') ?? [];

    if (!token) {
      throw new AuthRequiredAuthException();
    }

    const allowedTokenType =
      this.reflector.getAllAndOverride<JWTTokenType>(AuthGuard.ALLOWED_TOKEN_TYPE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? JWTTokenType.ACCESS_TOKEN;

    try {
      request.user = await this.jwtService.verifyAsync<AuthAccessTokenUserDto>(token, {
        secret: process.env['JWT_SECRET']!,
      });

      this.posthog.alias({
        distinctId: request.distinctId,
        alias: request.user.microsoft_id,
      });

      request.distinctId = request.user.microsoft_id;
    } catch (error) {
      throw new AuthInvalidTokenException(allowedTokenType);
    }

    if (request.user.typ !== allowedTokenType) {
      throw new AuthInvalidTokenTypeException(request.user.typ, allowedTokenType);
    }

    return true;
  }
}
