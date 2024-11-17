import type { Context } from 'hono';
import { ZodSerializerDto } from 'nestjs-zod';
import type { AuthenticationResult } from '@azure/msal-node';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiException } from '../../decorators/api-exception.decorator';
import { ApiGlobalExceptions } from '../../decorators/api-global-exceptions.decorator';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JWTTokenType } from './dto/auth.dto';
import { UserDto } from '../user/dto/user.dto';
import { AuthUrlDto } from './dto/auth-url.dto';
import { UserService } from '../user/user.service';
import { AuthMicrosoftDto } from './dto/auth-microsoft.dto';
import { AuthInvalidCodeException } from './error/auth-invalid-code.error';
import { AuthEmptyLoginUrlException } from './error/auth-empty-login-url.error';
import { AuthEmptyMicrosoftAccountException } from './error/auth-empty-microsoft-account.error';

import type { DeepNonNullable } from '../../types/deep-non-nullable';

@Controller('auth')
@ApiGlobalExceptions()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @AuthGuard.Skip()
  @ApiOperation({ summary: 'Returns the URL for authorization via Microsoft' })
  @ApiResponse({ status: 200, type: AuthUrlDto })
  @ApiException(() => [AuthEmptyLoginUrlException])
  async url() {
    const url = await this.authService.generateUrl();

    if (!url) {
      throw new AuthEmptyLoginUrlException();
    }

    return AuthUrlDto.create({
      url,
    });
  }

  @Post()
  @AuthGuard.Skip()
  @ZodSerializerDto(UserDto)
  @ApiOperation({
    summary: 'Authenticates a user or creates a new one if they do not exist using the code received from Microsoft',
  })
  @ApiBody({ type: AuthMicrosoftDto })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiException(() => [AuthInvalidCodeException, AuthEmptyMicrosoftAccountException])
  async microsoft(@Body() authMicrosoftDto: AuthMicrosoftDto, @Res({ passthrough: true }) context: Context) {
    const microsoftAuthenticationResult = await this.authService.processMicrosoftCode(authMicrosoftDto);

    if (!microsoftAuthenticationResult) {
      throw new AuthInvalidCodeException();
    }

    if (!microsoftAuthenticationResult?.account || !microsoftAuthenticationResult?.account?.idTokenClaims) {
      throw new AuthEmptyMicrosoftAccountException();
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

    return UserDto.create(user);
  }

  @Post('/refresh')
  @AuthGuard.AllowedTokenType(JWTTokenType.REFRESH_TOKEN)
  @ApiOperation({
    summary: 'Refreshes the access token using the refresh token and returns the current user with a new set of tokens',
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    headers: {
      'Access-Token': {
        schema: {
          type: 'string',
        },
        required: true,
      },
      'Refresh-Token': {
        schema: {
          type: 'string',
        },
        required: true,
      },
    },
  })
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

    return UserDto.create(user);
  }
}
