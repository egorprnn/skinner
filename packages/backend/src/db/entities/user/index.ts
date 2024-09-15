import { z } from 'zod';
import { Exclude, instanceToPlain } from 'class-transformer';
import { MinecraftAuth, MinecraftTextureState } from '@skinner/minecraft-auth';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { MinecraftSkin } from '../minecraftSkin';
import { MinecraftCape, ConstructorItem } from '../';

import { UserRole, userSchema } from './schema';

@Entity()
export class User {
  /**
   * Microsoft ID
   */
  @PrimaryColumn()
  declare microsoft_id: string;

  /**
   * Minecraft UUID
   */
  @Column()
  declare uuid: string;

  /**
   * Minecraft name
   */
  @Column({
    length: userSchema.shape.name.maxLength!,
  })
  declare name: string;

  /**
   * Minecraft access token
   */
  @Column({ select: false })
  @Exclude()
  declare minecraft_access_token?: string;

  /**
   * Minecraft active skin id
   */
  @Column()
  declare minecraft_active_skin_id?: string;

  /**
   * Minecraft active skin
   */
  @ManyToOne(() => MinecraftSkin, (minecraftSkin) => minecraftSkin.users, {
    eager: true,
  })
  @JoinColumn({ name: 'minecraft_active_skin_id' })
  declare minecraft_active_skin: MinecraftSkin;

  /**
   * Minecraft skins
   */
  @ManyToMany(() => MinecraftSkin, (minecraftSkin) => minecraftSkin.users)
  @JoinTable()
  declare minecraft_skins: MinecraftSkin[];

  /**
   * Minecraft capes
   */
  @ManyToMany(() => MinecraftCape, (minecraftCape) => minecraftCape.users)
  @JoinTable()
  declare minecraft_capes: MinecraftCape[];

  @OneToMany(() => ConstructorItem, (constructorItem) => constructorItem.owner)
  declare constructor_items: ConstructorItem[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: userSchema.shape.role._def.defaultValue(),
  })
  declare role: UserRole;

  /**
   * Last refresh token created at
   */
  @Column()
  @Exclude()
  declare refresh_token_created_at: number;

  /**
   * Sync Minecraft profile data
   */
  async syncMinecraftProfile() {
    if (!this.minecraft_access_token) {
      return;
    }

    const minecraftAuth = new MinecraftAuth();

    const minecraftProfile = await minecraftAuth.getMinecraftProfile(this.minecraft_access_token).catch(() => null);

    if (minecraftProfile) {
      const { id, name, skins, capes } = minecraftProfile;

      this.uuid = id;
      this.name = name;
      this.minecraft_skins = skins.map(({ id, state, variant, textureKey }) => {
        const skin = new MinecraftSkin();

        skin.id = id;
        skin.variant = variant;
        skin.texture_key = textureKey;

        if (state === MinecraftTextureState.ACTIVE) {
          this.minecraft_active_skin_id = id;
        }

        return skin;
      });
      this.minecraft_capes = capes.map(({ id, url, alias }) => {
        const cape = new MinecraftCape();

        cape.id = id;
        cape.alias = alias;
        cape.texture_key = url.split('/').pop() as string;

        return cape;
      });

      await Promise.all([
        // @ts-expect-error
        minecraftSkinRepository.save(this.minecraft_skins),
        // @ts-expect-error
        minecraftCapeRepository.save(this.minecraft_capes),
      ]);
    }
  }

  toJSON() {
    return instanceToPlain(this) as z.infer<typeof userSchema>;
  }
}
