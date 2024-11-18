import { z } from 'zod';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { UserRole, UserSchema } from './schema/user.schema';

import { MinecraftSkin } from '../minecraft/skin/minecraft-skin.entity';
import { MinecraftCape } from '../minecraft/cape/minecraft-cape.entity';
import { ConstructorItem } from '../constructor/item/constructor-item.entity';

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
    length: UserSchema.shape.name.maxLength!,
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
    cascade: true,
  })
  @JoinColumn({ name: 'minecraft_active_skin_id' })
  declare minecraft_active_skin: MinecraftSkin;

  /**
   * Minecraft skins
   */
  @ManyToMany(() => MinecraftSkin, (minecraftSkin) => minecraftSkin.users, {
    cascade: true,
  })
  @JoinTable()
  declare minecraft_skins: MinecraftSkin[];

  /**
   * Minecraft capes
   */
  @ManyToMany(() => MinecraftCape, (minecraftCape) => minecraftCape.users, {
    cascade: true,
  })
  @JoinTable()
  declare minecraft_capes: MinecraftCape[];

  @OneToMany(() => ConstructorItem, (constructorItem) => constructorItem.owner, {
    cascade: true,
  })
  declare constructor_items: ConstructorItem[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserSchema.shape.role._def.defaultValue(),
  })
  declare role: UserRole;

  /**
   * Last refresh token created at
   */
  @Column({
    default: 0,
  })
  @Exclude()
  declare refresh_token_created_at: number;

  toJSON() {
    return instanceToPlain(this) as z.infer<typeof UserSchema>;
  }
}
