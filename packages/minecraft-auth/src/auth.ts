import type {
  MinecraftAuthResponse,
  MinecraftRawProfileResponse,
  XboxLiveAccessData,
  XboxLiveAuthResponse,
  XboxLiveSecurityData,
} from './types';

const XBOX_LIVE_AUTH_ENDPOINT = 'https://user.auth.xboxlive.com/user/authenticate';
const XBOX_LIVE_SECURITY_AUTH_ENDPOINT = 'https://xsts.auth.xboxlive.com/xsts/authorize';
const MINECRAFT_AUTH_ENDPOINT = 'https://api.minecraftservices.com/authentication/login_with_xbox';
const MINECRAFT_PROFILE_ENDPOINT = 'https://api.minecraftservices.com/minecraft/profile';

export class MinecraftAuth {
  async getMinecraftProfile(microsoftAccessToken: string): Promise<MinecraftRawProfileResponse> {
    const { accessToken, userHash } = await this.#getXboxLiveAccessData(microsoftAccessToken);
    const { securityToken } = await this.#getXboxLiveSecurityToken(accessToken);
    const { access_token: minecraftAccessToken } = await this.#getMinecraftAuthData({
      userHash,
      securityToken,
    });

    return fetch(MINECRAFT_PROFILE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${minecraftAccessToken}`,
      },
    }).then((response) => response.json() as Promise<MinecraftRawProfileResponse>);
  }

  #getXboxLiveAccessData(microsoftAccessToken: string): Promise<XboxLiveAccessData> {
    return fetch(XBOX_LIVE_AUTH_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        Properties: {
          AuthMethod: 'RPS',
          SiteName: 'user.auth.xboxlive.com',
          RpsTicket: `d=${microsoftAccessToken}`,
        },
        RelyingParty: 'http://auth.xboxlive.com',
        TokenType: 'JWT',
      }),
    })
      .then((response) => response.json() as Promise<XboxLiveAuthResponse>)
      .then(
        ({
          Token,
          DisplayClaims: {
            xui: [{ uhs }],
          },
        }) => ({
          accessToken: Token,
          userHash: uhs,
        }),
      );
  }

  #getXboxLiveSecurityToken(xboxLiveAccessToken: string): Promise<XboxLiveSecurityData> {
    return fetch(XBOX_LIVE_SECURITY_AUTH_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        Properties: {
          SandboxId: 'RETAIL',
          UserTokens: [xboxLiveAccessToken],
        },
        RelyingParty: 'rp://api.minecraftservices.com/',
        TokenType: 'JWT',
      }),
    })
      .then((response) => response.json() as Promise<XboxLiveAuthResponse>)
      .then(({ Token }) => ({
        securityToken: Token,
      }));
  }

  #getMinecraftAuthData({
    userHash,
    securityToken,
  }: Pick<XboxLiveAccessData, 'userHash'> &
    Pick<XboxLiveSecurityData, 'securityToken'>): Promise<MinecraftAuthResponse> {
    return fetch(MINECRAFT_AUTH_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        identityToken: `XBL3.0 x=${userHash};${securityToken}`,
      }),
    })
      .then((response) => response.json() as Promise<MinecraftAuthResponse>)
      .then((data) => {
        const { expires_in } = data;

        data.expires_in = Date.now() + expires_in;

        return data;
      });
  }
}

export * from './types';
