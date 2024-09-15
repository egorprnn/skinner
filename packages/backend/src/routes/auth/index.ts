import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { zValidator, HTTPException, JWTTokenType } from '@skinner/hono';
import { ConfidentialClientApplication, ProtocolMode } from '@azure/msal-node';
import { MICROSOFT_CLIENT_ID, MICROSOFT_REDIRECT_URL, MICROSOFT_SCOPES } from '@skinner/constants';

import { AuthErrorCode } from './error';
import { authPostSchema } from './schema';
import { User, dataSource, userRepository } from '../../db';

const client = new ConfidentialClientApplication({
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    clientSecret: process.env['MICROSOFT_CLIENT_SECRET'],
    authority: 'https://login.microsoftonline.com/consumers/',
    protocolMode: ProtocolMode.AAD,
    knownAuthorities: ['login.live.com'],
  },
});

const app = new Hono()
  .get('/', async (context) => {
    const url = await client
      .getAuthCodeUrl({
        scopes: MICROSOFT_SCOPES,
        redirectUri: MICROSOFT_REDIRECT_URL,
      })
      .catch((error) => {
        context.get('sentry').captureException(error);

        return null;
      });

    if (!url) {
      throw new HTTPException(
        {
          code: AuthErrorCode.EMPTY_LOGIN_URL,
          message: 'Empty login url',
        },
        500,
      );
    }

    return context.json({
      url,
    });
  })
  .post('/', zValidator('json', authPostSchema), async (context) => {
    const jwtPayload = context.get('jwtPayload');
    const { code } = context.req.valid('json');

    let user = new User();

    const tokenCreatedAt = Math.floor(Date.now() / 1_000);

    if (code) {
      const microsoftTokenResponse = await client
        .acquireTokenByCode({
          code,
          scopes: MICROSOFT_SCOPES,
          redirectUri: MICROSOFT_REDIRECT_URL,
        })
        .catch((error) => {
          context.get('sentry').captureException(error);

          return null;
        });

      if (!microsoftTokenResponse) {
        throw new HTTPException(
          {
            code: AuthErrorCode.INVALID_CODE,
            message: 'Invalid Microsoft authorization code',
          },
          403,
        );
      }

      if (!microsoftTokenResponse?.account || !microsoftTokenResponse?.account?.idTokenClaims) {
        throw new HTTPException(
          {
            code: AuthErrorCode.UNKNOWN,
            message: "Microsoft account response empty, it probably doesn't exist",
          },
          403,
        );
      }

      const {
        account: { localAccountId },
        accessToken,
      } = microsoftTokenResponse;

      user.microsoft_id = localAccountId;
      user.minecraft_access_token = accessToken;
      user.refresh_token_created_at = tokenCreatedAt;

      await user.syncMinecraftProfile();

      await dataSource.manager.save(user);

      user =
        (await userRepository.findOne({
          where: {
            microsoft_id: localAccountId,
          },
        })) || user;
    } else if (jwtPayload?.typ === JWTTokenType.REFRESH_TOKEN) {
      const { microsoft_id, iat } = jwtPayload;

      user =
        (await userRepository.findOne({
          where: {
            microsoft_id,
          },
        })) || user;

      if (user.refresh_token_created_at > iat) {
        throw new HTTPException(
          {
            code: AuthErrorCode.REFRESH_TOKEN_EXPIRED,
            message: 'Refresh token expired',
          },
          401,
        );
      }

      user.refresh_token_created_at = tokenCreatedAt;

      await dataSource.manager.save(user);
    } else {
      throw new HTTPException(
        {
          code: AuthErrorCode.INVALID_REFRESH_TOKEN,
          message: 'Invalid refresh token',
        },
        401,
      );
    }

    const { microsoft_id } = user;

    const [accessToken, refreshToken] = await Promise.all([
      sign(
        {
          ...user,
          typ: JWTTokenType.ACCESS_TOKEN,
          iat: tokenCreatedAt,
          exp: 5 * 60 + tokenCreatedAt, // 5 минут
        },
        process.env['JWT_SECRET']!,
      ),
      sign(
        {
          microsoft_id,
          typ: JWTTokenType.REFRESH_TOKEN,
          iat: tokenCreatedAt,
          exp: 30 * 24 * 60 * 60 + tokenCreatedAt, // 30 дней
        },
        process.env['JWT_SECRET']!,
      ),
    ]);

    context.header('Access-Token', accessToken);
    context.header('Refresh-Token', refreshToken);
    context.header('Access-Control-Expose-Headers', 'Access-Token, Refresh-Token');

    return context.json(user);
  });

export default app;

export * from './error';
