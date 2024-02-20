import { env } from './utils';

export const IS_DEVELOPMENT_MODE = env['MODE'] === 'development';

export const SITE_URL =
  typeof location !== 'undefined'
    ? location.origin
    : IS_DEVELOPMENT_MODE
      ? 'http://localhost:3000'
      : 'https://sknnr.co';

export const API_URL = IS_DEVELOPMENT_MODE ? 'http://localhost:3001' : 'https://api.sknnr.co';

export const MICROSOFT_CLIENT_ID = '86d39ce1-b1b0-4e02-9ead-d1a06575da59';
export const MICROSOFT_SCOPES = ['openid', 'profile', 'offline_access', 'XboxLive.signin'];
export const MICROSOFT_REDIRECT_URL = new URL('connections/microsoft', SITE_URL).toString();
