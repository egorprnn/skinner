/**
 * Xbox
 */
export interface XboxLiveAccessData {
  accessToken: string;
  userHash: string;
}

export interface XboxLiveSecurityData {
  securityToken: string;
}

export interface XboxLiveAuthResponse {
  IssueInstant: string;
  NotAfter: string;
  Token: string;
  DisplayClaims: {
    xui: {
      uhs: string;
    }[];
  };
}

export interface XboxLiveAuthErrorResponse {
  Identity: string;
  XErr: XboxLiveAuthError;
  Message: string;
  Redirect: string;
}

export enum XboxLiveAuthError {
  NOT_EXIST = 2148916233,
  COUNTRY_UNAVAILABLE = 2148916235,
  CHILD = 2148916238,
}

/**
 * Minecraft
 */
export interface MinecraftAuthResponse {
  username: string;
  roles: string[];
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MinecraftRawProfileResponse {
  id: string;
  name: string;
  skins: MinecraftRawSkinTexture[];
  capes: MinecraftRawCapeTexture[];
}

export interface MinecraftRawSkinTexture extends MinecraftRawTexture {
  variant: MinecraftTextureVariant;
}

export interface MinecraftRawCapeTexture extends Omit<MinecraftRawTexture, 'textureKey'> {
  alias: string;
}

export interface MinecraftRawTexture {
  id: string;
  url: string;
  textureKey: string;
  state: MinecraftTextureState;
}

export enum MinecraftTextureState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MinecraftTextureVariant {
  CLASSIC = 'CLASSIC',
  SLIM = 'SLIM',
}
