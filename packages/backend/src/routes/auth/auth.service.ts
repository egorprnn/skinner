import * as Sentry from '@sentry/nestjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfidentialClientApplication, ProtocolMode } from '@azure/msal-node';
import { MICROSOFT_CLIENT_ID, MICROSOFT_REDIRECT_URL, MICROSOFT_SCOPES } from '@skinner/constants';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JWTTokenType } from './schema/auth.schema';
import { AuthMicrosoftDto } from './dto/auth-microsoft.dto';

@Injectable()
export class AuthService {
  private static readonly MICROSOFT_CLIENT = new ConfidentialClientApplication({
    auth: {
      clientId: MICROSOFT_CLIENT_ID,
      clientSecret: process.env['MICROSOFT_CLIENT_SECRET'],
      authority: 'https://login.microsoftonline.com/consumers/',
      protocolMode: ProtocolMode.AAD,
      knownAuthorities: ['login.live.com'],
    },
  });

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateUrl() {
    try {
      return await AuthService.MICROSOFT_CLIENT.getAuthCodeUrl({
        scopes: MICROSOFT_SCOPES,
        redirectUri: MICROSOFT_REDIRECT_URL,
      });
    } catch (error) {
      Sentry.captureException(error);

      return null;
    }
  }

  async processMicrosoftCode({ code }: AuthMicrosoftDto) {
    try {
      return await AuthService.MICROSOFT_CLIENT.acquireTokenByCode({
        code,
        scopes: MICROSOFT_SCOPES,
        redirectUri: MICROSOFT_REDIRECT_URL,
      });
    } catch (error) {
      Sentry.captureException(error);

      return null;
    }
  }

  getAccessToken(user: User) {
    const tokenCreatedAt = Math.floor(Date.now() / 1_000);

    return this.jwtService.signAsync({
      ...user.toJSON(),
      typ: JWTTokenType.ACCESS_TOKEN,
      iat: tokenCreatedAt,
      exp: 5 * 60 + tokenCreatedAt, // 5 минут
    });
  }

  async getRefreshToken(user: User) {
    const tokenCreatedAt = Math.floor(Date.now() / 1_000);

    user.refresh_token_created_at = tokenCreatedAt;

    const token = await this.jwtService.signAsync({
      microsoft_id: user.microsoft_id,
      typ: JWTTokenType.REFRESH_TOKEN,
      exp: 30 * 24 * 60 * 60 + tokenCreatedAt, // 30 дней
    });

    await this.userService.userRepository.save(user);

    return token;
  }
}
