import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { AuthenticationResult } from '@azure/msal-node';
import { MinecraftAuth, MinecraftTextureState } from '@skinner/minecraft-auth';

import { User } from './user.entity';
import { MinecraftSkin } from '../minecraft/skin/minecraft-skin.entity';
import { MinecraftCape } from '../minecraft/cape/minecraft-cape.entity';

import type { DeepNonNullable } from '../../types/deep-non-nullable';

@Injectable()
export class UserService {
  private static readonly MINECRAFT_AUTH = new MinecraftAuth();

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}

  async findByMicrosoftAuthenticationResultOrCreate({
    account: { localAccountId },
    accessToken,
  }: DeepNonNullable<AuthenticationResult>) {
    const user = new User();

    user.microsoft_id = localAccountId;
    user.minecraft_access_token = accessToken;

    await this.#syncMinecraftProfile(user);

    await this.dataSource.manager.save(user);

    return this.userRepository.findOneOrFail({
      where: {
        microsoft_id: localAccountId,
      },
    });
  }

  async #syncMinecraftProfile(user: User) {
    if (!user.minecraft_access_token) {
      return;
    }

    const minecraftProfile = await UserService.MINECRAFT_AUTH.getMinecraftProfile(user.minecraft_access_token).catch(
      () => null,
    );

    if (minecraftProfile) {
      const { id, name, skins, capes } = minecraftProfile;

      user.uuid = id;
      user.name = name;
      user.minecraft_skins = skins.map(({ id, state, variant, textureKey }) => {
        const skin = new MinecraftSkin();

        skin.id = id;
        skin.variant = variant;
        skin.texture_key = textureKey;

        if (state === MinecraftTextureState.ACTIVE) {
          user.minecraft_active_skin_id = id;
        }

        return skin;
      });
      user.minecraft_capes = capes.map(({ id, url, alias }) => {
        const cape = new MinecraftCape();

        cape.id = id;
        cape.alias = alias;
        cape.texture_key = url.split('/').pop() as string;

        return cape;
      });
    }
  }
}
