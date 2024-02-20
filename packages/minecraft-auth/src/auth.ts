import axios from 'axios';

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

    return axios
      .get<MinecraftRawProfileResponse>(MINECRAFT_PROFILE_ENDPOINT, {
        headers: {
          authorization: `Bearer ${minecraftAccessToken}`,
        },
      })
      .then(({ data }) => data);
  }

  #getXboxLiveAccessData(microsoftAccessToken: string): Promise<XboxLiveAccessData> {
    return axios
      .post<XboxLiveAuthResponse>(XBOX_LIVE_AUTH_ENDPOINT, {
        Properties: {
          AuthMethod: 'RPS',
          SiteName: 'user.auth.xboxlive.com',
          RpsTicket: `d=${microsoftAccessToken}`,
        },
        RelyingParty: 'http://auth.xboxlive.com',
        TokenType: 'JWT',
      })
      .then(
        ({
          data: {
            Token,
            DisplayClaims: {
              xui: [{ uhs }],
            },
          },
        }) => ({
          accessToken: Token,
          userHash: uhs,
        }),
      );
  }

  #getXboxLiveSecurityToken(xboxLiveAccessToken: string): Promise<XboxLiveSecurityData> {
    return axios
      .post<XboxLiveAuthResponse>(XBOX_LIVE_SECURITY_AUTH_ENDPOINT, {
        Properties: {
          SandboxId: 'RETAIL',
          UserTokens: [xboxLiveAccessToken],
        },
        RelyingParty: 'rp://api.minecraftservices.com/',
        TokenType: 'JWT',
      })
      .then(({ data: { Token } }) => ({
        securityToken: Token,
      }));
  }

  #getMinecraftAuthData({
    userHash,
    securityToken,
  }: Pick<XboxLiveAccessData, 'userHash'> &
    Pick<XboxLiveSecurityData, 'securityToken'>): Promise<MinecraftAuthResponse> {
    return axios
      .post<MinecraftAuthResponse>(MINECRAFT_AUTH_ENDPOINT, {
        identityToken: `XBL3.0 x=${userHash};${securityToken}`,
      })
      .then(({ data }) => {
        const { expires_in } = data;

        data.expires_in = Date.now() + expires_in;

        return data;
      });
  }
}

export * from './types';
