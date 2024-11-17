import type { HonoRequest } from 'hono';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { type CanActivate, type ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';

import { JWTTokenType } from './dto/auth.dto';
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
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const hasSkip = this.reflector.getAllAndOverride<boolean>(AuthGuard.SKIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (hasSkip) {
      return true;
    }

    const request = context.switchToHttp().getRequest<HonoRequest>();
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
    } catch (error) {
      throw new AuthInvalidTokenException(allowedTokenType);
    }

    if (request.user.typ !== allowedTokenType) {
      throw new AuthInvalidTokenTypeException(request.user.typ, allowedTokenType);
    }

    return true;
  }
}
