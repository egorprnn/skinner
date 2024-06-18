import 'reflect-metadata';

import { dataSource } from './db';
import { app, CommonErrorCode } from './hono';

import authMicrosoft, { AuthMicrosoftErrorCode } from './routes/auth/microsoft';

import usersGet, { UsersGetErrorCode } from './routes/users/get';

const routes = app.route('/auth/microsoft', authMicrosoft).route('/users/get', usersGet);
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
