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

import auth, { AuthErrorCode } from './routes/auth';

import user from './routes/user';

import usersGet, { UsersGetErrorCode } from './routes/users/get';

import constructorsItem from './routes/constructors/item';
import constructorsCategory from './routes/constructors/category';
import constructorsCategories from './routes/constructors/categories';

const routes = app
  // Auth
  .route('/auth', auth)
  // User
  .route('/user', user)
  // Users
  .route('/users/get', usersGet)
  // Constructors
  .route('/constructors/item', constructorsItem)
  .route('/constructors/category', constructorsCategory)
  .route('/constructors/categories', constructorsCategories);
export type APIRoutes = typeof routes;

await dataSource.initialize();

const port = parseInt(process.env['PORT']!) || 3001;

export default {
  port,
  fetch: app.fetch,
};

export type ErrorCode = CommonErrorCode | AuthErrorCode | UsersGetErrorCode;

export * from './db';
export * from './hono';

export * from './routes/auth';

export * from './routes/user';

export * from './routes/users/get';

export * from './routes/constructors/item';
export * from './routes/constructors/category';
export * from './routes/constructors/categories';
