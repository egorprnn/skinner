import type { Context } from 'hono';
import { ZodSerializerDto } from 'nestjs-zod';
import type { AuthenticationResult } from '@azure/msal-node';
import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthErrorCode } from './auth.error';
import { JWTTokenType } from './dto/auth.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthMicrosoftDto } from './dto/auth-microsoft.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @AuthGuard.Skip()
  async url() {
    const url = await this.authService.generateUrl();

    if (!url) {
      throw new HttpException(
        {
          code: AuthErrorCode.EMPTY_LOGIN_URL,
          message: 'Empty login url',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      url,
    };
  }

  @Post()
  @AuthGuard.Skip()
  @ZodSerializerDto(UserDto)
  async microsoft(@Body() authMicrosoftDto: AuthMicrosoftDto, @Res({ passthrough: true }) context: Context) {
    const microsoftAuthenticationResult = await this.authService.processMicrosoftCode(authMicrosoftDto);

    if (!microsoftAuthenticationResult) {
      throw new HttpException(
        {
          code: AuthErrorCode.INVALID_CODE,
          message: 'Invalid Microsoft authorization code',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!microsoftAuthenticationResult?.account || !microsoftAuthenticationResult?.account?.idTokenClaims) {
      throw new HttpException(
        {
          code: AuthErrorCode.UNKNOWN,
          message: "Microsoft account response empty, it probably doesn't exist",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.findByMicrosoftAuthenticationResultOrCreate(
      microsoftAuthenticationResult as DeepNonNullable<AuthenticationResult>,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user),
      this.authService.getRefreshToken(user),
    ]);

    context.header('Access-Token', accessToken);
    context.header('Refresh-Token', refreshToken);
    context.header('Access-Control-Expose-Headers', 'Access-Token, Refresh-Token');

    return user;
  }

  @Post('/refresh')
  @AuthGuard.AllowedTokenType(JWTTokenType.REFRESH_TOKEN)
  async refreshToken(@Res({ passthrough: true }) context: Context) {
    const { microsoft_id } = context.req.user!;

    const user = await this.userService.userRepository.findOneOrFail({
      where: {
        microsoft_id,
      },
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.getAccessToken(user),
      this.authService.getRefreshToken(user),
    ]);

    context.header('Access-Token', accessToken);
    context.header('Refresh-Token', refreshToken);
    context.header('Access-Control-Expose-Headers', 'Access-Token, Refresh-Token');

    return user;
  }
}
