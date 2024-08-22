import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { zValidator, HTTPException } from '@skinner/hono';
import { ConfidentialClientApplication, ProtocolMode } from '@azure/msal-node';
import { MICROSOFT_CLIENT_ID, MICROSOFT_REDIRECT_URL, MICROSOFT_SCOPES } from '@skinner/constants';

import { AuthMicrosoftErrorCode } from './error';
import { authMicrosoftPostSchema } from './schema';
import { User, dataSource, userRepository } from '../../../db';

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
          code: AuthMicrosoftErrorCode.EMPTY_LOGIN_URL,
          message: 'Empty login url',
        },
        500,
      );
    }

    return context.json({
      url,
    });
  })
  .post('/', zValidator('json', authMicrosoftPostSchema), async (context) => {
    const { code } = context.req.valid('json');

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
          code: AuthMicrosoftErrorCode.INVALID_CODE,
          message: 'Invalid Microsoft authorization code',
        },
        403,
      );
    }

    if (!microsoftTokenResponse?.account || !microsoftTokenResponse?.account?.idTokenClaims) {
      throw new HTTPException(
        {
          code: AuthMicrosoftErrorCode.UNKNOWN,
          message: "Microsoft account response empty, it probably doesn't exist",
        },
        403,
      );
    }

    const {
      account: { localAccountId },
      accessToken,
    } = microsoftTokenResponse;

    let user = new User();

    user.microsoft_id = localAccountId;
    user.minecraft_access_token = accessToken;

    await user.syncMinecraftProfile();

    await dataSource.manager.save(user);

    user =
      (await userRepository.findOne({
        where: {
          microsoft_id: localAccountId,
        },
      })) || user;

    const tokenCreatedAt = Math.floor(Date.now() / 1_000);

    // todo обнуление токенов при разлогине, обновлении прав
    const token = await sign(
      {
        ...user,
        iat: tokenCreatedAt,
        exp: 30 * 24 * 60 * 60 + tokenCreatedAt, // 30 дней
      },
      process.env['JWT_SECRET']!,
    );

    context.header('Access-Token', token);
    context.header('Access-Control-Expose-Headers', 'Access-Token');

    return context.json(user);
  });

export default app;

export * from './error';
