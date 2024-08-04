import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sentry } from '@hono/sentry';
import { IS_DEVELOPMENT_MODE, SITE_URL } from '@skinner/constants';
import { HTTPException } from '@skinner/hono';

export const enum CommonErrorCode {
  COMMON = 'common',
  INTERNAL = 'internal',
  UNKNOWN_METHOD = 'unknown_method',
}

export const app = new Hono();

app.use(
  '*',
  sentry({
    dsn: process.env['SENTRY_DSN'],
  }),
  cors({
    origin: [SITE_URL],
  }),
);

app.onError(async (error, context) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  if (IS_DEVELOPMENT_MODE) {
    console.log(error);
  }

  if (error.constructor.name === 'HTTPException') {
    throw new HTTPException(
      {
        code: CommonErrorCode.COMMON,
        message: await context.res.text(),
      },
      context.res.status as ConstructorParameters<typeof HTTPException>[1],
    );
  }

  context.get('sentry').captureException(error);

  throw new HTTPException(
    {
      code: CommonErrorCode.INTERNAL,
      message: 'Internal server error',
    },
    500,
  );
});

app.notFound(() => {
  throw new HTTPException(
    {
      code: CommonErrorCode.UNKNOWN_METHOD,
      message: 'Unknown method',
    },
    404,
  );
});
