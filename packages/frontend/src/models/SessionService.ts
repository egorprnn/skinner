import { hc } from 'hono/client';
import { API_URL } from '@skinner/constants';
import type { APIRoutes } from '@skinner/backend';
import { createProvider, scope } from '@skinner/di';
import { makeAutoObservable, runInAction } from 'mobx';
import type { ErrorCode, User } from '@skinner/backend';
import { createSyncStore, SyncAtomType } from '@skinner/browser-store';

import { router } from '../router';

@scope.global()
export class SessionService {
  private _cache = createSyncStore({
    dbName: 'session',
    version: 1,
    storeName: 'session',
  });
  private _userCache = this._cache.createAtom<User>('user', SyncAtomType.OBJECT);
  private _accessTokenCache = this._cache.createAtom<string>('accessToken', SyncAtomType.STRING);

  private _user: User | null = this._userCache.get();
  private _accessToken: string | null = this._accessTokenCache.get();

  private _api = hc<APIRoutes>(API_URL, {
    headers: () => ({
      Authorization: this._accessToken ?? '',
    }),
  });

  private _microsoftAuthUrl = '';
  private _isLoginStarted = false;
  private _isLoginError?: ErrorCode;
  private _isLoadMicrosoftAuthUrlStarted = false;

  constructor() {
    makeAutoObservable(this, {
      // @ts-expect-error
      _api: false,
    });

    this.restore();
  }

  get user() {
    return this._user;
  }

  get accessToken() {
    return this._accessToken;
  }

  get api() {
    return this._api;
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

  restore() {
    this.loadMicrosoftAuthUrl();

    this._api.users.get.$get({
      query: {},
    });
  }

  async loadMicrosoftAuthUrl() {
    if (this._isLoadMicrosoftAuthUrlStarted) {
      return;
    }

    this._isLoadMicrosoftAuthUrlStarted = true;

    const url = await this._api.auth.microsoft
      .$get()
      .then((response) => response.json())
      .then(({ url }) => url)
      .catch(() => '');

    runInAction(() => {
      this._isLoadMicrosoftAuthUrlStarted = false;
      this._microsoftAuthUrl = url;
    });
  }

  async handleMicrosoftCode() {
    if (this._isLoginStarted) {
      return;
    }

    this._isLoginStarted = true;

    const hash = new URLSearchParams(window.location.search.slice(1));

    const code = hash.get('code');

    if (!code) {
      this._isLoginStarted = false;

      router.navigate({
        to: '/',
        replace: true,
      });

      return;
    }

    const { error, accessToken, ...user } = await this._api.auth.microsoft
      .$post({
        json: {
          code,
        },
      })
      .then(async (response) => {
        const user = await response.json();
        const accessToken = response.headers.get('Access-Token')!;

        return {
          ...user,
          accessToken,
        };
      });

    runInAction(() => {
      this._isLoginStarted = false;

      if (error) {
        this._isLoginError = error.code;
      } else {
        this._accessToken = accessToken;
        this._accessTokenCache.set(accessToken);

        this._user = user;
        this._userCache.set(user);

        router.navigate({
          to: '/',
          replace: true,
        });
      }
    });
  }
}

export const { Provider: SessionProvider, useModel: useSession } = createProvider(SessionService);
