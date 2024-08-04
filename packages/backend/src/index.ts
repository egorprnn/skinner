import * as Sentry from '@sentry/bun';
import { IS_DEVELOPMENT_MODE } from '@skinner/constants';

Sentry.init({
  dsn: process.env['SENTRY_DSN'],
  tracesSampleRate: 1.0,
  beforeSend: (event, hint) => {
    if (IS_DEVELOPMENT_MODE) {
      console.error(hint.originalException || hint.syntheticException);

      return null;
    }

    return event;
  },
});

import 'reflect-metadata';

import { i18nextInitialization } from '@skinner/i18next';

await i18nextInitialization;

import { dataSource } from './db';
import { app, CommonErrorCode } from './hono';

import authMicrosoft, { AuthMicrosoftErrorCode } from './routes/auth/microsoft';

import usersGet, { UsersGetErrorCode } from './routes/users/get';

import constructorCreate from './routes/constructor/create';

const routes = app
  // Auth
  .route('/auth/microsoft', authMicrosoft)
  // Users
  .route('/users/get', usersGet)
  // Constructor
  .route('/constructor/create', constructorCreate);
export type APIRoutes = typeof routes;

await dataSource.initialize();

const port = parseInt(process.env['PORT']!) || 3001;

export default {
  port,
  fetch: app.fetch,
};

export type ErrorCode = CommonErrorCode | AuthMicrosoftErrorCode | UsersGetErrorCode;

export * from './db';
export * from './hono';

export * from './routes/auth/microsoft';

export * from './routes/users/get';

export * from './routes/constructor/create';
