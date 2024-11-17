import createClient from 'openapi-fetch';
import { API_URL } from '@skinner/constants';
import { makeAutoObservable, runInAction } from 'mobx';
import { createProvider, init, scope } from '@skinner/di';
import { type APIPaths, type APISchemas } from '@skinner/api-schema';
import { createSyncStore, SyncAtomType } from '@skinner/browser-store';
import { AuthInvalidTokenException } from '@skinner/backend/src/routes/auth/error/auth-invalid-token.error';

import { router } from '../router';

@scope.global()
export class SessionService {
  private _cache = createSyncStore({
    dbName: 'session',
    version: 1,
    storeName: 'session',
  });
  private _userCache = this._cache.createAtom<APISchemas['UserDto']>('user', SyncAtomType.OBJECT);
  private _accessTokenCache = this._cache.createAtom<string>('accessToken', SyncAtomType.STRING);
  private _refreshTokenCache = this._cache.createAtom<string>('refreshToken', SyncAtomType.STRING);

  private _user = this._userCache.get();
  private _accessToken: string | null = this._accessTokenCache.get();
  private _refreshToken: string | null = this._refreshTokenCache.get();

  private _refreshTokenPromise: Promise<void> | null = null;

  private _microsoftAuthUrl = '';
  private _isLoginStarted = false;
  private _isLoginError?: string;
  private _isLoadMicrosoftAuthUrlStarted = false;

  readonly api = createClient<APIPaths>({
    baseUrl: API_URL,
    fetch: async (request) => {
      if (this._accessToken && !request.headers.has('Authorization')) {
        request.headers.set('Authorization', `Bearer ${this._accessToken}`);
      }

      const response = await fetch(request.clone());

      const data = await response.json();
      const { error } = data;

      if (error === AuthInvalidTokenException.CODE && this._refreshToken) {
        if (!this._refreshTokenPromise) {
          this._refreshTokenPromise = this._auth();
        }

        await this._refreshTokenPromise;

        this._refreshTokenPromise = null;

        if (!this._isLoginError) {
          request.headers.set('Authorization', `Bearer ${this._accessToken}`);

          return fetch(request);
        }

        if (this._isLoginError === AuthInvalidTokenException.CODE) {
          this.logout();
        }
      }

      response.json = () => Promise.resolve(data);

      return response;
    },
  });

  constructor() {
    makeAutoObservable(this, {
      api: false,
    });
  }

  get user() {
    return this._user;
  }

  get accessToken() {
    return this._accessToken;
  }

  get authed() {
    return Boolean(this._accessToken || this._user);
  }

  get isLoginStarted() {
    return this._isLoginStarted;
  }

  get isLoginError() {
    return this._isLoginError;
  }

  get microsoftAuthUrl() {
    return this._microsoftAuthUrl;
  }

  logout() {
    this._user = null;
    this._accessToken = null;
    this._refreshToken = null;

    this._userCache.delete();
    this._accessTokenCache.delete();
    this._refreshTokenCache.delete();

    // todo snackbar

    this.loadMicrosoftAuthUrl();

    router.navigate({
      to: '/',
      replace: true,
    });
  }

  async loadMicrosoftAuthUrl() {
    if (this._isLoadMicrosoftAuthUrlStarted) {
      return;
    }

    this._isLoadMicrosoftAuthUrlStarted = true;

    const url = await this.api.GET('/auth').then(({ data }) => data?.url);

    runInAction(() => {
      this._isLoadMicrosoftAuthUrlStarted = false;
    });

    if (!url) {
      return;
    }

    runInAction(() => {
      this._microsoftAuthUrl = url;
    });
  }

  async handleMicrosoftCode() {
    const hash = new URLSearchParams(window.location.search.slice(1));

    const code = hash.get('code');

    if (!code) {
      router.navigate({
        to: '/',
        replace: true,
      });

      return;
    }

    await this._auth({
      code,
    });

    if (!this._isLoginError) {
      router.navigate({
        to: '/',
        replace: true,
      });
    }
  }

  [init]() {
    this.loadMicrosoftAuthUrl();
  }

  private async _auth(authMicrosoftDto?: APISchemas['AuthMicrosoftDto']) {
    console.log(this._isLoginStarted);
    if (this._isLoginStarted) {
      return;
    }

    this._isLoginError = undefined;
    this._isLoginStarted = true;

    const { data, error, accessToken, refreshToken } = await (
      authMicrosoftDto
        ? this.api.POST('/auth', {
            body: authMicrosoftDto,
          })
        : this.api.POST('/auth/refresh', {
            headers: {
              Authorization: `Bearer ${this._refreshToken}`,
            },
          })
    ).then(({ data, error, response }) => {
      const accessToken = response.headers.get('Access-Token');
      const refreshToken = response.headers.get('Refresh-Token');

      return {
        data,
        error,
        accessToken,
        refreshToken,
      };
    });

    runInAction(() => {
      this._isLoginStarted = false;

      if (error || !data) {
        this._isLoginError = error?.error;
      } else {
        this._accessToken = accessToken;
        this._refreshToken = refreshToken;

        if (accessToken) {
          this._accessTokenCache.set(accessToken);
        }

        if (refreshToken) {
          this._refreshTokenCache.set(refreshToken);
        }

        this._user = data;
        this._userCache.set(data);
      }
    });
  }
}

export const { Provider: SessionProvider, useModel: useSession } = createProvider(SessionService);
