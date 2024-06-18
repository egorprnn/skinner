import { Expose, instanceToPlain } from 'class-transformer';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { User } from './user';

@Entity()
export class MinecraftSkin {
  @PrimaryColumn()
  declare id: string;

  @Column({
    type: 'enum',
    enum: MinecraftTextureVariant,
  })
  declare variant: MinecraftTextureVariant;

  @Column()
  declare texture_key: string;
  @Expose()
  get url() {
    return `https://textures.minecraft.net/texture/${this.texture_key}`;
  }

  @ManyToMany(() => User, (user) => user.minecraft_skins)
  declare users: User[];

  toJSON() {
    return instanceToPlain(this);
  }
}
