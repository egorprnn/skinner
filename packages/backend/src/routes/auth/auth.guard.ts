import type { HonoRequest } from 'hono';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  type CanActivate,
  type ExecutionContext,
  HttpStatus,
  Injectable,
  SetMetadata,
  HttpException,
} from '@nestjs/common';

import { JWTTokenType } from './dto/auth.dto';
import { CommonErrorCode } from '../../filters/all-exception.filter';
import { AuthAccessTokenUserDto } from './dto/auth-access-token-user.dto';

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
      throw new HttpException(
        {
          code: CommonErrorCode.INVALID_ACCESS_TOKEN,
          message: 'This method required authorization',
        },
        HttpStatus.UNAUTHORIZED,
      );
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
    } catch {
      throw new HttpException(
        {
          code: CommonErrorCode.INVALID_ACCESS_TOKEN,
          message: `Invalid ${allowedTokenType}`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (request.user.typ !== allowedTokenType) {
      throw new HttpException(
        {
          code: CommonErrorCode.INVALID_ACCESS_TOKEN,
          message: `${request.user.typ} cannot be used for route with ${allowedTokenType} authorization`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
