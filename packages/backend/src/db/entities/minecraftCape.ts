import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { User } from './user';

@Entity()
export class MinecraftCape {
  @PrimaryColumn()
  declare id: string;

  @Column()
  declare alias: string;

  @Column()
  declare texture_key: string;

  @ManyToMany(() => User, (user) => user.minecraft_capes)
  declare users: User[];
}
